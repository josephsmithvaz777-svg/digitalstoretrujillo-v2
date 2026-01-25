# 📱 Guía Rápida: Login Admin desde Móvil

## Credenciales Correctas
```
Email: admin@digitalstoretrujillo.store
Password: stake123
```

## ⚡ Soluciones Rápidas (en orden de prioridad)

### 1️⃣ PRIMERO: Verifica que escribes bien el email
- ⚠️ **Muy Importante**: El autocorrector puede cambiar el email
- Escribe letra por letra: `admin@digitalstoretrujillo.store`
- NO copies y pegues (puede agregar espacios invisibles)
- El sistema ya limpia espacios automáticamente, pero verifica

### 2️⃣ Limpia Caché y Cookies

**iOS (Safari/Chrome):**
```
Configuración → Safari/Chrome → 
Borrar historial y datos → Confirmar
```

**Android (Chrome):**
```
Chrome → ⋮ → Configuración → 
Privacidad → Borrar datos de navegación → 
✓ Cookies ✓ Caché → Borrar
```

### 3️⃣ Prueba en Modo Incógnito/Privado
- Abre ventana privada
- Intenta login
- Si funciona → el problema son cookies/caché

### 4️⃣ Verifica Cookies Habilitadas

**iOS:**
```
Configuración → Safari → 
❌ Desactiva "Prevenir rastreo entre sitios"
❌ Desactiva "Bloquear todas las cookies"
```

**Android:**
```
Chrome → Configuración → Configuración del sitio → 
Cookies → "Permitir cookies"
```

### 5️⃣ Desactiva Modo Lite (Android)
```
Chrome → Configuración → 
Modo Lite → ❌ Desactivar
```

### 6️⃣ Prueba con Otro Navegador
- **iOS**: Prueba Chrome, Firefox, Edge
- **Android**: Prueba Firefox, Edge, Samsung Internet

### 7️⃣ Verifica tu Conexión
- Cambia de WiFi a datos móviles (o viceversa)
- WiFi público puede bloquear algunas conexiones

---

## 🔍 Ver Errores Detallados (Consola del Navegador)

Cuando intentas hacer login, la consola muestra información útil. 

### Cómo Acceder a la Consola:

**Opción A: Remote Debugging (Recomendado)**

**Android + PC:**
1. Conecta teléfono a PC con USB
2. Activa "Depuración USB" en Android
3. En Chrome desktop, ve a: `chrome://inspect`
4. Selecciona tu dispositivo
5. Abre la página de login en el móvil
6. Verás la consola en la PC

**iOS + Mac:**
1. iPhone: `Configuración → Safari → Avanzado → ✓ Inspector Web`
2. Conecta iPhone al Mac con cable
3. En Mac Safari: `Desarrollador → [Tu iPhone]`
4. Selecciona la pestaña del login
5. Verás la consola en el Mac

**Opción B: Usar una App de Consola**

**Eruda (Console para móvil):**
En tu navegador móvil, añade este código a la consola (si puedes):
```javascript
(function () { var script = document.createElement('script'); script.src="https://cdn.jsdelivr.net/npm/eruda"; document.body.append(script); script.onload = function () { eruda.init(); } })();
```

---

## 📊 Qué Información Buscar en la Consola

Cuando intentas login, busca estos mensajes:

✅ **Login Exitoso:**
```
🔐 Attempting login with email: admin@digitalstoretrujillo.store
✅ Login successful for: admin@digitalstoretrujillo.store
```

❌ **Login Fallido:**
```
❌ Login error: [mensaje del error]
Error code: [código]
Error status: [status]
```

### Errores Comunes y Soluciones:

| Error | Solución |
|-------|----------|
| `Invalid login credentials` | Email o contraseña incorrectos. Verifica que no haya espacios |
| `Email not confirmed` | Usuario no confirmado en Supabase. Contacta al admin |
| `Too many requests` | Demasiados intentos. Espera 5-10 minutos |
| `Network error` | Problema de conexión. Verifica internet |
| `Failed to fetch` | Problema de CORS o cookies bloqueadas |

---

## 🛠️ Debugging Paso a Paso

1. **Abre la página de login** en móvil
2. **Limpia todos los campos**
3. **Escribe el email manualmente** (sin copiar/pegar):
   ```
   admin@digitalstoretrujillo.store
   ```
4. **Escribe la contraseña**:
   ```
   stake123
   ```
5. **Click en "Iniciar Sesión"**
6. **Observa el error** (si aparece)

---

## 📸 Screenshots de Configuración

### Safari iOS - Cookies Habilitadas
```
Configuración
  └─ Safari
      ├─ ❌ Prevenir rastreo entre sitios (OFF)
      ├─ ❌ Bloquear todas las cookies (OFF)
      └─ ✓ Permitir cookies (ON)
```

### Chrome Android - Cookies Habilitadas
```
Chrome
  └─ Configuración
      └─ Configuración del sitio
          └─ Cookies
              └─ ✓ Permitir cookies
```

---

## 🆘 Si Nada Funciona

1. **Prueba desde una PC/laptop** primero para confirmar credenciales
2. **Reinicia tu teléfono**
3. **Actualiza tu navegador** a la última versión
4. **Contacta al administrador** con:
   - Modelo de teléfono
   - Sistema operativo (iOS/Android)
   - Navegador que usas
   - Mensaje de error exacto
   - Screenshot del error

---

## ✅ Checklist de Verificación

Marca lo que ya intentaste:

- [ ] Escribir email manualmente (sin copiar/pegar)
- [ ] Limpiar caché y cookies
- [ ] Probar en modo incógnito
- [ ] Verificar que cookies estén habilitadas
- [ ] Desactivar Modo Lite (Android)
- [ ] Probar con otro navegador
- [ ] Cambiar de WiFi a datos móviles
- [ ] Reiniciar el teléfono
- [ ] Actualizar el navegador
- [ ] Probar desde una PC (para confirmar credenciales)

---

## 📞 Soporte

Si después de intentar todo esto el problema persiste:

**Email**: admin@digitalstoretrujillo.store
**Telegram**: t.me/netflixaccglobal

Incluye en tu mensaje:
- ✓ Checklist completado arriba
- ✓ Screenshot del error
- ✓ Modelo de teléfono y navegador
- ✓ Resultado de la consola (si pudiste acceder)
