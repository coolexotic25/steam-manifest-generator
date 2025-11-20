const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getSteamAppDetails, validateAppId } = require('./utils/steamAPI');
const { generateSteamManifest, formatManifest } = require('./utils/manifestGenerator');
const { generateLuaScript } = require('./utils/luaGenerator');
const { randomBytes } = require('crypto');
const cors = require('cors');
const path = require('path');

// Initialize Prisma Client
const db = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Generate files API
app.post('/api/generate', async (req, res) => {
  try {
    const { appId, discordUserId, discordUsername } = req.body;

    // Validate input
    if (!validateAppId(appId)) {
      return res.status(400).json({ error: 'Invalid App ID' });
    }

    if (!discordUserId) {
      return res.status(400).json({ error: 'Discord user ID is required' });
    }

    // Fetch Steam app data
    const appData = await getSteamAppDetails(appId);

    // Generate files
    const manifest = generateSteamManifest(appData);
    const manifestJson = formatManifest(manifest);
    const luaScript = generateLuaScript(appData);

    // Generate unique access key
    const accessKey = randomBytes(16).toString('hex');

    // Calculate expiration (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Find or create user
    let user = await db.user.findUnique({
      where: { discordId: discordUserId }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          discordId: discordUserId,
          discordUsername: discordUsername || null
        }
      });
    }

    // Store the generated files
    const steamFile = await db.steamFile.create({
      data: {
        userId: user.id,
        discordUserId: discordUserId,
        steamAppId: appId,
        steamAppName: appData.name,
        manifestContent: manifestJson,
        luaContent: luaScript,
        manifestSize: manifestJson.length,
        luaSize: luaScript.length,
        accessKey: accessKey,
        expiresAt: expiresAt
      }
    });

    // Create Steamtools-compatible files
    const steamtoolsManifest = createSteamtoolsManifest(manifest, appData);
    const steamtoolsLua = createSteamtoolsLua(luaScript, appData);

    return res.json({
      success: true,
      accessKey: accessKey,
      downloadUrl: `/download/${accessKey}`,
      appId: appId,
      appName: appData.name,
      steamtoolsFiles: {
        manifest: steamtoolsManifest,
        lua: steamtoolsLua
      }
    });

  } catch (error) {
    console.error('Error generating files:', error);
    return res.status(500).json({ error: 'Failed to generate files' });
  }
});

// Download files API
app.get('/api/download/:accessKey', async (req, res) => {
  try {
    const { accessKey } = req.params;

    // Find file record
    const steamFile = await db.steamFile.findUnique({
      where: { accessKey },
      include: {
        user: {
          select: {
            discordUsername: true
          }
        }
      }
    });

    if (!steamFile) {
      return res.status(404).json({ error: 'File not found or access key invalid' });
    }

    // Check if file has expired
    if (new Date() > steamFile.expiresAt) {
      // Clean up expired file
      await db.steamFile.delete({
        where: { id: steamFile.id }
      });
      
      return res.status(410).json({ error: 'Download link has expired' });
    }

    // Mark as downloaded
    await db.steamFile.update({
      where: { id: steamFile.id },
      data: { isDownloaded: true }
    });

    // Return file data
    return res.json({
      success: true,
      file: {
        id: steamFile.id,
        appId: steamFile.steamAppId,
        appName: steamFile.steamAppName,
        manifestContent: steamFile.manifestContent,
        luaContent: steamFile.luaContent,
        manifestSize: steamFile.manifestSize,
        luaSize: steamFile.luaSize,
        createdAt: steamFile.createdAt,
        expiresAt: steamFile.expiresAt,
        discordUsername: steamFile.user.discordUsername
      }
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ error: 'Failed to download file' });
  }
});

// Download files API (POST for specific formats)
app.post('/api/download/:accessKey', async (req, res) => {
  try {
    const { accessKey } = req.params;
    const { format } = req.body;

    // Find file record
    const steamFile = await db.steamFile.findUnique({
      where: { accessKey }
    });

    if (!steamFile) {
      return res.status(404).json({ error: 'File not found or access key invalid' });
    }

    // Check if file has expired
    if (new Date() > steamFile.expiresAt) {
      return res.status(410).json({ error: 'Download link has expired' });
    }

    let content;
    let filename;
    let contentType;

    if (format === 'manifest') {
      content = steamFile.manifestContent;
      filename = `${steamFile.steamAppName.replace(/[^a-z0-9]/gi, '_')}_manifest.json`;
      contentType = 'application/json';
    } else if (format === 'lua') {
      content = steamFile.luaContent;
      filename = `${steamFile.steamAppName.replace(/[^a-z0-9]/gi, '_')}_script.lua`;
      contentType = 'text/x-lua';
    } else if (format === 'steamtools-manifest') {
      // Create Steamtools-compatible manifest
      const manifest = JSON.parse(steamFile.manifestContent);
      const steamtoolsManifest = {
        format: "steamtools",
        version: "1.0",
        appid: steamFile.steamAppId,
        name: steamFile.steamAppName,
        manifest: {
          ...manifest,
          steamtools_metadata: {
            generated_by: "Steam Manifest Generator Bot",
            generated_at: new Date().toISOString(),
            compatible_with: "Steamtools v1.0+",
            export_format: "json"
          }
        }
      };
      content = JSON.stringify(steamtoolsManifest, null, 2);
      filename = `${steamFile.steamAppName.replace(/[^a-z0-9]/gi, '_')}_steamtools.json`;
      contentType = 'application/json';
    } else if (format === 'steamtools-lua') {
      // Create Steamtools-compatible Lua script
      const steamtoolsHeader = `--[[
  Steamtools Compatible Lua Script
  Generated for: ${steamFile.steamAppName} (${steamFile.steamAppId})
  Generated by: Steam Manifest Generator Bot
  Generated at: ${new Date().toISOString()}
  
  This script is compatible with Steamtools and can be imported
  directly into your Steamtools project.
]]\n\n`;
      content = steamtoolsHeader + steamFile.luaContent;
      filename = `${steamFile.steamAppName.replace(/[^a-z0-9]/gi, '_')}_steamtools.lua`;
      contentType = 'text/x-lua';
    } else {
      return res.status(400).json({ error: 'Invalid format specified' });
    }

    // Return file as downloadable
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.send(content);

  } catch (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ error: 'Failed to download file' });
  }
});

// Simple HTML download page
app.get('/download/:accessKey', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Steam Files Download</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .container { text-align: center; }
        .loading { font-size: 18px; color: #666; }
        .error { color: red; }
        .success { color: green; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; margin: 10px; border-radius: 5px; cursor: pointer; }
        button:hover { background: #0056b3; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .file-info { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 Steam Files Download</h1>
        <div id="status" class="loading">Loading your files...</div>
        <div id="content" style="display: none;">
            <div class="file-info">
                <h2 id="app-name"></h2>
                <p><strong>App ID:</strong> <span id="app-id"></span></p>
                <p><strong>Generated:</strong> <span id="created"></span></p>
                <p><strong>Expires:</strong> <span id="expires"></span></p>
            </div>
            
            <h3>Download Options</h3>
            <button onclick="downloadFile('manifest')">📦 Download Manifest</button>
            <button onclick="downloadFile('lua')">🔧 Download Lua Script</button>
            
            <h3>Steamtools Compatible</h3>
            <button onclick="downloadFile('steamtools-manifest')">📦 Steamtools Manifest</button>
            <button onclick="downloadFile('steamtools-lua')">🔧 Steamtools Lua</button>
            
            <p><small><strong>Note:</strong> This link expires in 24 hours and is only accessible to you.</small></p>
        </div>
    </div>

    <script>
        const accessKey = window.location.pathname.split('/')[2];
        
        // Load file data
        fetch(\`/api/download/\${accessKey}\`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('status').style.display = 'none';
                    document.getElementById('content').style.display = 'block';
                    
                    document.getElementById('app-name').textContent = data.file.appName;
                    document.getElementById('app-id').textContent = data.file.appId;
                    document.getElementById('created').textContent = new Date(data.file.createdAt).toLocaleString();
                    document.getElementById('expires').textContent = new Date(data.file.expiresAt).toLocaleString();
                } else {
                    document.getElementById('status').textContent = data.error;
                    document.getElementById('status').className = 'error';
                }
            })
            .catch(error => {
                document.getElementById('status').textContent = 'Error loading file data';
                document.getElementById('status').className = 'error';
            });
        
        function downloadFile(format) {
            const button = event.target;
            button.disabled = true;
            const originalText = button.textContent;
            button.textContent = 'Downloading...';
            
            fetch(\`/api/download/\${accessKey}\`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ format })
            })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error('Download failed');
                }
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = getFilename(format);
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => {
                alert('Download failed: ' + error.message);
            })
            .finally(() => {
                button.disabled = false;
                button.textContent = originalText;
            });
        }
        
        function getFilename(format) {
            const appName = document.getElementById('app-name').textContent;
            const cleanName = appName.replace(/[^a-z0-9]/gi, '_');
            const filenames = {
                'manifest': \`\${cleanName}_manifest.json\`,
                'lua': \`\${cleanName}_script.lua\`,
                'steamtools-manifest': \`\${cleanName}_steamtools.json\`,
                'steamtools-lua': \`\${cleanName}_steamtools.lua\`
            };
            return filenames[format] || 'download';
        }
    </script>
</body>
</html>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`🤖 API endpoints ready`);
});

function createSteamtoolsManifest(manifest, appData) {
  return {
    format: "steamtools",
    version: "1.0",
    appid: appData.appId,
    name: appData.name,
    manifest: {
      ...manifest,
      steamtools_metadata: {
        generated_by: "Steam Manifest Generator Bot",
        generated_at: new Date().toISOString(),
        compatible_with: "Steamtools v1.0+",
        export_format: "json"
      }
    }
  };
}

function createSteamtoolsLua(luaScript, appData) {
  const steamtoolsHeader = `--[[
  Steamtools Compatible Lua Script
  Generated for: ${appData.name} (${appData.appId})
  Generated by: Steam Manifest Generator Bot
  Generated at: ${new Date().toISOString()}
  
  This script is compatible with Steamtools and can be imported
  directly into your Steamtools project.
]]\n\n`;

  return {
    format: "steamtools",
    version: "1.0",
    appid: appData.appId,
    name: appData.name,
    content: steamtoolsHeader + luaScript,
    metadata: {
      generated_by: "Steam Manifest Generator Bot",
      generated_at: new Date().toISOString(),
      compatible_with: "Steamtools v1.0+",
      language: "lua",
      encoding: "utf-8"
    }
  };
}