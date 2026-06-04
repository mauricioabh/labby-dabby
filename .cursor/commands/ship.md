# Ship Command

## Rol
Eres un ingeniero de software senior. Tu misión es tomar el trabajo
completado en el chat actual y subirlo a GitHub siguiendo todas
las convenciones del proyecto.

## Contexto obligatorio (leer antes de actuar)
- Lee `/.cursor/rules/main.mdc` para convenciones del proyecto
- Lee `/.cursor/rules/Convenciones-de-Git.mdc` para formato de ramas y commits

## Pre-requisito
Si el repo no está configurado (no existe remote origin o ramas main/dev en GitHub), ejecutar primero /setup-github-vercel.

## Proceso

### Paso 1 — Analizar cambios
- Ejecutar git status para ver archivos modificados
- Ejecutar git diff para entender qué cambió
- Inferir el tipo de cambio: feat, fix, refactor, style, db, etc.
- Inferir el scope según los archivos modificados

### Paso 2 — Crear rama
Crear rama siguiendo las convenciones del proyecto:
- feat/nombre-descriptivo-en-kebab-case
- fix/nombre-del-bug
- refactor/nombre-del-modulo
- db/nombre-del-cambio

Usar el MCP de GitHub para crear la rama:
- Base: dev (nunca main directamente). Si dev no existe, crearla desde main primero.
- Nombre inferido del cambio realizado

### Paso 3 — Verificaciones antes del commit
Ejecutar en orden y detener si algo falla:
- `npm run typecheck`
- `npm run lint`
- `npm run test` (si existe el script)

Si algo falla:
- Mostrar el error
- Intentar corregirlo automáticamente
- Si no se puede corregir automáticamente, reportar al usuario
  y esperar instrucciones antes de continuar

### Paso 4 — Commit
Crear commit siguiendo Conventional Commits (ver Convenciones-de-Git.mdc):
- Formato: tipo(scope): descripción corta en minúsculas
- Tipos: feat, fix, refactor, style, db, chore, docs
- Ejemplos:
  feat(auth): add google oauth sign in
  fix(dashboard): correct revenue calculation
  db(schema): add orders table
  refactor(sidebar): extract collapsible logic
- Husky y Commitlint validarán el mensaje

### Paso 5 — Push
- Push de la rama al remote origin
- Usar MCP de GitHub si está disponible

### Paso 6 — Abrir PR
Usar MCP de GitHub para crear el PR con:
- Base: dev
- Título: mismo mensaje del commit
- Descripción generada automáticamente con:
  - Qué cambió y por qué
  - Cómo probarlo
  - Checklist: typecheck ✅, lint ✅, tests ✅

## Al terminar
Mostrar:
- Nombre de la rama creada
- Mensaje del commit
- Link al PR abierto en GitHub
