# Deploying JBØ6 Mini ERP to Vercel (Step-by-Step Beginner Guide)

This guide takes you click-by-click through deploying your **Storefront** and **Operations Console** to [Vercel](https://vercel.com) from your Git repository, connected to your **Supabase** backend.

---

## 📌 Deployment Overview

You will create **TWO separate Vercel projects** pointing to the **same GitHub repository**:

| Project Name in Vercel | Root Directory | Production URL (Example) | Purpose |
| :--- | :--- | :--- | :--- |
| **`jb06-storefront`** | `apps/storefront` | `https://shop.yourdomain.com` (or `jb06-storefront.vercel.app`) | Customer E-Commerce Atelier |
| **`jb06-console`** | `apps/console` | `https://admin.yourdomain.com` (or `jb06-console.vercel.app`) | Operations & ERP Console |

---

## 🔑 Phase 1: Gathering Your Keys from Supabase

Keep your [Supabase Dashboard](https://supabase.com/dashboard) open in one browser tab. You will need these 5 values from your project settings:

1. **Project URL**: In Supabase Dashboard -> Click **Project Settings** (gear icon at bottom-left) -> **Data API** -> Copy **Project URL** (e.g. `https://xyz.supabase.co`).
2. **Publishable Key (`anon`)**: Same page -> Under **Project API keys** -> Copy the `anon` / `public` key.
3. **Secret Key (`service_role`)**: Same page -> Click **Reveal** next to `service_role` -> Copy the secret key.
4. **Database Pooled URL (`DATABASE_URL`)**:
   - In Supabase Dashboard -> **Project Settings** -> **Database**.
   - Under **Connection string**, select the **Transaction** pooler mode (port `6543`).
   - Copy the URI and append `?pgbouncer=true&connection_limit=1` to the end.
5. **Direct / Session URL (`DIRECT_URL`)**:
   - On the same **Database** settings page, select the **Session** pooler mode (port `5432`).
   - Copy this URI (used by Prisma during deployment migrations).

---

## 🚀 Phase 2: Deploy Project 1 — Storefront (`apps/storefront`)

### Step 1: Push your code to GitHub
Make sure your project repository is pushed to your personal GitHub account.

### Step 2: Create the Project in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click the **"Add New..."** button (top-right) -> Select **"Project"**.
3. Under **"Import Git Repository"**, find your `JB06` repository and click **"Import"**.

### Step 3: Configure Project Settings
1. **Project Name**: Name it `jb06-storefront`.
2. **Framework Preset**: Ensure **Next.js** is selected.
3. **Root Directory**:
   - Click the **Edit** button next to Root Directory.
   - Select `apps/storefront` from the folder tree (or type `apps/storefront`).
   - Click **Continue**.

### Step 4: Configure Build & Output Settings
Expand the **"Build and Output Settings"** section:
- **Build Command**: Toggle Override **ON** and enter:
  ```bash
  cd ../.. && pnpm --filter @jb06/db generate && pnpm --filter @jb06/storefront build
  ```
- **Install Command**: Toggle Override **ON** and enter:
  ```bash
  pnpm install
  ```

### Step 5: Add Environment Variables
Expand the **"Environment Variables"** section and add the following 7 keys:

| Key | Value Source | Target Environments |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase Pooled URI (Port 6543 + `?pgbouncer=true&connection_limit=1`) | Production, Preview, Development |
| `DIRECT_URL` | Supabase Session URI (Port 5432) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (`https://xyz.supabase.co`) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase `anon` public key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` secret key | Production, Preview, Development |
| `NEXT_PUBLIC_CONSOLE_URL` | The URL of your Console project (e.g. `https://admin.yourdomain.com` or leave empty for now) | Production, Preview, Development |
| `EXCHANGE_RATE` | `58.00` | Production, Preview, Development |

### Step 6: Click Deploy
Click the blue **"Deploy"** button. Vercel will install dependencies, generate the Prisma client, build the Next.js storefront, and provide your live URL!

---

## 🛠️ Phase 3: Deploy Project 2 — Console (`apps/console`)

### Step 1: Create the Second Project in Vercel
1. Back on the [Vercel Dashboard](https://vercel.com), click **"Add New..."** -> **"Project"**.
2. Select the **same `JB06` repository** and click **"Import"**.

### Step 2: Configure Project Settings
1. **Project Name**: Name it `jb06-console`.
2. **Framework Preset**: Ensure **Next.js** is selected.
3. **Root Directory**:
   - Click **Edit** next to Root Directory.
   - Select `apps/console`.
   - Click **Continue**.

### Step 3: Configure Build & Output Settings
Expand **"Build and Output Settings"**:
- **Build Command**: Toggle Override **ON** and enter:
  ```bash
  cd ../.. && pnpm --filter @jb06/db generate && pnpm --filter @jb06/console build
  ```
- **Install Command**: Toggle Override **ON** and enter:
  ```bash
  pnpm install
  ```

### Step 4: Add Environment Variables
Add the following 6 keys:

| Key | Value Source | Target Environments |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase Pooled URI (Port 6543 + `?pgbouncer=true&connection_limit=1`) | Production, Preview, Development |
| `DIRECT_URL` | Supabase Session URI (Port 5432) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (`https://xyz.supabase.co`) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase `anon` public key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` secret key | Production, Preview, Development |
| `NEXT_PUBLIC_STOREFRONT_URL` | The live URL of your Storefront project (e.g. `https://jb06-storefront.vercel.app`) | Production, Preview, Development |

*(Note: `NEXT_PUBLIC_STOREFRONT_URL` is used by the Console's **Live Monitor Spectator Iframe** so administrators can watch real customers live on the deployed storefront!)*

### Step 5: Click Deploy
Click the blue **"Deploy"** button.

---

## ⚡ Phase 4: Supabase Integration & Vercel Marketplace (Optional Recommended)

To automatically sync database credentials whenever Supabase rotates keys:
1. In Vercel, go to the **Integrations** tab in your team dashboard.
2. Search for **"Supabase"** in the Vercel Marketplace.
3. Click **"Add Integration"** -> Choose your account -> Select your `JB06` projects.
4. Select your existing Supabase project. Vercel will automatically manage `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` for you.

---

## ⏰ Phase 5: Enabling the 1-Minute Reservation Expiry Cron in Supabase

In JBØ6, items added to the cart reserve vault stock for **15 minutes**. If unpaid, the reservation is released automatically back into stock.

To set up the automated cleaner in Supabase:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) -> Select your project.
2. In the left sidebar, click **"Database"** -> Click **"Extensions"**.
3. Search for **`pg_cron`** -> Click the toggle to **Enable** it.
4. Now click **"SQL Editor"** in the left sidebar.
5. Click **"New Query"**, paste the following SQL, and click **"Run"**:

```sql
-- Schedule a background cron job that releases expired reservations every minute
SELECT cron.schedule(
  'release-expired-reservations-every-minute',
  '* * * * *',
  $$
  UPDATE variants
  SET reserved = 0
  WHERE reserved > 0
    AND updated_at < NOW() - INTERVAL '15 minutes';
  $$
);
```

You will see `Success. No rows returned`. Your vault hold auto-release is now live!

---

## 📦 Phase 6: Supabase Storage for Product Images

1. In Supabase Dashboard, click **"Storage"** in the left sidebar.
2. Click **"New Bucket"**.
3. Bucket name: **`product-images`**.
4. Toggle **"Public bucket"** to **ON** (product pictures need to be visible to online shoppers).
5. Click **"Save"**.

---

## 🌐 Phase 7: Custom Domains (e.g. `shop.` and `admin.`)

If you own a custom domain (e.g. `jb06atelier.com`):
1. In Vercel -> Go to your `jb06-storefront` project -> **Settings** -> **Domains**.
   - Add `shop.jb06atelier.com` (or `www.jb06atelier.com`).
2. Go to your `jb06-console` project -> **Settings** -> **Domains**.
   - Add `admin.jb06atelier.com`.
3. Configure the CNAME records in your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.) pointing to `cname.vercel-dns.com`.
