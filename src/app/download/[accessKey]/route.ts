import { NextRequest, NextResponse } from 'next/server';

// Import fileStorage from generate route
let fileStorage: Map<string, any> | null = null;

// Dynamic import to avoid crashes
async function getFileStorage() {
  if (!fileStorage) {
    try {
      const module = await import('../../api/generate/route');
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

    let steamFile = null;
    let storageSource = 'unknown';

    // Try memory storage first (most reliable)
    const storage = await getFileStorage();
    if (storage) {
      steamFile = storage.get(accessKey);
      if (steamFile) {
        storageSource = 'memory';
        console.log(`📁 Found file in memory storage: ${steamFile.steamAppName}`);
      }
    }

    // Try Supabase if not found in memory
    if (!steamFile) {
      try {
        const { getGeneratedFile } = await import('@/lib/supabase');
        steamFile = await getGeneratedFile(accessKey);
        if (steamFile) {
          storageSource = 'supabase';
          console.log(`🗄️ Found file in Supabase: ${steamFile.steam_app_name}`);
        }
      } catch (supabaseError) {
        console.log('⚠️ Supabase not available:', supabaseError.message);
      }
    }

    if (!steamFile) {
      console.log(`❌ File not found for key: ${accessKey}`);
      return NextResponse.json(
        { error: 'File not found or access key invalid' },
        { status: 404 }
      );
    }

    // Check if file has expired
    const expiresAt = new Date(steamFile.expires_at || steamFile.expiresAt);
    if (new Date() > expiresAt) {
      console.log(`⏰ File expired for key: ${accessKey}`);
      
      // Clean up expired file
      if (storageSource === 'memory' && storage) {
        storage.delete(accessKey);
      }
      
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      );
    }

    // Return the file data
    const responseData = {
      success: true,
      storage: storageSource,
      file: {
        appId: steamFile.steamAppId || steamFile.steam_app_id,
        appName: steamFile.steamAppName || steamFile.steam_app_name,
        manifestContent: steamFile.manifestContent || steamFile.manifest_content,
        luaContent: steamFile.luaContent || steamFile.lua_content,
        discordUsername: steamFile.discordUsername || steamFile.discord_username,
        createdAt: steamFile.createdAt || steamFile.created_at,
        expiresAt: steamFile.expiresAt || steamFile.expires_at
      }
    };

    console.log(`✅ Successfully serving file from ${storageSource}: ${responseData.file.appName}`);
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Error downloading files:', error);
    return NextResponse.json(
      { error: 'Failed to download files: ' + error.message },
      { status: 500 }
    );
  }
}