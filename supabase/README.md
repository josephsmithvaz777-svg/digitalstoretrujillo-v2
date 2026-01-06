# Supabase Setup Instructions

## Step 0: Clean Up Existing Tables (IMPORTANT!)

Since you have existing tables, we need to clean them up first:

1. Go to your Supabase project: https://supabase.com/dashboard/project/vmbupmwlyfjmxjmenyid
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/cleanup.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`
7. You should see "Cleanup complete!" message

> [!WARNING]
> This will delete all existing data in the `products` and `orders` tables!

## Step 1: Execute Database Schema

1. In the SQL Editor, create another **New Query**
2. Copy the contents of `supabase/schema.sql`
3. Paste into the SQL editor
4. Click **Run** or press `Ctrl+Enter`

This will create:
- `products` table
- `orders` table  
- Helper functions (`update_updated_at_column`, `generate_order_number`)
- Row Level Security policies
- Storage bucket for payment proofs

## Step 2: Insert Sample Data

1. In the SQL Editor, create another **New Query**
2. Copy the contents of `supabase/seed.sql`
3. Paste into the SQL editor
4. Click **Run**

This will insert your 3 current products:
- Windows 11 Pro Key
- Netflix 1 Month 4K
- Spotify Premium Upgrade

## Step 3: Verify Data

1. Click on **Table Editor** in the left sidebar
2. Select the `products` table
3. You should see 3 products listed
4. Verify all fields are populated correctly

## Step 4: Test the Connection

The `.env` file has already been created with your credentials. The Supabase client library has been installed.

Next steps:
- Update the code to fetch from Supabase
- Test locally
- Deploy to Coolify

## Troubleshooting

### If you see RLS errors:
- Make sure the policies were created correctly
- Check that `is_active = true` and `in_stock = true` for products

### If products don't appear:
- Verify the data was inserted: `SELECT * FROM products;`
- Check RLS policies are enabled
- Ensure `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are set correctly in `.env`
