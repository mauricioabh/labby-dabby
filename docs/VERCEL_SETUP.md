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
   - **No** uses `cp -r apps/web/.next .next` en el Build Command (provoca errores como `ENOENT ... client-only`).
   - Install Command: `cd ../.. && npm install`
   - Build Command: `cd ../.. && npm run build --workspace=web`
   - (O deja vacío para que aplique `apps/web/vercel.json`.)
4. **Settings → Git → Production Branch:** `main`
5. Variables de entorno: ver [ENV.md](./ENV.md) (Production y Preview).

`apps/web/next.config.ts` define `outputFileTracingRoot` hacia la raíz del monorepo para que el empaquetado encuentre dependencias hoisteadas (`client-only`, etc.).

## Por qué falla `.next was not found`

Vercel espera `.next` **dentro del Root Directory del proyecto**. En este monorepo, Next.js escribe en `apps/web/.next`. Si el Root Directory es la raíz del repo (`.`), el build puede completarse pero Vercel no encuentra `/vercel/path0/.next`.

**Solución:** Root Directory = `apps/web` (no copies `.next` a la raíz).

## Redeploy

Tras cambiar Root Directory, haz **Redeploy** del último deployment de `main` o mergea un PR `dev` → `main`.
