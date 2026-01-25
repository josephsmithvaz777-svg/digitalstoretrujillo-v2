import { atom, map } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
    id: string;
    title: string;
    price: number; // USD base (or standard)
    price_pen?: number; // Optional PEN price
    image: string;
    quantity: number;
    seller?: string;
}

// Persistent cart store (se guarda en localStorage)
export const cartItems = persistentAtom<CartItem[]>('cart', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

// Computed: total items in cart
export const cartCount = atom(0);

// Update cart count whenever cart changes
cartItems.subscribe((items) => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.set(total);
});

// Computed: cart total price (USD)
export const cartTotal = atom(0);

cartItems.subscribe((items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.set(total);
});

// Computed: cart total price (PEN)
export const cartTotalPEN = atom(0);

cartItems.subscribe((items) => {
    const total = items.reduce((sum, item) => {
        const pricePEN = item.price_pen ?? (item.price * 3.8);
        return sum + pricePEN * item.quantity;
    }, 0);
    cartTotalPEN.set(total);
});

// Add item to cart
export function addToCart(item: Omit<CartItem, 'quantity'>) {
    const currentCart = cartItems.get();
    const existingItem = currentCart.find((i) => i.id === item.id);

    if (existingItem) {
        // Increment quantity if item already exists
        cartItems.set(
            currentCart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );
    } else {
        // Add new item
        cartItems.set([...currentCart, { ...item, quantity: 1 }]);
    }
}

// Remove item from cart
export function removeFromCart(itemId: string) {
    const currentCart = cartItems.get();
    cartItems.set(currentCart.filter((item) => item.id !== itemId));
}

// Update item quantity
export function updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    const currentCart = cartItems.get();
    cartItems.set(
        currentCart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
        )
    );
}

// Clear cart
export function clearCart() {
    cartItems.set([]);
}
