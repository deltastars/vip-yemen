#!/bin/bash
# =============================================================================
# ViP Yemen - Android Keystore Generator
# =============================================================================
# This script generates a keystore for signing the Android app
# Package: com.vip.yemen
# =============================================================================

set -e

echo "🔑 ViP Yemen - Android Keystore Generator"
echo "=========================================="
echo ""

# Configuration
KEYSTORE_FILE="vipyemen-release.jks"
KEY_ALIAS="vipyemen"
KEYSTORE_PASSWORD="ViP@2026#Secure!"
KEY_PASSWORD="ViP@2026#Key!"
VALIDITY_DAYS=10000

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo "❌ keytool is not installed. Please install Java JDK."
    exit 1
fi

# Check if keystore already exists
if [ -f "$KEYSTORE_FILE" ]; then
    echo "⚠️  Keystore file already exists: $KEYSTORE_FILE"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

echo "📋 Keystore Configuration:"
echo "   File: $KEYSTORE_FILE"
echo "   Alias: $KEY_ALIAS"
echo "   Validity: $VALIDITY_DAYS days (~27 years)"
echo "   Algorithm: RSA 2048-bit"
echo ""

# Generate keystore
echo "🔨 Generating keystore..."
keytool -genkey -v \
    -keystore "$KEYSTORE_FILE" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity "$VALIDITY_DAYS" \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "CN=ViP Yemen, OU=Development, O=ViP Services Yemen, L=Sana'a, ST=Sana'a, C=YEM"

echo ""
echo "✅ Keystore generated successfully!"
echo ""

# Create keystore.properties
echo "📝 Creating keystore.properties..."
cat > keystore.properties << EOF
# =============================================================================
# ViP Yemen - Android Keystore Configuration
# Generated: $(date)
# =============================================================================
# DO NOT commit this file to version control!
# =============================================================================

# Keystore file path
storeFile=$KEYSTORE_FILE

# Keystore password
storePassword=$KEYSTORE_PASSWORD

# Key alias
keyAlias=$KEY_ALIAS

# Key password
keyPassword=$KEY_PASSWORD
EOF

echo "✅ keystore.properties created!"
echo ""

# Create .gitignore entries
echo "📝 Updating .gitignore..."
if [ -f "../.gitignore" ]; then
    # Check if entries already exist
    if ! grep -q "keystore.properties" "../.gitignore"; then
        echo "" >> "../.gitignore"
        echo "# Android Keystore (NEVER COMMIT!)" >> "../.gitignore"
        echo "capacitor-app/keystore.properties" >> "../.gitignore"
        echo "capacitor-app/*.jks" >> "../.gitignore"
        echo "capacitor-app/*.keystore" >> "../.gitignore"
        echo "✅ .gitignore updated!"
    else
        echo "✅ .gitignore already configured"
    fi
else
    echo "⚠️  .gitignore not found. Please add these entries manually:"
    echo "   capacitor-app/keystore.properties"
    echo "   capacitor-app/*.jks"
    echo "   capacitor-app/*.keystore"
fi

echo ""
echo "🔐 IMPORTANT: Keep these credentials secure!"
echo "   Keystore: $KEYSTORE_FILE"
echo "   Keystore Password: $KEYSTORE_PASSWORD"
echo "   Key Alias: $KEY_ALIAS"
echo "   Key Password: $KEY_PASSWORD"
echo ""
echo "📋 Next steps:"
echo "   1. Verify keystore: keytool -list -v -keystore $KEYSTORE_FILE"
echo "   2. Build release: cd android && ./gradlew bundleRelease"
echo "   3. Verify signature: $ANDROID_HOME/build-tools/*/apksigner verify --verbose app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "✅ Ready for publishing!"
