# Guía de Actualización Manual - Sistema Multi-Moneda

Esta guía te ayudará a completar las páginas restantes que necesitan soporte multi-moneda.

## ✅ Ya Completado

- ✅ `currency.ts` - Utilidad de conversión
- ✅ `currencyStore.ts` - Store global
- ✅ `ProductCard.astro` - Componente con conversión automática
- ✅ `Layout.astro` - Inicialización global
- ✅ `seed.sql` - Precios convertidos a USD
- ✅ `index.astro` - Usa ProductCard (ya funciona)
- ✅ `search.astro` - Usa ProductCard (ya funciona)
- ✅ `[category].astro` - Usa ProductCard (ya funciona)

## ⚠️ Pendientes de Completar

### 1. Página de Producto Detail - `[slug].astro`

**Archivo:** `src/pages/product/[slug].astro`

#### Cambios necesarios:

**Línea ~175-177** - Precio principal:
```astro
<!-- ANTES -->
<p class="text-4xl font-bold text-white">
    S/ {product.price.toFixed(2)}
</p>

<!-- DESPUÉS -->
<p class="text-4xl font-bold text-white product-price" data-price-usd={product.price}>
    $ {product.price.toFixed(2)}
</p>
```

**Líneas ~180-183** - Precio original (ya tiene data-price-usd, solo cambiar símbolo):
```astro
<!-- ANTES -->
<p class="text-xl text-text-m uted line-through mb-1 product-original-price" data-price-usd={product.original_price}>
    ${"  "}
    {product.original_price.toFixed(2)}
</p>

<!-- DESPUÉS (corregir clase y símbolo) -->
<p class="text-xl text-text-muted line-through mb-1 product-original-price" data-price-usd={product.original_price}>
    ${" "}
    {product.original_price.toFixed(2)}
</p>
```

**Agregar Script al final** (antes de `</Layout>`):

```astro
<script>
    import { initializeCurrency, userCurrency } from "../../stores/currencyStore";
    import { convertPrice } from "../../lib/currency";

    document.addEventListener("DOMContentLoaded", () => {
        // ... código existente de buy-now y share ...

        // Agregar al final del DOMContentLoaded:
        
        // Currency conversion
        initializeCurrency();

        const updatePrices = () => {
            const currency = userCurrency.get();
            const symbol = currency === 'USD' ? '$' : 'S/';

            // Main price
            const priceEl = document.querySelector('.product-price');
            if (priceEl) {
                const priceUSD = parseFloat(priceEl.getAttribute('data-price-usd') || '0');
                const converted = convertPrice(priceUSD, currency);
                priceEl.textContent = `${symbol} ${converted.toFixed(2)}`;
            }

            // Original price
            const originalPriceEl = document.querySelector('.product-original-price');
            if (originalPriceEl) {
                const priceUSD = parseFloat(originalPriceEl.getAttribute('data-price-usd') || '0');
                const converted = convertPrice(priceUSD, currency);
                const parts = originalPriceEl.textContent?.split(/[\d.]+/) || [];
                originalPriceEl.textContent = `${symbol} ${converted.toFixed(2)}`;
            }

            // Renewable price
            const renewablePriceEl = document.querySelector('.product-renewable-price');
            if (renewablePriceEl) {
                const priceUSD = parseFloat(renewablePriceEl.getAttribute('data-price-usd') || '0');
                const converted = convertPrice(priceUSD, currency);
                renewablePriceEl.textContent = `Renovable: ${symbol}${converted.toFixed(2)}`;
            }
        };

        userCurrency.subscribe(updatePrices);
        window.addEventListener('currency-changed', updatePrices);
    });
</script>
```

---

### 2. Página de Carrito - `cart.astro`

**Archivo:** `src/pages/cart.astro`

#### Buscar todas las ocurrencias de `S/` y reemplazar por símbolo dinámico:

**Ejemplo de cambio en los items del carrito:**

```javascript
// ANTES (aprox línea con ${item.price})
<p class="text-white font-bold">S/ ${item.price.toFixed(2)}</p>

// DESPUÉS
<p class="text-white font-bold cart-item-price" data-price-usd="${item.price}">$ ${item.price.toFixed(2)}</p>
```

**Agregar script de conversión al final:**

```astro
<script>
    import { initializeCurrency, userCurrency } from "../stores/currencyStore";
    import { convertPrice } from "../lib/currency";
    import { cartItems, cartTotal } from "../stores/cart";

    // Inicializar conversión
    initializeCurrency();

    const updateCartPrices = () => {
        const currency = userCurrency.get();
        const symbol = currency === 'USD' ? '$' : 'S/';

        // Actualizar precios de  items
        document.querySelectorAll('.cart-item-price').forEach((el) => {
            const priceUSD = parseFloat(el.getAttribute('data-price-usd') || '0');
            const converted = convertPrice(priceUSD, currency);
            el.textContent = `${symbol} ${converted.toFixed(2)}`;
        });

        // Actualizar total
        const totalEl = document.querySelector('.cart-total');
        if (totalEl) {
            const totalUSD = cartItems.get().reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const converted = convertPrice(totalUSD, currency);
            totalEl.textContent = `${symbol} ${converted.toFixed(2)}`;
        }
    };

    userCurrency.subscribe(updateCartPrices);
    cartItems.subscribe(updateCartPrices); // También actualizar cuando cambie el carrito
</script>
```

---

### 3. Página de Checkout - `checkout.astro`

**Archivo:** `src/pages/checkout.astro`

Similar a cart.astro, buscar las líneas donde se muestra `S/` y agregar:

1. Agregar `data-price-usd` a elementos de precio
2. Cambiar `S/` por `$`
3. Agregar clases como `checkout-item-price` y `checkout-total`
4. Agregar script de conversión similar al de cart

---

### 4. Página de Payment - `payment.astro`

**Archivo:** `src/pages/payment.astro`

Este archivo **ya tiene lógica de conversión** (líneas 1095-1096), pero debemos integrarlo con nuestro sistema:

**Reemplazar las líneas ~1095-1098:**

```javascript
// ANTES
const rate = 3.8;
const total = isUSD ? totalPEN / rate : totalPEN;
const symbol = isUSD ? "$" : "S/";
const currencyText = isUSD ? "USD" : "PEN";

// DESPUÉS
import { EXCHANGE_RATE } from '../lib/currency';
import { userCurrency } from '../stores/currencyStore';

const currentCurrency = userCurrency.get();
const rate = EXCHANGE_RATE; // 3.8
const total = isUSD ? totalPEN / rate : totalPEN;
const symbol = currentCurrency === 'USD' ? "$" : "S/";
const currencyText = currentCurrency;
```

---

## 🔧 Testing

Después de hacer estos cambios:

1. **Ejecutar el script de actualización de precios en Supabase:**
   ```sql
   -- Ejecutar update-prices-to-usd.sql en SQL Editor
   ```

2. **Probar con VPN:**
   - Con VPN en Perú: Debería mostrar S/ y precios en soles
   - Sin VPN (o fuera de Perú): Debería mostrar $ y precios en dólares

3. **Verificar localStorage:**
   ```javascript
   // En la consola del navegador:
   localStorage.getItem('user-currency')
   // Debería retornar 'USD' o 'PEN'
   ```

4. **Verificar conversión:**
   - Producto de $3.95 USD debería mostrarse como S/15.01 en Perú
   - Cálculo: 3.95 × 3.8 = 15.01

---

## 📝 Notas Importantes

1. **Todos los precios nuevos** deben ingresarse en USD en el admin panel
2. **La conversión es automática** en el cliente
3. **El localStorage guarda la preferencia** para no hacer múltiples requests a la API de geolocalización
4. **Si hay errores**, verifica la consola del navegador para ver logs de `currency.ts`

---

## ❓ Si tienes problemas

Ejecuta en la consola del navegador:

```javascript
// Verificar si la utilidad está cargada
import('./src/lib/currency.ts').then(c => console.log(c));

// Forzar una moneda
localStorage.setItem('user-currency', 'PEN'); // o 'USD'
location.reload();

// Ver el store actual
import('./src/stores/currencyStore.ts').then(s => console.log(s.userCurrency.get()));
```
