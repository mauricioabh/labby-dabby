# Labby-dabby — Variables de entorno

## apps/web

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | Connection string de NeonDB |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Sí | Clerk publishable key |
| `CLERK_SECRET_KEY` | Sí | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Sí | Para webhook de sync users |
| `UPLOADTHING_TOKEN` | Sí | Uploadthing API token |
| `UPLOADTHING_APP_ID` | Sí | Uploadthing app ID |
| `RESEND_API_KEY` | Sí | Resend para emails |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Sí | Gemini API |
| `NEXT_PUBLIC_APP_URL` | Sí | URL base (ej. https://app.labbydabby.com) |
| `SENTRY_DSN` | No | Monitoreo de errores |
| `UPSTASH_REDIS_REST_URL` | No | Rate limiting (si se usa) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting (si se usa) |

## apps/mobile

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Sí | Misma key que web |
| `EXPO_PUBLIC_API_URL` | Sí | URL de la web app (ej. https://app.labbydabby.com) |

## Ejemplo .env.local (web)

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
UPLOADTHING_TOKEN=...
UPLOADTHING_APP_ID=...
RESEND_API_KEY=re_...
GOOGLE_GENERATIVE_AI_API_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Ejemplo .env.local (mobile)

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_API_URL=http://localhost:3000
```
