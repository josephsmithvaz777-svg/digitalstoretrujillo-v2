-- Allow Admin to manage ALL orders
DROP POLICY IF EXISTS "Admin can manage all orders" ON orders;
CREATE POLICY "Admin can manage all orders"
    ON orders
    FOR ALL
    USING (auth.jwt() ->> 'email' = 'admin@digitalstoretrujillo.com');

-- Allow Admin to manage ALL products (if not already covered by service role, but good for client-side)
DROP POLICY IF EXISTS "Admin can manage all products" ON products;
CREATE POLICY "Admin can manage all products"
    ON products
    FOR ALL
    USING (auth.jwt() ->> 'email' = 'admin@digitalstoretrujillo.com');
