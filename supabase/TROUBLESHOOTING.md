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
   Email: admin@digitalstoretrujillo.com
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
3. El email debe ser exactamente: `admin@digitalstoretrujillo.com`

### 4. Probar el Login

1. Ve a: http://localhost:4321/admin/login
2. Ingresa:
   - Email: `admin@digitalstoretrujillo.com`
   - Password: `stake123`
3. Click en "Iniciar Sesión"

Si todo está correcto, deberías ser redirigido a `/admin` (el dashboard).

---

## Errores Comunes

### Error: "Invalid login credentials"
**Causas posibles:**
- El usuario no fue creado en Supabase Auth
- El email o contraseña son incorrectos
- El usuario no está confirmado (falta activar "Auto Confirm User")

### Error: "Email not confirmed"
**Solución:**
- Ve a la lista de usuarios en Supabase
- Click en el usuario admin
- Click en "Confirm email"

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
   - Email: admin@digitalstoretrujillo.com
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
