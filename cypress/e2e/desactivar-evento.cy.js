describe('AgendaYA - M03: Gestión de Tipos de Evento', () => {

  // Hook que se ejecuta de forma automática antes de cada test
  beforeEach(() => {
    // Carga la página principal del frontend sobre la URL configurada en baseUrl
    cy.visit('/index.html')
  })

  /* ==========================================================================
     TEST E2E: Desactivación de un Tipo de Evento (Happy Path)
     Propósito: Verificar que un usuario administrador puede desactivar un
     tipo de evento previamente activo y que dicho evento deja de estar
     disponible posteriormente en la vista pública de reservas.
     ========================================================================== */
  it('Debe permitir desactivar un tipo de evento activo y ocultarlo de la reserva pública', () => {
    
    // ------------------------------------------------------------------------
    // ARRANGE: Preparación del escenario de prueba
    // Se verifica que el evento precargado "Consulta Inicial" se encuentre
    // visible y activo dentro del listado administrativo.
    // ------------------------------------------------------------------------
    cy.get('[data-cy="event-row-evt-1"]')
      .should('be.visible')
      .and('contain', 'Consulta Inicial')
      .and('contain', 'Activo')

    cy.get('[data-cy="toggle-event-evt-1"]')
      .should('contain', 'Desactivar')

    // ------------------------------------------------------------------------
    // ACT: Ejecución de la acción del usuario
    // Se presiona el botón "Desactivar" correspondiente al evento.
    // ------------------------------------------------------------------------
    cy.get('[data-cy="toggle-event-evt-1"]')
      .click()

    // ------------------------------------------------------------------------
    // ASSERT: Verificación del cambio de estado en la vista administrativa
    // ------------------------------------------------------------------------

    // Verificación 1: El evento debe continuar dentro del listado
    cy.get('[data-cy="event-row-evt-1"]')
      .should('be.visible')
      .and('contain', 'Consulta Inicial')

    // Verificación 2: El evento debe figurar ahora como Inactivo
    cy.get('[data-cy="event-row-evt-1"]')
      .should('contain', 'Inactivo')

    // Verificación 3: El botón debe cambiar de "Desactivar" a "Activar"
    cy.get('[data-cy="toggle-event-evt-1"]')
      .should('contain', 'Activar')

    // ------------------------------------------------------------------------
    // ACT adicional: Se navega a la vista pública de reservas
    // ------------------------------------------------------------------------
    cy.get('[data-cy="nav-public"]')
      .click()

    // ------------------------------------------------------------------------
    // ASSERT adicional: Verificación del impacto funcional
    // El evento desactivado no debe estar disponible para realizar reservas.
    // ------------------------------------------------------------------------

    // Verificación 4: La tarjeta correspondiente a "Consulta Inicial"
    // no debe existir dentro del catálogo público
    cy.get('[data-cy="event-card-evt-1"]')
      .should('not.exist')

    // Verificación 5: El catálogo no debe contener el nombre del evento
    cy.get('[data-cy="event-catalog"]')
      .should('not.contain', 'Consulta Inicial')
  })

})