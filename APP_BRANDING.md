# Breath App - Branding Assets

## App Icon & Splash Screen Documentation

### Overview
Professional app icons and splash screens have been created for the Breath meditation app, designed to meet Play Store and App Store standards.

### Assets Created

#### 1. **Main App Icon** (`icon.png`)
- **Size**: 1024x1024px
- **Format**: PNG
- **Design**: Modern gradient with concentric circles representing breath waves
- **Colors**: Teal (#4FD1C5) to Blue (#667EEA) gradient
- **Usage**: iOS, Android (legacy), and Web

#### 2. **Android Adaptive Icon**
**Foreground** (`adaptive-icon.png`):
- **Size**: 1024x1024px
- **Format**: PNG with transparent background
- **Design**: Concentric circles with lung symbol
- **Safe Zone**: Center 66% contains all important elements

**Background** (`adaptive-icon-background.png`):
- **Size**: 1024x1024px
- **Format**: PNG
- **Design**: Smooth gradient from teal to blue
- **Purpose**: Background layer for Android adaptive icons

#### 3. **Splash Screen** (`splash.png`)
- **Size**: 1284x2778px (iPhone Pro Max size)
- **Format**: PNG
- **Design**: Gradient background with centered glowing app icon
- **Background Color**: #4FD1C5 (Teal)
- **Resize Mode**: contain

#### 4. **Favicon** (`favicon.png`)
- **Size**: 1024x1024px
- **Format**: PNG
- **Usage**: Web application favicon

### Configuration

All assets are properly configured in `app.json`:

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4FD1C5"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundImage": "./assets/images/adaptive-icon-background.png"
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    }
  }
}
```

### Design Philosophy

**Color Palette**:
- Primary Teal: `#4FD1C5`
- Primary Blue: `#667EEA`
- Accent Purple: Subtle purple tints in gradients

**Design Elements**:
- Concentric circles representing breath waves
- Stylized lung/breath symbol in the center
- Soft glows and modern gradients
- Minimalist, calming aesthetic
- Professional and premium look

### Play Store & App Store Readiness

✅ **Icon Requirements Met**:
- 1024x1024px size (required by both stores)
- No alpha/transparency in main icon
- Professional, recognizable design
- Follows Material Design 3 guidelines (Android)
- Follows Human Interface Guidelines (iOS)

✅ **Adaptive Icon (Android)**:
- Separate foreground and background layers
- Safe zone compliance (66% center)
- Works with all launcher shapes (circle, rounded square, squircle)

✅ **Splash Screen**:
- High resolution for all device sizes
- Fast loading visual feedback
- Brand consistency

### Testing Recommendations

1. **Local Testing**:
   ```bash
   npx expo start
   # Test on iOS simulator
   # Test on Android emulator
   ```

2. **Check Icon Appearance**:
   - Different launcher themes (Android)
   - Different device sizes
   - Light/dark mode compatibility

3. **Build for Production**:
   ```bash
   # Android
   eas build --platform android
   
   # iOS
   eas build --platform ios
   ```

### Next Steps

1. ✅ Icons created and configured
2. ✅ Splash screen added
3. ⏭️ Build and test on real devices
4. ⏭️ Submit to Play Store/App Store
5. ⏭️ Create promotional graphics (screenshots, feature graphics)

### Additional Assets Needed for Store Submission

**Google Play Store**:
- Feature Graphic: 1024x500px
- Screenshots: At least 2 (phone), recommend 4-8
- Promotional video (optional but recommended)

**Apple App Store**:
- Screenshots: Required for all supported devices
- App Previews (optional videos)
- Promotional text and descriptions

---

**Created**: February 3, 2026  
**App**: Breath - Breathing & Meditation App  
**Version**: 1.0.0
