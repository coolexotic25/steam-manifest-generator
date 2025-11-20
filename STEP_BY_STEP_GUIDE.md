# 🚀 STEP-BY-STEP GITHUB DEPLOYMENT

## 📋 PREPARATION CHECKLIST

Before starting, make sure you have:
- [ ] **GitHub Account**: Free account created
- [ ] **Discord Developer Account**: Bot application created
- [ ] **Steam API Key** (optional): [Get here](https://steamcommunity.com/dev/apikey)
- [ ] **Vercel Account**: [Sign up here](https://vercel.com/signup)

---

## 🏗️ STEP 1: CREATE GITHUB REPOSITORY

### Option A: Fork This Repository (Easiest)
1. Go to the GitHub repository page
2. Click the **"Fork"** button in the top right
3. Select your GitHub account
4. Wait for fork to complete

### Option B: Create New Repository
1. Go to [GitHub](https://github.com) and click **"New"**
2. Repository name: `steam-manifest-generator`
3. Description: `Discord bot and website for Steam manifest generation`
4. Make it **Public**
5. Click **"Create repository"**

---

## 📁 STEP 2: UPLOAD YOUR CODE

### If You Forked:
1. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/steam-manifest-generator.git
   cd steam-manifest-generator
   ```

### If You Created New:
1. Copy all files from the current project to your new repository
2. Or clone the current project and push to your repo:
   ```bash
   git clone https://github.com/yourusername/steam-manifest-generator.git
   cd steam-manifest-generator
   git remote add new-origin https://github.com/YOUR_USERNAME/steam-manifest-generator.git
   git push new-origin main
   ```

---

## 🔐 STEP 3: ADD GITHUB SECRETS

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** for each of these:

### Required Secrets:
| Secret Name | Value | Where to Get |
|-------------|--------|--------------|
| `DISCORD_TOKEN` | Your Discord bot token | Discord Developer Portal → Bot → Reset Token |
| `CLIENT_ID` | Your Discord application ID | Discord Developer Portal → General Information |
| `WEBSITE_URL` | Your Vercel URL (later) | After Vercel deployment |
| `VERCEL_TOKEN` | Your Vercel API token | Vercel Dashboard → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Your Vercel org ID | Vercel Dashboard URL or settings |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | After Vercel deployment |
| `DATABASE_URL` | Your database URL | Database provider (Supabase, Neon, etc.) |
| `STEAM_API_KEY` | Your Steam API key | Steam Community → Dev API Key |

---

## 🌐 STEP 4: DEPLOY WEBSITE TO VERCEL

### Method A: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository
5. Configure settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm install`
   - **Output Directory**: `./`
6. Click **"Deploy"**

### Method B: Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel --prod
   ```

---

## 🔗 STEP 5: CONNECT VERCEL TO GITHUB

After Vercel deployment:
1. Go to your Vercel project → **Settings** → **Git Integration**
2. Click **"Connect to Git"**
3. Select your GitHub repository
4. Enable **Automatic Deployments** from `main` branch

---

## 🤖 STEP 6: DEPLOY DISCORD BOT

### Option A: Use GitHub Actions (Automatic)
1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy Steam Manifest Generator"
   git push origin main
   ```
2. Go to **Actions** tab in your repository
3. The workflow will automatically deploy your Discord bot

### Option B: Manual Deployment
1. Choose a hosting service:
   - **Replit** (Free): [Import repository](https://replit.com/github)
   - **Railway** (Free tier): [Connect GitHub](https://railway.app/new)
   - **Render** (Free tier): [Connect GitHub](https://render.com/dashboard)
   - **Heroku** (Paid): [Connect GitHub](https://dashboard.heroku.com/new)

---

## 🔧 STEP 7: CONFIGURE INTEGRATION

### Update Environment Variables:
1. After Vercel deployment, copy your Vercel URL
2. Go to your GitHub repository → **Settings** → **Secrets**
3. Update `WEBSITE_URL` secret to: `https://your-app.vercel.app`

### Test Integration:
1. Go to Discord and run: `/manifest appid:730`
2. The bot should call your Vercel website
3. Check that files generate and download correctly

---

## ✅ STEP 8: VERIFY DEPLOYMENT

### Website Verification:
1. Visit your Vercel URL
2. Check health: `https://your-app.vercel.app/api/health`
3. Should return: `{"status":"ok","timestamp":"..."}`

### Bot Verification:
1. Invite bot to your Discord server:
   ```
   https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```
2. Run: `/manifest appid:730`
3. Should respond with download button

---

## 🚨 TROUBLESHOOTING

### Common Issues:

#### "Workflow Failed" in GitHub Actions:
- Check all secret names are correct
- Ensure secret values have no extra spaces
- Verify repository permissions

#### "Deployment Failed" in Vercel:
- Check build command and output directory
- Verify environment variables in Vercel dashboard
- Check function logs for runtime errors

#### "Bot Not Responding":
- Verify `WEBSITE_URL` is correct
- Check Discord bot logs
- Ensure bot has proper permissions

#### "Database Connection Failed":
- Verify `DATABASE_URL` format
- Check database provider status
- Ensure Prisma schema is pushed

### Debug Commands:
```bash
# Test locally first
npm run server  # Test website
npm run bot     # Test bot

# Check database
npx prisma db push
npx prisma studio

# Test API
curl https://your-app.vercel.app/api/health
```

---

## 🎯 SUCCESS METRICS

Your deployment is successful when:
- ✅ **Website**: Responds to `/api/health`
- ✅ **Bot**: Online and responds to commands
- ✅ **Integration**: Bot calls website API
- ✅ **Files**: Generate and download correctly
- ✅ **Security**: Access control working
- ✅ **Steamtools**: Compatible formats available

---

## 📞 GETTING HELP

If you encounter issues:

1. **Check this guide** for missed steps
2. **Review GitHub Actions** logs for errors
3. **Check Vercel dashboard** for deployment issues
4. **Join Discord** for community support
5. **Create GitHub Issue** for technical problems

---

## 🎉 CONGRATULATIONS!

Once completed, you'll have:
- 🌐 **Globally hosted website** via Vercel
- 🤖 **Deployed Discord bot** with automatic updates
- 🔗 **Full integration** between bot and website
- 🛠️ **Steamtools compatibility** for your users
- 🔄 **CI/CD pipeline** for automatic updates

**Your Steam Manifest Generator is now production-ready!** 🚀