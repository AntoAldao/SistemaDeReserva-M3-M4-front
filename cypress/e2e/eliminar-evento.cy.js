describe('AgendaYA - M03: Gestión de Tipos de Evento', () => {

  // Hook que se ejecuta de forma automática antes de cada test
  beforeEach(() => {
    // Carga la página principal del frontend sobre la URL configurada en baseUrl
    cy.visit('/index.html')
  })

  /* ==========================================================================
     TEST E2E: Eliminación de un Tipo de Evento (Flujo Opcional)
     Propósito: Verificar que un usuario administrador puede eliminar
     definitivamente un tipo de evento (confirmando la acción) y que
     el sistema lo remueve mostrando un mensaje de éxito.
     ========================================================================== */
  it('Debe permitir eliminar un tipo de evento tras confirmar y mostrar mensaje de éxito', () => {
    
    // ------------------------------------------------------------------------
    // ARRANGE: Preparación del escenario de prueba
    // Se verifica que el evento precargado "Consulta Inicial" se encuentre
    // visible en el listado administrativo y se intercepta el prompt nativo.
    // ------------------------------------------------------------------------
    cy.get('[data-cy="event-row-evt-1"]')
      .should('be.visible')
      .and('contain', 'Consulta Inicial')

    // Interceptamos la alerta nativa (window.confirm) del navegador
    cy.on('window:confirm', (textoConfirmacion) => {
      // Validamos que la pregunta incluya la palabra "eliminar"
      expect(textoConfirmacion).to.contain('eliminar')
      // Retornar true simula que el usuario hace clic en "Aceptar"
      return true
    })

    // ------------------------------------------------------------------------
    // ACT: Ejecución de la acción del usuario
    // Se presiona el botón "Eliminar" correspondiente al evento.
    // ------------------------------------------------------------------------
    cy.get('[data-cy="delete-event-evt-1"]')
      .click()

    // ------------------------------------------------------------------------
    // ASSERT: Verificación del resultado tras la eliminación
    // ------------------------------------------------------------------------

    // Verificación 1: El sistema debe renderizar el pop-up/toast de éxito
    cy.get('[data-cy="event-confirmation"]')
      .should('be.visible')
      .and('contain', 'borrado')

    // Verificación 2: El evento debe desaparecer inmediatamente del listado administrativo
    cy.get('[data-cy="event-row-evt-1"]')
      .should('not.exist')

    // ------------------------------------------------------------------------
    // ACT adicional: Se navega a la vista pública de reservas
    // ------------------------------------------------------------------------
    cy.get('[data-cy="nav-public"]')
      .click()

    // ------------------------------------------------------------------------
    // ASSERT adicional: Verificación del impacto funcional
    // El evento eliminado ya no debe estar disponible para realizar reservas.
    // ------------------------------------------------------------------------

    // Verificación 3: La tarjeta correspondiente a "Consulta Inicial"
    // no debe existir dentro del catálogo público
    cy.get('[data-cy="event-card-evt-1"]')
      .should('not.exist')

  })

})