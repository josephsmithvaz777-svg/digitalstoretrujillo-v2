-- ============================================
-- SET DUAL CURRENCY PRICES - Example Products
-- ============================================
-- This script sets independent prices for USD and PEN

-- Example: Product costs S/12 in Peru, $5.65 internationally

-- Update Netflix 1 Month 4K
UPDATE products
SET 
    price = 5.65,              -- USD price
    price_pen = 12.00,         -- PEN price
    original_price = 7.50,     -- USD original
    original_price_pen = 15.00, -- PEN original
    renewable_price = 0.50,    -- USD renewable
    renewable_price_pen = 1.00  -- PEN renewable
WHERE slug = 'netflix-1-month';

-- Update Spotify Premium
UPDATE products
SET 
    price = 3.00,              -- USD price
    price_pen = 8.00,          -- PEN price
    original_price = 4.50,     -- USD original
    original_price_pen = 12.00, -- PEN original
    renewable_price = NULL,
    renewable_price_pen = NULL
WHERE slug = 'spotify-premium';

-- Update Windows 11 Pro Key
UPDATE products
SET 
    price = 10.00,             -- USD price
    price_pen = 25.00,         -- PEN price
    original_price = 12.00,    -- USD original
    original_price_pen = 30.00, -- PEN original
    renewable_price = 1.00,    -- USD renewable
    renewable_price_pen = 3.00  -- PEN renewable
WHERE slug = 'windows-11-pro';

-- Update HBO Max 1 Month 4K
UPDATE products
SET 
    price = 8.00,              -- USD price
    price_pen = 20.00,         -- PEN price
    original_price = 10.00,    -- USD original
    original_price_pen = 25.00, -- PEN original
    renewable_price = 0.50,    -- USD renewable
    renewable_price_pen = 1.50  -- PEN renewable
WHERE slug = 'hbomax-1-month';

-- Update IPTV Premium 6 Months
UPDATE products
SET 
    price = 45.00,             -- USD price
    price_pen = 110.00,        -- PEN price
    original_price = 55.00,    -- USD original
    original_price_pen = 135.00, -- PEN original
    renewable_price = 5.00,    -- USD renewable
    renewable_price_pen = 12.00 -- PEN renewable
WHERE slug = 'iptv-premium-6-months';

-- Verify all prices
SELECT 
    slug,
    title,
    price as price_usd,
    price_pen,
    original_price as original_usd,
    original_price_pen,
    renewable_price as renewable_usd,
    renewable_price_pen
FROM products
WHERE slug IN (
    'netflix-1-month',
    'spotify-premium',
    'windows-11-pro',
    'hbomax-1-month',
    'iptv-premium-6-months'
)
ORDER BY slug;

-- IMPORTANT: Adjust these prices according to your actual pricing strategy
-- The values above are just examples
