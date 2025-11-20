'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, ExternalLink, Clock, CheckCircle, AlertCircle, Package, Code } from 'lucide-react';

interface FileData {
  id: string;
  appId: number;
  appName: string;
  manifestContent: string;
  luaContent: string;
  manifestSize: number;
  luaSize: number;
  createdAt: string;
  expiresAt: string;
  discordUsername: string;
}

export default function DownloadPage() {
  const params = useParams();
  const router = useRouter();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (params.accessKey) {
      fetchFileData(params.accessKey as string);
    }
  }, [params.accessKey]);

  const fetchFileData = async (accessKey: string) => {
    try {
      const response = await fetch(`/api/download/${accessKey}`);
      const data = await response.json();

      if (response.ok) {
        setFileData(data.file);
      } else {
        setError(data.error || 'Failed to load file data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (format: string) => {
    if (!fileData) return;

    setDownloading(format);
    try {
      const response = await fetch(`/api/download/${params.accessKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Get filename from response headers or create default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `${fileData.appName.replace(/[^a-z0-9]/gi, '_')}_${format}.json`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Download failed');
      }
    } catch (err) {
      setError('Download failed');
    } finally {
      setDownloading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">{error}</p>
            <div className="mt-4 text-center">
              <Button onClick={() => router.push('/')} variant="outline">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fileData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Steam Files Ready for Download</h1>
          <p className="text-muted-foreground">
            Generated for <span className="font-medium">{fileData.appName}</span>
          </p>
          <Badge variant="secondary" className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getTimeRemaining(fileData.expiresAt)} remaining
          </Badge>
        </div>

        {/* File Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              File Information
            </CardTitle>
            <CardDescription>
              Generated on {new Date(fileData.createdAt).toLocaleString()} for {fileData.discordUsername}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Steam App Manifest</h3>
                <p className="text-sm text-muted-foreground">
                  Valid Steam manifest file with all required fields
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">JSON</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(fileData.manifestSize)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Lua Script</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive Lua script for game development
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Lua</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(fileData.luaSize)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Download Options */}
            <div className="space-y-4">
              <h3 className="font-medium">Download Options</h3>
              
              {/* Standard Downloads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => downloadFile('manifest')}
                  disabled={downloading === 'manifest'}
                  className="w-full"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloading === 'manifest' ? 'Downloading...' : 'Download Manifest'}
                </Button>
                
                <Button
                  onClick={() => downloadFile('lua')}
                  disabled={downloading === 'lua'}
                  className="w-full"
                  variant="default"
                >
                  <Code className="h-4 w-4 mr-2" />
                  {downloading === 'lua' ? 'Downloading...' : 'Download Lua Script'}
                </Button>
              </div>

              {/* Steamtools Downloads */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Steamtools Compatible</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => downloadFile('steamtools-manifest')}
                    disabled={downloading === 'steamtools-manifest'}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloading === 'steamtools-manifest' ? 'Downloading...' : 'Steamtools Manifest'}
                  </Button>
                  
                  <Button
                    onClick={() => downloadFile('steamtools-lua')}
                    disabled={downloading === 'steamtools-lua'}
                    className="w-full"
                    variant="outline"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    {downloading === 'steamtools-lua' ? 'Downloading...' : 'Steamtools Lua'}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Steamtools Info */}
            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertDescription>
                <strong>Steamtools Compatible:</strong> The Steamtools downloads are specially formatted 
                for direct import into Steamtools projects. They include additional metadata and 
                compatibility headers for seamless integration.
              </AlertDescription>
            </Alert>

            {/* Security Notice */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Secure Access:</strong> This download link is unique to you and will expire 
                in {getTimeRemaining(fileData.expiresAt)}. For security reasons, the link cannot be shared.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Steam Store Link */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">View on Steam</h3>
                <p className="text-sm text-muted-foreground">
                  See this app on the Steam Store
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(`https://store.steampowered.com/app/${fileData.appId}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Steam Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}