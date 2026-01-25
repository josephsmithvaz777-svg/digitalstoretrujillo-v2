/**
 * Internationalization (i18n) Utilities
 */

export type Language = 'en' | 'es';

// List of Latin American country codes (ISO 3166-1 alpha-2)
const LATAM_COUNTRIES = [
    'AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV',
    'GT', 'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'UY', 'VE'
];

/**
 * Detect user's language based on IP geolocation
 */
export async function detectUserLanguage(): Promise<Language> {
    try {
        // Check localStorage first
        const stored = localStorage.getItem('user-language');
        if (stored === 'en' || stored === 'es') {
            return stored as Language;
        }

        // Use ipapi.co (same as currency)
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) return 'en';

        const data = await response.json();
        const countryCode = data.country_code;

        // If in LATAM, default to Spanish, otherwise English
        const lang: Language = LATAM_COUNTRIES.includes(countryCode) ? 'es' : 'en';

        localStorage.setItem('user-language', lang);
        return lang;
    } catch (error) {
        console.error('Error detecting language:', error);
        return 'en';
    }
}

/**
 * Translation Dictionary
 */
export const TRANSLATIONS = {
    en: {
        // Header
        nav_home: 'Home',
        nav_software: 'Software',
        nav_games: 'Games',
        nav_services: 'Services',
        search_placeholder: 'Search products...',
        auth_signin: 'Sign In',
        auth_account: 'My Account',

        // Product Card
        product_buy_now: 'BUY NOW',
        product_notify: 'NOTIFY ME',
        product_out_of_stock: 'OUT OF STOCK',
        product_renewable: 'Renewable',

        // Cart
        cart_title: 'Your Shopping Cart',
        cart_empty: 'Your cart is empty',
        cart_add_started: 'Add some products to get started!',
        cart_continue_shopping: 'Continue Shopping',
        cart_summary: 'Order Summary',
        cart_subtotal: 'Subtotal',
        cart_tax: 'Tax',
        cart_total: 'Total',
        cart_description: 'Review your digital items before checkout',
        cart_checkout: 'Proceed to Checkout',
        cart_remove_confirm: 'Remove product?',
        cart_remove_question: 'Are you sure you want to remove',
        cart_remove_cancel: 'Cancel',
        cart_remove_yes: 'Yes, remove',

        // Product Details
        prod_breadcrumb_home: 'Home',
        prod_reviews: 'reviews',
        prod_in_stock: 'IN STOCK',
        prod_instant_delivery: 'Instant delivery via email',
        prod_quantity: 'Quantity',
        prod_buy_now: 'Buy Now',
        prod_share: 'Share Product',
        prod_secure_payment: 'Secure Payment with',
        prod_origin_title: 'Product Origin',
        prod_origin_text: 'This product comes from verified official marketplaces. All keys and licenses are legitimately obtained.',
        prod_support_title: 'Support & Warranty',
        prod_support_text: 'We verify every product before delivery. 24-48 hours full support after purchase.',
        prod_features_title: 'Key Features',
        prod_related_title: 'Related Products',
        product_review: 'Leave a review',
        product_notify_me: 'NOTIFY ME'
    },
    es: {
        // Header
        nav_home: 'Inicio',
        nav_software: 'Software',
        nav_games: 'Juegos',
        nav_services: 'Servicios',
        search_placeholder: 'Buscar productos...',
        auth_signin: 'Iniciar Sesión',
        auth_account: 'Mi Cuenta',

        // Product Card
        product_buy_now: 'COMPRAR AHORA',
        product_notify: 'AVISARME',
        product_out_of_stock: 'AGOTADO',
        product_renewable: 'Renovable',

        // Cart
        cart_title: 'Tu Carrito de Compras',
        cart_empty: 'Tu carrito está vacío',
        cart_add_started: '¡Añade algunos productos para comenzar!',
        cart_continue_shopping: 'Continuar Comprando',
        cart_summary: 'Resumen del Pedido',
        cart_subtotal: 'Subtotal',
        cart_tax: 'Impuesto',
        cart_total: 'Total',
        cart_description: 'Revisa tus productos antes de finalizar la compra',
        cart_checkout: 'Proceder al Pago',
        cart_remove_confirm: '¿Eliminar producto?',
        cart_remove_question: '¿Estás seguro que deseas eliminar',
        cart_remove_cancel: 'Cancelar',
        cart_remove_yes: 'Sí, eliminar',

        // Product Details
        prod_breadcrumb_home: 'Inicio',
        prod_reviews: 'reseñas',
        prod_in_stock: 'EN STOCK',
        prod_instant_delivery: 'Entrega instantánea por email',
        prod_quantity: 'Cantidad',
        prod_buy_now: 'Comprar Ahora',
        prod_share: 'Compartir Producto',
        prod_secure_payment: 'Pago Seguro con',
        prod_origin_title: 'Origen del Producto',
        prod_origin_text: 'Este producto proviene de marketplaces oficiales verificados. Todas las claves son obtenidas legítimamente.',
        prod_support_title: 'Soporte y Garantía',
        prod_support_text: 'Verificamos cada producto antes de la entrega. Soporte completo 24-48 horas después de la compra.',
        prod_features_title: 'Características Clave',
        prod_related_title: 'Productos Relacionados',
        product_review: 'Dejar reseña',
        product_notify_me: 'AVISARME'
    }
};

export function t(key: keyof typeof TRANSLATIONS.en, lang: Language): string {
    return TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
}
