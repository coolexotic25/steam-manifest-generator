#!/bin/bash

echo "🚀 STEAM MANIFEST GENERATOR - DEPLOYMENT SCRIPT"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    git branch -M main
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "📝 Committing changes..."
git commit -m "Deploy Steam Manifest Generator with GitHub Actions

# Check if remote exists
if ! git remote get-url origin | grep -q "https"; then
    echo "🔗 No remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/steam-manifest-generator.git"
    echo "   Then run this script again."
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Add secrets to your GitHub repository:"
echo "   - DISCORD_TOKEN"
echo "   - CLIENT_ID" 
echo "   - VERCEL_TOKEN"
echo "   - DATABASE_URL"
echo "   - STEAM_API_KEY"
echo ""
echo "2. Deploy to Vercel: https://vercel.com/new"
echo "3. Connect Vercel to GitHub for automatic deployments"
echo ""
echo "📖 For detailed instructions, see: STEP_BY_STEP_GUIDE.md"