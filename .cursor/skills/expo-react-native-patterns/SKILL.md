---
name: expo-react-native-patterns
description: Applies Expo, React Native, Expo Router, NativeWind and Next.js API consumption patterns in mobile apps. Use when working in apps/mobile, Expo, React Native, Expo Router, NativeWind, Clerk on mobile, or when the user mentions mobile app structure or API calls from React Native.
---

# Expo + React Native Patterns

Aplica estos patrones siempre que trabajes en apps/mobile.

## Regla fundamental

La app mobile **NUNCA** accede a NeonDB directamente. Siempre consume los API Routes de Next.js en apps/web.

## Estructura de navegación (Expo Router)

```
app/
├── _layout.tsx         → ClerkProvider + Stack/Tabs root
├── (auth)/
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (tabs)/
│   ├── _layout.tsx     → Tab Navigator
│   ├── index.tsx       → Home
│   └── profile.tsx
└── +not-found.tsx
```

## ClerkProvider en _layout.tsx

```typescript
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@/lib/token-cache'

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <Stack />
    </ClerkProvider>
  )
}
```

## Llamadas a la API de Next.js

El token de Clerk se obtiene en el componente o hook con `useAuth().getToken()` y se pasa a las funciones de servicio. No usar hooks dentro de funciones async puras.

```typescript
// services/api.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL

export async function fetchPosts(token: string | null) {
  const res = await fetch(`${API_URL}/api/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
```

En pantallas o hooks:

```typescript
const { getToken } = useAuth()
const token = await getToken()
const data = await fetchPosts(token)
```

## NativeWind (Tailwind en React Native)

Usar `className` igual que en web. Requiere `nativewind` y babel config según su documentación.

**Design tokens:** La app mobile usa el mismo design system que web (`@labby-dabby/ui`, packages/ui/tokens). El `tailwind.config.js` de mobile ya extiende spacing y fontSize con los tokens (xs, sm, md, lg, xl, 2xl, 3xl). Usar siempre esas clases en lugar de valores sueltos:

- Spacing: `p-lg`, `px-xl`, `py-2xl`, `gap-md`, `mt-xl`, etc.
- Tipografía: `text-xs`–`text-3xl` (no `text-4xl`/`text-5xl`/`text-6xl`).
- Colores: si el config de mobile define semantic colors (primary, muted, etc.), usarlos; si no, evitar hex hardcodeados y alinear con los tokens del paquete ui.

```typescript
<View className="flex-1 bg-background p-lg">
  <Text className="text-lg font-bold text-foreground">Hello</Text>
</View>
```
