# Setup MCPs Command

## Rol
Eres un DevOps engineer senior. Tu misión es configurar los MCPs
específicos del proyecto para que el agente pueda interactuar
con los servicios externos directamente desde Cursor.

## Contexto obligatorio (leer antes de actuar)
- Lee .cursor/rules/main.mdc para entender el proyecto
- Lee docs/TECH_STACK.md para identificar los servicios usados
- Lee docs/ENV.md para conocer las keys necesarias

## Detectar servicios del proyecto
Basándose en docs/TECH_STACK.md identificar qué servicios
usa el proyecto para incluir solo los MCPs relevantes:
- ¿Usa NeonDB? → incluir MCP de Neon
- ¿Usa Vercel? → incluir MCP de Vercel
- ¿Usa GitHub? → incluir MCP de GitHub
- ¿Usa Stripe? → incluir MCP de Stripe
- ¿Usa Resend? → incluir MCP de Resend si existe
- ¿Usa Uploadthing? → incluir MCP de Uploadthing si existe

## Paso 1 — Crear .cursor/mcp.json
Crear en la raíz del proyecto con solo los MCPs relevantes:

```json
{
  "mcpServers": {
    "neon": {
      "command": "npx",
      "args": ["-y", "@neondatabase/mcp-server-neon"],
      "env": {
        "NEON_API_KEY": ""
      }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-adapter"],
      "env": {
        "VERCEL_TOKEN": ""
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "stripe-mcp"],
      "env": {
        "STRIPE_SECRET_KEY": ""
      }
    }
  }
}
```

Reglas:
- Incluir SOLO los MCPs de servicios que usa el proyecto
- Dejar valores de keys vacíos
- NO incluir filesystem (va en configuración global de Cursor)
- NO incluir Figma (va en configuración global de Cursor)

## Paso 2 — Crear .cursor/mcp.example.json
Copiar el mismo contenido de .cursor/mcp.json.
Este SÍ va al repo como referencia para el equipo.

## Paso 3 — Actualizar .gitignore
Agregar al .gitignore:
```
.cursor/mcp.json
```

Verificar que .cursor/mcp.example.json NO está en .gitignore.

## Paso 4 — Instrucciones para llenar las keys
Mostrar al usuario dónde obtener cada key:

"Abre .cursor/mcp.json y llena las keys:

- NEON_API_KEY
  → neon.tech → Account Settings → API Keys

- VERCEL_TOKEN
  → vercel.com → Settings → Tokens

- GITHUB_PERSONAL_ACCESS_TOKEN
  → github.com → Settings → Developer settings → Personal access tokens

- STRIPE_SECRET_KEY
  → dashboard.stripe.com → Developers → API Keys

Después de llenar las keys:
→ Cursor Settings → Tools & MCP → verifica que cada MCP
  muestra un círculo verde indicando que está activo."

## Al terminar mostrar resumen
- ✅ .cursor/mcp.json creado con [N] MCPs configurados
- ✅ .cursor/mcp.example.json creado para el repo
- ✅ .gitignore actualizado
- ⏳ Keys pendientes de configurar por el usuario
- Lista de MCPs incluidos y para qué sirven en este proyecto
