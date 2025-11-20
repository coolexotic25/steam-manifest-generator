# 🚀 GitHub Deployment Guide

This guide will help you deploy the Steam Manifest Generator using GitHub with automatic CI/CD.

## 📋 Prerequisites

- **GitHub Account**: For hosting repository and secrets
- **Vercel Account**: For website hosting (free tier is fine)
- **Discord Developer Account**: For bot application
- **Steam Web API Key** (optional but recommended): [Get here](https://steamcommunity.com/dev/apikey)

## 🏗️ Step 1: Prepare Repository

### 1. Fork or Create Repository
```bash
# Option A: Fork this repository
# Go to GitHub and click "Fork"

# Option B: Create new repository
git init
git add .
git commit -m "Initial commit: Steam Manifest Generator"
git branch -M main
git remote add origin https://github.com/yourusername/steam-manifest-generator.git
git push -u origin main
```

### 2. Push Your Code
```bash
# If you've been working locally, push your changes
git add .
git commit -m "Add GitHub deployment setup"
git push origin main
```

## 🔐 Step 2: Configure GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

### Required Secrets

| Secret | Value | Description |
|--------|--------|-------------|
| `DISCORD_TOKEN` | Your Discord bot token | Bot authentication |
| `CLIENT_ID` | Your Discord application ID | Bot identification |
| `WEBSITE_URL` | Your Vercel deployment URL | Bot-website integration |
| `VERCEL_TOKEN` | Your Vercel API token | Website deployment |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Vercel deployment |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Vercel deployment |
| `DATABASE_URL` | Production database URL | Database connection |
| `STEAM_API_KEY` | Your Steam Web API key | Steam data fetching |

### How to Get Values

#### Discord Token & Client ID
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "Bot" tab → Copy Token
4. Go to "General Information" → Copy Application ID

#### Vercel Credentials
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to Account Settings → Tokens → Create New Token
3. Go to your project → Settings → General → Copy Project ID
4. Organization ID is in your account URL or settings

#### Database URL
For production, use a cloud database:
- **Supabase**: `postgresql://[user]:[password]@[host]:[port]/[database]`
- **PlanetScale**: MySQL connection string
- **Neon**: PostgreSQL connection string
- **Railway**: Database connection string

## 🌐 Step 3: Deploy Website to Vercel

### Method A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel --prod

# Follow prompts to connect your GitHub repository
```

### Method B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm install`
   - **Output Directory**: ./
5. Add environment variables (from Step 2)
6. Deploy

### Vercel Configuration
The `vercel.json` file is already configured for:
- **Node.js serverless functions**
- **API routes** (`/api/*`, `/download/*`)
- **Environment variables**
- **Build optimization**

## 🤖 Step 4: Deploy Discord Bot

### Option A: GitHub Actions (Automatic)
The GitHub Actions workflow is already configured:

```yaml
# .github/workflows/deploy-bot.yml
# Automatically runs on push to main branch
# Deploys Discord commands and bot
```

### Option B: Manual Deployment
```bash
# Deploy to your preferred hosting service
# Set environment variables
npm start
```

### Hosting Options for Discord Bot
- **Replit**: Free tier, always online
- **Railway**: Auto-deploys from GitHub
- **Render**: Free tier with background workers
- **Heroku**: Paid dynos required
- **DigitalOcean**: VPS with full control
- **AWS EC2**: Cloud hosting with scalability

## 🔄 Step 5: Configure Integration

### Update Bot Configuration
After deployment, update your bot's environment:

```bash
# In your Discord bot hosting
WEBSITE_URL=https://your-domain.vercel.app
```

### Test Integration
```bash
# Test website API
curl https://your-domain.vercel.app/api/health

# Test Discord bot
/manifest appid:730
```

## 📊 Step 6: Monitor Deployments

### GitHub Actions
- Go to **Actions** tab in your repository
- Monitor deployment status
- View logs for debugging

### Vercel
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- View function logs
- Monitor performance metrics

### Discord Bot
- Check bot console logs
- Monitor API response times
- Track error rates

## 🚨 Troubleshooting

### Common GitHub Issues

#### Workflow Failures
```bash
# Check secrets are correctly named
# Verify secret values have no extra spaces
# Ensure repository has proper permissions
```

#### Vercel Deployment Issues
```bash
# Check environment variables in Vercel dashboard
# Verify build command and output directory
# Check function logs for runtime errors
```

#### Discord Bot Issues
```bash
# Verify WEBSITE_URL is correct
# Check Discord application status
# Ensure bot has proper permissions
```

### Debug Commands
```bash
# Test local setup
npm run server  # Test website locally
npm run bot     # Test bot locally

# Check GitHub Actions locally
act -j deploy-bot.yml  # Requires act CLI

# Database connection
npx prisma db push  # Test database schema
```

## 🎯 Production Checklist

### Before Going Live
- [ ] All GitHub secrets configured
- [ ] Vercel environment variables set
- [ ] Discord application properly configured
- [ ] Database connection tested
- [ ] API endpoints tested
- [ ] Discord bot commands deployed
- [ ] Integration between bot and website tested

### After Deployment
- [ ] Monitor GitHub Actions for failures
- [ ] Check Vercel function logs
- [ ] Test Discord bot in actual server
- [ ] Verify Steam API integration
- [ ] Test file generation and downloads
- [ ] Monitor user feedback and errors

## 📈 Scaling Considerations

### Website Scaling
- **Vercel**: Automatic scaling with serverless functions
- **Database**: Consider connection pooling
- **CDN**: Vercel provides global CDN
- **Monitoring**: Add analytics and error tracking

### Bot Scaling
- **Sharding**: For >1000 servers
- **Rate Limiting**: Implement user limits
- **Caching**: Cache Steam API responses
- **Load Balancing**: Multiple bot instances

## 🔗 Quick Links

- **GitHub Repository**: `https://github.com/yourusername/steam-manifest-generator`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Discord Developer Portal**: `https://discord.com/developers/applications`
- **Steam API Keys**: `https://steamcommunity.com/dev/apikey`

## 🎉 Success Metrics

### Deployment Indicators
- ✅ **Website**: Responds to `/api/health`
- ✅ **Bot**: Online and responds to commands
- ✅ **Integration**: Files generate and download correctly
- ✅ **Security**: Access control and expiration working
- ✅ **Steamtools**: Compatible formats generated

### Monitoring
- 📊 **GitHub Actions**: Deployment status
- 📊 **Vercel**: Function performance
- 📊 **Discord**: Bot uptime and commands
- 📊 **Database**: Query performance and storage

---

**Your Steam Manifest Generator is now ready for production deployment via GitHub!** 🚀

This setup provides:
- 🔄 **Automatic CI/CD** from GitHub
- 🌐 **Global CDN** via Vercel
- 🔒 **Secure deployment** with secrets management
- 📊 **Monitoring** and logging
- 🛠️ **Steamtools compatibility** out of the box