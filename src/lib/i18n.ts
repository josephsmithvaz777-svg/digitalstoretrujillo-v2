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
        // 1. Check localStorage first (User's manual choice)
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('user-language');
            if (stored === 'en' || stored === 'es') {
                return stored as Language;
            }
        }

        // 2. Geolocation (User business rule: LATAM/ES -> Spanish)
        // High priority to ensure local relevance
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                const countryCode = data.country_code;

                // Console log for debugging detection issues
                console.log(`[i18n] Detected country: ${countryCode}`);

                if (LATAM_COUNTRIES.includes(countryCode) || countryCode === 'ES') {
                    return 'es';
                }
            }
        } catch (e) {
            console.warn('[i18n] Geolocation failed, falling back to browser language');
        }

        // 3. Browser Language (Fallback preference)
        if (typeof navigator !== 'undefined') {
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('es')) {
                return 'es';
            }
        }

        return 'en';
    } catch (error) {
        console.warn('[i18n] Detection failed, defaulting to English');
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
        auth_signout: 'Sign Out',

        // Footer
        footer_desc: 'Your trusted source for digital software, games, and services. Instant delivery and secure payments.',
        footer_shop: 'Shop',
        footer_all_products: 'All Products',
        footer_support: 'Support',
        footer_about: 'About Us',
        footer_help: 'Help Center',
        footer_terms: 'Terms of Service',
        footer_refund: 'Refund Policy',
        footer_contact: 'Contact Us',
        footer_rights: 'All rights reserved.',

        // Home
        hero_title: 'Best Digital Prices in',
        hero_subtitle: 'Secure digital products delivered instantly to your inbox. From software keys to gift cards, we have it all.',
        hero_cta: 'Explore All Products',
        hero_delivery: 'Instant Delivery',
        hero_title_accent: 'Trujillo',
        hero_offers: 'View Offers',
        featured_title: 'Featured Products',
        top_sellers: 'Top Sellers',

        // Product Card & Catalog
        product_buy_now: 'BUY NOW',
        product_notify: 'NOTIFY ME',
        product_out_of_stock: 'OUT OF STOCK',
        product_renewable: 'Renewable',
        product_from: 'From',

        // Product Details
        prod_breadcrumb_home: 'Home',
        prod_reviews: 'reviews',
        prod_in_stock: 'IN STOCK',
        prod_instant_delivery: 'Instant delivery via email',
        prod_quantity: 'Quantity',
        prod_buy_now: 'Buy Now',
        prod_add_to_cart: 'Add to Cart',
        prod_share: 'Share Product',
        prod_secure_payment: 'Secure Payment with',
        prod_origin_title: 'Product Origin',
        prod_origin_text: 'This product comes from verified official marketplaces. All keys and licenses are legitimately obtained.',
        prod_support_title: 'Support & Warranty',
        prod_support_text: 'We verify every product before delivery. 24-48 hours full support after purchase.',
        prod_features_title: 'Key Features',
        prod_related_title: 'Related Products',
        product_review: 'Leave a review',
        product_notify_me: 'NOTIFY ME',

        // Trust sections
        trust_payments_title: 'Secure Payments Accepted',
        trust_payments_desc: 'We accept local payments via Yape, and international payments through Binance Pay and Cryptomus (Cards & Crypto). Instant verification.',
        trust_origin_title: 'Product Origin',
        trust_origin_subtitle: 'Total transparency in our operations',
        trust_g2a_title: 'G2A Goldmine',
        trust_g2a_desc: 'Official affiliate program of G2A Marketplace, one of the largest digital key platforms.',
        trust_eneba_title: 'Eneba Affiliates',
        trust_eneba_desc: 'Affiliate program of Eneba, internationally recognized marketplace for digital products.',
        trust_keys_title: 'Keysforgames',
        trust_keys_desc: 'Direct purchases from price comparison platforms, acquiring keys from verified stores.',
        trust_warranty_title: 'Legitimacy Guarantee',
        trust_warranty_desc1: 'We do not generate keys on our own or use illicit methods. We only work with recognized marketplaces and verify all keys before delivering them to the final customer.',
        trust_warranty_desc2: 'Every product is tested and validated to guarantee its operation. We offer full support within 24-48 hours after purchase.',

        // Modal
        auth_confirmed_title: 'Account Confirmed!',
        auth_confirmed_desc: 'Thank you for verifying your email. You can now access your account and complete your purchases.',

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

        // Checkout Info
        checkout_title: 'Checkout',
        checkout_buyer_info: 'Buyer Information',
        checkout_buyer_desc: 'Please enter your details to receive your digital product immediately.',
        checkout_email: 'Email Address',
        checkout_email_placeholder: 'you@example.com',
        checkout_phone: 'Phone Number (WhatsApp)',
        checkout_phone_placeholder: '999-999-999',
        checkout_first_name: 'First Name',
        checkout_last_name: 'Last Name',
        checkout_create_account: 'Create an account for faster checkout next time',
        checkout_password: 'Password',
        checkout_continue_payment: 'Continue to Payment',
        checkout_back_to_cart: 'Back to Cart',

        // Payment Page
        pay_title: 'Choose Payment Method',
        pay_desc: 'Select your preferred payment method to complete your purchase',
        pay_back_to_info: 'Back to Information',
        pay_continue_btn: 'Continue to Payment',
        pay_secure_notice: 'Your payment information is encrypted and secure. We never store your payment details.',
        pay_order_summary: 'Order Summary',
        pay_yape_title: 'Pay with Yape',
        pay_yape_step1: 'Scan the QR code or send to the phone number',
        pay_yape_step2: 'Complete the payment in your Yape app',
        pay_yape_step3: 'Upload screenshot and reference code below',
        pay_yape_amount: 'Amount to Pay',
        pay_yape_screenshot: 'Payment Screenshot',
        pay_yape_reference: 'Reference Code (6 digits)',
        pay_yape_timer: 'Time remaining',
        pay_yape_submit: 'Submit Payment Proof',
        pay_success_title: 'Payment Received!',
        pay_success_desc: 'We are processing your payment. You will receive your products via email within 5-10 minutes.',
        pay_success_btn: 'Back to Home',
        pay_paypal_title: 'Pay with PayPal',
        pay_paypal_desc: 'You will be redirected to PayPal to complete your payment. Alternatively, you can use manual transfer.',
        pay_paypal_button: 'Continue with PayPal',
        pay_paypal_manual_title: 'Manual PayPal Transfer (Optional)',
        pay_paypal_manual_desc: 'If you prefer, you can send money directly to our PayPal account and upload proof of payment.',
        pay_paypal_email: 'PayPal Account',
        pay_paypal_screenshot_optional: 'Payment Screenshot (Optional)',
        pay_paypal_transaction_id: 'Transaction ID (Optional)',
        pay_paypal_submit_proof: 'Submit Manual Proof',

        // Auth
        auth_login_title: 'Welcome Back',
        auth_login_desc: 'Sign in to access your digital library and orders',
        auth_register_title: 'Create Account',
        auth_register_desc: 'Join us to manage your licenses and get exclusive offers',
        auth_forgot_password: 'Forgot Password?',
        auth_no_account: "Don't have an account?",
        auth_has_account: 'Already have an account?'
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
        auth_signout: 'Cerrar Sesión',

        // Footer
        footer_desc: 'Tu fuente confiable de software, juegos y servicios digitales. Entrega instantánea y pagos seguros.',
        footer_shop: 'Tienda',
        footer_all_products: 'Todos los Productos',
        footer_support: 'Soporte',
        footer_about: 'Sobre Nosotros',
        footer_help: 'Centro de Ayuda',
        footer_terms: 'Términos de Servicio',
        footer_refund: 'Política de Reembolso',
        footer_contact: 'Contáctanos',
        footer_rights: 'Todos los derechos reservados.',

        // Home
        hero_title: 'Los Mejores Precios Digitales en',
        hero_subtitle: 'Productos digitales seguros entregados al instante en tu bandeja de entrada. Desde claves de software hasta tarjetas de regalo, lo tenemos todo.',
        hero_cta: 'Explorar Productos',
        hero_delivery: 'Entrega Inmediata',
        hero_title_accent: 'Trujillo',
        hero_offers: 'Ver Ofertas',
        featured_title: 'Productos Destacados',
        top_sellers: 'Más Vendidos',

        // Product Card & Catalog
        product_buy_now: 'COMPRAR AHORA',
        product_notify: 'AVISARME',
        product_out_of_stock: 'AGOTADO',
        product_renewable: 'Renovable',
        product_from: 'Desde',

        // Product Details
        prod_breadcrumb_home: 'Inicio',
        prod_reviews: 'reseñas',
        prod_in_stock: 'EN STOCK',
        prod_instant_delivery: 'Entrega instantánea por email',
        prod_quantity: 'Cantidad',
        prod_buy_now: 'Comprar Ahora',
        prod_add_to_cart: 'Añadir al Carrito',
        prod_share: 'Compartir Producto',
        prod_secure_payment: 'Pago Seguro con',
        prod_origin_title: 'Origen del Producto',
        prod_origin_text: 'Este producto proviene de marketplaces oficiales verificados. Todas las claves son obtenidas legítimamente.',
        prod_support_title: 'Soporte y Garantía',
        prod_support_text: 'Verificamos cada producto antes de la entrega. Soporte completo 24-48 horas después de la compra.',
        prod_features_title: 'Características Clave',
        prod_related_title: 'Productos Relacionados',
        product_review: 'Dejar reseña',
        product_notify_me: 'AVISARME',

        // Trust sections
        trust_payments_title: 'Pagos Seguros Aceptados',
        trust_payments_desc: 'Aceptamos pagos locales vía Yape, y pagos internacionales mediante Binance Pay y Cryptomus (Tarjetas y Cripto). Verificación instantánea.',
        trust_origin_title: 'Origen de Nuestros Productos',
        trust_origin_subtitle: 'Transparencia total en nuestras operaciones',
        trust_g2a_title: 'G2A Goldmine',
        trust_g2a_desc: 'Programa de afiliados oficial de G2A Marketplace, una de las plataformas más grandes de claves digitales.',
        trust_eneba_title: 'Eneba Affiliates',
        trust_eneba_desc: 'Programa de afiliados de Eneba, marketplace reconocido internacionalmente para productos digitales.',
        trust_keys_title: 'Keysforgames',
        trust_keys_desc: 'Compras directas en plataforma de comparación de precios, adquiriendo claves de tiendas verificadas.',
        trust_warranty_title: 'Garantía de Legitimidad',
        trust_warranty_desc1: 'No generamos claves por nuestra cuenta ni utilizamos métodos ilícitos. Solo trabajamos con marketplaces reconocidos y verificamos todas las claves antes de entregarlas al cliente final.',
        trust_warranty_desc2: 'Cada producto es probado y validado para garantizar su funcionamiento. Ofrecemos soporte completo dentro de las 24-48 horas posteriores a la compra.',

        // Modal
        auth_confirmed_title: '¡Cuenta Confirmada!',
        auth_confirmed_desc: 'Gracias por verificar tu correo. Ahora puedes acceder a tu cuenta y completar tus compras.',

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

        // Checkout Info
        checkout_title: 'Finalizar Compra',
        checkout_buyer_info: 'Información del Comprador',
        checkout_buyer_desc: 'Por favor, ingresa tus datos para recibir tu producto digital inmediatamente.',
        checkout_email: 'Correo Electrónico',
        checkout_email_placeholder: 'tu@ejemplo.com',
        checkout_phone: 'Teléfono (WhatsApp)',
        checkout_phone_placeholder: '999-999-999',
        checkout_first_name: 'Nombre',
        checkout_last_name: 'Apellido',
        checkout_create_account: 'Crear una cuenta para compras más rápidas',
        checkout_password: 'Contraseña',
        checkout_continue_payment: 'Continuar al Pago',
        checkout_back_to_cart: 'Volver al Carrito',

        // Payment Page
        pay_title: 'Elige un Método de Pago',
        pay_desc: 'Selecciona tu método de pago preferido para completar la compra',
        pay_back_to_info: 'Volver a Información',
        pay_continue_btn: 'Continuar al Pago',
        pay_secure_notice: 'Tu información de pago está cifrada y segura. Nunca almacenamos tus datos de pago.',
        pay_order_summary: 'Resumen del Pedido',
        pay_yape_title: 'Pagar con Yape',
        pay_yape_step1: 'Escanea el código QR o envía al número de teléfono',
        pay_yape_step2: 'Completa el pago en tu aplicación Yape',
        pay_yape_step3: 'Sube la captura y el código de referencia abajo',
        pay_yape_amount: 'Monto a Pagar',
        pay_yape_screenshot: 'Captura de Pago',
        pay_yape_reference: 'Código de Referencia (6 dígitos)',
        pay_yape_timer: 'Tiempo restante',
        pay_yape_submit: 'Enviar Comprobante',
        pay_success_title: '¡Pago Recibido!',
        pay_success_desc: 'Estamos procesando tu pago. Recibirás tus productos por correo en 5-10 minutos.',
        pay_success_btn: 'Volver al Inicio',
        pay_paypal_title: 'Pagar con PayPal',
        pay_paypal_desc: 'Serás redirigido a PayPal para completar tu pago. Alternativamente, puedes usar transferencia manual.',
        pay_paypal_button: 'Continuar con PayPal',
        pay_paypal_manual_title: 'Transferencia Manual PayPal (Opcional)',
        pay_paypal_manual_desc: 'Si prefieres, puedes enviar dinero directamente a nuestra cuenta PayPal y subir comprobante de pago.',
        pay_paypal_email: 'Cuenta PayPal',
        pay_paypal_screenshot_optional: 'Captura de Pago (Opcional)',
        pay_paypal_transaction_id: 'ID de Transacción (Opcional)',
        pay_paypal_submit_proof: 'Enviar Comprobante Manual',

        // Auth
        auth_login_title: 'Bienvenido de Nuevo',
        auth_login_desc: 'Inicia sesión para acceder a tu biblioteca digital y pedidos',
        auth_register_title: 'Crear Cuenta',
        auth_register_desc: 'Únete para gestionar tus licencias y recibir ofertas exclusivas',
        auth_forgot_password: '¿Olvidaste tu contraseña?',
        auth_no_account: '¿No tienes una cuenta?',
        auth_has_account: '¿Ya tienes una cuenta?'
    }
};

export function t(key: keyof typeof TRANSLATIONS.en, lang: Language): string {
    return TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
}
