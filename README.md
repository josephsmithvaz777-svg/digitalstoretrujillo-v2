# DigitalStoreTrujillo - Astro.js Project

## 🚀 Proyecto migrado exitosamente a Astro.js

Este proyecto ha sido completamente migrado de HTML estático a **Astro.js**, un framework moderno y de alto rendimiento para sitios web.

## 📅 Changelog (Última actualización: 13/01/2026)

### ✨ Nuevas Funcionalidades
*   **Ordenamiento Manual de Productos (Drag & Drop)**: 
    *   Se implementó la capacidad de reordenar productos manualmente en el Panel Administrativo arrastrando y soltando las filas.
    *   La página de inicio (`Home`) ahora respeta estrictamente este orden manual, permitiendo destacar productos específicos independientemente de su fecha de creación o estado de "destacado".
*   **Sistema de Notificaciones Multicanal**:
    *   **Telegram**: Notificaciones instantáneas al administrador (@OrberNotifyBot) con detalles de cada nueva orden (Cliente, Monto, Método de Pago).
    *   **Email**: Envío automático de correos de alerta al administrador mediante SMTP/Mailgun.
    *   Integración automática con todos los métodos de pago (Manual/Yape, Cryptomus, PayPal).

### 🛠️ Configuración y Backend
*   **Base de Datos**: Nueva columna `sort_order` en la tabla `products`.
*   **API**: Nuevos endpoints para reordenamiento (`/api/admin/products/reorder`) y lógica centralizada de notificaciones (`src/lib/notifications.ts`).
*   **Variables de Entorno**: Configuración de credenciales para Telegram Bot y SMTP en `.env`.

---

## 📁 Estructura del Proyecto

```
minor-mass/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header.astro     # Barra de navegación
│   │   ├── Footer.astro     # Pie de página
│   │   └── ProductCard.astro # Tarjeta de producto
│   ├── layouts/
│   │   └── Layout.astro     # Layout principal con SEO
│   ├── pages/               # Páginas del sitio
│   │   ├── index.astro      # Página principal (Home)
│   │   └── product/
│   │       └── index.astro  # Página de detalle de producto
│   └── styles/
│       └── global.css       # Estilos globales + Tailwind
├── public/                  # Archivos estáticos
├── astro.config.mjs         # Configuración de Astro
├── tailwind.config.mjs      # Configuración de Tailwind CSS
└── package.json
```

## 🎨 Tecnologías Utilizadas

- **Astro.js 5.16.6** - Framework principal (SSR + Estático)
- **Supabase** - Base de datos, Autenticación y Edge Functions
- **Tailwind CSS 3.x** - Framework de estilos
- **Nodemailer / Mailgun** - Notificaciones por correo electrónico
- **Telegram Bot API** - Notificaciones en tiempo real
- **WhatsApp Web API** - Notificaciones manuales rápidas

## 🎯 Características Implementadas

✅ **Perfil de Usuario**: Visualización de datos personales (Nombre, Teléfono) y historial de pedidos.  
✅ **Panel Administrativo Premium**: Gestión completa de productos, usuarios y órdenes.  
✅ **Verificación de Pagos**: Sistema de revisión de comprobantes (Yape/Binance) con previsualización de capturas.  
✅ **Notificaciones Inteligentes**:
   - **Telegram**: Alertas inmediatas al admin con detalles de venta.
   - **Email**: Aviso al admin y confirmación al cliente.
   - **Web**: Actualización de estado en tiempo real.
✅ **SEO & Performance**: Optimizado para carga rápida y buscadores.  

## 📁 Estructura del Sistema de Notificaciones

```
minor-mass/
├── src/
│   ├── lib/
│   │   ├── notifications.ts # Lógica central de notificaciones (Telegram + Email)
│   │   ├── mail.ts          # Cliente SMTP (Nodemailer)
│   │   └── supabase.ts      # Cliente de Supabase (Admin & Public)
├── supabase/
│   └── functions/
│       └── send-order-email/ # (Legacy) Lógica alternativa en Edge Functions
└── README.md
```

## 🚀 Despliegue

Recuerda configurar las siguientes variables de entorno en tu servidor (Vercel/Coolify/Netlify):

```env
# Telegram
TELEGRAM_BOT_TOKEN=tu_token
TELEGRAM_CHAT_ID=tu_chat_id

# SMTP / Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=noreply@digitalstoretrujillo.store
SMTP_PASS=tu_password
NOTIFICATION_EMAIL_TO=admin@digitalstoretrujillo.com
```

## 🎨 Paleta de Colores

- **Primary**: `#e00700` (Rojo característico)
- **Background Dark**: `#0f0f0f`
- **Card Dark**: `#1a1a1a`
- **Border Dark**: `#333333`
- **Text Muted**: `#a3a3a3`

---

**Desarrollado con ❤️ para DigitalStoreTrujillo**
