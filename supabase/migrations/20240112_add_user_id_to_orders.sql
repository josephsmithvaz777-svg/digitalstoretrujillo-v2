-- Add user_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Update RLS policy for users to see their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" 
    ON orders 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow users to update their own orders (e.g. for payment proof)
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders" 
    ON orders 
    FOR UPDATE
    USING (auth.uid() = user_id);
