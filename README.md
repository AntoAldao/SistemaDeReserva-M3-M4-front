# AgendaYA - Frontend Mínimo (TP6 - Grupo 7)

Módulos: **M03 - Tipos de Evento** / **M04 - Proceso de Reserva (Booking Público)**

## Cómo levantarlo localmente

No requiere instalación de dependencias. Es HTML + CSS + JS vanilla.

**Opción A - Abrir directo:**
Hacer doble clic en `index.html` (o abrirlo con el navegador). Va a correr como `file://...`.

**Opción B - Con Live Server (recomendado para Cypress):**
1. Abrir la carpeta `frontend/` en VS Code.
2. Instalar la extensión "Live Server".
3. Click derecho sobre `index.html` → "Open with Live Server".
4. Por defecto queda en `http://127.0.0.1:5500` (o `localhost:5500`).

> Si usan Live Server, configuren ese puerto como `baseUrl` en `cypress.config.js`.

## Flujos implementados

### M03 - Administrador
- **Crear tipo de evento**: formulario con nombre, duración, modalidad, tipo de
  confirmación y descripción. Valida campo vacío y nombre duplicado.
- **Editar tipo de evento**: botón "Editar" en el listado, reutiliza el mismo formulario.
- Extra: activar/desactivar y eliminar (con los mismos data-cy, útiles para tests opcionales).

### M04 - Invitado (booking público)
- **Seleccionar fecha y hora**: catálogo de eventos activos → calendario → slots
  disponibles (el slot `11:00` está simulado como ocupado para poder testear el
  caso de horario no disponible).
- **Completar formulario y confirmar reserva**: valida campos obligatorios y
  formato de email; al confirmar muestra pantalla de éxito con estado
  Confirmada/Pendiente según la configuración del tipo de evento.

## Atributos data-cy relevantes

| Zona | data-cy |
|---|---|
| Form M03 | `event-name-input`, `event-duration-select`, `event-modality-presencial/virtual/ambas`, `event-confirmation-auto/manual`, `event-description-input`, `submit-event`, `cancel-edit-event` |
| Feedback M03 | `event-error`, `event-confirmation` |
| Listado M03 | `events-list`, `event-row-{id}`, `edit-event-{id}`, `toggle-event-{id}`, `delete-event-{id}` |
| Catálogo M04 | `event-catalog`, `event-card-{id}` |
| Fecha/hora M04 | `date-input`, `slots-container`, `slot-{hhmm}` |
| Datos invitado M04 | `guest-name-input`, `guest-lastname-input`, `guest-email-input`, `submit-booking`, `booking-error-step3` |
| Confirmación M04 | `booking-confirmation` |

## Notas
- Los datos se guardan **en memoria** (se pierden al recargar la página), tal
  como permite la consigna del TP6. No hay backend real.
- El frontend viene pre-cargado con 2 tipos de evento de ejemplo para poder
  probar el flujo de booking sin tener que crear uno primero.
