# JBØ6 ATELIER — Mini ERP & Luxury Fashion E-Commerce

> High-fidelity minimalist streetwear engineered with disciplined tailoring, dual-monetary transparency (USD / PHP ₱58.00), and limited generational capsules.

JBØ6 is a full-stack e-commerce enterprise built as **two connected web applications in one monorepo**, powered by Next.js 15 App Router, TypeScript (strict), Tailwind CSS, Prisma ORM, and Supabase (Postgres, Auth, Storage, and Realtime).

---

## ⚡ Quick Start: Running Locally

You can launch both the **Storefront** and the **Operations Console** concurrently with a single command:

```bash
npm start
```
*(or `pnpm dev`)*

Once started, open your web browser:

| Application | Local URL | Description |
| :--- | :--- | :--- |
| **Storefront** | [http://localhost:3000](http://localhost:3000) | Luxury customer-facing atelier (Capsule drops, Shoes, Clothes, Bag with 15-min vault hold, GCash & PayPal checkout) |
| **Operations Console** | [http://localhost:3001](http://localhost:3001) | Operations & ERP suite (Live spectator monitor, Performance KPIs, Inventory drawer, Order fulfillment ledger) |

---

## 👤 Operator Roles & Testing Profiles

In the Console sidebar (bottom-left), click **"Switch Role"** to toggle between the two pre-configured profiles:

1. **Devon (Role: `DEVELOPER`)**
   - Full access to all operations, plus exclusive developer zones:
   - **System Health & APIs** (`/system-health`): Latency monitors for Postgres, Supabase Realtime, PayMongo (GCash), and PayPal, plus 1-click webhook replayer.
   - **Settings & Currency** (`/settings`): Live exchange rate editor (Manual ₱58 vs Auto) and staff invite dispatch.
2. **Sarah (Role: `STAFF`)**
   - Day-to-day fulfillment operator (Live Monitor, Dashboard, Inventory table, Order fulfillment drawer, Supplier POs).
   - Attempting to visit `/system-health` or `/settings` triggers an immediate **403 Developer-Only barrier**.

---

## 🏗️ Monorepo Structure

```
JB06/
├── apps/
│   ├── storefront/             # Customer e-commerce app (Port 3000)
│   │   ├── app/                # Next.js App Router (Home, Shoes, Clothes, PDP, Cart, Checkout)
│   │   ├── components/         # Header, Footer, AnnouncementBar, TelemetryTracker
│   │   └── lib/                # Cart & Currency React context providers
│   └── console/                # Operations ERP app (Port 3001)
│       ├── app/                # Live Monitor, Dashboard, Inventory, Orders, Health, Settings
│       ├── components/         # Spectator Iframe, ConsoleSidebar, KPI charts, Drawers
│       └── lib/                # Auth & Role switching context
├── packages/
│   ├── ui/                     # Shared design system (Tailwind tokens #FAFAF8, #111111, #B8912F)
│   ├── db/                     # Prisma schema, migrations, RLS policies, seeders
│   ├── events/                 # Supabase Realtime Provider (live-monitor channel)
│   └── payments/               # PaymentProvider (PayPal Orders v2, PayMongo GCash, Mock fallback)
├── DEPLOY.md                   # Step-by-step Vercel & Supabase deployment guide
└── .env                        # Local environment variables
```

---

## 💎 Features & Faithful UI Implementation

1. **Atelier Storefront** (reproduced from Stitch design specs):
   - **Editorial Home**: Hero video/billboard, value props, 4-card seasonal capsule selection, dual collection banners, essay editorial, newsletter registry.
   - **Shoes Catalog**: Subcategory filter pills (Sneakers, Boots, Loafers, Derbies, Slides), sizing matrix (US 7.0–13.0), palette color swatches, dynamic price range, 3-column grid.
   - **Apparel Catalog**: Subcategory filter pills (Tees, Hoodies, Outerwear, Shirts, Cargos, Shorts), curated apparel grid.
   - **Product Detail Page (PDP)**: 4-image asymmetric gallery with 3D/AR inspection trigger, size selection with out-of-stock strike-through, dual price display, Express checkout buttons, technical specifications, "Complete the Look" recommendations.
   - **Atelier Bag (Cart)**: Active **15-minute vault reservation countdown timer** (`Vault reservation: 14:54`), line item stepper, voucher code redemption (`ATELIER10` for 10% off), checkout summary with GCash PHP vs PayPal USD conversion disclosure.
   - **Two-Step Checkout**: Client dossier form (DHL / J&T Express) and payment gateway selection (GCash instant QR redirect vs PayPal Orders v2).

2. **Operations & ERP Console**:
   - **Live Monitor**: 5 real-time telemetry cards (Active Visitors, Open Carts, Orders Today, Gross Revenue, Live Conversion rate) + scaled responsive spectator iframe (1440px / 390px, auto-sync DOM) + live activity stream.
   - **Dashboard (Overview & Performance)**: Gross revenue, total orders, AOV, return rate, 7-day sales dynamics bezier curve, payment split donut (GCash 59.2% vs PayPal 40.8%), top-selling products, category allocation, and critical low-stock watch with 1-click PO creation.
   - **Archival & Core Inventory**: Real-time stock levels, search & filter, inline stepper adjustments, and slide-over **Active Variant Inspector Drawer** with dual-pricing engine (Auto ₱58 vs Manual PHP override), stock adjustment with PO audit note, and image uploader.
   - **Customer Orders Ledger**: Status tabs (New Awaiting, Packed, Shipped, Delivered, Returned, Refunded) and slide-over **Order Detail Drawer** with customer dossier, itemized breakdown, full fulfillment audit trail, print courier shipping label, and refund modal.

---

## 🔒 Security & Backend Architecture

- **Supabase Row Level Security (RLS)**: Enabled across all 19 PostgreSQL tables. By default, public anon access is blocked.
- **Server-Only Service Key**: `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side route handlers and Prisma client, never exposed to client browsers (`NEXT_PUBLIC_` never used for secrets).
- **15-Minute Reservation Expiry**: Handled by Supabase `pg_cron` background job running every 60 seconds (see `packages/db/prisma/cron.sql`) with lazy fallback validation during cart checkout.
- **Dual-Currency Minor Units**: All monetary amounts are stored as integers in minor units (e.g., $145.00 stored as `14500` cents, ₱8,410.00 stored as `841000` centavos) to eliminate floating-point rounding errors.

---

## 🚀 Vercel Deployment

For complete, step-by-step instructions on deploying both the Storefront and the Console to Vercel, read [DEPLOY.md](file:///c:/Users/ACER/OneDrive/Desktop/3A%20Lessons/AntiGrave/JB06/DEPLOY.md).
