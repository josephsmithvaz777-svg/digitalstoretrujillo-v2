# 🚀 Inicio Rápido - DigitalStoreTrujillo

## ✅ Tu proyecto ya está integrado con Astro.js

### 📍 Ubicación del Proyecto
```
c:\Users\USUARIO\Downloads\stitch_digitalstoretrujillo_home_page (1)\minor-mass\
```

### 🌐 Servidor de Desarrollo
**El servidor YA está corriendo en:**
👉 **http://localhost:4321/**

### 🎯 Páginas Disponibles

1. **Home** - http://localhost:4321/
   - Hero section
   - Productos destacados
   - Métodos de pago

2. **Product Detail** - http://localhost:4321/product
   - Galería de imágenes
   - Información detallada
   - Productos relacionados

### 📂 Archivos Importantes

```
minor-mass/
├── README.md              ← Documentación completa
├── MIGRATION_SUMMARY.md   ← Resumen de migración
├── src/
│   ├── components/        ← Componentes reutilizables
│   ├── layouts/           ← Layout principal
│   ├── pages/             ← Páginas del sitio
│   └── styles/            ← Estilos globales
```

### ⚡ Comandos Útiles

```bash
# Ver el sitio (ya está corriendo)
# Abre: http://localhost:4321/

# Detener el servidor
# Presiona: Ctrl + C

# Reiniciar el servidor
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

### 🎨 Componentes Creados

1. **Header.astro** - Navegación superior
2. **Footer.astro** - Pie de página
3. **ProductCard.astro** - Tarjeta de producto
4. **Layout.astro** - Layout base con SEO

### 📋 Próximos Pasos

#### Opción 1: Migrar Shopping Cart
```bash
# Crear nueva página
New-Item src/pages/cart.astro

# Copiar estructura de shopping-page.html
# Usar componentes existentes
```

#### Opción 2: Migrar Checkout
```bash
# Crear nueva página
New-Item src/pages/checkout.astro

# Copiar estructura de checkout.html
# Implementar formulario
```

#### Opción 3: Crear Productos Dinámicos
```bash
# Crear ruta dinámica
New-Item src/pages/product/[id].astro

# Implementar lógica de productos
```

### 🎨 Personalización

#### Cambiar Colores
Edita: `tailwind.config.mjs`
```javascript
colors: {
  'primary': '#e00700',  // ← Cambia aquí
  // ...
}
```

#### Modificar Estilos Globales
Edita: `src/styles/global.css`

#### Editar Componentes
Navega a: `src/components/`

### 📚 Recursos

- [Documentación Astro](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Material Symbols](https://fonts.google.com/icons)

### ❓ Solución de Problemas

#### El servidor no inicia
```bash
# Reinstalar dependencias
npm install

# Intentar de nuevo
npm run dev
```

#### Cambios no se reflejan
- El servidor recarga automáticamente
- Si no funciona, presiona Ctrl+C y ejecuta `npm run dev` de nuevo

#### Error de Tailwind
- Verifica que `tailwind.config.mjs` existe
- Verifica que `global.css` tiene las directivas @tailwind

### 🎉 ¡Listo!

Tu proyecto está completamente funcional y listo para continuar el desarrollo.

**Páginas migradas**: 2/4 (50%)
- ✅ Home
- ✅ Product Detail
- ⏳ Shopping Cart
- ⏳ Checkout

---

**¿Necesitas ayuda?** Revisa `README.md` y `MIGRATION_SUMMARY.md` para más detalles.
