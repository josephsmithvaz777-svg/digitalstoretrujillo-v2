## Crear Usuario Admin en Supabase

### Paso 1: Ejecutar Script SQL

1. Ve a tu proyecto Supabase: https://supabase.com/dashboard/project/vmbupmwlyfjmxjmenyid
2. Click en **SQL Editor**
3. Crea una **New Query**
4. Copia el contenido de `supabase/admin-auth.sql`
5. Click **Run**

### Paso 2: Crear Usuario Admin

1. En Supabase, ve a **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Ingresa:
   - **Email**: `admin@digitalstoretrujillo.com` (o tu email preferido)
   - **Password**: Crea una contraseña segura
   - **Auto Confirm User**: ✅ Activado
4. Click **Create user**

> [!IMPORTANT]
> Si usas un email diferente, actualiza la función `isAdmin()` en `src/lib/supabase.ts` línea 293

### Paso 3: Probar Login

1. Ve a http://localhost:4321/admin/login
2. Ingresa el email y contraseña que creaste
3. Deberías ser redirigido a `/admin` (aún no existe, lo crearemos ahora)

### Notas

- El usuario admin puede acceder a todas las funciones del dashboard
- Solo este email tendrá acceso administrativo
- Puedes cambiar la contraseña en cualquier momento desde Supabase Auth
