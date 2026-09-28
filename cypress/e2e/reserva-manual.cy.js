describe('AgendaYA - M04: Proceso de Reserva Pública', () => {

  // Hook que se ejecuta de forma automática antes de cada test
  beforeEach(() => {
    // Carga la página principal del frontend sobre la URL configurada en baseUrl
    cy.visit('/index.html')
  })

  /* ==========================================================================
     TEST E2E: Reserva Pública con Confirmación Manual (Happy Path)
     Propósito: Verificar que un usuario invitado puede realizar correctamente
     una reserva sobre un tipo de evento configurado con confirmación Manual
     y que el sistema registre la reserva con estado Pendiente.
     ========================================================================== */
  it('Debe registrar una reserva con estado Pendiente cuando el evento tiene confirmación manual', () => {

    // ------------------------------------------------------------------------
    // ARRANGE: Preparación del escenario de prueba
    // Se accede a la vista pública y se selecciona el evento precargado
    // "Entrevista Técnica", configurado con confirmación Manual.
    // ------------------------------------------------------------------------
    cy.get('[data-cy="nav-public"]')
      .click()

    cy.get('[data-cy="event-card-evt-2"]')
      .should('be.visible')
      .and('contain', 'Entrevista Técnica')
      .click()

    // Verificación inicial: El evento seleccionado debe mostrarse en el paso 2
    cy.get('[data-cy="selected-event-name"]')
      .should('contain', 'Entrevista Técnica')

    // ------------------------------------------------------------------------
    // ARRANGE: Selección de fecha y horario disponible
    // ------------------------------------------------------------------------
    cy.get('[data-cy="date-input"]')
      .type('2026-10-15')
      .blur()

    cy.get('[data-cy="slot-1400"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click()

    // ------------------------------------------------------------------------
    // ACT: Se continúa al formulario de datos del invitado
    // ------------------------------------------------------------------------
    cy.get('[data-cy="continue-to-data"]')
      .click()

    // ------------------------------------------------------------------------
    // ASSERT intermedio: Verificación del resumen de la reserva
    // ------------------------------------------------------------------------
    cy.get('[data-cy="booking-summary"]')
      .should('be.visible')
      .and('contain', 'Entrevista Técnica')
      .and('contain', '15/10/2026')
      .and('contain', '14:00')
      .and('contain', 'Confirmación Manual')

    // ------------------------------------------------------------------------
    // ARRANGE: Se completan los datos requeridos del invitado
    // ------------------------------------------------------------------------
    cy.get('[data-cy="guest-name-input"]')
      .type('Camila')

    cy.get('[data-cy="guest-lastname-input"]')
      .type('Villarreal')

    cy.get('[data-cy="guest-email-input"]')
      .type('camila.villarreal@example.com')

    // ------------------------------------------------------------------------
    // ACT: Se confirma la reserva
    // ------------------------------------------------------------------------
    cy.get('[data-cy="submit-booking"]')
      .click()

    // ------------------------------------------------------------------------
    // ASSERT: Verificación de los resultados esperados
    // Al tratarse de un evento con confirmación Manual, la reserva debe
    // registrarse correctamente pero quedar en estado Pendiente.
    // ------------------------------------------------------------------------

    // Verificación 1: Debe mostrarse la pantalla final de confirmación
    cy.get('[data-cy="booking-confirmation"]')
      .should('be.visible')

    // Verificación 2: Debe informarse que la reserva quedó pendiente
    cy.get('[data-cy="booking-confirmation"]')
      .should('contain', 'Reserva registrada, pendiente de aprobación')

    // Verificación 3: Debe mostrarse el evento reservado
    cy.get('[data-cy="booking-confirmation"]')
      .should('contain', 'Entrevista Técnica')

    // Verificación 4: Deben mostrarse la fecha y el horario seleccionados
    cy.get('[data-cy="booking-confirmation"]')
      .should('contain', '15/10/2026')
      .and('contain', '14:00')

    // Verificación 5: Deben mostrarse los datos del invitado
    cy.get('[data-cy="booking-confirmation"]')
      .should('contain', 'Camila Villarreal')
      .and('contain', 'camila.villarreal@example.com')

    // Verificación 6: El estado final debe ser Pendiente
    cy.get('[data-cy="booking-confirmation"]')
      .should('contain', 'Estado: Pendiente')

    // Verificación 7: La reserva no debe quedar confirmada automáticamente
    cy.get('[data-cy="booking-confirmation"]')
      .should('not.contain', 'Estado: Confirmada')
  })

})