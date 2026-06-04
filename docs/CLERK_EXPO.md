# Clerk en la app Expo (mobile)

La app móvil usa **Clerk** (misma aplicación que la web) para iniciar sesión con email/contraseña y Google OAuth.

## Configuración en Clerk Dashboard

### 1. Native applications (Native API)

La opción **Native applications** no siempre aparece en el sidebar. Opciones para acceder:

- **URL directa**: [dashboard.clerk.com/~/native-applications](https://dashboard.clerk.com/~/native-applications)
- **Búsqueda**: En el Dashboard, usa **Ctrl+K** (o Cmd+K en Mac) y busca "native" o "Native applications".

En esa página:

1. **Activa "Native API"** para que la app Expo pueda autenticarse.
2. En **Allowlist for mobile SSO redirect**, añade las URLs de callback de OAuth:
   - `labby-dabby://sso-callback` (scheme de la app)
   - En desarrollo con Expo Go: `exp://192.168.x.x:8081/--/sso-callback` (o la que genere `expo-auth-session`)

### 2. Google OAuth (Social connections)

Para el botón "Continuar con Google" en sign-in y sign-up:

1. Ve a [SSO connections](https://dashboard.clerk.com/~/user-authentication/sso-connections).
2. Activa **Google** → **Add connection** → **For all users**.
3. En desarrollo, Clerk usa credenciales compartidas; en producción necesitas tus propias credenciales OAuth de Google.

## Variables en la app móvil

En `apps/mobile/` crea o edita `.env.local`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:3000
```

- **EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY**: La misma Publishable Key que usas en la web.
- **EXPO_PUBLIC_API_URL**: URL del backend Next.js (localhost en desarrollo, o tu deploy en Vercel).
