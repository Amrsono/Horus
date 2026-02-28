-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create Policies for Products
-- Allow public read access to products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Allow authenticated users (Admins) to insert/update/delete
-- Note: In a real app, you'd check for specific admin role. 
-- For now, we assume if you can access the admin dashboard (protected by middleware), you're authorized.
-- But for DB security, we can check email or generic "authenticated" role if we trust our middleware/apps structure.
-- Ideally: USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');
CREATE POLICY "Admins can insert products" 
ON public.products FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

CREATE POLICY "Admins can update products" 
ON public.products FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

CREATE POLICY "Admins can delete products" 
ON public.products FOR DELETE 
USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

-- Storage Setup for Product Images
-- Create a new bucket 'product-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public view
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

-- Allow Admin upload/delete
CREATE POLICY "Admin Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' AND auth.jwt() ->> 'email' = 'admin@smokinghouse.com' );

CREATE POLICY "Admin Update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'product-images' AND auth.jwt() ->> 'email' = 'admin@smokinghouse.com' );

CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'product-images' AND auth.jwt() ->> 'email' = 'admin@horus.com' );

-- Seed Data (Optional - check if empty first)
INSERT INTO public.products (name, category, price, stock, description)
SELECT 'Nebula Haze', 'E-Liquids', 24.99, 156, 'Premium cosmic flavor blend.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Nebula Haze');

INSERT INTO public.products (name, category, price, stock, description)
SELECT 'Quantum Mod X', 'Devices', 129.99, 12, 'High-end vaping device with quantum tech.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Quantum Mod X');

INSERT INTO public.products (name, category, price, stock, description)
SELECT 'Plasma Coils (5pk)', 'Accessories', 14.99, 0, 'Replacement coils for maximum flavor.'
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Plasma Coils (5pk)');
