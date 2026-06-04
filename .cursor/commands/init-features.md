# Init Features Command

## Contexto en el flujo de desarrollo

Este comando se ejecuta **después** de:

1. **onboarding-smart** — docs generados, init-base, setup-db, setup-env
2. **Manual** — el dev configura las API keys en `.env.local` según docs/ENV.md
3. **design-system** — tokens definidos, web y mobile configurados
4. **design-assets** — logos, favicons, og-image, íconos mobile generados

En este punto el proyecto tiene `.env` correcto y web/mobile arrancan sin errores.

---

## Rol

Eres un desarrollador senior full stack. Tu misión es generar el **proyecto completo** según el plan: landing, features, web y mobile (si aplica). Calidad de producción, como si el producto fuera a venderse. Sin scaffolding ni placeholders.

---

## Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`
2. Lee `/docs/PRD.md`
3. Lee `/docs/SCREENS.md`
4. Lee `/docs/DATA_MODEL.md`
5. Lee `/docs/TECH_STACK.md`
6. **Referencia visual:** Si existen imágenes en `assets/reference-images/` o `docs/mockups/`, úsalas como base principal para generar la UI. Prioridad: imágenes > sección "Referencia visual" en SCREENS.md > descripción de pantallas en SCREENS.md

---

## Pre-requisitos (verificar antes de continuar)

Pregunta al usuario: **"¿Ya ejecutaste design-system y design-assets, y configuraste las variables de entorno en .env.local?"**

- Si **NO**: detener y decir: "Ejecuta primero /design-system, luego /design-assets, y configura las API keys según docs/ENV.md. Cuando web y mobile arranquen sin errores, vuelve a ejecutar este comando."
- Si **SÍ**: continuar

---

## Detectar tipo de proyecto

- **Monorepo con mobile** si existe `apps/mobile/` y docs/SCREENS.md incluye pantallas mobile
  - Generar web completa + mobile completa
- **Solo web** si no existe `apps/mobile/` o el plan no incluye mobile
  - Generar solo web completa

---

## Objetivo

Implementar el proyecto **completo y profesional** según el plan:

- **NO** scaffolding ni placeholders
- **SÍ** implementación lista para producción
- UI pulida con loading, error y empty states
- Integraciones reales (Uploadthing, Gemini, Resend, Clerk webhook según plan)
- Validación Zod, auth Clerk, manejo de errores en todo el flujo

---

## Alcance

### 1. Landing (web)

- Todas las secciones de docs/SCREENS.md: Hero, Problem, Solution, Features, How it works, CTA, Footer
- Componentes en `src/components/landing/` (no todo en page.tsx)
- Usar design tokens de `@labby-dabby/ui` (o tokens del proyecto)
- Diseño profesional, mobile-first, responsive
- Clerk `Show` para signed-in vs signed-out (Dashboard vs Get started)
- Animaciones sutiles, CTAs claros, optimizado para conversión

### 2. Features web

Todas las rutas de docs/SCREENS.md:

- `/dashboard` — métricas, accesos rápidos
- `/lab-reports` — lista, upload (Uploadthing), análisis
- `/lab-reports/[id]` — detalle, análisis IA, compartir
- `/ai-chatbot` — chat con IA (Gemini según plan)
- `/notes` — CRUD con tags y búsqueda
- `/share/[token]` — vista pública de informe compartido

### 3. Backend

- Server Actions o API Routes para cada entidad
- Clerk webhook → sync `users` (si está en el plan)
- Integraciones: Uploadthing, Gemini, Resend según docs/TECH_STACK.md
- Validación Zod, auth Clerk antes de mutaciones

### 4. Mobile (solo si el proyecto incluye mobile)

- Todas las pantallas de docs/SCREENS.md
- Auth flow (sign-in, sign-up)
- Features: dashboard, lab-reports, ai-chatbot, notes
- Vista share pública
- Consumir API de web, nunca tocar DB directamente
- UI coherente con design system

### 5. Layout y navegación

- Dashboard con links a lab-reports, ai-chatbot, notes
- Navegación consistente entre web y mobile
- **Si hay imágenes de referencia:** Implementar layout exacto (sidebar plegable, top bar, modales, tabs, etc.) según lo mostrado en las imágenes

---

## Orden de implementación

1. API Routes / Server Actions (backend)
2. Clerk webhook (si aplica)
3. Integraciones (Uploadthing, Gemini, Resend)
4. Landing (componentes + page.tsx)
5. Features web (página por página)
6. Layout dashboard con navegación
7. Mobile (si aplica): pantalla por pantalla

---

## Reglas de implementación

- TypeScript estricto, nunca `any`
- Server Components por defecto, `"use client"` solo si es necesario
- Validar con Zod antes de tocar DB
- Verificar auth con Clerk antes de operar
- Manejar loading, error y empty states en toda la UI
- Usar design tokens del proyecto (spacing, typography, colors)
- Commits atómicos por cada parte completada

---

## Al terminar

- Resumen de archivos creados y modificados
- Comandos a ejecutar si hay migraciones pendientes
- Variables de entorno nuevas si aplica
- En TODO.md: marcar [x] Onboarding: init-features completado
