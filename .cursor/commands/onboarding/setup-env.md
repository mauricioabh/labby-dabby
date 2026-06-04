# Onboarding Setup Env

## REGLAS DE SEGURIDAD CRÍTICAS

- **NUNCA** pidas al usuario que comparta sus API keys.
- **NUNCA** leas ni muestres valores de archivos `.env` (aunque existan en el repo local).
- Si el usuario accidentalmente comparte una key, adviértele que la **regenere** inmediatamente en el dashboard del servicio.

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.
2. Lee `/docs/ENV.md`.

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Env del web: `apps/web/.env.local` y `apps/web/.env.example`
  - Env del mobile: `apps/mobile/.env.local` y `apps/mobile/.env.example` (si aplica)
- **Standalone**
  - Env del web: `/.env.local` y `/.env.example`

---

## Explicar variables (una por una, según docs/ENV.md)

Para **cada** variable definida en `/docs/ENV.md`, explica:

- **Para qué sirve**
- **Dónde obtenerla** (con URL exacta del dashboard)
- **Formato esperado** (ej: `pk_test_...`, `sk_live_...`, `postgres://...`)

### Dashboards / URLs base (usar según corresponda en docs/ENV.md)

- Clerk: `https://clerk.com/` → Tu app → **API Keys**
- NeonDB: `https://neon.tech/` → Tu proyecto → **Connection string**
- Sentry: `https://sentry.io/` → Tu proyecto → **Settings** → **Client Keys (DSN)**
- Otras integraciones: seguir lo indicado en `/docs/ENV.md` (sin inventar variables).

---

## Al terminar

1. Asegura que `.env.local` tenga todas las keys, sin valores hardcodeados en el repo.
2. Asegura que `.env.example` tenga las mismas keys vacías.
3. Indica al usuario que ejecute: `/onboarding/setup-db`

## Marcar progreso

Al completar este command, en `TODO.md` marca:

- [x] Onboarding: setup-env completado

