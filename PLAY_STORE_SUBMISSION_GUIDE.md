# Google Play Store Submission Guide - Breath App

## 📱 Complete Asset Checklist

All required graphics for your **Breath** meditation app Play Store submission have been created and organized in the `assets/store-graphics/` directory.

---

## 🎨 Required Assets Created

### ✅ 1. App Icon
**Location:** `assets/store-graphics/icon-512x512.png`
- **Size:** 512x512px (Play Store requires 512x512px)
- **Format:** 32-bit PNG
- **Design:** Modern gradient with concentric breath circles and lung symbol
- **Notes:** Also have 1024x1024px version in `assets/images/icon.png`

### ✅ 2. Feature Graphic
**Location:** `assets/store-graphics/play-store-feature.png`
- **Size:** 1024x500px
- **Format:** JPG or 24-bit PNG (no alpha)
- **Design:** App icon on left, "Breath - Find Your Calm" branding
- **Usage:** Displays at the top of your Play Store listing

### ✅ 3. Phone Screenshots (REQUIRED - Minimum 2)
**Location:** `assets/store-graphics/screenshots/`

All screenshots are **1080x1920px** (frameless, no device mockup):

1. **01_login.png** - Welcome/Login screen
2. **02_breathe.png** - Active breathing exercise session
3. **03_progress.png** - User progress and statistics
4. **04_onboarding.png** - Onboarding experience
5. **05_settings.png** - Settings and preferences

**Screenshot Guidelines:**
- ✅ Minimum: 2 screenshots (we have 5)
- ✅ Maximum: 8 screenshots
- ✅ Format: JPG or 24-bit PNG
- ✅ Dimensions: 1080x1920px to 3840x2160px
- ✅ Aspect ratio: 16:9 or 9:16
- ✅ NO device frames (Play Store adds these automatically)

### ✅ 4. Promotional Graphic (Optional)
**Location:** `assets/store-graphics/promo-180x120.png`
- **Size:** 180x120px
- **Format:** JPG or 24-bit PNG
- **Usage:** Optional promotional material

---

## 📋 Play Store Listing Requirements

### App Details

**App Name:**
```
Breath - Meditation & Wellness
```

**Short Description (max 80 characters):**
```
Master your breathing, master your mind. Reduce stress & improve focus.
```

**Full Description (max 4000 characters):**
```
🌬️ Breath - Your Personal Breathing Coach

Transform your wellness journey with Breath, the ultimate meditation and breathing exercise app designed to help you reduce stress, improve focus, and achieve inner calm.

✨ KEY FEATURES:

🫁 Guided Breathing Exercises
• 4-7-8 Breathing Technique
• Box Breathing for Focus
• Deep Breathing for Relaxation
• Custom breathing patterns

📊 Track Your Progress
• Monitor your meditation journey
• View detailed statistics
• Maintain daily streaks
• Celebrate milestones

🎯 Personalized Experience
• Set custom breathing durations
• Choose from calming themes
• Customize notification reminders
• Adapt sessions to your schedule

💜 Beautiful & Intuitive Design
• Stunning visual breathing guides
• Calming color schemes
• Smooth animations
• Dark mode optimized

🔒 Privacy First
• Secure account sync
• Your data stays private
• No ads, no tracking

BENEFITS OF REGULAR BREATHING PRACTICE:
✓ Reduce stress and anxiety
✓ Improve sleep quality
✓ Enhance focus and concentration
✓ Lower blood pressure
✓ Increase mindfulness
✓ Boost overall wellness

Perfect for beginners and experienced meditators alike. Whether you need a quick 2-minute breathing break or a longer meditation session, Breath adapts to your needs.

Start your journey to better breathing and improved wellness today!

📱 Download Breath now and experience the transformative power of conscious breathing.
```

**Category:**
- Primary: Health & Fitness
- Secondary: Mental Wellness / Meditation

**Tags/Keywords:**
```
breathing, meditation, mindfulness, wellness, stress relief, anxiety relief, 
relaxation, mental health, breathing exercises, calm, sleep, focus, zen, yoga
```

---

## 🎯 Content Rating

Fill out the content rating questionnaire:
- **Violence:** None
- **Sexual Content:** None
- **Language:** None
- **Controlled Substances:** None
- **Gambling:** None
- **Social Features:** User accounts (authentication)
- **Data Collection:** Yes (user progress/stats)

Expected Rating: **Everyone** or **Everyone 10+**

---

## 📊 Store Listing Details

### Privacy Policy
**Required:** Yes (if you collect user data)
- Create a privacy policy page
- Host it on your website or GitHub
- Include details about data collection (email, progress stats)

**URLs (app hosted on Vercel):**
- **Privacy Policy:** https://breath-beryl.vercel.app/privacy  
- **Terms of Service:** https://breath-beryl.vercel.app/terms  

Use the Privacy Policy URL in Play Console when asked for the app’s privacy policy link.

### Target Audience
- **Age:** 13+ (or Everyone)
- **Primary Audience:** Adults seeking stress relief and wellness
- **Secondary:** Students, professionals, meditation practitioners

### Countries
- Recommended: Start with US, UK, Canada, Australia
- Expand to: Worldwide after initial testing

### Pricing
- **Free** with optional in-app purchases (if planning premium features)
- OR **Paid** (set your price)

---

## 🚀 Technical Requirements

### App Bundle/APK
```bash
# Build production AAB (Android App Bundle)
eas build --platform android --profile production

# Or build APK for testing
eas build --platform android --profile preview
```

### Version Information
- **Version Code:** 1
- **Version Name:** 1.0.0
- **Package Name:** com.dhaval29.breath (from app.json)

### Permissions Required
Review your app's permissions in `app.json` and `AndroidManifest.xml`:
- Internet (for authentication)
- Notifications (optional - for reminders)

### SDK Versions
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 34+ (latest Android)

---

## 📝 Pre-Submission Checklist

### Assets
- [x] App icon (512x512px)
- [x] Feature graphic (1024x500px)
- [x] At least 2 phone screenshots (we have 5)
- [x] Promotional graphic (optional, but we have it)

### App Details
- [ ] App name and description written
- [ ] Privacy policy created and hosted
- [ ] Content rating questionnaire completed
- [ ] Category selected
- [ ] Pricing set

### Technical
- [ ] Signed AAB/APK built and tested
- [ ] All permissions justified
- [ ] Min/Target SDK set correctly
- [ ] Version codes incremented properly

### Testing
- [ ] Test on multiple Android devices
- [ ] Test different screen sizes
- [ ] Verify all features work
- [ ] Check authentication flow
- [ ] Test offline functionality

### Legal
- [ ] Privacy policy URL provided
- [ ] Terms of service created (if needed)
- [ ] Content rating completed
- [ ] Distribution countries selected

---

## 📸 Screenshot Upload Order

When uploading to Play Console, use this order for best presentation:

1. **02_breathe.png** - Show the main feature first (breathing exercise)
2. **03_progress.png** - Demonstrate value (progress tracking)
3. **01_login.png** - Show professional onboarding
4. **04_onboarding.png** - Welcoming experience
5. **05_settings.png** - Customization options

**Pro Tip:** You can add text overlays or captions to screenshots in Play Console to highlight key features!

---

## 🎨 Optional Enhancements

### Additional Graphics You Can Create Later:

1. **Tablet Screenshots** (7" and 10")
   - Size: 1920x1200px to 2560x1800px
   - Shows app optimized for tablets
   - Increases quality perception

2. **TV Banner** (for Android TV - if applicable)
   - Size: 1280x720px
   - Required only if supporting TV

3. **Feature Graphics for Updates**
   - Create seasonal variations
   - Special event graphics
   - Update announcements

### Video Preview (Highly Recommended!)
- YouTube video (30 seconds to 2 minutes)
- Show app in action
- Highlight key features
- Professional voiceover optional
- Significant boost in conversions

---

## 🔗 Useful Resources

### Google Play Console
- Console URL: https://play.google.com/console
- Asset specifications: https://support.google.com/googleplay/android-developer/answer/9866151

### Build Commands
```bash
# Install EAS CLI (if not already)
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for production
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

### Testing
```bash
# Test locally
npx expo start

# Build preview for testing
eas build --platform android --profile preview
```

---

## 📱 Asset Directory Structure

```
assets/store-graphics/
├── icon-512x512.png          (App Icon - 512x512px)
├── play-store-feature.png    (Feature Graphic - 1024x500px)
├── promo-180x120.png         (Promo Graphic - 180x120px)
└── screenshots/              (Phone Screenshots - 1080x1920px)
    ├── 01_login.png
    ├── 02_breathe.png
    ├── 03_progress.png
    ├── 04_onboarding.png
    └── 05_settings.png
```

---

## ✅ Ready to Submit!

You now have all the required graphical assets for Google Play Store submission:

✅ **App Icon** - Professional, calming design  
✅ **Feature Graphic** - Eye-catching store banner  
✅ **5 Screenshots** - Showcasing all key features  
✅ **Promo Graphic** - Additional promotional material  

### Next Steps:

1. **Build your app:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Create Play Console account:**
   - Go to https://play.google.com/console
   - Pay $25 one-time registration fee

3. **Create new app listing:**
   - Upload all assets from `assets/store-graphics/`
   - Fill in app details (name, description, category)
   - Add privacy policy URL: **https://breath-beryl.vercel.app/privacy**
   - Complete content rating

4. **Upload APK/AAB:**
   - Upload your production build
   - Fill in release notes

5. **Submit for review:**
   - Review all information
   - Submit to Google Play
   - Wait for approval (typically 1-7 days)

---

## 🎉 Good Luck!

Your Breath app has professional, Play Store-ready graphics that meet all Google's requirements. The calming design and comprehensive screenshots will help attract users and showcase your app's value.

**Questions or need help?** Check the Google Play Console documentation or reach out for assistance.

---

**Created:** February 3, 2026  
**Version:** 1.0.0  
**App:** Breath - Meditation & Wellness
