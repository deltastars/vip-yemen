#!/bin/bash
# =============================================================================
# ViP Yemen - Auto-Update Verification Script
# =============================================================================
# This script verifies that the auto-update configuration is correct
# =============================================================================

set -e

echo "🔍 ViP Yemen - Auto-Update Verification"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check package name consistency
echo "📋 Checking package name consistency..."

# Get package name from build.gradle
GRADLE_PACKAGE=$(grep -o 'applicationId "[^"]*"' capacitor-app/android/app/build.gradle | head -1 | cut -d'"' -f2)
echo "   build.gradle: $GRADLE_PACKAGE"

# Check for debug suffix
if grep -q 'applicationIdSuffix ".debug"' capacitor-app/android/app/build.gradle; then
    echo -e "   ${RED}❌ ERROR: Debug suffix found! This will cause package mismatch.${NC}"
    echo "   Remove: applicationIdSuffix \".debug\""
    exit 1
else
    echo -e "   ${GREEN}✅ No debug suffix (correct for auto-update)${NC}"
fi

# Check signing consistency
echo ""
echo "📋 Checking signing configuration..."

# Check if debug uses same signing as release
if grep -A5 "debug {" capacitor-app/android/app/build.gradle | grep -q "signingConfig signingConfigs.release"; then
    echo -e "   ${GREEN}✅ Debug and release use same signing (correct)${NC}"
else
    echo -e "   ${YELLOW}⚠️  Warning: Debug and release may use different signing${NC}"
fi

# Check version consistency
echo ""
echo "📋 Checking version consistency..."

# Get version from build.gradle
GRADLE_VERSION=$(grep -o 'versionName "[^"]*"' capacitor-app/android/app/build.gradle | head -1 | cut -d'"' -f2)
GRADLE_CODE=$(grep -o 'versionCode [0-9]*' capacitor-app/android/app/build.gradle | head -1 | awk '{print $2}')

echo "   build.gradle: versionName=$GRADLE_VERSION, versionCode=$GRADLE_CODE"

# Get version from package.json
if [ -f "capacitor-app/package.json" ]; then
    NPM_VERSION=$(node -e "console.log(require('./capacitor-app/package.json').version)")
    echo "   package.json: $NPM_VERSION"
    
    if [ "$GRADLE_VERSION" = "$NPM_VERSION" ]; then
        echo -e "   ${GREEN}✅ Versions match${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Warning: Version mismatch between build.gradle and package.json${NC}"
    fi
fi

# Check keystore exists
echo ""
echo "📋 Checking signing files..."

if [ -f "capacitor-app/keystore.properties" ]; then
    echo -e "   ${GREEN}✅ keystore.properties exists${NC}"
    
    # Check if keystore file exists
    KEYSTORE_FILE=$(grep "storeFile=" capacitor-app/keystore.properties | cut -d'=' -f2)
    if [ -f "capacitor-app/$KEYSTORE_FILE" ]; then
        echo -e "   ${GREEN}✅ Keystore file exists: $KEYSTORE_FILE${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Warning: Keystore file not found: $KEYSTORE_FILE${NC}"
        echo "   Run: cd capacitor-app && sh generate-keystore.sh"
    fi
else
    echo -e "   ${YELLOW}⚠️  Warning: keystore.properties not found${NC}"
    echo "   Run: cd capacitor-app && sh generate-keystore.sh"
fi

# Summary
echo ""
echo "========================================"
echo "📋 Summary"
echo "========================================"
echo ""
echo "For auto-update to work:"
echo "1. ✅ Same package name: com.vip.yemen"
echo "2. ✅ No debug suffix"
echo "3. ✅ Same signing for debug and release"
echo "4. ✅ versionCode increments with each release"
echo ""
echo "📱 Users can update without deleting the old version!"
echo ""
echo "🔄 To create a new version:"
echo "   node scripts/set-android-version.mjs X.Y.Z"
echo "   cd capacitor-app && npm version X.Y.Z --no-git-tag-version"
echo "   git add . && git commit -m 'chore: update version to X.Y.Z'"
echo "   git tag vX.Y.Z && git push origin main && git push origin vX.Y.Z"
