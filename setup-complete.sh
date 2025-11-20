#!/bin/bash

echo "🚀 Setting up complete Supabase integration..."

# Set up Vercel environment variables
echo "📝 Configuring Vercel environment variables..."

# Check if we have Vercel CLI access
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI found, setting environment variables..."
    
    # Set Supabase environment variables
    vercel env add NEXT_PUBLIC_SUPABASE_URL production
    vercel env add SUPABASE_URL production  
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
    vercel env add SUPABASE_ANON_KEY production
    
    echo "🔧 Please enter these values when prompted:"
    echo "NEXT_PUBLIC_SUPABASE_URL = https://xybrjrecphoavhtvcsnn.supabase.co"
    echo "SUPABASE_URL = https://xybrjrecphoavhtvcsnn.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnJqcmVjcGhvYXZodHZjc25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTg1MTYsImV4cCI6MjA3OTE3NDUxNn0.h8jBmRyWN-lASy94nXg6Z19PIkq8tRn_oV78lXXWB2Q"
    echo "SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnJqcmVjcGhvYXZodHZjc25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTg1MTYsImV4cCI6MjA3OTE3NDUxNn0.h8jBmRyWN-lASy94nXg6Z19PIkq8tRn_oV78lXXWB2Q"
    
else
    echo "❌ Vercel CLI not found. Please set environment variables manually:"
    echo "https://vercel.com/dashboard/projects/steam-manifest-generator-7400r641h/settings/environmentvariables"
fi

echo "🔧 Testing local Supabase connection..."

# Test the setup API
curl -X POST http://localhost:3000/api/setup-supabase 2>/dev/null | jq . || echo "Local server not running, but that's okay."

echo "✅ Setup complete! Next steps:"
echo "1. Run the SQL in Supabase: https://xybrjrecphoavhtvcsnn.supabase.co/project/_/sql"
echo "2. Set Vercel environment variables"
echo "3. Test the bot with /manifest appid:730"