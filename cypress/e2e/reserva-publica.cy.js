describe("AgendaYA - M04: Proceso de Reserva (Booking Público)", () => {
  beforeEach(() => {
    cy.visit("/index.html");
  });

  /*
    Flujo completo del invitado sobre un tipo de evento con confirmación automática.
    Estado final esperado: la reserva queda Confirmada.
    No repite el alta de tipos de evento (M03) ni el caso de campos vacíos.
  */
  it("Permite reservar un turno libre y muestra la reserva como Confirmada", () => {
    // ARRANGE: entrar a la vista pública y elegir el evento precargado de confirmación automática
    cy.get('[data-cy="nav-public"]').click();
    cy.get('[data-cy="event-card-evt-1"]').click();
    cy.get('[data-cy="selected-event-name"]').should("contain", "Consulta Inicial");

    // El input date dispara "change" al perder el foco; sin eso no se renderizan los horarios.
    cy.get('[data-cy="date-input"]').type("2026-10-15").blur();
    cy.get('[data-cy="slot-1400"]').should("not.be.disabled");

    // ACT: elegir un horario libre, cargar los datos del invitado y confirmar
    cy.get('[data-cy="slot-1400"]').click();
    cy.get('[data-cy="continue-to-data"]').click();

    cy.get('[data-cy="guest-name-input"]').type("Enzo");
    cy.get('[data-cy="guest-lastname-input"]').type("Pérez");
    cy.get('[data-cy="guest-email-input"]').type("enzo.perez@example.com");
    cy.get('[data-cy="submit-booking"]').click();

    // ASSERT: la pantalla final muestra la reserva confirmada, no pendiente
    cy.get('[data-cy="booking-confirmation"]')
      .should("be.visible")
      .and("contain", "Confirmada")
      .and("contain", "Consulta Inicial")
      .and("contain", "14:00")
      .and("contain", "Enzo Pérez")
      .and("contain", "enzo.perez@example.com");

    cy.get('[data-cy="booking-error-step3"]').should("have.class", "hidden");
  });
});
