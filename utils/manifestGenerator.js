const { generateManifestId, generateBuildId } = require('./steamAPI');

/**
 * Generates a Steam app manifest based on app data
 * @param {Object} appData - Steam app data from the API
 * @returns {Object} - Steam manifest object
 */
function generateSteamManifest(appData) {
  const currentTime = Math.floor(Date.now() / 1000);
  const manifestId = generateManifestId();
  const buildId = generateBuildId();
  
  const manifest = {
    "appid": appData.appId,
    "name": appData.name,
    "state": "eStateAvailable",
    "installdir": appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    "size": Math.floor(Math.random() * 50000000000) + 1000000000, // Random size between 1GB and 50GB
    "bytes_downloaded": 0,
    "bytes_staged": 0,
    "bytes_to_download": 0,
    "bytes_to_stage": 0,
    "target_build_id": buildId,
    "user": {
      "gamestats": {
        "ingame": false,
        "seconds": 0
      }
    },
    "manifest": {
      "gid": manifestId,
      "size": Math.floor(Math.random() * 100000000) + 1000000, // Random manifest size
      "download_size": Math.floor(Math.random() * 50000000000) + 1000000000,
      "time_updated": currentTime,
      "time_created": currentTime - 86400, // 1 day ago
      "encrypted_gid": manifestId.toString(16),
      "decrypt_key": "",
      "filenames": [
        `${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.exe`,
        "steam_api.dll",
        "game_data.bin"
      ],
      "filesha": [
        "a1b2c3d4e5f6789012345678901234567890abcd",
        "f1e2d3c4b5a6978012345678901234567890efgh",
        "9a8b7c6d5e4f321001234567890123456789ijkl"
      ]
    },
    "depot": {
      "228980": {
        "name": "Windows",
        "config": {
          "oslist": "windows",
          "language": "english",
          "osarch": "64"
        },
        "manifest": {
          "gid": manifestId,
          "size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "download_size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "time_updated": currentTime,
          "time_created": currentTime - 86400,
          "encrypted_gid": manifestId.toString(16),
          "decrypt_key": ""
        },
        "dlcappid": []
      },
      "228981": {
        "name": "Mac",
        "config": {
          "oslist": "macos",
          "language": "english",
          "osarch": "64"
        },
        "manifest": {
          "gid": generateManifestId(),
          "size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "download_size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "time_updated": currentTime,
          "time_created": currentTime - 86400,
          "encrypted_gid": generateManifestId().toString(16),
          "decrypt_key": ""
        },
        "dlcappid": []
      },
      "228982": {
        "name": "Linux",
        "config": {
          "oslist": "linux",
          "language": "english",
          "osarch": "64"
        },
        "manifest": {
          "gid": generateManifestId(),
          "size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "download_size": Math.floor(Math.random() * 50000000000) + 1000000000,
          "time_updated": currentTime,
          "time_created": currentTime - 86400,
          "encrypted_gid": generateManifestId().toString(16),
          "decrypt_key": ""
        },
        "dlcappid": []
      }
    },
    "userconfig": {
      "gameid": appData.appId,
      "name": appData.name,
      "language": "english",
      "beta": "",
      "gamestats": {
        "ingame": false,
        "seconds": 0
      }
    },
    "platforms": {
      "windows": appData.platforms.windows,
      "mac": appData.platforms.mac,
      "linux": appData.platforms.linux
    },
    "required_appid": [],
    "launch": [
      {
        "type": "default",
        "config": {
          "oslist": "windows"
        },
        "executable": `${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.exe`,
        "arguments": "",
        "workingdir": "",
        "description": "Launch Game"
      }
    ]
  };

  // Only include platforms that are supported
  if (!appData.platforms.mac) {
    delete manifest.depot["228981"];
  }
  if (!appData.platforms.linux) {
    delete manifest.depot["228982"];
  }

  return manifest;
}

/**
 * Formats the manifest as a pretty-printed JSON string
 * @param {Object} manifest - The manifest object
 * @returns {string} - Formatted JSON string
 */
function formatManifest(manifest) {
  return JSON.stringify(manifest, null, 2);
}

/**
 * Generates a summary of the manifest for Discord embed
 * @param {Object} manifest - The manifest object
 * @returns {Object} - Summary object for embed
 */
function getManifestSummary(manifest) {
  const totalSize = Object.values(manifest.depot)
    .reduce((total, depot) => total + depot.manifest.size, 0);
  
  const totalDownloadSize = Object.values(manifest.depot)
    .reduce((total, depot) => total + depot.manifest.download_size, 0);

  return {
    appName: manifest.name,
    appId: manifest.appid,
    buildId: manifest.target_build_id,
    installDir: manifest.installdir,
    totalSize: formatBytes(totalSize),
    downloadSize: formatBytes(totalDownloadSize),
    platforms: Object.keys(manifest.platforms)
      .filter(platform => manifest.platforms[platform])
      .map(platform => platform.charAt(0).toUpperCase() + platform.slice(1))
      .join(', '),
    depotCount: Object.keys(manifest.depot).length
  };
}

/**
 * Formats bytes to human readable format
 * @param {number} bytes - Number of bytes
 * @returns {string} - Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  generateSteamManifest,
  formatManifest,
  getManifestSummary
};