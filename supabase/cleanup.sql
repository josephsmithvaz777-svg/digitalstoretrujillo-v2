-- ============================================
-- CLEANUP SCRIPT
-- Execute this FIRST to remove old tables
-- ============================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Anyone can read active products" ON products;
DROP POLICY IF EXISTS "Service role can manage products" ON products;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Service role can manage all orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

-- Drop storage policies
DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Service role can read payment proofs" ON storage.objects;

-- Drop triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_order_number() CASCADE;

-- Drop tables
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Delete storage buckets
DELETE FROM storage.buckets WHERE id = 'products';
DELETE FROM storage.buckets WHERE id = 'payment-proofs';

-- Verify cleanup
SELECT 'Cleanup complete!' as status;
