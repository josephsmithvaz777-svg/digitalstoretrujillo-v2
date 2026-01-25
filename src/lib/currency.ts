// Currency utilities - DUAL PRICE VERSION
// Shows independent prices for USD and PEN (no conversion)

export type Currency = 'USD' | 'PEN';

export interface CurrencyConfig {
    code: Currency;
    symbol: string;
    name: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar'
    },
    PEN: {
        code: 'PEN',
        symbol: 'S/',
        name: 'Peruvian Sol'
    }
};

/**
 * Detect user's country using IP geolocation
 * Returns currency code based on location
 */
export async function detectUserCurrency(): Promise<Currency> {
    try {
        // Check localStorage first
        const stored = localStorage.getItem('user-currency');
        if (stored && (stored === 'USD' || stored === 'PEN')) {
            return stored as Currency;
        }

        // Use ipapi.co for free geolocation
        const response = await fetch('https://ipapi.co/json/');

        if (!response.ok) {
            console.warn('Failed to detect location, defaulting to USD');
            return 'USD';
        }

        const data = await response.json();
        const countryCode = data.country_code;

        // If user is in Peru, use PEN, otherwise USD
        const currency: Currency = countryCode === 'PE' ? 'PEN' : 'USD';

        // Store preference in localStorage
        localStorage.setItem('user-currency', currency);

        return currency;
    } catch (error) {
        console.error('Error detecting currency:', error);
        // Default to USD if detection fails
        return 'USD';
    }
}

/**
 * Get the appropriate price based on currency
 * IMPORTANT: Now we return the price directly from the product object
 * No conversion needed!
 */
export function getPrice(priceUSD: number, pricePEN: number | null | undefined, currency: Currency): number {
    if (currency === 'PEN' && pricePEN != null) {
        return pricePEN;
    }
    return priceUSD;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: Currency): string {
    const config = CURRENCIES[currency];
    return `${config.symbol} ${price.toFixed(2)}`;
}

/**
 * Get currency configuration
 */
export function getCurrencyConfig(currency: Currency): CurrencyConfig {
    return CURRENCIES[currency];
}

/**
 * Set user currency preference
 */
export function setUserCurrency(currency: Currency): void {
    localStorage.setItem('user-currency', currency);
    // Trigger storage event for other tabs/windows
    window.dispatchEvent(new CustomEvent('currency-changed', { detail: currency }));
}

/**
 * Get stored user currency preference or detect
 */
export async function getUserCurrency(): Promise<Currency> {
    const stored = localStorage.getItem('user-currency');
    if (stored && (stored === 'USD' || stored === 'PEN')) {
        return stored as Currency;
    }
    return detectUserCurrency();
}
