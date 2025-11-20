# Steam Manifest Generator

A powerful Discord bot and website that generates Steam app manifests and Lua scripts with real Steam API data and Steamtools compatibility.

## 🚀 Features

- **🤖 Discord Bot**: Slash commands with rich embeds and download buttons
- **🌐 Website**: Secure file hosting with user authentication
- **🛠️ Steamtools Compatibility**: Special export formats for Steamtools
- **🔒 Security**: User-specific access with 24-hour expiration
- **📊 Real Data**: Integration with Steam Store API
- **🎮 Professional UI**: Modern interface with shadcn/ui components

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Discord Bot  │───▶│   Website API  │───▶│   Database     │
│                │    │                │    │                │
│ • Slash Cmds   │    │ • File Gen    │    │ • Users        │
│ • Rich Embeds  │    │ • Downloads    │    │ • Files        │
│ • Buttons      │    │ • Security     │    │ • Access Keys  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 How It Works

1. **User runs** `/manifest appid:730` in Discord
2. **Bot calls** Website API to generate files
3. **Website stores** Files with unique access key
4. **Bot responds** Rich embed with download button
5. **User downloads** From secure website page

## 🛠️ Tech Stack

- **Discord Bot**: Node.js + Discord.js v14
- **Website**: Next.js 16 + TypeScript
- **Database**: Prisma + SQLite
- **API**: RESTful endpoints with Express
- **UI**: shadcn/ui + Tailwind CSS
- **Deployment**: GitHub Actions + Vercel

## 🚀 Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/steam-manifest-generator.git
cd steam-manifest-generator

# Install dependencies
npm install

# Setup database
npx prisma db push

# Start Discord bot
npm run bot

# Start website (new terminal)
npm run server
```

### Discord Bot Setup

1. **Create Discord Application**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create new application
   - Add bot with message content intent

2. **Configure Bot**:
   - Copy bot token
   - Copy application ID
   - Enable slash commands

3. **Deploy Commands**:
   ```bash
   npm run deploy
   ```

4. **Invite Bot**:
   ```
   https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```

## 🔗 Deployment

### Automatic Deployment (Recommended)

#### Website (Vercel)
1. **Fork** this repository
2. **Connect** to Vercel
3. **Add Environment Variables**:
   ```
   DATABASE_URL=your_database_url
   DISCORD_TOKEN=your_discord_token
   STEAM_API_KEY=your_steam_api_key
   ```
4. **Deploy**: Automatic on push to main

#### Discord Bot (GitHub Actions)
1. **Add Repository Secrets**:
   ```
   DISCORD_TOKEN=your_discord_token
   CLIENT_ID=your_discord_client_id
   WEBSITE_URL=your_deployed_website_url
   ```
2. **Deploy**: Automatic on push to main

### Manual Deployment

#### Website (Vercel CLI)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Discord Bot (Hosting Service)
```bash
# Deploy to your preferred hosting
# Set environment variables
# Start bot
npm start
```

## 📁 Project Structure

```
steam-manifest-generator/
├── 🤖 Discord Bot
│   ├── index.js                 # Main bot file
│   ├── commands/
│   │   └── manifest.js         # Slash command handler
│   ├── utils/                  # Bot utilities
│   │   ├── steamAPI.js         # Steam API integration
│   │   ├── manifestGenerator.js # Manifest generation
│   │   └── luaGenerator.js     # Lua script generation
│   └── config/
│       └── deploy-commands.js   # Command registration
├── 🌐 Website
│   ├── src/app/
│   │   ├── page.tsx            # Landing page
│   │   ├── api/generate/       # File generation API
│   │   └── download/[accessKey]/ # Secure downloads
│   ├── src/components/ui/      # UI components
│   └── server.js               # Express server
├── 🗄️ Database
│   ├── prisma/schema.prisma     # Database schema
│   └── dev.db                 # SQLite database
├── ⚙️ Configuration
│   ├── .env                    # Environment variables
│   ├── .github/workflows/       # GitHub Actions
│   └── package.json            # Dependencies
└── 📚 Documentation
    ├── README.md               # This file
    └── docs/                  # Additional docs
```

## 🔐 Security

### Access Control
- **User Authentication**: Discord user ID verification
- **Access Keys**: Unique tokens per file generation
- **Expiration**: 24-hour automatic cleanup
- **Rate Limiting**: Built-in API protection

### Data Protection
- **Environment Variables**: All secrets in environment
- **Database Security**: Prisma best practices
- **API Security**: CORS enabled, input validation
- **HTTPS**: Secure connections only

## 🛠️ Steamtools Integration

### Enhanced Manifest Format
```json
{
  "format": "steamtools",
  "version": "1.0",
  "appid": 730,
  "name": "Counter-Strike 2",
  "manifest": { /* Steam manifest data */ },
  "steamtools_metadata": {
    "generated_by": "Steam Manifest Generator Bot",
    "generated_at": "2025-11-20T06:08:11.454Z",
    "compatible_with": "Steamtools v1.0+",
    "export_format": "json"
  }
}
```

### Enhanced Lua Script
```lua
--[[
  Steamtools Compatible Lua Script
  Generated for: Counter-Strike 2 (730)
  Generated by: Steam Manifest Generator Bot
  
  This script is compatible with Steamtools and can be imported
  directly into your Steamtools project.
]]

-- Rest of Lua script content...
```

## 📊 Environment Variables

### Required
```bash
# Discord Bot
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_application_id

# Website
WEBSITE_URL=https://your-domain.com
DATABASE_URL=your_database_connection_string

# Steam API
STEAM_API_KEY=your_steam_web_api_key
```

### Optional
```bash
# Development
NODE_ENV=development
BOT_PREFIX=!
```

## 🎮 Usage Examples

### Discord Commands
```bash
# Generate files for Counter-Strike 2
/manifest appid:730

# Generate files for any Steam app
/manifest appid:570  # Dota 2
/manifest appid:440  # Team Fortress 2
/manifest appid:220  # Half-Life 2
```

### API Endpoints
```bash
# Generate files
POST /api/generate
{
  "appId": 730,
  "discordUserId": "123456789",
  "discordUsername": "User"
}

# Get file info
GET /api/download/:accessKey

# Download file
POST /api/download/:accessKey
{
  "format": "manifest" | "lua" | "steamtools-manifest" | "steamtools-lua"
}
```

## 🚨 Troubleshooting

### Common Issues

#### Discord Bot
- **"Application did not respond"**: Check bot token and intents
- **"Unknown interaction"**: Deploy commands with `npm run deploy`
- **"Missing access"**: Check bot permissions in server

#### Website
- **"Database connection failed"**: Check DATABASE_URL
- **"Steam API error"**: Verify STEAM_API_KEY
- **"File not found"**: Check access key expiration

#### Deployment
- **GitHub Actions failed**: Check repository secrets
- **Vercel deployment failed**: Check environment variables
- **Bot not starting**: Check Node.js version (>=16.11.0)

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start

# Database operations
npx prisma studio

# API testing
curl http://localhost:3000/api/health
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch
3. **Make** changes with tests
4. **Push** to your fork
5. **Submit** pull request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Discord Bot Invite**: `https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID`
- **Live Demo**: `https://your-domain.com`
- **API Documentation**: `https://your-domain.com/api/docs`
- **Issues**: `https://github.com/yourusername/steam-manifest-generator/issues`
- **Discussions**: `https://github.com/yourusername/steam-manifest-generator/discussions`

---

**Built with ❤️ using Discord.js, Next.js, and Prisma**