import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Steam Manifest Generator - Working Download Link</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .link-box {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .download-link {
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: all 0.3s;
        }
        .download-link:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
        .success {
            border-left: 5px solid #4CAF50;
            padding: 15px;
            margin: 20px 0;
        }
        .info {
            border-left: 5px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
        }
        .code {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 Steam Manifest Generator</h1>
        <h2>🔗 Working Download Link</h2>
        
        <div class="success">
            <h3>✅ Your Download Link is Ready!</h3>
            <p>Here's your working download link for Verlet Swing files:</p>
            <div class="link-box">
                <a href="https://steam-manifest-generator-7400r641h.vercel.app/api/direct-download?accessKey=demo_manifest_811870" class="download-link">
                    📥 Download Verlet Swing Files
                </a>
            </div>
        </div>

        <div class="info">
            <h3>🔗 How to Use This Link</h3>
            <p><strong>Method 1:</strong> Copy and paste this link into your Discord bot:</p>
            <div class="code">/manifest appid:811870</div>
            <p>This will generate fresh files for you!</p>
            
            <p><strong>Method 2:</strong> Use the access key with your Discord bot:</p>
            <div class="code">/manifest appid:811870</div>
            <p>The bot will recognize the access key and give you the files!</p>
        </div>

        <div class="info">
            <h3>📋 What You'll Get</h3>
            <ul>
                <li>📁 Steam manifest file (JSON format)</li>
                <li>🔧 Lua script file (Lua format)</li>
                <li>🛠️ Steamtools compatible files</li>
                <li>✅ No authentication required</li>
                <li>🚀 Instant download access</li>
            </ul>
        </div>

        <div class="info">
            <h3>🎯 For Custom App IDs</h3>
            <p>Replace <code>811870</code> with your desired App ID in the Discord command:</p>
            <div class="code">/manifest appid:YOUR_APP_ID</div>
            <p>This will generate files for your specific game!</p>
        </div>
    </div>

    <script>
        console.log('🚀 Working download link page loaded');
    </script>
</body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}