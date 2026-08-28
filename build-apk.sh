#!/bin/bash
# =============================================================================
# ViP Yemen - Local APK Build Script
# =============================================================================
# This script builds the Android APK locally
# Prerequisites: Java 17+, Android SDK, Node.js 22+

set -e

echo "🚀 ViP Yemen APK Builder"
echo "========================"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17+"
    echo "   Ubuntu: sudo apt install openjdk-17-jdk"
    echo "   macOS: brew install openjdk@17"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 22+"
    exit 1
fi

if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME is not set. Trying common paths..."
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
    elif [ -d "/usr/local/android-sdk" ]; then
        export ANDROID_HOME="/usr/local/android-sdk"
    else
        echo "❌ Android SDK not found. Please set ANDROID_HOME"
        exit 1
    fi
fi

echo "✅ Prerequisites OK"
echo ""

# Step 1: Build web assets
echo "📦 Step 1: Building web assets..."
cd website
npm ci --silent
npm run build
cd ..

# Step 2: Copy to capacitor-app
echo "📱 Step 2: Copying web assets to capacitor-app..."
rm -rf capacitor-app/dist
cp -r website/dist/public capacitor-app/dist

# Step 3: Install capacitor dependencies
echo "📥 Step 3: Installing Capacitor dependencies..."
cd capacitor-app
npm ci --silent

# Step 4: Sync Capacitor
echo "🔄 Step 4: Syncing Capacitor Android..."
npx cap sync android

# Step 5: Build APK
echo "🔨 Step 5: Building Android APK..."
cd android

# Build debug APK
echo "   Building debug APK..."
./gradlew assembleDebug --no-daemon --stacktrace

# Build release AAB
echo "   Building release AAB..."
./gradlew bundleRelease --no-daemon --stacktrace

cd ../..

# Step 6: Copy artifacts
echo "📋 Step 6: Copying build artifacts..."
mkdir -p release

VERSION=$(node -e "console.log(require('./capacitor-app/package.json').version)")
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Copy APK
if [ -f "capacitor-app/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    cp "capacitor-app/android/app/build/outputs/apk/debug/app-debug.apk" "release/ViP-Yemen-${VERSION}-debug.apk"
    echo "✅ Debug APK: release/ViP-Yemen-${VERSION}-debug.apk"
fi

# Copy AAB
if [ -f "capacitor-app/android/app/build/outputs/bundle/release/app-release.aab" ]; then
    cp "capacitor-app/android/app/build/outputs/bundle/release/app-release.aab" "release/ViP-Yemen-${VERSION}-release.aab"
    echo "✅ Release AAB: release/ViP-Yemen-${VERSION}-release.aab"
fi

echo ""
echo "🎉 Build complete!"
echo ""
echo "📱 Files ready in release/ directory:"
ls -lh release/
echo ""
echo "📥 To install APK on Android device:"
echo "   1. Copy ViP-Yemen-${VERSION}-debug.apk to your device"
echo "   2. Enable 'Install from unknown sources' in Android settings"
echo "   3. Open the file and install"
echo ""
echo "📤 To publish to Google Play:"
echo "   1. Upload ViP-Yemen-${VERSION}-release.aab to Google Play Console"
echo "   2. Follow the store listing requirements"
