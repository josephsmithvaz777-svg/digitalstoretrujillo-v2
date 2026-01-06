-- ============================================
-- ADMIN AUTHENTICATION SETUP
-- ============================================
-- Execute this in Supabase SQL Editor

-- Enable email auth (should already be enabled by default)
-- This is just to verify the configuration

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- For single admin, we'll check against a specific email
    -- You can change this email to your admin email
    RETURN user_email = 'admin@digitalstoretrujillo.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update products RLS to allow admin full access
DROP POLICY IF EXISTS "Admins can manage all products" ON products;
CREATE POLICY "Admins can manage all products"
    ON products FOR ALL
    USING (
        auth.role() = 'authenticated' AND 
        is_admin(auth.jwt()->>'email')
    );

-- Update orders RLS to allow admin full access
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders"
    ON orders FOR ALL
    USING (
        auth.role() = 'authenticated' AND 
        is_admin(auth.jwt()->>'email')
    );

-- Grant admin access to storage
DROP POLICY IF EXISTS "Admins can manage payment proofs" ON storage.objects;
CREATE POLICY "Admins can manage payment proofs"
    ON storage.objects FOR ALL
    USING (
        bucket_id = 'payment-proofs' AND
        auth.role() = 'authenticated' AND
        is_admin(auth.jwt()->>'email')
    );

-- Verify setup
SELECT 'Admin auth setup complete!' as status;
