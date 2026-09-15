-- ========================================================
-- Enable Guest Checkout Orders in Supabase
-- ========================================================
-- Run this in your Supabase Dashboard > SQL Editor:
-- This allows customers to place orders without having to register/log in.

-- 1. Orders table policy: allow anyone (anon + authenticated) to insert
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

-- 2. Order items table policy: allow anyone to insert
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" 
ON public.order_items FOR INSERT 
WITH CHECK (true);

-- 3. Allow viewing orders by order ID (so customers can track without login)
DROP POLICY IF EXISTS "Anyone can view their order by id" ON public.orders;
CREATE POLICY "Anyone can view their order by id" 
ON public.orders FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
CREATE POLICY "Anyone can view order items" 
ON public.order_items FOR SELECT 
USING (true);
