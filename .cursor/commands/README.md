# Commands (uso local en proyecto)

Estos **commands** son copia de los que estaban en **global** (`~/.cursor/commands` o `C:\Users\<user>\.cursor\commands`). Para usarlos como **comandos locales** en un proyecto:

1. Copia el contenido de esta carpeta `commands/` a **`.cursor/commands/`** del proyecto destino.
2. Los comandos aparecerán en Cursor solo cuando abras ese proyecto.

Ventaja de tenerlos locales: el proyecto queda autocontenido y cualquier persona que clone el repo puede usar los mismos comandos sin depender de tu configuración global.

Contenido actual:
- `db-migration.md` — Gestionar migraciones Drizzle/Neon con seguridad.
- `setup-github-vercel.md` — Configurar Git, GitHub (repo vacío, ramas, protección) y Vercel desde cero.
- `fix.md` — Proceso de diagnóstico y fix de bugs.
- `init-features.md` — Generar el proyecto completo (landing + features, web + mobile) según el plan. Se ejecuta después de onboarding-smart, design-system y design-assets.
- `new-feature.md` — Implementar features siguiendo convenciones del proyecto.
- `onboarding-smart.md` — Onboarding por análisis e inferencia (pocas preguntas).
- `onboarding-steps.md` — Onboarding por preguntas paso a paso.
- `refactor.md` — Refactor con plan y aprobación.
