-- Add delivery_info column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_info JSONB DEFAULT NULL;

-- Comment on column
COMMENT ON COLUMN public.orders.delivery_info IS 'Stores digital product credentials (email, password, pin, etc.)';
