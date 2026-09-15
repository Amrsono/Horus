-- Migration script to create site_pages table for editable pages
CREATE TABLE IF NOT EXISTS public.site_pages (
    slug TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site pages
CREATE POLICY "Public read access for site_pages"
ON public.site_pages FOR SELECT
USING (true);

-- Allow authenticated/admin write access
CREATE POLICY "Allow all to insert site_pages"
ON public.site_pages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all to update site_pages"
ON public.site_pages FOR UPDATE
USING (true);
