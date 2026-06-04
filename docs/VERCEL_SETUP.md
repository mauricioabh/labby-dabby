# Vercel — monorepo Labby-dabby

## Build local (verificar antes de deploy)

Desde la raíz del repositorio:

```bash
npm install
npm run build --workspace=web
```

Si termina sin errores, el código compila. El artefacto queda en `apps/web/.next`.

## Configuración obligatoria en Vercel

1. Abre el proyecto [labby-dabby](https://vercel.com/mauricioabhs-projects/labby-dabby) en Vercel.
2. **Settings → General → Root Directory** → escribe `apps/web` → **Save**.
3. **Settings → General → Build & Development Settings**
   - Framework Preset: **Next.js**
   - Deja que `apps/web/vercel.json` defina install/build, o usa:
     - Install Command: `cd ../.. && npm install`
     - Build Command: `cd ../.. && npm run build --workspace=web`
4. **Settings → Git → Production Branch:** `main`
5. Variables de entorno: ver [ENV.md](./ENV.md) (Production y Preview).

## Por qué falla `.next was not found`

Vercel espera `.next` **dentro del Root Directory del proyecto**. En este monorepo, Next.js escribe en `apps/web/.next`. Si el Root Directory es la raíz del repo (`.`), el build puede completarse pero Vercel no encuentra `/vercel/path0/.next`.

**Solución:** Root Directory = `apps/web` (no copies `.next` a la raíz).

## Redeploy

Tras cambiar Root Directory, haz **Redeploy** del último deployment de `main` o mergea un PR `dev` → `main`.
