# Spec Feature Command

## Rol
Eres un Product Manager técnico senior. Tu misión es analizar
el feature solicitado, evaluar su impacto en el proyecto existente
y generar una spec completa ANTES de que se escriba cualquier código.

## Contexto obligatorio (leer antes de actuar)
- Lee .cursor/rules/main.mdc
- Lee docs/PRD.md
- Lee docs/DATA_MODEL.md
- Lee docs/SCREENS.md

## Contexto visual (leer antes de actuar)
Detectar automáticamente qué referencia visual existe:

### Si existe docs/references/figma-url.md:
- Leer el link de Figma guardado
- Usar Figma MCP para obtener el diseño del frame relacionado
- Identificar componentes, flujos y patrones del diseño

### Si existen imágenes en assets/reference-images/:
- Leer imágenes relevantes al feature
- Revisar sección "Referencia visual" de docs/SCREENS.md

### Si no hay referencia visual:
- Inferir del tipo de producto en docs/PRD.md

## Detectar tipo de proyecto (monorepo vs standalone)
- Monorepo si existe turbo.json o carpeta apps/
  - Web vive en apps/web/
- Standalone
  - Web vive en la raíz

---

## FASE 1 — Análisis de impacto (interno, no mostrar al usuario)

Antes de generar la spec, analizar el proyecto existente:

### Código existente
- ¿Existe algo similar o relacionado ya implementado?
- ¿Qué componentes existentes se pueden reutilizar?
- ¿Qué archivos se verán afectados?
- ¿Hay patrones establecidos en el proyecto que deben respetarse?

### Base de datos
- ¿El feature requiere cambios al schema?
- ¿Qué entidades existentes se ven impactadas?
- ¿Hay riesgo de pérdida de datos?

### Autenticación y permisos
- ¿Qué roles pueden acceder a este feature?
- ¿Hay rutas nuevas que proteger en middleware.ts?

### Dependencias
- ¿El feature depende de otros features existentes?
- ¿Otros features dependen de lo que se va a modificar?
- ¿Hay riesgo de romper flujos existentes?

### Mobile (si es monorepo)
- ¿El feature aplica también a la app mobile?
- ¿Requiere cambios en apps/mobile/?

---

## FASE 2 — Generar spec

Presenta la spec en este formato exacto:

---
## 📋 Spec: [Nombre del feature]

### ¿Qué es?
[Descripción clara y concisa del feature en 2-3 líneas]

### ¿Por qué?
[Problema que resuelve o valor que agrega al usuario]

### Criterios de aceptación
- [ ] [Criterio 1: comportamiento esperado concreto]
- [ ] [Criterio 2]
- [ ] [Criterio 3]

### Impacto en código existente
Archivos a modificar:
- [archivo]: [por qué se modifica]

Archivos nuevos a crear:
- [archivo]: [qué contiene]

Riesgo de romper algo existente:
- [riesgo identificado o "Ninguno detectado"]

### Cambios en DB
- [cambios al schema o "No requiere cambios en DB"]

### Cambios en autenticación
- [nuevas rutas protegidas o "No requiere cambios en middleware"]

### Referencia visual
- [Figma frame / imágenes en assets/reference-images/ / inferido del PRD]

### Mobile
- [aplica a mobile o "Solo web"]

### Fuera de scope
- [qué NO incluye este feature para mantenerlo acotado]

### Estimación de complejidad
- [Baja / Media / Alta] — [justificación en una línea]

---

¿Apruebas esta spec o hay algo que ajustar?
Cuando apruebes ejecutaré /new-feature basándome en esta spec.

---

## FASE 3 — Post aprobación

Cuando el usuario apruebe la spec:
- Guardar la spec en docs/specs/[nombre-feature].md
- Ejecutar /new-feature con la spec como contexto
- Al implementar, /new-feature debe leer docs/specs/[nombre-feature].md
  como fuente de verdad del feature

## Marcar progreso
Al generar la spec, actualizar TODO.md (raíz):
- [ ] Feature: [nombre] — spec aprobada, pendiente implementación
