# Design Assets Command

## Rol

Eres un diseñador UI/UX senior especializado en identidad visual
para productos digitales multiplataforma.

## Contexto obligatorio (leer antes de actuar)

- Lee .cursor/rules/main.mdc para entender nombre y tipo de proyecto
- Lee packages/ui/tokens/ o src/lib/tokens/ para usar la paleta definida
- Si no existen los tokens, indicar al usuario que ejecute /design-system primero

## Detectar estado actual

### Si NO existen SVGs en packages/ui/assets/ o public/:

- Modo creación: generar todos los SVGs desde cero
- Continuar con el flujo completo de generación

### Si YA existen SVGs:

- Mostrar lista de assets existentes con sus rutas
- Preguntar al usuario qué quiere modificar:
  - Solo el logo
  - Solo el favicon
  - Solo los íconos mobile
  - Todo
- Modificar solo los SVGs solicitados
- Regenerar solo los assets afectados con el script

---

## FASE 1 — SVGs fuente (fuente de verdad, nunca se borran)

### Logo principal

Crear o actualizar:

- packages/ui/assets/logo.svg (monorepo)
- packages/ui/assets/logo-isotipo.svg (monorepo)
- public/logo.svg (standalone)
- public/logo-isotipo.svg (standalone)

Especificaciones:

- Formato vectorial SVG, escalable
- logo.svg → versión horizontal: isotipo + nombre del proyecto
- logo-isotipo.svg → solo el isotipo, para favicon e íconos mobile
- Usar colores del design system
- Funcionar en fondo claro y oscuro
- Estilo coherente con el tipo de producto definido en main.mdc

### OG Image fuente

Crear o actualizar:

- packages/ui/assets/og-image.svg (monorepo)
- public/og-image-source.svg (standalone)

Especificaciones:

- Dimensiones: 1200x630
- Incluir logo + nombre del proyecto + tagline
- Usar colores del design system

---

## FASE 2 — Script de conversión (permanente en el repo)

### Verificar si existe scripts/generate-assets.ts

- Si existe → actualizarlo si hay nuevos assets o cambios
- Si no existe → crearlo

### Instalar dependencias si no existen

- npm add -D sharp tsx

### Contenido de scripts/generate-assets.ts

El script debe:

- Leer los SVGs fuente desde packages/ui/assets/ o public/
- Generar todos los assets PNG e ICO con sharp
- Mostrar progreso de cada archivo generado

Assets web a generar:

- apps/web/public/favicon.ico (32x32)
- apps/web/public/favicon-16x16.png (16x16)
- apps/web/public/favicon-32x32.png (32x32)
- apps/web/public/apple-touch-icon.png (180x180)
- apps/web/public/og-image.png (1200x630)

Assets mobile a generar (solo si es monorepo):

- apps/mobile/assets/icon.png (1024x1024)
- apps/mobile/assets/adaptive-icon.png (1024x1024)
- apps/mobile/assets/splash-icon.png (1024x1024, fondo del color primario)
- apps/mobile/assets/favicon.png (48x48)

### Agregar script en package.json raíz

```json
"generate-assets": "tsx scripts/generate-assets.ts"
```

---

## FASE 3 — Ejecutar el script

CRÍTICO: este comando (archivo `.md`) es una **instrucción para el agente**; no “ejecuta” nada por sí mismo.
En Cursor, el agente debe **correr realmente** el script y luego reportar el resultado (output + archivos generados).

El agente debe correr automáticamente:

```bash
npm run generate-assets
```

Luego debe:

- Verificar que todos los archivos se generaron correctamente.
- Mostrar en el chat el output (o un resumen) del script, y una lista de archivos creados/modificados.

Checklist mínimo (monorepo):

- `apps/web/public/favicon.ico`
- `apps/web/public/favicon-16x16.png`
- `apps/web/public/favicon-32x32.png`
- `apps/web/public/apple-touch-icon.png`
- `apps/web/public/og-image.png`
- `apps/mobile/assets/icon.png`
- `apps/mobile/assets/adaptive-icon.png`
- `apps/mobile/assets/splash-icon.png`
- `apps/mobile/assets/favicon.png`

Si el usuario ve “missing icon/splash files referenced by apps/mobile/app.json” incluso después de generar:

- Asegurar que las rutas en `apps/mobile/app.json` coinciden con los nombres anteriores.
- Reiniciar el bundler de Expo (detener `npm run mobile` y volver a iniciarlo) para recargar config.

---

## FASE 4 — Actualizar configuraciones

### src/app/layout.tsx (o apps/web/src/app/layout.tsx)

Actualizar metadata con favicon y og-image:

```typescript
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: ['/og-image.png'],
  },
};
```

### apps/mobile/app.json (solo si es monorepo)

Actualizar referencias a los assets generados.

---

## FASE 5 — .gitignore

Agregar al .gitignore para no commitear assets generados
(solo se commiten los SVGs fuente y el script):

```
# Assets generados (se regeneran con npm run generate-assets)
apps/web/public/favicon.ico
apps/web/public/favicon-*.png
apps/web/public/apple-touch-icon.png
apps/web/public/og-image.png
apps/mobile/assets/icon.png
apps/mobile/assets/adaptive-icon.png
apps/mobile/assets/splash-icon.png
apps/mobile/assets/favicon.png
```

---

## Reglas de diseño

- Todos los assets deben ser coherentes entre sí
- Usar exclusivamente la paleta de colores del design system
- El ícono mobile debe ser reconocible en tamaño pequeño sin texto
- El og-image debe incluir logo + nombre + tagline
- Generar variante dark del logo si el proyecto usa dark mode
- Los SVGs fuente NUNCA se borran, son la fuente de verdad

---

## Si el usuario no proporciona preferencias de diseño

Analiza main.mdc para inferir:

- Tipo de producto → define el estilo visual general
- Nombre → usado en logo y og-image
- Audiencia objetivo → define si el diseño es más serio,
  amigable, moderno, etc.

Propón una propuesta completa y pregunta:
"¿Apruebas esta propuesta o quieres ajustar algo?"
Solo procede si el usuario aprueba.

---

## Al terminar

- Mostrar preview SVG del logo generado
- Mostrar lista completa de archivos creados o modificados
- Confirmar que npm run generate-assets se ejecutó correctamente
- Recordar al usuario que puede regenerar los assets en cualquier momento con:
  npm run generate-assets
