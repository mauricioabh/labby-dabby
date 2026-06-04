# Labby-dabby — Stack tecnológico

## Estructura del proyecto (monorepo Turborepo)

```
labby-dabby/
├── apps/
│   ├── web/          # Next.js 16
│   └── mobile/       # Expo
├── packages/
│   ├── types/        # Tipos TypeScript compartidos
│   └── utils/        # Helpers compartidos
├── package.json
└── turbo.json
```

## Stack base (web)

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16 | App Router, Server Components, Turbopack por defecto |
| TypeScript | 5.x | Tipado estricto |
| Tailwind CSS | 3.x | Estilos |
| shadcn/ui | latest | Componentes UI |
| Zustand | 4.x | Estado cliente |
| React Query | 5.x | Fetching y cache |
| Zod | 3.x (pin) | Validación; en este proyecto se mantiene 3.x |
| React Hook Form | 7.x | Formularios |
| Clerk | latest | Auth (Google + email/password) |
| NeonDB | serverless | PostgreSQL |
| Drizzle ORM | latest | ORM |
| Vercel | - | Deployment |

## Stack base (mobile)

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Expo | SDK 52+ | Runtime React Native |
| Expo Router | 4.x | Navegación file-based |
| NativeWind | 4.x | Tailwind en RN |
| @clerk/expo | latest | Auth |
| React Query | 5.x | Fetching |
| Zustand | 4.x | Estado |
| Zod | 3.x | Validación |
| React Hook Form | 7.x | Formularios |

## Stack extendido

| Librería | Uso |
|----------|-----|
| @google/generative-ai | Integración Gemini para extracción y análisis |
| Uploadthing | Subida de PDFs |
| Resend | Envío de emails |
| pdf-parse | Extracción de texto de PDFs en servidor |
| Recharts o Tremor | Gráficas del dashboard |
| Upstash Ratelimit | Rate limiting en endpoints |
| @t3-oss/env-nextjs | Validación de env vars |
| @sentry/nextjs | Monitoreo de errores |
| @vercel/analytics | Analytics |
| @vercel/speed-insights | Performance |

## Configuraciones clave

### Clerk

- Google OAuth habilitado
- Email/Password habilitado
- Webhook para sync a `users`
- Rutas públicas: `/`, `/sign-in`, `/sign-up`, `/share/[token]`, `/api/webhooks/*`

### NeonDB + Drizzle

- `drizzle-kit` para migraciones
- `@neondatabase/serverless` para driver
- Schema en `apps/web/src/db/schema.ts`
- RLS habilitado en tablas sensibles
- **drizzle.config.ts**: cargar dotenv (`.env` y `.env.local`) al inicio para que `db:migrate` y `db:generate` tengan `DATABASE_URL` al ejecutarse por CLI (Next.js no carga env en esos comandos). Incluir `dotenv` como devDependency en el app web.
- **Migraciones con enums**: tras `db:generate`, si el SQL generado usa tipos enum en tablas, comprobar que existan los `CREATE TYPE "nombre" AS ENUM (...)` al inicio del archivo; si faltan, añadirlos a mano para evitar `type "nombre" does not exist`.

### Vercel

- `apps/web` como proyecto
- Variables de entorno desde dashboard
- Preview deployments en PRs
