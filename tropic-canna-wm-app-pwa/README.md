
# Tropic Canna – Weedmaps Menu App

A minimal Next.js app that fetches your live Weedmaps **Menu** via the official **Weedmaps Menu API** and displays it with search + category filters. Product cards link back to your Weedmaps listing for checkout.

---

## 1) Prereqs

- Node 18+
- **Weedmaps developer access** with a Bearer token
- Your **Menu ID** for the location you want to show

> How to get access / IDs: see the Weedmaps developer docs.

---

## 2) Configure

Create a file named `.env.local` in the project root with:

```
WEEDMAPS_API_BASE=https://api-g.weedmaps.com
WEEDMAPS_API_VERSION=2025-07
WEEDMAPS_BEARER=REPLACE_WITH_YOUR_BEARER_TOKEN
WEEDMAPS_MENU_ID=REPLACE_WITH_YOUR_MENU_ID
LISTING_URL=https://weedmaps.com/dispensaries/big-chief-collective-2-1
BRAND_NAME=Tropic Canna - Lawton
PRIMARY_COLOR=#FF6DAE
```

> Keep your token secret. Do **not** commit `.env.local` to source control.

---

## 3) Install & run

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

---

## 4) Notes

- This starter calls the **Menu** and **Menu Items** endpoints server-side so your token never hits the browser.
- You can support multiple locations by adding another API route or query param for `menu_id` and rendering a location switcher.
- If the API is unavailable or credentials are missing, the UI will show a friendly error and a button to open your Weedmaps listing directly.


---

## 5) Make it a PWA (Add to Home Screen)
This project includes:
- **`app/manifest.ts`** → provides app name/icon/theme for Add to Home Screen
- **`public/sw.js`** → registers a simple service worker for basic offline caching
- **`app/layout.tsx`** → registers the service worker on load

On iOS Safari or Android Chrome, open your deployed URL and choose **"Add to Home Screen"**.

---

## 6) Deploy on Vercel (recommended)
1. Create a free Vercel account and click **New Project** → **Import** from your GitHub (or drag-drop this folder).
2. In **Project Settings → Environment Variables**, add:
   - `WEEDMAPS_API_BASE=https://api-g.weedmaps.com`
   - `WEEDMAPS_API_VERSION=2025-07`
   - `WEEDMAPS_BEARER=YOUR_BEARER_TOKEN`
   - `WEEDMAPS_MENU_ID=YOUR_MENU_ID`
   - `LISTING_URL=https://weedmaps.com/dispensaries/big-chief-collective-2-1`
   - `BRAND_NAME=Tropic Canna - Lawton`
   - `PRIMARY_COLOR=#FF6DAE`
3. Deploy. Your app will be available at `https://your-project.vercel.app` (or a custom domain).

