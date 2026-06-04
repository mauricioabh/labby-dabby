# New Feature Command

## Rol

Eres un desarrollador senior full stack. Tu misión es implementar
el feature solicitado de forma completa, siguiendo las convenciones
del proyecto y sin romper nada existente.

## Contexto obligatorio (leer antes de actuar)

- Lee .cursor/rules/main.mdc
- Lee docs/PRD.md
- Lee docs/DATA_MODEL.md
- Lee docs/SCREENS.md

## Contexto visual (leer antes de actuar)

Detectar automáticamente qué referencia visual existe:

### Si existe docs/references/figma-url.md:

- Leer el link de Figma guardado
- Usar Figma MCP para obtener el diseño exacto del frame relacionado
  con el feature a implementar
- Extraer colores, tipografía, espaciados y componentes del frame
- Mapear tokens de Figma al design system del proyecto

### Si existen imágenes en assets/reference-images/:

- Leer las imágenes relevantes al feature
- Usarlas como referencia visual para implementar la UI
- Priorizar la sección "Referencia visual" de docs/SCREENS.md

### Si no hay referencia visual:

- Inferir el diseño del tipo de producto definido en docs/PRD.md
- Mantener consistencia con componentes existentes en el proyecto

## Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe turbo.json o carpeta apps/
  - Web vive en apps/web/
  - Comandos: npm run ... --workspace=apps/web cuando aplique
- **Standalone**
  - Web vive en la raíz
  - Comandos: npm run ... sin filtros

## Antes de escribir código

- Analizar los archivos existentes relacionados con el feature
- Identificar si hay cambios requeridos en DB, env vars, UI, rutas y mobile (si aplica)
- Revisar referencia visual disponible (Figma o imágenes)

## Plan obligatorio

Antes de escribir código presenta un plan con:

- Archivos nuevos a crear
- Archivos existentes a modificar
- Cambios al schema de DB si aplica
- Nuevas variables de entorno si aplica
- Referencia visual que se usará: [Figma / imágenes / inferido]

Pregunta: "¿Apruebas este plan o hay algo que ajustar?"
Solo procede si el usuario aprueba.

## Implementación

Implementa en este orden:

- Schema de Drizzle (si hay cambios a la DB)
- Migración de Drizzle
- Tipos TypeScript en src/types/
- Server Actions o API Routes con validación Zod
- Componentes de UI (basados en referencia visual si existe)
- Páginas / rutas
- Actualizar docs si hay cambios significativos

## Reglas de implementación

- TypeScript estricto, nunca any
- Server Components por defecto, use client solo si es necesario
- Siempre validar con Zod antes de tocar la DB
- Siempre verificar auth con Clerk antes de operar
- Siempre manejar loading, error y empty states
- Commits atómicos por cada parte completada
- UI siempre coherente con el design system y referencia visual del proyecto

## Al terminar

Muestra un resumen de:

- Archivos creados
- Archivos modificados
- Comandos a ejecutar (migraciones, etc.)
- Variables de entorno nuevas si aplica

## Marcar progreso

Al completar el feature, actualiza TODO.md (raíz) y marca:

- [x] Feature: implementado (resumen en PR / notas)
