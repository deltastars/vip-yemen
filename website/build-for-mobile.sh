#!/bin/bash
# ViP Yemen - Build Web Assets for Mobile App
# This script builds the web app and copies it to capacitor-app/dist

set -e

echo "🔨 Building ViP Yemen web assets..."

# Navigate to website directory
cd "$(dirname "$0")"

# Build the web app
echo "📦 Building Vite production bundle..."
bun run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Web build complete"

# Copy to capacitor-app/dist
echo "📱 Copying to capacitor-app/dist..."
rm -rf ../capacitor-app/dist
cp -r dist ../capacitor-app/dist

echo "✅ Assets copied to capacitor-app/dist"
echo "🚀 Ready for Capacitor sync and mobile build"
