# Onboarding Init Base

## Contexto obligatorio (leer antes de actuar)

- Lee `/.cursor/rules/main.mdc`
- Lee `/docs/TECH_STACK.md`
- Lee `/docs/DATA_MODEL.md` (para las entidades del schema inicial)

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`
  - Target principal: `apps/web/`
  - Comandos: usar `npm run ...` y `npm run ... --workspace=web` cuando aplique
- **Standalone**
  - Target principal: raíz del repo
  - Comandos: usar `npm run ...` sin filtros

> Si detectas que el repo ya tiene `apps/web/` con Next.js 16 (o 15+), NO re-inicialices.
> En su lugar verifica dependencias y crea archivos faltantes.

---

## Inicializar Next.js 16 + TypeScript + Tailwind (solo si NO existe aún)

### Monorepo

- Si `apps/web/` no existe o no es un proyecto Next:
  `npx create-next-app@latest apps/web --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`

### Standalone

- Si no existe un `package.json` con Next:
  `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`

---

## Instalar stack base

Instala en `apps/web/` si monorepo, en raíz si standalone:

### Dependencias principales

- Monorepo: `npm install zustand @tanstack/react-query zod react-hook-form -w web`
- Standalone: `npm install zustand @tanstack/react-query zod react-hook-form`

### Clerk

- Monorepo: `npm install @clerk/nextjs -w web`
- Standalone: `npm install @clerk/nextjs`

### Drizzle + Neon

- Monorepo: `npm install drizzle-orm @neondatabase/serverless -w web && npm install -D drizzle-kit -w web`
- Standalone: `npm install drizzle-orm @neondatabase/serverless && npm install -D drizzle-kit`

### Validación de env vars

- Monorepo: `npm install @t3-oss/env-nextjs zod -w web`
- Standalone: `npm install @t3-oss/env-nextjs zod`

---

## Crear estructura de carpetas

### Carpeta de imágenes de referencia (raíz del repo)

Crear `assets/reference-images/` con README.md explicando: carpeta para mockups/screenshots pegados durante el onboarding; el usuario debe guardarlos aquí; init-features los usa como base visual al generar las pantallas.

### Carpetas web

Crear si faltan dentro del proyecto web:

- `src/app`
- `src/components/ui`
- `src/components/layout`
- `src/lib`
- `src/hooks`
- `src/types`
- `src/services`
- `src/db`

### Tests opcionales (según main.mdc)

- Si main.mdc confirma Vitest: crear `src/__tests__/`
- Si main.mdc confirma Playwright: crear `e2e/`

---

## Design System compartido (solo si es monorepo)

Crear `packages/ui/` con tokens de diseño compartidos entre web y mobile.

**Importante:** En este proyecto los tokens viven en un **solo archivo** `packages/ui/tokens/index.ts` (colors, typography y spacing definidos e exportados ahí). Evitar imports relativos entre archivos dentro del paquete para que Turbopack (Next 16) resuelva correctamente.

### packages/ui/tokens/index.ts

Definir y exportar en un único archivo: `colors`, `typography`, `spacing` y sus tipos (`Colors`, `Typography`, `Spacing`). Incluir al menos: primary, primaryForeground, secondary, background, foreground, muted, destructive, border; fontFamily (sans, mono), fontSize; spacing (xs, sm, md, lg, xl, 2xl).

### packages/ui/assets/README.md

Crear README explicando los assets necesarios:

- `icon.png` → 1024x1024, ícono principal (Expo + base para favicon)
- `adaptive-icon.png` → 1024x1024 para Android
- `splash-icon.png` → imagen de splash screen
- `favicon.ico` → generado desde icon.png para web
- `logo.svg` → logo vectorial usado en web y mobile
- Herramientas sugeridas: appicon.co, realfavicongenerator.net

### Configurar Tailwind en apps/web para consumir tokens

Actualizar `tailwind.config.ts`:

```typescript
import { colors, typography, spacing } from '@labby-dabby/ui';
export default {
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      spacing,
    },
  },
};
```

### Instalar fuentes en apps/web

- `npm install @next/font -w web`
- Configurar Inter en `src/app/layout.tsx` usando `next/font/google`

### Instalar fuentes en apps/mobile

- `npm install expo-font @expo-google-fonts/inter -w mobile`
- Configurar Inter en `apps/mobile/app/_layout.tsx` con `useFonts`
- Ambas apps deben usar la misma fuente definida en `packages/ui/tokens/index.ts` (typography)

---

## Expo (mobile) — versiones y compatibilidad (obligatorio)

Este repo usa **Expo SDK 54** en `apps/mobile`.

- Al cambiar la versión de `expo`, siempre ejecutar:
  - `npm install`
  - `npx expo install --fix` dentro de `apps/mobile`
- Si `expo start` falla con `TypeError: Body is unusable: Body has already been read`, arrancar con `EXPO_NO_CACHE=1`.
  - Recomendación: setearlo en `apps/mobile/package.json` usando `cross-env EXPO_NO_CACHE=1 expo start`.

### Configurar NativeWind en apps/mobile para consumir tokens

- Importar colors y spacing desde `@labby-dabby/ui`
- Usar para estilos consistentes con la web

---

## Env files + ignores

### Crear .env.local (NO se commitea)

Crear con todas las keys de `main.mdc` y `docs/ENV.md` con valores vacíos.
Nunca inventar variables, usar solo las del proyecto.

### Crear .env.example (sí va al repo)

Mismas keys que .env.local, valores vacíos.

### .cursorignore

Crear/actualizar `/.cursorignore` con:

- `.env.local`
- `.env.*.local`
- `.env.production`
- `*.pem`
- `*.key`

### .gitignore

Asegurar que `.env.local` esté ignorado en `/.gitignore`

---

## Drizzle config

Crear/actualizar `drizzle.config.ts` apuntando a `DATABASE_URL` y al schema en `src/db/schema.ts`.

- Nunca hardcodear credenciales
- Usar `process.env.DATABASE_URL`
- Cargar dotenv al inicio del archivo (`.env` y `.env.local`) y añadir `dotenv` como devDependency en el app web, para que `db:migrate` y `db:generate` tengan `DATABASE_URL` al ejecutarse desde la terminal

---

## Clerk auth: proxy (Next 16) o middleware (Next 15)

- **Next.js 16:** Crear/actualizar `src/proxy.ts` (no `middleware.ts`). Misma lógica con `clerkMiddleware` y `createRouteMatcher`. Turbopack es el bundler por defecto; script `dev`: `next dev`.
- **Next.js 15:** Crear/actualizar `middleware.ts` en raíz o `src/`.

Rutas públicas típicas: `/`, `/sign-in`, `/sign-up`, `/share/(.*)`, `/api/webhooks(.*)`. Privadas: todo lo demás.

---

## Schema inicial (Drizzle)

Crear `src/db/schema.ts` con entidades definidas en `docs/DATA_MODEL.md`.

- TypeScript estricto, sin `any`
- Usar tipos compatibles con Clerk para userId
- Agregar índices y constraints básicos cuando aplique

---

## Configurar shadcn/ui

Inicializar shadcn/ui en el proyecto web.

- Mantener componentes en `src/components/ui/`
- Usar `cn()` para clases condicionales

---

## Crear src/env.ts tipado con Zod

Crear con `@t3-oss/env-nextjs` + `zod` tipando todas las variables documentadas.

- Nunca loggear env vars
- Separar `server` vs `client` para `NEXT_PUBLIC_*`

---

## Vitest (si fue confirmado en main.mdc)

- Monorepo: `npm install -D vitest @vitejs/plugin-react -w web`
- Standalone: `npm install -D vitest @vitejs/plugin-react`
- Crear `vitest.config.ts`
- Agregar script `"test": "vitest"` en package.json del proyecto web
- Crear `src/__tests__/ejemplo.test.ts` de muestra

---

## Playwright (si fue confirmado en main.mdc)

- Monorepo: `npm install -D @playwright/test -w web`
- Standalone: `npm install -D @playwright/test`
- Instalar browsers: `npx playwright install`
- Crear `playwright.config.ts`
- Agregar script `"test:e2e": "playwright test"` en package.json del proyecto web
- Crear `e2e/ejemplo.spec.ts` de muestra

---

## Marcar progreso

Al completar, en `TODO.md` marcar:

- [x] Onboarding: init-base completado
