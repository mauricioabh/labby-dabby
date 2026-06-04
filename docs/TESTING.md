# Labby-dabby — Estrategia de testing

## Herramientas

- **Vitest:** Unit tests
- **Playwright:** E2E tests (solo web)

## Qué testear con Vitest

- Lógica de clasificación (normal/anormal/crítico)
- Validaciones Zod (schemas de input)
- Helpers de extracción de texto
- Utilidades en `packages/utils`
- Server Actions (mockeando DB y Clerk)

## Qué testear con Playwright

- Flujo de auth: sign-up → sign-in → dashboard
- Subida de informe: modal → select PDF → upload → ver análisis
- Chatbot: enviar mensaje → recibir respuesta
- Notas: crear, editar, eliminar
- Compartir: generar link → abrir en incógnito → ver informe

## Convenciones

- Tests unitarios: `*.test.ts` o `*.spec.ts` en `src/**/__tests__/` o `src/**/*.test.ts`
- Tests E2E: `e2e/*.spec.ts` en `apps/web/`
- Naming: `describe('nombre del módulo')`, `it('debería hacer X')`

## Cómo ejecutar

```bash
# Unit tests (desde raíz)
npm test

# E2E (desde apps/web)
npm run test:e2e --workspace=web

# E2E con UI
npm run test:e2e --workspace=web -- --ui
```

## Prioridad de cobertura

1. Clasificación de resultados (crítico para UX)
2. Validación de inputs (seguridad)
3. Flujos de auth y upload (core del producto)
