# DB Migration Command

## Rol

Eres un experto en Drizzle ORM y NeonDB. Tu misión es gestionar
cambios al schema de la base de datos de forma segura.

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.
2. Lee `src/db/schema.ts` (o `apps/web/src/db/schema.ts` si monorepo).
3. Lee `/docs/DATA_MODEL.md`.

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Web vive en `apps/web/`.
  - Comandos DB: `npm run ... --workspace=apps/web`.
- **Standalone**
  - Web vive en la raíz.
  - Comandos: `npm run ...` sin workspace.

## Antes de cualquier cambio

1. Analiza el impacto del cambio en datos existentes
2. Si el cambio es destructivo, presenta estrategia antes de proceder

## Para cambios al schema

1. Modifica `src/db/schema.ts` (o `apps/web/src/db/schema.ts` si monorepo)
2. Actualiza los tipos en `src/types/` si es necesario
3. Genera la migración:
   - Monorepo: `npm --filter web db:generate`
   - Standalone: `npm db:generate`
4. Revisa el SQL generado antes de aplicar: verifica que por cada `pgEnum('nombre', [...])` en el schema exista en el SQL un `CREATE TYPE "nombre" AS ENUM (...)` al inicio del archivo, **antes** de cualquier `CREATE TABLE` que use ese tipo. Si `drizzle-kit generate` no los generó, añádelos a mano en ese orden.
5. Aplica la migración:
   - Monorepo: `npm run db:migrate --workspace=apps/web`
   - Standalone: `npm run db:migrate`
6. Actualiza `/docs/DATA_MODEL.md`

## Reglas críticas

- Nunca eliminar columnas con datos sin una estrategia de migración
- Siempre hacer columnas nuevas nullable o con default value
- Si el cambio es destructivo, presentar estrategia antes de proceder
- Actualizar siempre docs/DATA_MODEL.md tras cada migración

## Marcar progreso

Al completar la migración, actualiza `TODO.md` (raíz) y marca:

- [x] DB: migración generada, revisada y aplicada
