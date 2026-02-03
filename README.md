# Breath

Breathing exercises app – control anxiety, focus, and sleep with guided protocols. Built with Expo (React Native), Supabase (auth + database), and TypeScript.

**Live (web):** [https://breath-beryl.vercel.app/](https://breath-beryl.vercel.app/)

## Features

- **Auth** – Sign up / sign in with email and password (Supabase Auth)
- **Control** – Choose a protocol (anxiety, sleep, focus, anger, performance)
- **Breathe** – Guided breathing with visual feedback and session tracking
- **Results** – Session history and stats (synced to Supabase)
- **Settings** – Notifications, heart rate toggle, account, logout
- **Onboarding** – One-time goals and preferences after first login

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - In **SQL Editor**, run the contents of `supabase/migrations/001_initial.sql`
   - In **Settings → API**, copy **Project URL** and **anon public** key

3. **Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `EXPO_PUBLIC_SUPABASE_URL` = your Project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = your anon key

4. **Run**
   ```bash
   npm run dev
   ```
   Then open in Expo Go (scan QR) or press `w` for web.

## Scripts

| Command           | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Start Expo (Metro)             |
| `npm run dev:clear` | Start with cache cleared   |
| `npm run dev:tunnel` | Start with tunnel (mobile on different network) |
| `npm run build:web`  | Export static web build    |
| `npm run lint`   | Run ESLint                     |
| `npm run typecheck` | Run TypeScript check        |

## Deploy to Vercel (web)

The repo is set up for one-click deploy on [Vercel](https://vercel.com):

1. **Import** the GitHub repo in Vercel (New Project → Import from GitHub).
2. **Build settings** (set in Vercel if not auto-detected):
   - **Build Command:** `npm run build:web`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. **Environment variables** (Project Settings → Environment Variables):
   - `EXPO_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

`vercel.json` in the repo configures rewrites so client-side routes (e.g. `/privacy`, `/terms`) work on the deployed site.

## Mobile

If you see **“Failed to download remote update”** on Android, see [MOBILE_DEV.md](./MOBILE_DEV.md) (same Wi‑Fi, tunnel, firewall).

## Project structure

- `app/` – Expo Router screens (`index`, `(tabs)`, `+not-found`)
- `components/` – UI (Login, Splash, Onboarding, etc.)
- `lib/` – Supabase client, sessions, DB types, connection check
- `utils/` – Auth helpers
- `supabase/migrations/` – SQL for `profiles` and `breathing_sessions`

## License

Private.
