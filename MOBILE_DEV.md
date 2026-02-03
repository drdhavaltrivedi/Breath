# Mobile development (Android / iOS)

## "Failed to download remote update" on Android

This usually means the device cannot reach your Metro bundler. Try in order:

1. **Same Wi‑Fi**  
   Phone and computer must be on the same Wi‑Fi. Turn off mobile data on the phone so it only uses Wi‑Fi.

2. **Restart with cache clear**  
   ```bash
   npm run dev:clear
   ```
   Then scan the QR code again in Expo Go.

3. **Use tunnel (works across networks)**  
   ```bash
   npm run dev:tunnel
   ```
   Expo will use a public URL. First run may ask to install `@expo/ngrok`. Scan the new QR code in Expo Go.

4. **Firewall**  
   Allow Node / Metro on your computer firewall (often ports 8081, 19000, 19001).

5. **Manual URL**  
   In Expo Go, enter the URL shown in the terminal (e.g. `exp://192.168.x.x:8081`) instead of scanning the QR code.
