-- Umer Gill Photography — Hardened Supabase Schema (PostgreSQL / RLS)
-- Paste and execute this entire script in:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run

-- 1. Create enquiries table with strict database-level constraints
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  contact text NOT NULL CHECK (char_length(btrim(contact)) BETWEEN 5 AND 120),
  event_date text CHECK (event_date IS NULL OR char_length(btrim(event_date)) <= 40),
  event_type text NOT NULL DEFAULT 'Wedding Photography and Cinematography'
    CHECK (char_length(btrim(event_type)) BETWEEN 1 AND 120),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 2000),
  source text NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'manual')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for quick sorting in Dashboard
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx
  ON public.enquiries (created_at DESC);

-- 2. Enable strict Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 3. Lock down privileges: revoke everything from public/anon/authenticated first
REVOKE ALL ON TABLE public.enquiries FROM PUBLIC;
REVOKE ALL ON TABLE public.enquiries FROM anon;
REVOKE ALL ON TABLE public.enquiries FROM authenticated;

-- Allow only inserting the 5 form fields from anon/website; deny SELECT/UPDATE/DELETE completely
GRANT INSERT (name, contact, event_date, event_type, message)
  ON TABLE public.enquiries TO anon, authenticated;

-- Only service_role / dashboard owners have full access
GRANT ALL ON TABLE public.enquiries TO service_role;

-- 4. Drop existing policy if re-running cleanly, then create strict INSERT policy
DROP POLICY IF EXISTS "Allow website enquiry submissions only" ON public.enquiries;

CREATE POLICY "Allow website enquiry submissions only"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 2 AND 120
    AND char_length(btrim(contact)) BETWEEN 5 AND 120
    AND (event_date IS NULL OR char_length(btrim(event_date)) <= 40)
    AND char_length(btrim(event_type)) BETWEEN 1 AND 120
    AND char_length(message) <= 2000
    AND status = 'new'
    AND source = 'website'
  );

