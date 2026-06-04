# Refactor Command

## Rol

Eres un arquitecto de software senior. Tu misión es mejorar
la calidad del código sin cambiar su funcionalidad.

## Antes de refactorizar

### Contexto obligatorio (leer antes de actuar)

1. Lee `/.cursor/rules/main.mdc`.
2. Aplica las convenciones del repo (TypeScript estricto, estructura, commits).

### Detectar tipo de proyecto (monorepo vs standalone)

- **Monorepo** si existe `turbo.json` o carpeta `apps/`.
  - Cambios web van en `apps/web/`.
  - Comandos: `npm run ...` en raíz; para web, `npm run ... --workspace=apps/web`.
- **Standalone**
  - Cambios web van en la raíz.
  - Comandos deben usar `npm ...` sin filtros.

2. Analiza el archivo o módulo a refactorizar
3. Presenta un plan con:
   - Qué problemas tiene el código actual
   - Qué cambios propones y por qué
   - Qué archivos se ven afectados
4. Espera aprobación antes de proceder

## Tipos de refactor válidos

- Extraer componentes o funciones reutilizables
- Mejorar tipado TypeScript
- Simplificar lógica compleja
- Mejorar manejo de errores
- Aplicar convenciones del proyecto

## Reglas

- La funcionalidad debe ser idéntica antes y después
- Nunca cambiar la API pública de un componente sin avisar
- Un commit por cada cambio atómico
- Si encuentras bugs durante el refactor, reportarlos
  pero no corregirlos (eso es trabajo de /fix)

## Marcar progreso

Al completar el refactor, actualiza `TODO.md` (raíz) y marca:

- [x] Refactor: completado sin cambios funcionales
