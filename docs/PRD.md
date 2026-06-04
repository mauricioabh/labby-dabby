# Labby-dabby — Product Requirements Document

## Resumen ejecutivo

**Labby-dabby** es una aplicación full-stack de IA que ayuda a los pacientes a comprender sus informes de laboratorio. Utiliza Google Gemini para extraer, interpretar y explicar resultados médicos en lenguaje sencillo.

## Problema

Los informes de laboratorio usan terminología técnica y rangos de referencia que los pacientes no entienden, generando ansiedad y dificultando el seguimiento de su salud.

## Usuario objetivo

- **Principal:** Pacientes que reciben resultados de laboratorio y quieren entenderlos sin depender exclusivamente de una consulta médica.
- **Secundario:** Cuidadores o familiares que ayudan a gestionar la salud de un paciente.

## Propuesta de valor

- Interpretación en lenguaje sencillo con IA (Gemini)
- Clasificación automática: normal, anormal, crítico
- Chatbot contextual con acceso al informe
- Notas de salud organizadas con tags
- Envío de análisis por email
- Compartir informes con terceros (médicos, familiares)
- Disponible en web y móvil

## Funcionalidades principales

### 1. Análisis de informes de laboratorio (PDF)

- Carga de archivos PDF
- Extracción de datos con Gemini
- Interpretación clínica en lenguaje sencillo
- Detección de estados: normal, anormal, crítico

### 2. Chatbot de IA interactivo

- Consultas de seguimiento sobre el informe
- Contexto completo del informe para respuestas precisas

### 3. Gestión de notas de salud

- Diario personal de progreso médico
- Título, contenido y tags para organización

### 4. Integración de correo electrónico

- Conexión Gmail vía Resend
- Envío automático de análisis al completar el procesamiento

### 5. Panel de control y estadísticas

- Total de informes, normales, anormales, críticos
- Historial de informes recientes
- Notas pendientes

### 6. Compartir con terceros

- Enlaces compartibles con token único
- Expiración configurable
- Vista solo lectura sin login

### 7. Autenticación y seguridad

- Clerk: registro, login, Google OAuth
- RLS en NeonDB: cada usuario solo ve sus datos

## Scope del MVP

### Incluido

- Web app completa (Next.js 15)
- App móvil (Expo)
- Carga y análisis de PDFs con Gemini
- Clasificación normal/anormal/crítico
- Chatbot contextual
- Notas de salud con tags
- Integración Resend para email
- Dashboard con estadísticas
- Compartir informes con terceros
- Auth Clerk (Google + email/password)
- RLS en NeonDB

### Excluido (post-MVP)

- Importación automática desde Gmail
- Compartir notas
- Múltiples idiomas

## Criterios de éxito

- Usuario puede subir un PDF y recibir interpretación en < 2 min
- Clasificación correcta en > 95% de casos de prueba
- Chatbot responde con contexto del informe
- Compartir funciona sin login para el destinatario
- App móvil ofrece paridad funcional con web
