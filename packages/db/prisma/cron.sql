-- =============================================================================
-- JBØ6 MINI ERP — PG_CRON RESERVATION EXPIRY JOB
-- =============================================================================
-- How to run this in Supabase:
-- 1. Open your Supabase Dashboard -> SQL Editor (icon with >_ on left sidebar).
-- 2. Click "+ New query".
-- 3. Paste this script and click "Run".
-- =============================================================================

-- Step 1: Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 2: Create a Postgres function that releases expired variant reservations
CREATE OR REPLACE FUNCTION release_expired_reservations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  released_count integer := 0;
BEGIN
  -- 1. Clear expired reservations on variants where reservedUntil has passed
  WITH expired_holds AS (
    UPDATE variants
    SET 
      stock = stock + reserved,
      reserved = 0,
      "reservedUntil" = NULL,
      "updatedAt" = NOW()
    WHERE 
      reserved > 0 
      AND "reservedUntil" IS NOT NULL 
      AND "reservedUntil" < NOW()
    RETURNING id, reserved
  )
  SELECT COUNT(*) INTO released_count FROM expired_holds;

  -- 2. Mark pending orders whose reservation expired as CANCELLED
  UPDATE orders
  SET 
    status = 'CANCELLED',
    "updatedAt" = NOW()
  WHERE 
    status = 'PENDING'
    AND "reservedUntil" IS NOT NULL
    AND "reservedUntil" < NOW();

  RETURN released_count;
END;
$$;

-- Step 3: Schedule the job to run every minute via pg_cron
-- (First unschedule any previous job with the same name to avoid duplicates)
SELECT cron.unschedule('release-expired-reservations')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'release-expired-reservations'
);

SELECT cron.schedule(
  'release-expired-reservations',
  '* * * * *', -- Every minute
  'SELECT release_expired_reservations();'
);

