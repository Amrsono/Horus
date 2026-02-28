-- ============================================
-- Horus E-commerce: Orders & Order Items Setup
-- ============================================
-- This script creates the orders and order_items tables
-- with Row Level Security policies and sample data

-- Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_email TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);

-- Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Orders
-- Allow anyone to insert orders (for guest checkout)
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id OR guest_email = auth.jwt() ->> 'email');

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

-- Admins can update orders
CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

-- Admins can delete orders
CREATE POLICY "Admins can delete orders" 
ON public.orders FOR DELETE 
USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

-- RLS Policies for Order Items
-- Allow anyone to insert order items (for checkout)
CREATE POLICY "Anyone can create order items" 
ON public.order_items FOR INSERT 
WITH CHECK (true);

-- Users can view items from their orders
CREATE POLICY "Users can view own order items" 
ON public.order_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.user_id = auth.uid() OR orders.guest_email = auth.jwt() ->> 'email')
    )
);

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" 
ON public.order_items FOR SELECT 
USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

-- Admins can update order items
CREATE POLICY "Admins can update order items" 
ON public.order_items FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'admin@smokinghouse.com');

-- Admins can delete order items
CREATE POLICY "Admins can delete order items" 
ON public.order_items FOR DELETE 
USING (auth.jwt() ->> 'email' = 'admin@horus.com');

-- Seed Sample Data (Optional - for testing)
-- Insert sample orders
INSERT INTO public.orders (user_id, guest_email, total_amount, status, shipping_address, created_at)
SELECT 
    NULL,
    'guest' || generate_series || '@example.com',
    (random() * 500 + 50)::NUMERIC(10,2),
    CASE (random() * 4)::INT
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'processing'
        WHEN 2 THEN 'shipped'
        WHEN 3 THEN 'delivered'
        ELSE 'cancelled'
    END,
    jsonb_build_object(
        'name', 'Customer ' || generate_series,
        'address', '123 Main St',
        'city', 'Cairo',
        'zip', '12345'
    ),
    NOW() - (random() * INTERVAL '90 days')
FROM generate_series(1, 20)
WHERE NOT EXISTS (SELECT 1 FROM public.orders LIMIT 1);

-- Insert sample order items
INSERT INTO public.order_items (order_id, product_id, product_name, quantity, price_at_purchase)
SELECT 
    o.id,
    p.id,
    p.name,
    (random() * 3 + 1)::INT,
    p.price
FROM public.orders o
CROSS JOIN LATERAL (
    SELECT id, name, price 
    FROM public.products 
    ORDER BY random() 
    LIMIT (random() * 3 + 1)::INT
) p
WHERE NOT EXISTS (SELECT 1 FROM public.order_items LIMIT 1);
