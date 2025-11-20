import { NextRequest, NextResponse } from 'next/server';

// Import fileStorage from simple-generate route
let fileStorage: Map<string, any> | null = null;

async function getFileStorage() {
  if (!fileStorage) {
    try {
      const module = await import('../simple-generate/route');
      fileStorage = module.fileStorage;
    } catch (error) {
      console.log('⚠️ Could not import file storage:', error.message);
      fileStorage = new Map();
    }
  }
  return fileStorage;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { accessKey: string } }
) {
  try {
    console.log(`🔍 Download request for key: ${params.accessKey}`);
    
    const accessKey = params.accessKey;

    if (!accessKey) {
      return NextResponse.json(
        { error: 'Access key is required' },
        { status: 400 }
      );
    }

    const storage = await getFileStorage();
    const steamFile = storage?.get(accessKey);

    if (!steamFile) {
      console.log(`❌ File not found for key: ${accessKey}`);
      return NextResponse.json(
        { error: 'File not found or access key invalid' },
        { status: 404 }
      );
    }

    // Check if file has expired
    if (new Date() > new Date(steamFile.expiresAt)) {
      console.log(`⏰ File expired for key: ${accessKey}`);
      storage?.delete(accessKey);
      
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      );
    }

    // Return the file data
    const responseData = {
      success: true,
      storage: 'memory',
      file: {
        appId: steamFile.steamAppId,
        appName: steamFile.steamAppName,
        manifestContent: steamFile.manifestContent,
        luaContent: steamFile.luaContent,
        discordUsername: steamFile.discordUsername,
        createdAt: steamFile.createdAt,
        expiresAt: steamFile.expiresAt
      }
    };

    console.log(`✅ Successfully serving file: ${responseData.file.appName}`);
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Error downloading files:', error);
    return NextResponse.json(
      { error: 'Failed to download files: ' + error.message },
      { status: 500 }
    );
  }
}