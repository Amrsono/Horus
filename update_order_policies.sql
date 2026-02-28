-- ============================================
-- Update RLS Policies for Authenticated Orders
-- ============================================
-- Run this in Supabase SQL Editor to update policies

-- Drop old policies that allowed anonymous orders
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Create new policies for authenticated users only
CREATE POLICY "Authenticated users can create orders" 
ON public.orders FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create order items" 
ON public.order_items FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    )
);
