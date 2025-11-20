import { NextRequest, NextResponse } from 'next/server';
import { getGeneratedFile } from '@/lib/supabase';
import { fileStorage } from '../../api/generate/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { accessKey: string } }
) {
  try {
    const accessKey = params.accessKey;

    if (!accessKey) {
      return NextResponse.json(
        { error: 'Access key is required' },
        { status: 400 }
      );
    }

    let steamFile = null;
    let storageSource = 'unknown';

    // Try Supabase first
    try {
      steamFile = await getGeneratedFile(accessKey);
      if (steamFile) {
        storageSource = 'supabase';
      }
    } catch (supabaseError) {
      console.log('Supabase fetch failed, trying fallback:', supabaseError.message);
    }

    // Fallback to memory storage
    if (!steamFile) {
      steamFile = fileStorage.get(accessKey);
      storageSource = 'memory';
    }

    if (!steamFile) {
      return NextResponse.json(
        { error: 'File not found or access key invalid' },
        { status: 404 }
      );
    }

    // Check if file has expired
    if (new Date() > new Date(steamFile.expires_at)) {
      // Clean up expired file
      if (storageSource === 'memory') {
        fileStorage.delete(accessKey);
      }
      
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      );
    }

    // Return the file data
    return NextResponse.json({
      success: true,
      storage: storageSource,
      file: {
        appId: steamFile.steam_app_id,
        appName: steamFile.steam_app_name,
        manifestContent: steamFile.manifest_content,
        luaContent: steamFile.lua_content,
        discordUsername: steamFile.discord_username,
        createdAt: steamFile.created_at,
        expiresAt: steamFile.expires_at
      }
    });

  } catch (error) {
    console.error('Error downloading files:', error);
    return NextResponse.json(
      { error: 'Failed to download files' },
      { status: 500 }
    );
  }
}