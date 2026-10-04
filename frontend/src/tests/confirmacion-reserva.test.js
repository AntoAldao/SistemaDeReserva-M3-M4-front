// M03-RF03 - Tipo de confirmación y estado inicial de la reserva.
// Migrado desde SistemaDeReserva-Modulo3 (tests/modulo_03/confirmation.test.js).
const { determinarEstadoReserva, actualizarConfirmacionEvento } = require("../gestion-reservas");

describe("M03 - Configuración del tipo de confirmación", () => {
  test("1. Retorna estado 'Confirmada' cuando la confirmación es Automatica", () => {
    const resultado = determinarEstadoReserva("Automatica");
    expect(resultado.estado).toBe("Confirmada");
    expect(resultado.error).toBeNull();
  });

  test("2. Retorna estado 'Pendiente' cuando la confirmación es Manual", () => {
    const resultado = determinarEstadoReserva("Manual");
    expect(resultado.estado).toBe("Pendiente");
    expect(resultado.error).toBeNull();
  });

  test("3. Retorna error cuando el tipo de confirmación no es válido", () => {
    const resultado = determinarEstadoReserva("Instantanea");
    expect(resultado.estado).toBeNull();
    expect(resultado.error).toBe("Tipo de confirmación no válido");
  });

  test("4. Las reservas previas conservan su estado al cambiar la confirmación del evento", () => {
    const evento = { id: "evt-2", nombre: "Entrevista Técnica", confirmacion: "Manual" };
    const reservasPrevias = [{ id: "RES-99", eventId: "evt-2", estado: "Pendiente" }];

    const resultado = actualizarConfirmacionEvento(evento, "Automatica", reservasPrevias);

    expect(resultado.error).toBeNull();
    expect(resultado.evento.confirmacion).toBe("Automatica");
    expect(resultado.reservas[0].estado).toBe("Pendiente");
  });
});
