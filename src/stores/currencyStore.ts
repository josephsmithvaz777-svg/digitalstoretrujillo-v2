import { atom, computed } from 'nanostores';
import type { Currency } from '../lib/currency';
import { getUserCurrency, getPrice, formatPrice, CURRENCIES } from '../lib/currency';

// Currency store
export const userCurrency = atom<Currency>('USD');

// Computed: Currency config
export const currencyConfig = computed(userCurrency, (currency) => {
    return CURRENCIES[currency];
});

// Initialize currency from detection
export async function initializeCurrency() {
    const currency = await getUserCurrency();
    userCurrency.set(currency);
}

// Update user currency
export function updateCurrency(currency: Currency) {
    userCurrency.set(currency);
    localStorage.setItem('user-currency', currency);

    // Trigger custom event for other components
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('currency-changed', { detail: currency }));
    }
}

// Helper to get the right price based on currency
// Pass both USD and PEN prices from the product
export function displayPrice(priceUSD: number, pricePEN?: number | null): string {
    const currency = userCurrency.get();
    const price = getPrice(priceUSD, pricePEN, currency);
    return formatPrice(price, currency);
}

// Helper to get just the price value
export function getCurrentPrice(priceUSD: number, pricePEN?: number | null): number {
    const currency = userCurrency.get();
    return getPrice(priceUSD, pricePEN, currency);
}
