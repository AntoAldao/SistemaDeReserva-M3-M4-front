describe('AgendaYA - M03: Editar Tipo de Evento', () => {

  // Hook que se ejecuta de forma automática antes de cada test
  beforeEach(() => {
    // Carga la página principal del frontend sobre la URL configurada en baseUrl
    cy.visit('/index.html')
  })

  /* ==========================================================================
     TEST 1: Flujo Exitoso (Happy Path) - Editar Evento
     Propósito: Verificar que un usuario administrador puede editar un tipo de
     evento existente, cambiando sus datos, y que el sistema confirma la
     actualización e incorpora los cambios en la lista visual.
     ========================================================================== */
  it('Test 1 [Happy Path]: Debe permitir editar un tipo de evento completando campos válidos', () => {

    // ------------------------------------------------------------------------
    // ARRANGE: Preparación del escenario de prueba
    // Se busca el evento "Consulta Inicial" en el listado y se hace click en editar
    // ------------------------------------------------------------------------
    cy.get('[data-cy="edit-event-evt-1"]')
      .click() // Click en botón Editar del primer evento

    // Verificar que el título cambió a "Editar Tipo de Evento"
    cy.contains('h2', 'Editar Tipo de Evento').should('be.visible')

    // Limpiar el nombre y escribir uno nuevo
    cy.get('[data-cy="event-name-input"]')
      .clear()
      .type('Consulta Nutricional')

    cy.get('[data-cy="event-duration-select"]')
      .select('30') // Cambiar de 45 a 30 minutos

    cy.get('[data-cy="event-modality-presencial"]')
      .check() // Cambiar de Virtual a Presencial

    cy.get('[data-cy="event-confirmation-manual"]')
      .check() // Cambiar de Automática a Manual

    cy.get('[data-cy="event-description-input"]')
      .clear()
      .type('Asesoría personalizada de nutrición.')

    // ------------------------------------------------------------------------
    // ACT: Ejecución de la acción del usuario
    // Dispara el evento submit presionando el botón "Guardar"
    // ------------------------------------------------------------------------
    cy.get('[data-cy="submit-event"]').click()

    // ------------------------------------------------------------------------
    // ASSERT: Verificación de los resultados esperados
    // Se comprueba que la interfaz reaccione conforme a las reglas de negocio
    // ------------------------------------------------------------------------

    // Verificación 1: El cartel de confirmación o éxito debe estar visible
    cy.get('[data-cy="event-confirmation"]')
      .should('be.visible')
      .and('contain', 'modificado correctamente')

    // Verificación 2: El evento actualizado debe figurar dentro del listado con el nuevo nombre
    cy.get('[data-cy="events-list"]')
      .should('contain', 'Consulta Nutricional')

    // Verificación 3: El título del formulario debe volver a "Crear Tipo de Evento"
    cy.contains('h2', 'Crear Tipo de Evento').should('be.visible')

    // Verificación 4: El botón Cancelar debe estar oculto nuevamente
    cy.get('[data-cy="cancel-edit-event"]')
      .should('have.class', 'hidden')
  })

  /* ==========================================================================
     TEST 2: Flujo de Error - Intentar cambiar a nombre duplicado
     Propósito: Verificar que el sistema bloquea la edición cuando se intenta
     cambiar el nombre del evento a uno que ya existe en el sistema.
     ========================================================================== */
  it('Test 2 [Caso de Error]: Debe bloquear la edición al intentar cambiar a un nombre duplicado', () => {

    // ------------------------------------------------------------------------
    // ARRANGE: Preparación del escenario
    // Se abre la edición del primer evento y se intenta cambiar su nombre
    // al nombre del segundo evento existente ("Entrevista Técnica")
    // ------------------------------------------------------------------------
    cy.get('[data-cy="edit-event-evt-1"]')
      .click()

    cy.get('[data-cy="event-name-input"]')
      .clear()
      .type('Entrevista Técnica') // Nombre que ya existe (duplicado)

    // ------------------------------------------------------------------------
    // ACT: Ejecución de la acción
    // Intenta enviar el formulario
    // ------------------------------------------------------------------------
    cy.get('[data-cy="submit-event"]').click()

    // ------------------------------------------------------------------------
    // ASSERT: Verificación de la validación del sistema
    // ------------------------------------------------------------------------

    // Verificación 1: El contenedor del mensaje de error debe ser visible
    cy.get('[data-cy="event-error"]')
      .should('be.visible')
      .and('not.have.class', 'hidden')

    // Verificación 2: El cartel de confirmación NO debe aparecer
    cy.get('[data-cy="event-confirmation"]')
      .should('have.class', 'hidden')

    // Verificación 3: El título aún debe decir "Editar Tipo de Evento"
    cy.contains('h2', 'Editar Tipo de Evento').should('be.visible')
  })

})
