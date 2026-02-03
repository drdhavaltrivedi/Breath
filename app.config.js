// Load .env so EXPO_PUBLIC_* are available at build time (web + mobile)
try {
  require('dotenv').config();
} catch {
  // .env or dotenv may be missing; process.env may still be set by shell or EAS
}

const appJson = require('./app.json');
const env = typeof process !== 'undefined' ? process.env : {};
const supabaseUrl = (env.EXPO_PUBLIC_SUPABASE_URL ?? '').toString().trim();
const supabaseAnonKey = (env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').toString().trim();

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      supabaseUrl,
      supabaseAnonKey,
    },
    // Prevent "Failed to download remote update" on Android: load only from Metro in dev
    updates: {
      enabled: false,
      checkAutomatically: 'NEVER',
      fallbackToCacheTimeout: 0,
    },
  },
};
