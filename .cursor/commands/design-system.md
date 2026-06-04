# Design System Command

## Rol

Eres un diseñador de sistemas UI/UX senior especializado en design tokens
y sistemas de diseño escalables para productos digitales multiplataforma.

## Contexto obligatorio (leer antes de actuar)

- Lee .cursor/rules/main.mdc para entender el tipo de proyecto
- Lee docs/TECH_STACK.md para saber si es monorepo o standalone

## Detectar estado actual

### Si existen packages/ui/tokens/ (o src/lib/tokens/ en standalone):

- **Este proyecto (Labby-dabby):** Los tokens están en un solo archivo `packages/ui/tokens/index.ts` (colors, typography, spacing). Leer ese archivo.
- **Otros monorepos:** Pueden tener colors.ts, typography.ts, spacing.ts; leer los que existan.
- Mostrar los valores actuales al usuario en formato tabla.
- Preguntar qué quiere modificar y aplicar los cambios. En Labby-dabby, editar solo `tokens/index.ts` para evitar problemas de resolución con Turbopack.

### Si NO existen packages/ui/tokens/:

- Analizar el proyecto existente para inferir valores actuales:
  - Leer tailwind.config.ts si existe
  - Leer src/app/globals.css si existe
  - Leer cualquier archivo de estilos existente
- Presentar al usuario los valores inferidos y preguntar si quiere ajustar algo
- Crear la estructura completa:

### Estructura a crear (si no existe)

**Labby-dabby (monorepo):** Crear un único `packages/ui/tokens/index.ts` con colors, typography y spacing (evitar archivos separados para que Turbopack resuelva bien).

**Otros monorepos / standalone:** Pueden usar archivos separados:

#### packages/ui/tokens/colors.ts (monorepo) o src/lib/tokens/colors.ts (standalone)

```typescript
export const colors = {
  primary: '[inferido o definido]',
  primaryForeground: '#ffffff',
  secondary: '[inferido o definido]',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#94a3b8',
  destructive: '#ef4444',
  border: '#e2e8f0',
};
```

#### packages/ui/tokens/typography.ts (monorepo)

#### src/lib/tokens/typography.ts (standalone)

```typescript
export const typography = {
  fontFamily: {
    sans: 'Inter',
    mono: 'JetBrains Mono',
  },
  fontSize: {
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    '2xl': 32,
  },
};
```

#### packages/ui/tokens/spacing.ts (monorepo)

#### src/lib/tokens/spacing.ts (standalone)

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};
```

#### packages/ui/tokens/index.ts (monorepo)

#### src/lib/tokens/index.ts (standalone)

Exportar colors, typography y spacing.

## Aplicar tokens al proyecto

### En apps/web (monorepo) o raíz (standalone)

- Actualizar tailwind.config.ts para consumir los tokens
- Actualizar src/app/globals.css con CSS variables coherentes con los tokens
- Actualizar shadcn/ui theme si está configurado

### En apps/mobile (solo si es monorepo)

- Importar tokens desde @repo/ui/tokens
- Verificar que NativeWind está configurado para usar los tokens
- Instalar fuentes si no están: npm install expo-font @expo-google-fonts/inter --workspace=apps/mobile

## Al terminar

- Mostrar resumen de tokens creados o modificados
- Sugerir ejecutar /design-assets para regenerar assets con los nuevos tokens

## Si el usuario no proporciona preferencias de diseño

Analiza main.mdc para inferir:

- Tipo de producto → define el estilo visual general
- Nombre → usado en logo y og-image
- Audiencia objetivo → define si el diseño es más serio,
  amigable, moderno, etc.
  Propón una propuesta completa y pregunta:
  "¿Apruebas esta propuesta o quieres ajustar algo?"
  Solo procede si el usuario aprueba.
