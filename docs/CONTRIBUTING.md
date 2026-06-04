# Contribuir a Labby-dabby

Para el flujo completo desde cero hasta producción, ver [DEVELOPMENT_FLOW.md](./DEVELOPMENT_FLOW.md).

## Ramas

- `main` → producción, nunca commitear directo
- `dev` → desarrollo activo
- `feat/nombre-feature` → features nuevos
- `fix/nombre-bug` → correcciones

## Commits (Conventional Commits)

```
tipo(scope): descripción corta en minúsculas
```

Tipos: `feat`, `fix`, `refactor`, `style`, `db`, `chore`, `docs`

Ejemplos:
- `feat(lab-reports): add PDF upload with Gemini analysis`
- `fix(auth): correct redirect after sign-in`
- `db(schema): add report_shares table`

## Cómo correr el proyecto

### Prerrequisitos

- Node.js 20+
- npm 10+ (o compatible)

### Instalación

```bash
npm install
```

### Web

```bash
npm run web
```

### Mobile

```bash
npm run mobile
```

### Base de datos

- `DATABASE_URL` debe estar definida (p. ej. en `apps/web/.env.local`). El `drizzle.config.ts` carga dotenv para que la CLI tenga acceso.
- Si `db:migrate` falla con `type "X" does not exist`, añadir al inicio del archivo `.sql` de la migración los `CREATE TYPE "X" AS ENUM (...)` correspondientes a los `pgEnum` del schema.

```bash
npm run db:generate --workspace=web   # Generar migraciones
npm run db:migrate --workspace=web   # Aplicar migraciones
```

## Tests

```bash
npm test                    # Unit tests
npm run test:e2e --workspace=web   # E2E
```

## Proceso de PR

Flujo completo documentado en [DEVELOPMENT_FLOW.md](./DEVELOPMENT_FLOW.md).

1. Trabajar en `dev` (o rama `feat/*` desde `dev`)
2. Commitear con Conventional Commits y `git push origin dev`
3. Abrir PR **`dev` → `main`** cuando el cambio esté listo para producción
4. Revisión de código y merge en GitHub
5. Vercel despliega **Production** automáticamente al mergear en `main`

Opcional para features grandes: PR `feat/*` → `dev` primero; cuando `dev` esté estable, PR `dev` → `main`.

## Checklist antes de PR

- [ ] `npm run typecheck` pasa
- [ ] `npm run lint` pasa
- [ ] Tests relevantes pasan
- [ ] Variables de entorno documentadas en ENV.md si son nuevas
- [ ] Sin `console.log` en producción
