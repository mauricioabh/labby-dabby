# Flujo de desarrollo — Labby-dabby

Este documento define el flujo obligatorio para desarrollar, versionar y desplegar el proyecto.

## Ramas en Git y GitHub

| Rama | Uso | Deploy en Vercel |
|------|-----|------------------|
| `main` | Producción. **No commitear directo.** | Production (deploy automático al mergear) |
| `dev` | Integración diaria. Rama de trabajo habitual. | Preview opcional (según configuración del proyecto) |

Ambas ramas deben existir en el remoto `origin` (GitHub: `mauricioabh/labby-dabby`).

## Flujo diario (resumen)

```
dev → commit → push origin dev → PR dev → main → merge → deploy Production en Vercel
```

## 1. Empezar a trabajar

```bash
git fetch origin
git checkout dev
git pull origin dev
```

Para una feature aislada (opcional):

```bash
git checkout -b feat/nombre-descriptivo dev
# ... desarrollar ...
git push -u origin feat/nombre-descriptivo
# PR feat/* → dev, luego cuando esté listo el release: PR dev → main
```

## 2. Desarrollar y commitear

- Trabajar siempre partiendo de `dev` (o una rama feature desde `dev`).
- Usar [Conventional Commits](./CONTRIBUTING.md#commits-conventional-commits).
- No subir secretos: `.env.local` está en `.gitignore`.

```bash
git add .
git commit -m "feat(scope): descripción breve"
```

## 3. Push a GitHub

```bash
git push origin dev
```

(Si usas rama feature: `git push origin feat/nombre-descriptivo` y abre PR hacia `dev` primero.)

## 4. Pull Request hacia `main`

Cuando el cambio en `dev` esté listo para producción:

```bash
gh pr create --base main --head dev --title "release: descripción del cambio" --body "## Summary
- ...

## Test plan
- [ ] Preview en Vercel OK
- [ ] typecheck / lint locales OK
"
```

Revisar el PR en GitHub, esperar checks de CI si aplica, y mergear (squash o merge commit según convención del equipo).

```bash
gh pr merge <número> --merge
# o desde la UI de GitHub
```

Tras el merge a `main`, **Vercel despliega automáticamente** a Production si el proyecto está ligado al repo y la rama de producción es `main`.

## 5. Mantener `dev` alineada con `main`

Después de mergear `dev` → `main`:

```bash
git checkout dev
git pull origin main   # o merge main en dev si hay hotfixes solo en main
git push origin dev
```

## 6. Variables de entorno

- **Local:** `apps/web/.env.local` y `apps/mobile/.env.local` (ver [ENV.md](./ENV.md)).
- **Vercel:** Settings → Environment Variables. Production usa credenciales de prod; Preview/Development pueden usar las de dev.
- Nunca commitear `.env.local`.

Sincronizar desde CLI (ejemplo, una variable):

```bash
cd apps/web
vercel env add NOMBRE_VAR production
```

## 7. Vercel (monorepo)

- **Repositorio:** GitHub `labby-dabby`
- **Root Directory:** `apps/web`
- **Install:** `npm install` (desde la raíz del monorepo en el dashboard, o `cd ../.. && npm install` en `vercel.json`)
- **Build:** `npm run build --workspace=web` (desde raíz) o el script definido en el proyecto Vercel
- **Production Branch:** `main`

## 8. Onboarding del proyecto (una sola vez)

Orden histórico del repo:

1. Inicializar Git local, ramas `main` y `dev`.
2. Crear repo en GitHub `labby-dabby`, push de ambas ramas.
3. PR `dev` → `main` (bootstrap).
4. Crear proyecto en Vercel, conectar GitHub, subir variables de entorno.
5. Cambio de prueba en `dev` → commit → push → PR → `main` → verificar deploy en Vercel.

Para generar docs y features desde cero con comandos Cursor, ver también el flujo de producto:

```
onboarding-smart → .env.local → design-system → design-assets → init-features → ship
```

## 9. Comandos útiles

```bash
npm install
npm run web                    # dev local web
npm run typecheck
npm run lint
gh pr list
gh pr view <número> --web
vercel env ls
vercel ls                      # deployments
```

## Referencias

- [CONTRIBUTING.md](./CONTRIBUTING.md) — commits, PRs, tests
- [ENV.md](./ENV.md) — variables requeridas
- [TECH_STACK.md](./TECH_STACK.md) — stack y estructura
