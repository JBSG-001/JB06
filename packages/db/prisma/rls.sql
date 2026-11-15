-- =============================================================================
-- JBØ6 MINI ERP — ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- This file enables RLS on every single business table and sets strict access rules.
--
-- ARCHITECTURE NOTE:
-- In JBØ6 Mini ERP, all data access happens through server-side Next.js route handlers
-- and Server Actions using Prisma with server-side role checks.
-- Prisma connects via the direct/pooled Postgres connection as the 'postgres' role,
-- which intentionally bypasses RLS for high-performance server operations.
--
-- However, to guarantee total defense-in-depth and ensure that NO BROWSER CLIENT
-- using the Supabase Anon Key can ever inspect or alter private business tables,
-- RLS is enabled on ALL tables with zero public access by default.
-- =============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subcategories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_status_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "webhook_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "suppliers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "purchase_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "purchase_order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stock_movements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "service_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "error_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_events" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any
DROP POLICY IF EXISTS "Public can view active products" ON "products";
DROP POLICY IF EXISTS "Public can view categories" ON "categories";
DROP POLICY IF EXISTS "Public can view subcategories" ON "subcategories";
DROP POLICY IF EXISTS "Public can view variants" ON "variants";
DROP POLICY IF EXISTS "Users can read own profile" ON "profiles";
DROP POLICY IF EXISTS "Users can update own profile" ON "profiles";
DROP POLICY IF EXISTS "Customers can view own orders" ON "orders";

-- 3. Explicit minimal policies where authenticated clients interact directly:

-- Profiles: Authenticated users can only read their own profile row
CREATE POLICY "Users can read own profile"
  ON "profiles"
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Profiles: Authenticated users can update their own profile name / avatar
CREATE POLICY "Users can update own profile"
  ON "profiles"
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Read-only catalog fallback for Supabase client caching (Anon & Authenticated)
CREATE POLICY "Public read-only categories"
  ON "categories"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read-only subcategories"
  ON "subcategories"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read-only products"
  ON "products"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read-only variants"
  ON "variants"
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Settings: Only read-only for public settings like exchange rate
CREATE POLICY "Public read-only settings"
  ON "settings"
  FOR SELECT
  TO anon, authenticated
  USING (key = 'EXCHANGE_RATE');

-- ALL OTHER TABLES (orders, payments, webhook_events, suppliers, purchase_orders,
-- stock_movements, audit_logs, error_logs, service_status) HAVE ZERO PUBLIC POLICIES.
-- Any direct request from the browser using the anon key is rejected with HTTP 403 / empty result.

