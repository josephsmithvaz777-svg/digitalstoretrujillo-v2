# DigitalStoreTrujillo - Astro.js Project

## 🚀 Proyecto migrado exitosamente a Astro.js

Este proyecto ha sido completamente migrado de HTML estático a **Astro.js**, un framework moderno y de alto rendimiento para sitios web.

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
- **WhatsApp Web API** - Notificaciones manuales rápidas

## 🎯 Características Implementadas

✅ **Perfil de Usuario**: Visualización de datos personales (Nombre, Teléfono) y historial de pedidos.  
✅ **Panel Administrativo Premium**: Gestión completa de productos, usuarios y órdenes.  
✅ **Verificación de Pagos**: Sistema de revisión de comprobantes (Yape/Binance) con previsualización de capturas.  
✅ **Notificaciones Inteligentes**:
   - **Email**: Confirmación automática vía Supabase Edge Functions + Mailgun.
   - **WhatsApp**: Botón de notificación rápida con mensaje pre-configurado y copia al portapapeles.
   - **Web**: Actualización de estado en tiempo real para el cliente.
✅ **SEO & Performance**: Optimizado para carga rápida y buscadores.  

## 📁 Estructura del Sistema de Notificaciones

```
minor-mass/
├── src/
│   ├── lib/
│   │   └── supabase.ts      # Cliente de Supabase (Admin & Public)
│   └── pages/
│       └── api/
│           └── admin/
│               └── orders/
│                   └── update-status.ts  # Trigger de notificaciones
├── supabase/
│   └── functions/
│       └── send-order-email/            # Lógica del correo (Deno/Edge Function)
└── README.md
```

## 🚀 Despliegue de Edge Functions (Supabase)

Para actualizar o desplegar la lógica de correos electrónicos:

1. **Login**: `npx supabase login`
2. **Link**: `npx supabase link --project-ref vmbupmwlyfjmxjmenyid`
3. **Deploy**: `npx supabase functions deploy send-order-email --no-verify-jwt`
4. **Secretos**: `npx supabase secrets set MAILGUN_API_KEY=tu_clave_aqui`

## 🎨 Paleta de Colores

- **Primary**: `#e00700` (Rojo característico)
- **Background Dark**: `#0f0f0f`
- **Card Dark**: `#1a1a1a`
- **Border Dark**: `#333333`
- **Text Muted**: `#a3a3a3`

---

**Desarrollado con ❤️ para DigitalStoreTrujillo**

