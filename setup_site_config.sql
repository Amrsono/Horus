-- Create a table for global site configuration
CREATE TABLE IF NOT EXISTS public.site_config (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

-- Insert the maintenance mode setting
INSERT INTO public.site_config (key, value) 
VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- Grant access
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to INSERT
DROP POLICY IF EXISTS "Allow admin insert" ON public.site_config;
CREATE POLICY "Allow admin insert" ON public.site_config 
    FOR INSERT TO authenticated 
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@horus.com');

-- Allow authenticated admins to UPDATE
DROP POLICY IF EXISTS "Allow admin update" ON public.site_config;
CREATE POLICY "Allow admin update" ON public.site_config 
    FOR UPDATE TO authenticated 
    USING (auth.jwt() ->> 'email' = 'admin@horus.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'admin@horus.com');

-- Allow anyone to READ (public)
DROP POLICY IF EXISTS "Allow public read" ON public.site_config;
CREATE POLICY "Allow public read" ON public.site_config 
    FOR SELECT USING (true);
