# AgendaYA - Frontend Mínimo (TP6 - Grupo 7)

Módulos: **M03 - Tipos de Evento** / **M04 - Proceso de Reserva (Booking Público)**

## Cómo levantarlo localmente

El proyecto está desarrollado en HTML, CSS y JavaScript vanilla.

**Con Live Server (Requerido para Cypress):**

1. Abrir la carpeta raíz del proyecto en VS Code.
2. Instalar la extensión "Live Server".
3. Click derecho sobre `frontend/index.html` → "Open with Live Server".
4. Por defecto queda disponible en `http://127.0.0.1:5500/frontend/index.html` (o `localhost:5500`).

> La URL base está configurada en `cypress.config.js`. Si Live Server levanta en otro puerto o ruta, actualizar la propiedad `baseUrl`.

## Testing Automatizado

### 1. Instalación de dependencias

Al clonar el repositorio por primera vez, pararse en la raíz del proyecto y ejecutar:
npm install

### 2. Tests Unitarios (Jest)

Validan funciones de lógica pura (validaciones de formulario, reglas de negocio, formatos).

- Ubicación de código fuente: `frontend/src/`
- Ubicación de pruebas: `frontend/src/tests/*.test.js`

Para ejecutar todas las suites de pruebas unitarias:
npm test

Pautas para sumar nuevos tests unitarios:

- Crear el archivo de pruebas dentro de `frontend/src/tests/` con terminación `.test.js`.
- Importar las funciones a testear usando la ruta relativa `../nombre-modulo`.
- Cubrir casos válidos, casos de error y valores límite.

### 3. Tests End-to-End (Cypress)

Prueban la interacción completa de los flujos sobre la interfaz gráfica del navegador.

Requisito previo:
Tener el frontend levantado con Live Server.

Comandos de ejecución (desde la raíz):

- Modo Consola / Headless (Recomendado para WSL / Linux):
  npx cypress run

- Ejecutar un archivo E2E puntual:
  npx cypress run --spec "cypress/e2e/nombre-archivo.cy.js"

- Modo Interactivo con UI (Recomendado para Windows / Mac):
  npx cypress open

Pautas para sumar nuevos tests E2E:

- Guardar los archivos en `cypress/e2e/` con extensión `.cy.js`.
- Usar exclusivamente selectores de tipo `[data-cy="..."]`.
- Organizar cada caso de prueba (`it`) con los bloques de comentarios `// ARRANGE`, `// ACT` y `// ASSERT`.

## Flujos implementados

### M03 - Administrador

- **Crear tipo de evento**: formulario con nombre, duración, modalidad, tipo de confirmación y descripción. Valida campo vacío y nombre duplicado.
- **Editar tipo de evento**: botón "Editar" en el listado, reutiliza el mismo formulario.
- Extra: activar/desactivar y eliminar (con los mismos data-cy, útiles para tests opcionales).

### M04 - Invitado (booking público)

- **Seleccionar fecha y hora**: catálogo de eventos activos → calendario → slots disponibles (el slot `11:00` está simulado como ocupado para poder testear el caso de horario no disponible).
- **Completar formulario y confirmar reserva**: valida campos obligatorios y formato de email; al confirmar muestra pantalla de éxito con estado Confirmada/Pendiente según la configuración del tipo de evento.

## Atributos data-cy relevantes

| Zona               | data-cy                                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form M03           | `event-name-input`, `event-duration-select`, `event-modality-presencial/virtual/ambas`, `event-confirmation-auto/manual`, `event-description-input`, `submit-event`, `cancel-edit-event` |
| Feedback M03       | `event-error`, `event-confirmation`                                                                                                                                                      |
| Listado M03        | `events-list`, `event-row-{id}`, `edit-event-{id}`, `toggle-event-{id}`, `delete-event-{id}`                                                                                             |
| Catálogo M04       | `event-catalog`, `event-card-{id}`                                                                                                                                                       |
| Fecha/hora M04     | `date-input`, `slots-container`, `slot-{hhmm}`                                                                                                                                           |
| Datos invitado M04 | `guest-name-input`, `guest-lastname-input`, `guest-email-input`, `submit-booking`, `booking-error-step3`                                                                                 |
| Confirmación M04   | `booking-confirmation`                                                                                                                                                                   |

## Notas

- Los datos se guardan **en memoria** (se pierden al recargar la página), tal como permite la consigna del TP6. No hay backend real.
- El frontend viene pre-cargado con 2 tipos de evento de ejemplo para poder probar el flujo de booking sin tener que crear uno primero.
- El pipeline despliega automáticamente a desarrollo (canal `dev` de Firebase Hosting) en cada merge a `develop`, y a producción (https://agendaya-g7.web.app) en cada merge a `main`, previa aprobación manual del environment `production`.
