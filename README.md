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

- **Astro.js 5.16.6** - Framework principal
- **Tailwind CSS 3.x** - Framework de estilos
- **Google Fonts** - Spline Sans & Noto Sans
- **Material Symbols** - Iconos

## 🎯 Características

✅ **Componentes Modulares**: Header, Footer y ProductCard reutilizables  
✅ **Diseño Responsivo**: Optimizado para móvil, tablet y desktop  
✅ **Tema Oscuro**: Diseño premium con paleta de colores personalizada  
✅ **SEO Optimizado**: Meta tags y estructura semántica  
✅ **Alto Rendimiento**: Generación estática con Astro  
✅ **Tailwind CSS**: Sistema de diseño consistente  

## 🎨 Paleta de Colores

- **Primary**: `#e00700` (Rojo característico)
- **Background Dark**: `#181110`
- **Card Dark**: `#231515`
- **Border Dark**: `#3a2727`
- **Text Muted**: `#bc9b9a`

## 🚀 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📄 Páginas Migradas

### ✅ Completadas
1. **Home** (`/`) - Página principal con hero, productos destacados y métodos de pago
2. **Product Detail** (`/product`) - Página de detalle de producto con galería e información

### 📋 Pendientes de Migración
3. **Shopping Cart** - Carrito de compras (shopping-page.html)
4. **Checkout** - Página de checkout (checkout.html)

## 🔧 Próximos Pasos

1. **Migrar páginas restantes**:
   - Crear `/cart.astro` basado en `shopping-page.html`
   - Crear `/checkout.astro` basado en `checkout.html`

2. **Agregar funcionalidad dinámica**:
   - Sistema de rutas dinámicas para productos (`/product/[id].astro`)
   - Gestión de estado del carrito
   - Integración con API de pagos (Yape, Cryptomus)

3. **Optimizaciones**:
   - Lazy loading de imágenes
   - Optimización de assets
   - Implementar PWA

## 📝 Notas de Migración

- Todos los estilos inline de Tailwind se mantuvieron
- Las fuentes de Google se cargan desde el Layout principal
- Los iconos de Material Symbols se mantienen
- La estructura HTML se conservó para mantener el diseño original
- Se agregó soporte para props en componentes para mayor flexibilidad

## 🌐 Servidor de Desarrollo

El proyecto está corriendo en: **http://localhost:4321/**

## 📦 Archivos Originales

Los archivos HTML originales se mantienen en el directorio raíz para referencia:
- `home.html`
- `product-page.html` / `code.html`
- `shopping-page.html`
- `checkout.html`

## 🎓 Recursos

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)

---

**Desarrollado con ❤️ para DigitalStoreTrujillo**
