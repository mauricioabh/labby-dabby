# Setup GitHub & Vercel Command

## Rol
Eres un DevOps engineer senior. Tu misión es configurar el versionado
de código y el pipeline de deploy del proyecto desde cero.

## Contexto obligatorio (leer antes de actuar)
- Lee .cursor/rules/main.mdc para obtener el nombre del proyecto
- Lee docs/TECH_STACK.md para entender el stack y estructura
- Lee docs/ENV.md para conocer todas las variables de entorno necesarias

## Detectar estado actual
Antes de ejecutar cualquier paso verificar:
- ¿Existe .git en la raíz? → si sí, saltar Paso 1
- ¿Existe remote origin? → si sí, saltar Pasos 2 y 3
- ¿Existe rama dev en GitHub? → si sí, saltar Paso 4

---

## Paso 1 — Inicializar Git local (si no existe)
- git init en la raíz del proyecto
- Verificar que .gitignore existe y contiene:
  node_modules/
  .env.local
  .env.*.local
  .env.production
  *.pem
  *.key
  .cursor/commands/
  .cursor/skills/
  .cursor/rules/code-conventions.md
  .cursor/rules/git-conventions.md
  .turbo/
  dist/
  .next/
  apps/mobile/.expo/
- Si falta algo en .gitignore, agregarlo

## Paso 2 — Crear repo vacío en GitHub via MCP
- Nombre: nombre del proyecto en kebab-case (leer de main.mdc)
- Visibilidad: public
- Sin README, sin .gitignore, sin licencia
  (el proyecto ya los tiene, el repo se crea completamente vacío)
- Conectar local con el repo remoto:
  git remote add origin https://github.com/[usuario]/[nombre-repo].git

## Paso 3 — Crear ramas vacías en GitHub
- Crear rama main vacía en GitHub via MCP
- Crear rama dev vacía en GitHub via MCP
- NO hacer ningún push de código todavía
  (el primer push lo hará /ship cuando el código esté listo)

## Paso 4 — Protección de ramas via MCP de GitHub

### Reglas para main:
- Require pull request before merging
- Require status checks to pass: ci
- Require branches to be up to date before merging
- No allow direct pushes
- Include administrators

### Reglas para dev:
- Require pull request before merging
- Require status checks to pass: ci
- No allow direct pushes

## Paso 5 — Instrucciones para conectar Vercel
El agente NO puede conectar Vercel automáticamente ya que requiere
autenticación via UI. Mostrar al usuario estas instrucciones:

"Para conectar Vercel (el repo puede estar vacío, no importa):
1. Ve a vercel.com/new
2. Import Git Repository → selecciona [nombre-repo]
3. Configura:
   - Framework Preset: Next.js
   - Root Directory: apps/web (monorepo) o ./ (standalone)
   - Build Command: npm run build --workspace=web (monorepo)
                    npm run build (standalone)
   - Install Command: npm install
4. Click Deploy
5. Vercel quedará conectado y esperando el primer push.
   Cuando ejecutes /ship por primera vez, Vercel detectará
   el código y hará el primer deploy automáticamente.

Vercel creará automáticamente estos ambientes:
- Production → tuapp.vercel.app (al mergear a main)
- Preview    → tuapp-abc123.vercel.app (en cada PR)
- Staging    → tuapp-dev.vercel.app (al mergear a dev)"

## Paso 6 — Instrucciones para variables de entorno en Vercel
Mostrar al usuario estas instrucciones:

"Configura las variables de entorno por ambiente en Vercel
ANTES del primer deploy para evitar errores.
Ve a vercel.com → tu proyecto → Settings → Environment Variables

### Recomendación de servicios por ambiente:

NeonDB — crear dos bases de datos:
- [nombre-proyecto]-prod → solo para Production
- [nombre-proyecto]-dev  → para Preview y Development

Clerk — crear dos aplicaciones:
- [nombre-proyecto]-prod → solo para Production
- [nombre-proyecto]-dev  → para Preview y Development

### Variables a configurar por ambiente (ver docs/ENV.md):

Production (main → tuapp.vercel.app):
- Credenciales de servicios de producción
- NeonDB prod, Clerk prod, Sentry prod

Preview (PRs → tuapp-abc123.vercel.app):
- Credenciales de servicios de desarrollo
- NeonDB dev, Clerk dev, Sentry dev

Development (local → localhost:3000):
- Estas van en tu .env.local, NO en Vercel"

## Paso 7 — Verificar y mostrar resumen
Al terminar mostrar:
- ✅ Git inicializado localmente
- ✅ Repo vacío creado: [URL del repo en GitHub]
- ✅ Ramas main y dev creadas en GitHub
- ✅ Protección de ramas activa en main y dev
- ⏳ Vercel: pendiente de configuración manual (ver instrucciones arriba)
- ⏳ Variables de entorno: pendiente de configuración por ambiente en Vercel
- 📌 Primer push: ejecuta /ship cuando el código esté listo
