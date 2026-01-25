-- ============================================
-- ADD DUAL CURRENCY SUPPORT - Independent Prices
-- ============================================
-- This migration adds separate price fields for USD and PEN
-- Allowing different prices for each currency

-- Step 1: Add new PEN price columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS price_pen DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS original_price_pen DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS renewable_price_pen DECIMAL(10,2);

-- Step 2: Rename existing price columns to clarify they are USD
-- (We'll keep using 'price' as USD for backward compatibility)
-- But add a comment to clarify
COMMENT ON COLUMN products.price IS 'Price in USD for international customers';
COMMENT ON COLUMN products.original_price IS 'Original price in USD';
COMMENT ON COLUMN products.renewable_price IS 'Renewable price in USD';
COMMENT ON COLUMN products.price_pen IS 'Price in PEN for Peru customers';
COMMENT ON COLUMN products.original_price_pen IS 'Original price in PEN';
COMMENT ON COLUMN products.renewable_price_pen IS 'Renewable price in PEN';

-- Verify new columns
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name LIKE '%price%'
ORDER BY ordinal_position;
