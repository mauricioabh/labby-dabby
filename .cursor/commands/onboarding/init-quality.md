# Onboarding Init Quality

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Quality tooling va en la **raíz** (workspace) para cubrir todo el repo.
  - Comandos: usar `npm run ...` o `npm install ...` en raíz.
- **Standalone**
  - Tooling va en la raíz del repo.
  - Comandos: usar `npm run ...` o `npm install ...`.

---

## 1) Commitlint

Instalar:

- Monorepo: `npm install -D @commitlint/cli @commitlint/config-conventional`
- Standalone: `npm install -D @commitlint/cli @commitlint/config-conventional`

Crear `commitlint.config.js`:

```js
module.exports = { extends: ['@commitlint/config-conventional'] }
```

---

## 2) Husky + lint-staged

Instalar:

- Monorepo: `npm install -D husky lint-staged`
- Standalone: `npm install -D husky lint-staged`

Inicializar Husky:

- Monorepo: `npx husky init`
- Standalone: `npx husky init`

Crear/asegurar hooks:

- `.husky/pre-commit` debe ejecutar: `npm run lint-staged`
- `.husky/commit-msg` debe contener:
  - `npx --no -- commitlint --edit $1`

---

## 3) Configurar lint-staged en package.json (raíz)

Agregar en el `package.json` (raíz del repo):

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

> Nota: si tu monorepo tiene ESLint/Prettier por app, ajusta los comandos para que apunten al binario correcto, pero mantén `lint-staged` centralizado.

---

## Marcar progreso

Al completar este command, en `TODO.md` marca:

- [x] Onboarding: init-quality completado

