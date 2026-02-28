-- ============================================
-- Add Sale Fields to Products Table
-- ============================================
-- Run this in Supabase SQL Editor

ALTER TABLE products
ADD COLUMN IF NOT EXISTS on_sale BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS sale_badge_text TEXT;

-- Create index for faster sale product queries
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(on_sale) WHERE on_sale = TRUE;

-- Update existing products to not be on sale by default
UPDATE products SET on_sale = FALSE WHERE on_sale IS NULL;
