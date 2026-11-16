# JBØ6 Mini ERP — Vercel Deployment Guide

This guide walks you through deploying the **JBØ6 Mini ERP** monorepo to Vercel.

Because this project is a high-performance **Turborepo monorepo**, it contains two independent Next.js 15 applications:
1. **Storefront (Customer App):** `apps/storefront` &rarr; e.g. `https://jbo6.vercel.app`
2. **Admin Console (Staff ERP):** `apps/console` &rarr; e.g. `https://jbo6-console.vercel.app`

On Vercel, you will create **two projects** connected to the **same GitHub repository**.

---

## Step 1: Push Your Code to GitHub

If you haven't already pushed this project to a GitHub repository, run the following commands in your terminal:

```bash
# 1. Initialize git (if not already on master/main)
git branch -M main

# 2. Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 3. Push all commits to GitHub
git push -u origin main
```

---

## Step 2: Deploy the Storefront (Customer App)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." &rarr; "Project"**.
2. Select your GitHub repository and click **"Import"**.
3. Configure the Project Settings:
   * **Project Name:** `jb06-storefront` (or `jbo6`)
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Click **"Edit"** next to Root Directory and select **`apps/storefront`**.
   * Leave Build Command and Output Directory as default (Turborepo is automatically detected).
4. Expand **Environment Variables** and add the following keys:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.jyeibdxqrmouwrliakow:degregation4life@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require` | Supabase Pooler (Direct Session) |
| `DIRECT_URL` | `postgresql://postgres.jyeibdxqrmouwrliakow:degregation4life@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require` | Migration & Prisma engine URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jyeibdxqrmouwrliakow.supabase.co` | Supabase REST & Auth API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_U3uFXwFxgzgLbIgU6UvZVA_MXb0-Vzc` | Public browser API key |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_nOrZ_7RvnYxIYYDHieuQhA_fIa178DI` | Server-only admin secret key |
| `NEXT_PUBLIC_STOREFRONT_URL` | `https://jb06-storefront.vercel.app` | (Update with your actual Vercel domain once assigned) |
| `NEXT_PUBLIC_CONSOLE_URL` | `https://jb06-console.vercel.app` | (Update with your console domain once deployed) |
| `CRON_SECRET` | `jb06_super_secret_cron_token_2026` | Authorization token for release-reservations cron |

5. Click **"Deploy"**.
   * Vercel will install dependencies using `pnpm`, run `prisma generate` via `@jb06/db`, and compile the static & dynamic routes.

---

## Step 3: Deploy the Admin Console (Staff ERP)

1. In your [Vercel Dashboard](https://vercel.com/dashboard), click **"Add New..." &rarr; "Project"** again.
2. Select the **same GitHub repository** and click **"Import"**.
3. Configure the Project Settings:
   * **Project Name:** `jb06-console`
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Click **"Edit"** next to Root Directory and select **`apps/console`**.
   * Leave Build Command and Output Directory as default.
4. Expand **Environment Variables** and add the same database and Supabase keys:

| Variable Name | Value |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.jyeibdxqrmouwrliakow:degregation4life@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `DIRECT_URL` | `postgresql://postgres.jyeibdxqrmouwrliakow:degregation4life@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jyeibdxqrmouwrliakow.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_U3uFXwFxgzgLbIgU6UvZVA_MXb0-Vzc` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_nOrZ_7RvnYxIYYDHieuQhA_fIa178DI` |
| `NEXT_PUBLIC_STOREFRONT_URL` | `https://jb06-storefront.vercel.app` (your storefront URL) |
| `NEXT_PUBLIC_CONSOLE_URL` | `https://jb06-console.vercel.app` (your console URL) |

5. Click **"Deploy"**.

---

## Step 4: Verification Checklist

Once both deployments finish:

1. **Storefront Verification:**
   * Open your Storefront URL (e.g. `https://jb06-storefront.vercel.app`).
   * Test browsing products, filtering `/shoes` and `/clothes`, currency conversion (USD &rarr; PHP), and navigating to `/cart` and `/checkout`.
   * Test the customer login at `/login` and signup at `/signup`.
2. **Console Verification:**
   * Open your Console URL (e.g. `https://jb06-console.vercel.app`).
   * Notice that unauthenticated requests automatically redirect to `/login`.
   * Select **Devon Developer** or **Sarah Staff**, enter the password, and click **"Continue to 2FA"**.
   * Enter the 6-digit OTP (or click **"Quick Fill"** `062026`) and click **"Verify & Enter Console"**.
   * Confirm that the dashboard loads with real metrics and inventory data.
