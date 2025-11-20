import { NextRequest, NextResponse } from 'next/server';
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

    // Find the file record in memory storage
    const steamFile = fileStorage.get(accessKey);

    if (!steamFile) {
      return NextResponse.json(
        { error: 'File not found or access key invalid' },
        { status: 404 }
      );
    }

    // Check if file has expired
    if (new Date() > steamFile.expiresAt) {
      fileStorage.delete(accessKey); // Clean up expired file
      return NextResponse.json(
        { error: 'Download link has expired' },
        { status: 410 }
      );
    }

    // Return the file data
    return NextResponse.json({
      success: true,
      file: {
        appId: steamFile.steamAppId,
        appName: steamFile.steamAppName,
        manifestContent: steamFile.manifestContent,
        luaContent: steamFile.luaContent,
        discordUsername: steamFile.discordUsername,
        createdAt: steamFile.createdAt,
        expiresAt: steamFile.expiresAt
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