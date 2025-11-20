'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Steam, Download, Shield, Clock, ExternalLink, Bot, Code, Package } from 'lucide-react';

export default function Home() {
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const popularApps = [
    { id: 730, name: 'Counter-Strike 2', genre: 'FPS' },
    { id: 570, name: 'Dota 2', genre: 'MOBA' },
    { id: 440, name: 'Team Fortress 2', genre: 'FPS' },
    { id: 220, name: 'Half-Life 2', genre: 'Action' },
    { id: 550, name: 'Left 4 Dead 2', genre: 'Co-op' },
    { id: 4000, name: 'Garry\'s Mod', genre: 'Sandbox' }
  ];

  const handleDiscordBot = () => {
    window.open('https://discord.com/oauth2/authorize?client_id=713943465616080948&permissions=8&scope=bot%20applications.commands', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Steam className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Steam Manifest Generator
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate Steam app manifests and Lua scripts with real Steam API data. 
              Compatible with Steamtools for seamless integration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleDiscordBot} className="text-lg px-8">
                <Bot className="h-5 w-5 mr-2" />
                Use Discord Bot
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <ExternalLink className="h-5 w-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Generator?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools with real Steam data, Steamtools compatibility, and secure file hosting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Steam className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Real Steam API Data</CardTitle>
              <CardDescription>
                Fetches actual app data from Steam Store API for accurate manifest generation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Valid Steam Manifests</CardTitle>
              <CardDescription>
                Generates properly formatted Steam app manifests with all required fields
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Comprehensive Lua Scripts</CardTitle>
              <CardDescription>
                Complete Lua scripts with Steam integration, player systems, and utilities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Steamtools Compatible</CardTitle>
              <CardDescription>
                Special exports optimized for direct import into Steamtools projects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Download className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Downloads</CardTitle>
              <CardDescription>
                Files hosted securely with 24-hour expiration and user-specific access
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Discord Integration</CardTitle>
              <CardDescription>
                Easy-to-use Discord bot with slash commands and rich embeds
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Popular Apps Section */}
      <div className="container mx-auto px-4 py-16 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Steam Apps</h2>
          <p className="text-muted-foreground">
            Try these popular Steam App IDs with our generator
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {popularApps.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{app.name}</h3>
                  <Badge variant="secondary">{app.genre}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">App ID: {app.id}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`https://discord.com/channels/@me`, '_blank')}
                  >
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Generate Steam manifests and Lua scripts in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold">Use Discord Bot</h3>
            <p className="text-muted-foreground">
              Run <code className="bg-muted px-2 py-1 rounded">/manifest appid:730</code> in Discord
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-semibold">Get Download Link</h3>
            <p className="text-muted-foreground">
              Receive a secure, personalized download link that expires in 24 hours
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-semibold">Download Files</h3>
            <p className="text-muted-foreground">
              Choose between standard or Steamtools-compatible formats
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Add our Discord bot to your server and start generating Steam files instantly
          </p>
          <Button size="lg" variant="secondary" onClick={handleDiscordBot} className="text-lg px-8">
            <Bot className="h-5 w-5 mr-2" />
            Add Discord Bot
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Steam className="h-6 w-6" />
              <span className="font-semibold">Steam Manifest Generator</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Powered by real Steam API data • Steamtools compatible • Secure file hosting
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}