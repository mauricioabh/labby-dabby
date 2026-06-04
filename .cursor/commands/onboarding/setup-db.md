# Onboarding Setup DB

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.
2. Lee `/docs/ENV.md` (para `DATABASE_URL`).
3. Lee el `package.json` del proyecto web (para scripts `db:*`).

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Web: `apps/web/`
  - Comandos: `npm run ... --workspace=apps/web`
- **Standalone**
  - Web: raíz
  - Comandos: `npm ...`

---

## Paso 0) Confirmación de `DATABASE_URL`

Pregunta al usuario: **“¿Ya configuraste `DATABASE_URL` en `.env.local`?”**

- Si **NO**: detener y decir exactamente: **“Ejecuta /onboarding/setup-env primero”**
- Si **SÍ**: continuar

> Regla: no pidas ni muestres el valor de `DATABASE_URL`.

---

## Paso 1) Generar migraciones

- Monorepo: `npm --filter web db:generate`
- Standalone: `npm db:generate`

## Paso 2) Aplicar migraciones

- Monorepo: `npm run db:migrate --workspace=apps/web`
- Standalone: `npm run db:migrate`

---

## Verificación

- Verificar que las migraciones se aplicaron correctamente (sin errores).
- Mostrar las **tablas creadas** (leyendo el estado del schema/migraciones generadas).

### Si hay errores

Analiza el error y sugiere una solución específica:

- Problema de conexión (host, SSL, DNS)
- Formato de `DATABASE_URL` inválido
- Variables no cargadas (archivo `.env.local` en ruta incorrecta para monorepo)
- Falta de permisos en NeonDB
- **`url: undefined` / DATABASE_URL no definida:** La CLI de drizzle-kit no carga env. Asegurar que `drizzle.config.ts` cargue dotenv al inicio (`.env` y `.env.local`) y que el proyecto tenga `dotenv` como devDependency en el app web.
- **`type "nombre" does not exist` (ej. `chat_role`):** La migración usa un enum que no se creó. Al inicio del `.sql` de la migración debe haber `CREATE TYPE "nombre" AS ENUM (...)` antes de cualquier `CREATE TABLE` que use ese tipo. Revisar el schema por `pgEnum` y añadir los `CREATE TYPE` faltantes.

---

## Marcar progreso

Al completar este command, en `TODO.md` marca:

- [x] Onboarding: setup-db completado

