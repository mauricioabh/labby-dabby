# Onboarding Init CI/CD (GitHub)

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.
2. Lee `/docs/TECH_STACK.md`.
3. Lee `/docs/TESTING.md` (para confirmar Vitest/Playwright si aplica).

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Workflows ejecutan comandos en raíz con `npm run ...`.
  - Para web: usar `npm run ... --workspace=apps/web`.
- **Standalone**
  - Workflows ejecutan `npm run ...` en raíz.

---

## 1) Changelogen

Instalar:

- Monorepo: `npm install -D changelogen`
- Standalone: `npm install -D changelogen`

Agregar scripts en `package.json` (raíz):

- `"release": "changelogen --release"`
- `"changelog": "changelogen"`

---

## 2) GitHub Actions workflows

Crear `.github/workflows/ci.yml` con:

- **Triggers**: `push` y `pull_request` a `main` y `dev`
- **Jobs (orden)**: `typecheck` → `lint` → `build` → `vitest` (si aplica)
- **Node.js**: 20
- **Cache**: npm

Si Playwright fue confirmado, crear `.github/workflows/e2e.yml` con:

- **Trigger**: `pull_request` a `main`
- **Job**: instalar browsers → correr Playwright

Crear `.github/workflows/release.yml` con:

- **Trigger**: push de tags `v*.*.*`
- **Job**: generar changelog → crear GitHub Release automáticamente

---

## 3) Dependabot + templates

Crear `.github/dependabot.yml`:

- Revisión semanal de npm dependencies
- Revisión semanal de `github-actions`

Crear `.github/pull_request_template.md` con:

- ¿Qué cambia este PR?
- ¿Cómo probarlo?
- Checklist:
  - typecheck
  - lint
  - tests
  - env vars documentadas
  - no console.logs

Crear issue templates:

- `.github/ISSUE_TEMPLATE/bug_report.md`
  - Descripción del bug
  - Pasos para reproducirlo
  - Comportamiento esperado
  - Screenshots
- `.github/ISSUE_TEMPLATE/feature_request.md`
  - Descripción de la feature
  - Problema que resuelve
  - Solución propuesta

---

## 4) CodeRabbit

Crear `.coderabbit.yml` en la raíz:

```yml
language: es
reviews:
  auto_review: true
  drafts: false
tone_instructions: concise
```

---

## 5) Docs legales y changelog

Crear en la raíz:

- `CHANGELOG.md` (estructura inicial)
- `SECURITY.md`
- `LICENSE` (MIT)

---

## Marcar progreso

Al completar este command, en `TODO.md` marca:

- [x] Onboarding: init-ci completado

