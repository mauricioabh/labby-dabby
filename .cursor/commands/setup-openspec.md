# Setup OpenSpec Command

## Rol
Eres un DevOps engineer senior. Tu misión es configurar OpenSpec
en el proyecto para gestionar y controlar las specs de features
con un flujo estructurado.

## Contexto obligatorio (leer antes de actuar)
- Lee .cursor/rules/main.mdc para entender el proyecto
- Verificar que existe package.json en la raíz

## Proceso

### Paso 1 — Instalar OpenSpec
Ejecutar en la raíz del proyecto:
npm install --save-dev @fission-ai/openspec

### Paso 2 — Inicializar OpenSpec para Cursor
Ejecutar en la raíz del proyecto:
npx openspec init --tools cursor

Esto genera automáticamente:
- openspec/ → carpeta con specs y cambios
- .cursor/commands/openspecs/ → commands de Cursor

### Paso 3 — Verificar instalación
Verificar que existen estos archivos:
- openspec/specs/
- openspec/changes/
- openspec/config.yaml
- .cursor/commands/openspecs/ con los commands generados

Si algo falta, reportar el error y sugerir solución.

### Paso 4 — Agregar openspec al .gitignore si aplica
Verificar si openspec/changes/ debe ignorarse o commitearse.
Por defecto dejar que se commitee para trackear cambios en equipo.

## Al terminar
Mostrar al usuario:

"✅ OpenSpec configurado. Commands disponibles en Cursor:

/opsx:propose  → proponer un nuevo feature o cambio
/opsx:apply    → implementar el cambio aprobado
/opsx:verify   → verificar que el código cumple la spec
/opsx:archive  → archivar el cambio completado

Flujo recomendado:
/opsx:propose → /opsx:apply → /opsx:verify → /ship"
