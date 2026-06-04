# Labby-dabby — Pantallas y rutas

## Web (Next.js App Router)

| Ruta | Pantalla | Descripción | Acceso |
|------|----------|-------------|--------|
| `/` | Landing | Página de bienvenida, CTA a sign-up | Público |
| `/sign-in` | Inicio de sesión | Clerk sign-in | Público |
| `/sign-up` | Registro | Clerk sign-up | Público |
| `/dashboard` | Dashboard | Estadísticas, resumen, accesos rápidos | Autenticado |
| `/lab-reports` | Análisis de informes | Tabs: Overview, Recent Reports, Detailed Analysis | Autenticado |
| `/lab-reports/[id]` | Detalle de informe | Análisis IA, preguntas sugeridas, compartir | Autenticado |
| `/share/[token]` | Vista compartida | Informe en solo lectura, sin login | Público (token válido) |
| `/ai-chatbot` | Chatbot de salud | Chat con contexto del informe | Autenticado |
| `/notes` | Notas de salud | Lista, búsqueda, CRUD de notas con tags | Autenticado |

### Componentes principales por pantalla

- **Dashboard:** Cards de estadísticas (Total, Normales, Anormales, Críticos), último análisis, accesos rápidos
- **Lab Reports:** Botones Connect Gmail, Upload Report; tabs; cards de métricas; área de análisis
- **Lab Report Detail:** Interpretación por categoría, preguntas para el médico, botón compartir
- **AI Chatbot:** Historial de mensajes, input, disclaimer
- **Notes:** Lista de notas, búsqueda, + New Note, tags

## Mobile (Expo Router)

| Ruta | Pantalla | Descripción | Acceso |
|------|----------|-------------|--------|
| `/` | Home | Redirige a dashboard o sign-in | Público/Auth |
| `/sign-in` | Inicio de sesión | Clerk Expo sign-in | Público |
| `/sign-up` | Registro | Clerk Expo sign-up | Público |
| `/(tabs)/` | Tabs root | Dashboard, Lab Reports, Chatbot, Notes | Autenticado |
| `/(tabs)/dashboard` | Dashboard | Mismas métricas que web | Autenticado |
| `/(tabs)/lab-reports` | Lista informes | Lista de informes del usuario | Autenticado |
| `/lab-reports/[id]` | Detalle informe | Análisis, compartir | Autenticado |
| `/(tabs)/ai-chatbot` | Chatbot | Chat con IA | Autenticado |
| `/(tabs)/notes` | Notas | Lista y CRUD de notas | Autenticado |
| `/share/[token]` | Vista compartida | Informe compartido, solo lectura | Público |

### Estructura Expo Router

```
app/
├── _layout.tsx           # ClerkProvider + Stack
├── (auth)/
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (tabs)/
│   ├── _layout.tsx       # Tab Navigator
│   ├── dashboard.tsx
│   ├── lab-reports/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── ai-chatbot.tsx
│   └── notes.tsx
├── share/
│   └── [token].tsx
└── +not-found.tsx
```
