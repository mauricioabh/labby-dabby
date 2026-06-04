# Labby-dabby — Modelo de datos

## Entidades

### users

Sincronizada desde Clerk vía webhook. No se crea manualmente.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | text (PK) | Clerk user ID |
| email | text | Email del usuario |
| name | text | Nombre completo |
| imageUrl | text | URL del avatar |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |

### lab_reports

Informes de laboratorio subidos por el usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | Identificador único |
| userId | text (FK → users) | Propietario |
| fileUrl | text | URL del PDF (Uploadthing) |
| originalFilename | text | Nombre original del archivo |
| extractedText | text | Texto extraído del PDF |
| analysisSummary | text | Resumen IA |
| analysisDetailed | text | Análisis detallado (markdown) |
| suggestedQuestions | jsonb | Array de preguntas sugeridas |
| status | enum | normal \| abnormal \| critical |
| reportDate | date | Fecha del informe (extraída o upload) |
| createdAt | timestamp | Fecha de subida |
| updatedAt | timestamp | Última actualización |

### report_shares

Compartición de informes con terceros.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | Identificador único |
| labReportId | uuid (FK → lab_reports) | Informe compartido |
| userId | text (FK → users) | Quien comparte |
| shareToken | text (unique) | Token para la URL |
| recipientEmail | text | Email del destinatario (opcional) |
| expiresAt | timestamp | Fecha de expiración |
| permission | enum | view_only |
| createdAt | timestamp | Fecha de creación |

### notes

Notas de salud del usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | Identificador único |
| userId | text (FK → users) | Propietario |
| title | text | Título |
| content | text | Contenido |
| tags | text[] | Etiquetas para clasificación |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |

### chat_messages

Historial del chatbot para consultas de seguimiento.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | Identificador único |
| userId | text (FK → users) | Usuario |
| labReportId | uuid (FK, nullable) | Informe de contexto |
| role | enum | user \| assistant |
| content | text | Contenido del mensaje |
| createdAt | timestamp | Fecha del mensaje |

## Relaciones

- **users** 1:N **lab_reports**
- **users** 1:N **notes**
- **users** 1:N **chat_messages**
- **users** 1:N **report_shares**
- **lab_reports** 1:N **report_shares**
- **lab_reports** 1:N **chat_messages** (opcional, para contexto)

## Índices recomendados

- `lab_reports(userId, createdAt DESC)`
- `lab_reports(userId, status)`
- `report_shares(shareToken)` unique
- `report_shares(labReportId)`
- `notes(userId, updatedAt DESC)`
- `chat_messages(userId, createdAt DESC)`

## RLS (Row Level Security)

- `lab_reports`: usuario solo ve sus propios registros
- `notes`: usuario solo ve sus propias notas
- `chat_messages`: usuario solo ve sus propios mensajes
- `report_shares`: lectura por token (ruta pública) o por userId (propietario)
