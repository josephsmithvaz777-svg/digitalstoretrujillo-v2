import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Types
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  renewable_price: number | null;
  image: string;
  thumbnails: string[];
  category: string;
  seller: string | null;
  badge: string | null;
  badge_color: string | null;
  badge_text_color: string | null;
  show_badge: boolean;
  discount_badge: string | null;
  discount_badge_color: string | null;
  discount_badge_text_color: string | null;
  show_discount_badge: boolean;
  show_renewable_price: boolean;
  show_gallery: boolean;
  rating: number;
  review_count: number;
  in_stock: boolean;
  stock_quantity: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  items: any;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  payment_method: 'yape' | 'binance' | 'cryptomus';
  payment_proof: string | null;
  payment_reference: string | null;
  payment_status: 'pending' | 'verified' | 'failed';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  delivery_status: 'pending' | 'sent' | 'delivered';
  delivery_email: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// ============================================
// Product Functions
// ============================================

/**
 * Get all active products
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all products (including inactive/out of stock) - For Admin
 */
export async function getAllProducts(): Promise<Product[]> {
  // Use admin client on server if available to bypass RLS
  const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  // Use admin client on server if available to bypass RLS
  const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }

  return data;
}

/**
 * Get featured products (for homepage)
 */
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  // 1. Try fetching manually featured products
  const { data: featured, error: featuredError } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('in_stock', true)
    .order('sort_order', { ascending: true }) // Primary sort: Manual order
    .order('created_at', { ascending: false }) // Secondary sort: Newest
    .limit(limit);

  if (featuredError) {
    console.error('Error fetching featured products:', featuredError);
    return [];
  }

  // If we have manual picks, use them
  if (featured && featured.length > 0) {
    return featured;
  }

  // 2. Fallback: Automatic (Popularity/Reviews) BUT still respect sort_order if set
  const { data: popular, error: popularError } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('in_stock', true)
    .order('sort_order', { ascending: true }) // Respect manual order even in fallback
    .order('review_count', { ascending: false })
    .limit(limit);

  if (popularError) {
    console.error('Error fetching popular products:', popularError);
    return [];
  }

  return popular || [];
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .eq('in_stock', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = `%${query.trim()}%`;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('in_stock', true)
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all product slugs (for static path generation)
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching product slugs:', error);
    return [];
  }

  return data?.map(p => p.slug) || [];
}

// ============================================
// Order Functions
// ============================================

/**
 * Create a new order
 */
export async function createOrder(orderData: Partial<Order>): Promise<Order | null> {
  // Generate order number
  const { data: orderNumber } = await supabase.rpc('generate_order_number');

  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      order_number: orderNumber,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  return data;
}

/**
 * Update order payment proof
 */
export async function updateOrderPaymentProof(
  orderId: string,
  proofUrl: string,
  reference: string
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({
      payment_proof: proofUrl,
      payment_reference: reference,
      payment_status: 'pending',
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order payment proof:', error);
    return false;
  }

  return true;
}

/**
 * Upload payment proof to storage
 */
export async function uploadPaymentProof(
  file: File,
  orderId: string
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${orderId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('payment-proofs')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading payment proof:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('payment-proofs')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Get orders for the current user
 */
export async function getUserOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

  return data || [];
}

// ============================================
// Admin Authentication Functions
// ============================================

/**
 * Sign in admin user
 */
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    return { user: null, error };
  }

  return { user: data.user, error: null };
}

/**
 * Sign out admin user
 */
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return false;
  }

  return true;
}

/**
 * Get current admin user
 */
export async function getAdminUser(token?: string) {
  const { data: { user }, error } = token
    ? await supabase.auth.getUser(token)
    : await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Helper to get admin user from a Bearer token
 */
export async function getAdminUserFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return getAdminUser(token);
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getAdminUser();
  if (!user) return false;

  // Check if user email matches admin email
  // You can change this to your admin email
  return user.email === 'admin@digitalstoretrujillo.com';
}

// ============================================
// Admin Product Functions
// ============================================

/**
 * Create a new product (admin only)
 */
export async function createProduct(productData: Partial<Product>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }

  return data;
}

/**
 * Update a product (admin only)
 */
export async function updateProduct(id: string, productData: Partial<Product>): Promise<boolean> {
  console.log('🔄 updateProduct called with ID:', id);
  console.log('📦 Product data received:', productData);
  console.log('🖼️ Image URL in productData:', productData.image);

  const { error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    if (error.message) console.error('Supabase Error Message:', error.message);
    if (error.details) console.error('Supabase Error Details:', error.details);
    if (error.hint) console.error('Supabase Error Hint:', error.hint);
    return false;
  }

  console.log('✅ Product updated successfully');
  return true;
}

/**
 * Delete a product (admin only)
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
}

// ============================================
// Admin User Functions
// ============================================

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  // Use admin client on server if available to bypass RLS
  const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase;

  // Since we can't directly list users from auth.users via client SDK without admin API,
  // we'll fetch from the auth admin API if on server, or rely on a specific table if we had a public profiles table.
  // BUT, supabaseAdmin (service role) HAS access to auth.admin.listUsers()!
  
  if (typeof window === 'undefined' && supabaseAdmin) {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return users || [];
  }
  
  // Client side can't list users easily without a function or public table.
  // For this project, we are rendering mostly on server (Astro) for admin pages, 
  // so the component will call this and get data.
  return [];
}

/**
 * Delete a user (admin only)
 */
export async function deleteUser(userId: string): Promise<boolean> {
  // This must be done via an API route because client-side can't use auth.admin
  try {
    const response = await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass session token if needed for API route protection
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({ userId })
    });
    
    return response.ok;
  } catch (e) {
    console.error("Error deleting user:", e);
    return false;
  }
}

// ============================================
// Admin Order Functions
// ============================================

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(): Promise<Order[]> {
  // Use admin client on server if available to bypass RLS
  const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase;

  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

/**
 * Update payment status (admin only)
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order['payment_status']
): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating payment status:', error);
    return false;
  }

  return true;
}

/**
 * Delete an order (admin only)
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error('Error deleting order:', error);
    return false;
  }

  return true;
}

/**
 * Delete multiple orders (admin only)
 */
export async function deleteOrders(orderIds: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .in('id', orderIds);

  if (error) {
    console.error('Error deleting orders:', error);
    return false;
  }

  return true;
}

/**
 * Get dashboard statistics (admin only)
 */
export async function getDashboardStats() {
  // Use admin client on server if available to bypass RLS
  const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase;

  // Get total products
  const { count: totalProducts } = await client
    .from('products')
    .select('*', { count: 'exact', head: true });

  // Get total orders
  const { count: totalOrders } = await client
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get pending orders
  const { count: pendingOrders } = await client
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get new users (last 30 days or total)
  // Since we can't filter auth.users easily here without admin API wrapper,
  // we'll fetch all users count if possible, or just return 0 if client side.
  let totalUsers = 0;
  let pendingUsers = 0; // Unverified email

  if (typeof window === 'undefined' && supabaseAdmin) {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (!error && users) {
      totalUsers = users.length;
      pendingUsers = users.filter(u => !u.email_confirmed_at).length;
    }
  }

  // Get total revenue
  const { data: orders } = await client
    .from('orders')
    .select('total')
    .eq('payment_status', 'verified');

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
    totalUsers,
    pendingUsers,
    totalRevenue,
  };
}

/**
 * Get products expiring soon (next N days)
 */
export async function getExpiringProducts(daysThreshold: number = 7) {
  // Use admin client on server if available to bypass RLS
  const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase;

  const { data: orders, error } = await client
    .from('orders')
    .select('*')
    .not('delivery_info', 'is', null); // Only orders with delivery info

  if (error || !orders) return [];

  const expiringItems: any[] = [];
  const now = new Date();
  const threshold = new Date();
  threshold.setDate(now.getDate() + daysThreshold);

  orders.forEach(order => {
    if (Array.isArray(order.delivery_info)) {
      order.delivery_info.forEach((item: any) => {
        if (item.expiration_date) {
          const expDate = new Date(item.expiration_date);
          // Check if expiring soon (future but within threshold) or already expired
          if (expDate <= threshold) {
            expiringItems.push({
              ...item,
              order_number: order.order_number,
              customer_name: order.customer_name,
              customer_email: order.customer_email,
              customer_phone: order.customer_phone,
              days_left: Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            });
          }
        }
      });
    }
  });

  // Sort by expiration date (soonest first)
  return expiringItems.sort((a, b) => new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime());
}

/**
 * Get monthly sales data for chart
 */
export async function getMonthlySales() {
  // Use admin client on server if available to bypass RLS
  const client = (typeof window === 'undefined' && supabaseAdmin) ? supabaseAdmin : supabase;

  const { data: orders, error } = await client
    .from('orders')
    .select('created_at, total')
    .eq('payment_status', 'verified')
    .order('created_at', { ascending: true });

  if (error || !orders) return [];

  const monthlyData: Record<string, number> = {};
  
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
    monthlyData[key] = 0;
  }

  orders.forEach(order => {
    const date = new Date(order.created_at);
    const key = date.toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
    // Only count if it's within our initialized range (or add new keys dynamically)
    if (monthlyData[key] !== undefined) {
      monthlyData[key] += Number(order.total);
    } else {
       // If we want to include older data dynamically
       // monthlyData[key] = (monthlyData[key] || 0) + Number(order.total);
    }
  });

  return Object.entries(monthlyData).map(([month, total]) => ({ month, total }));
}

// ============================================
// Cart Synchronization Functions
// ============================================

export interface CartItemDB {
  id?: string;
  user_id?: string;
  product_id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * Sync local cart to database
 */
export async function syncCartToDB(userId: string, items: any[]) {
  if (!items.length) return;

  // Transform local items to DB format
  const dbItems = items.map(item => ({
    user_id: userId,
    product_id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    quantity: item.quantity
  }));

  // Upsert items (requires unique constraint on user_id, product_id)
  const { error } = await supabase
    .from('cart_items')
    .upsert(dbItems, { onConflict: 'user_id,product_id' });

  if (error) {
    console.error('Error syncing cart to DB:', error);
  }
}

/**
 * Fetch cart from database
 */
export async function fetchCartFromDB(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart from DB:', error);
    return [];
  }

  // Transform back to local format
  return data.map(item => ({
    id: item.product_id,
    title: item.title,
    price: Number(item.price),
    image: item.image,
    quantity: item.quantity
  }));
}

/**
 * Clear cart in database
 */
export async function clearCartInDB(userId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart in DB:', error);
  }
}
