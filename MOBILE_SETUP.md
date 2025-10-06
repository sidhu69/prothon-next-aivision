# Mobile APK Build Setup Guide

## Prerequisites

Before the GitHub Actions workflow can build APKs, you need to complete these one-time setup steps locally.

## Initial Setup Steps

### 1. Export to GitHub
Click the GitHub button in Lovable to export your project to a GitHub repository.

### 2. Clone Your Repository Locally
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Add Android Platform
```bash
npx cap add android
```

This creates the `android/` directory with all necessary Android project files.

### 5. Update Capacitor
```bash
npx cap update android
```

### 6. Build the Web App
```bash
npm run build
```

### 7. Sync to Native Platform
```bash
npx cap sync android
```

### 8. Commit Android Files
```bash
git add android/
git commit -m "Add Android platform"
git push origin main
```

## GitHub Actions Workflows

### Debug APK (Automatic)
- **File**: `.github/workflows/build-android.yml`
- **Trigger**: Pushes to `main` branch or manual dispatch
- **Output**: Debug APK (unsigned, for testing)
- **Download**: Check the "Actions" tab → Select workflow run → Download artifact

### Release APK (Manual, Signed)
- **File**: `.github/workflows/build-release-apk.yml`
- **Trigger**: Manual dispatch only
- **Output**: Signed release APK (ready for distribution)

## Setting Up Signed Release Builds

To build signed release APKs, you need to configure signing keys:

### 1. Generate a Keystore (One-Time)
```bash
keytool -genkey -v -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Save these values - you'll need them:**
- Keystore password
- Key alias (e.g., "my-key-alias")
- Key password

### 2. Convert Keystore to Base64
```bash
base64 release.keystore > release.keystore.base64
```

### 3. Add Secrets to GitHub

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:
- `KEYSTORE_BASE64`: Content of `release.keystore.base64` file
- `KEYSTORE_PASSWORD`: Your keystore password
- `KEY_ALIAS`: Your key alias (e.g., "my-key-alias")
- `KEY_PASSWORD`: Your key password

### 4. Run Release Build

1. Go to Actions tab in GitHub
2. Select "Build Release APK (Signed)"
3. Click "Run workflow"
4. Enter version number (e.g., "1.0.0")
5. Click "Run workflow"

The signed APK will be available as:
- Artifact download in the workflow run
- GitHub Release with the version tag

## Testing APKs

### Install Debug APK
```bash
adb install app-debug.apk
```

### Install Release APK
```bash
adb install app-release.apk
```

## Troubleshooting

### Workflow fails with "android directory not found"
- Make sure you've run `npx cap add android` locally
- Commit and push the `android/` directory

### Gradle build fails
- Check JDK version (should be 17)
- Check Android SDK setup in workflow
- Review build logs in GitHub Actions

### Signing fails
- Verify all secrets are set correctly in GitHub
- Ensure KEYSTORE_BASE64 is the base64-encoded keystore file
- Check that passwords match those used when creating the keystore

## Hot Reload During Development

The app is configured to connect to Lovable's preview URL for hot reload:
```
https://ad035749-a12e-48ef-af11-1f2a73ae786e.lovableproject.com
```

This means you can:
- Make changes in Lovable
- App automatically updates without rebuilding
- Perfect for rapid development!

To build a standalone APK (without hot reload), update `capacitor.config.ts` and remove the `server` configuration.

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Android Signing Guide](https://developer.android.com/studio/publish/app-signing)

## Questions?

For issues with:
- Lovable platform → support@lovable.dev
- Capacitor → [Capacitor Discussions](https://github.com/ionic-team/capacitor/discussions)
- Android builds → Check Android Studio logs
