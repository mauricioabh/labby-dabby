# Onboarding Init (orquestador)

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.
2. Lee `/docs/TECH_STACK.md`.

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Web suele vivir en `apps/web/`.
  - Mobile suele vivir en `apps/mobile/`.
  - Comandos: usar `npm run ...` en raíz; para web, `npm run ... --workspace=apps/web`.
- **Standalone** si no existen los indicadores anteriores.
  - Web vive en la raíz.
  - Comandos: usar `npm run ...` sin filtros.

## Ejecución (en orden)

Ejecuta estos commands, uno por uno, sin saltarte pasos:

1. `/onboarding/init-base`
2. `/onboarding/init-quality`
3. `/onboarding/init-monitoring`
4. `/onboarding/init-ci`

## Al finalizar (generar TODO.md en la raíz)

Crea (o actualiza) `TODO.md` en la raíz del repo con una sección **Onboarding (manual)** y deja estos pendientes:

- [ ] Configurar variables de entorno (`/onboarding/setup-env`)
- [ ] Inicializar base de datos (`/onboarding/setup-db`)
- [ ] Conectar servicios externos: Clerk Dashboard, NeonDB, Sentry, Vercel

## Marcar progreso

Cuando completes este orquestador, marca en `TODO.md`:

- [x] Onboarding: init (orquestador) completado

