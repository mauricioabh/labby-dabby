# Onboarding Init Monitoring

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.
2. Lee `/docs/TECH_STACK.md`.

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Instalar/configurar en `apps/web/` usando `npm install ... --workspace=apps/web`.
- **Standalone**
  - Instalar/configurar en raíz usando `npm install ...`.

---

## 1) Sentry (Next.js)

Instalar:

- Monorepo: `npm install @sentry/nextjs --workspace=apps/web`
- Standalone: `npm install @sentry/nextjs`

Ejecutar wizard:

- Monorepo: `npx @sentry/wizard@latest -i nextjs` (ejecutar desde `apps/web/`)
- Standalone: `npx @sentry/wizard@latest -i nextjs`

Actualizar env files:

- Agregar `SENTRY_DSN=` en `.env.local` y `.env.example` (web).

---

## 2) Vercel Analytics + Speed Insights

Instalar:

- Monorepo: `npm install @vercel/analytics @vercel/speed-insights --workspace=apps/web`
- Standalone: `npm install @vercel/analytics @vercel/speed-insights`

Agregar en `src/app/layout.tsx` (web):

- `<Analytics />`
- `<SpeedInsights />`

Reglas:

- Evitar romper Server Components (importar como indica la librería para App Router).
- Mantener layout estable (no envolver con providers innecesarios).

---

## Marcar progreso

Al completar este command, en `TODO.md` marca:

- [x] Onboarding: init-monitoring completado

