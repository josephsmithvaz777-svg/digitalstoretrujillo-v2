# Solución al Error de Login Admin

## Problema
Error: `AuthApiError: Invalid login credentials` al intentar iniciar sesión en `/admin/login`

## Causa
El usuario administrador no ha sido creado correctamente en Supabase Auth.

## Solución Paso a Paso

### 1. Verificar que ejecutaste el script SQL

Primero, asegúrate de haber ejecutado el script de configuración:

1. Ve a: https://supabase.com/dashboard/project/vmbupmwlyfjmxjmenyid/sql/new
2. Copia y pega el contenido de `supabase/admin-auth.sql`
3. Click en **"Run"**

### 2. Crear el Usuario Admin en Supabase

**IMPORTANTE**: Supabase NO permite crear usuarios por SQL. Debes hacerlo manualmente:

1. **Ir a Authentication:**
   - URL directa: https://supabase.com/dashboard/project/vmbupmwlyfjmxjmenyid/auth/users

2. **Crear nuevo usuario:**
   - Click en el botón **"Add user"** (esquina superior derecha)
   - Selecciona **"Create new user"**

3. **Completar el formulario:**
   ```
   Email: admin@digitalstoretrujillo.store
   Password: stake123
   ```

4. **MUY IMPORTANTE - Auto Confirm User:**
   - ✅ **DEBES ACTIVAR** la opción "Auto Confirm User"
   - Si no la activas, el usuario no podrá iniciar sesión

5. **Crear usuario:**
   - Click en **"Create user"**

### 3. Verificar que el usuario se creó correctamente

Después de crear el usuario, verifica:

1. El usuario debe aparecer en la lista de usuarios
2. El estado debe ser **"Confirmed"** (no "Waiting for verification")
3. El email debe ser exactamente: `admin@digitalstoretrujillo.store`

### 4. Probar el Login

1. Ve a: http://localhost:4321/admin/login
2. Ingresa:
   - Email: `admin@digitalstoretrujillo.store`
   - Password: `stake123`
3. Click en "Iniciar Sesión"

Si todo está correcto, deberías ser redirigido a `/admin` (el dashboard).

---

## Problemas Específicos en Móvil 📱

### Error: Las credenciales no funcionan desde el teléfono

Si el login funciona en desktop pero NO en móvil, prueba estas soluciones:

#### Solución 1: Limpiar Caché y Cookies del Navegador Móvil

**Para Chrome/Safari en iOS:**
1. Ve a Configuración → Safari/Chrome
2. Selecciona "Borrar historial y datos del sitio web"
3. Confirma
4. Reinicia el navegador e intenta de nuevo

**Para Chrome en Android:**
1. Abre Chrome
2. Toca los tres puntos (⋮) → Configuración
3. Privacidad y seguridad → Borrar datos de navegación
4. Selecciona "Cookies y datos de sitios" y "Archivos e imágenes en caché"
5. Toca "Borrar datos"
6. Reinicia el navegador e intenta de nuevo

#### Solución 2: Desactivar Ahorro de Datos / Modo Lite

Si usas "Modo Lite" o "Ahorro de datos" en Chrome móvil:
1. Abre Chrome → Configuración
2. Busca "Modo Lite" o "Ahorro de datos"
3. **Desactívalo**
4. Intenta iniciar sesión de nuevo

#### Solución 3: Verificar que Escribes Correctamente el Email

⚠️ **IMPORTANTE**: El autocorrector móvil puede cambiar tu email:

1. Escribe el email letra por letra: `admin@digitalstoretrujillo.store`
2. **NO copies y pegues** desde otro lugar (puede agregar espacios invisibles)
3. Asegúrate de que NO haya espacios antes o después del email
4. El sistema ahora automáticamente limpia espacios, pero verifica manualmente

**Consejo**: Escribe el email sin usar autocorrector:
- Mantén presionada la tecla del teclado para desactivar sugerencias
- Usa el teclado de email (@ debe estar visible)
- Asegúrate de escribir `.store` al final (no `.com`)

#### Solución 4: Intentar con Modo Incógnito / Privado

1. Abre una ventana de incógnito/privado en tu navegador móvil
2. Ve a la página de login
3. Intenta iniciar sesión
4. Si funciona en incógnito, el problema son las cookies/caché

#### Solución 5: Verificar Configuración de Cookies

**En Safari (iOS):**
1. Configuración → Safari
2. Desactiva "Prevenir rastreo entre sitios"
3. Asegúrate de que "Bloquear todas las cookies" esté DESACTIVADO

**En Chrome (Android):**
1. Chrome → Configuración → Configuración del sitio
2. Cookies → Asegúrate de que esté en "Permitir cookies"
3. NO debe estar en "Bloquear cookies de terceros"

#### Solución 6: Actualizar el Navegador Móvil

1. Ve a App Store (iOS) o Play Store (Android)
2. Busca tu navegador (Chrome, Safari, Firefox, etc.)
3. Actualiza a la última versión
4. Reinicia el dispositivo
5. Intenta de nuevo

#### Solución 7: Probar con Otro Navegador Móvil

Si el problema persiste, prueba con:
- **iOS**: Chrome, Firefox, Edge
- **Android**: Firefox, Edge, Samsung Internet

#### Solución 8: Verificar la Conexión a Internet

1. Asegúrate de tener una conexión estable (WiFi o datos móviles)
2. Prueba abrir otros sitios web para verificar conectividad
3. Si estás en WiFi público, puede haber restricciones de firewall
4. Intenta cambiar de WiFi a datos móviles (o viceversa)

#### Solución 9: Revisar la Consola del Navegador Móvil (Avanzado)

Para debugging en móvil:

**En Android (Chrome):**
1. Conecta tu teléfono a la PC con USB
2. En Chrome desktop, ve a `chrome://inspect`
3. Selecciona tu dispositivo
4. Ve al sitio y abre DevTools
5. Mira la consola para ver errores específicos

**En iOS (Safari):**
1. En iPhone: Configuración → Safari → Avanzado → Activar "Inspector web"
2. Conecta el iPhone a Mac
3. En Mac Safari: Desarrollador → [Tu iPhone] → Selecciona la pestaña
4. Revisa la consola para errores

---

## Errores Comunes

### Error: "Invalid login credentials"
**Causas posibles:**
- El usuario no fue creado en Supabase Auth
- El email o contraseña son incorrectos
- El usuario no está confirmado (falta activar "Auto Confirm User")
- Espacios invisibles en el email (común en móvil)
- Autocorrector cambió el email sin que te des cuenta

### Error: "Email not confirmed"
**Solución:**
- Ve a la lista de usuarios en Supabase
- Click en el usuario admin
- Click en "Confirm email"

### Error: "Too many requests"
**Solución:**
- Supabase limita los intentos de login
- Espera 5-10 minutos antes de intentar de nuevo
- Si persiste, limpia cookies y caché

---

## Alternativa: Crear usuario con Supabase CLI

Si prefieres usar la línea de comandos:

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Login a Supabase
supabase login

# Crear usuario (requiere configuración adicional)
# Nota: Es más fácil usar el dashboard
```

---

## Verificación Final

Una vez creado el usuario, puedes verificar que funciona:

1. **Probar login** en http://localhost:4321/admin/login
2. **Verificar redirección** a `/admin`
3. **Comprobar que aparece tu email** en el sidebar del dashboard
4. **Probar logout** y volver a iniciar sesión

---

## Capturas de Pantalla de Referencia

### Cómo crear el usuario en Supabase:

1. **Ir a Authentication → Users**
2. **Click en "Add user"**
3. **Seleccionar "Create new user"**
4. **Completar formulario:**
   - Email: admin@digitalstoretrujillo.store
   - Password: stake123
   - ✅ Auto Confirm User: ACTIVADO
5. **Click "Create user"**

---

## ¿Necesitas ayuda?

Si sigues teniendo problemas:

1. Verifica que las variables de entorno en `.env` sean correctas
2. Asegúrate de que el proyecto de Supabase esté activo
3. Revisa la consola del navegador para más detalles del error
4. Verifica que ejecutaste el script `admin-auth.sql`
5. **Si estás en móvil**, prueba primero desde una computadora para verificar que las credenciales son correctas
6. Contacta al soporte si el problema persiste después de intentar todas las soluciones

