// M04-RF07 - Cancelación de la reserva por parte del invitado.
// Migrado desde SistemaDeReserva-Modulo3 (tests/modulo_04/cancellation.test.js).
const { cancelarReserva } = require("../gestion-reservas");

describe("M04 - Cancelación de reservas", () => {
  // 27/09/2026 a las 10:00, hora local. Se fija la referencia para no depender del reloj.
  const ahora = new Date(2026, 8, 27, 10, 0, 0);
  const MENSAJE_PLAZO_VENCIDO =
    "El plazo de cancelación de esta reserva venció. Contactá directamente al profesional.";
  const MENSAJE_ESTADO = "Solo se pueden cancelar reservas confirmadas o pendientes";

  test("1. Cancela una reserva confirmada con más de 24 horas de anticipación", () => {
    // 29/09 10:00 -> 48 horas después
    const reserva = { id: "RES-8821", estado: "Confirmada", fecha: "2026-09-29", hora: "10:00" };

    const resultado = cancelarReserva(reserva, 24, ahora);

    expect(resultado.error).toBeNull();
    expect(resultado.reserva.estado).toBe("Cancelada");
    expect(resultado.reserva).toHaveProperty("canceladaEn");
  });

  test("2. Rechaza la cancelación cuando el plazo ya venció", () => {
    // 27/09 12:00 -> solo 2 horas después
    const reserva = { id: "RES-1102", estado: "Confirmada", fecha: "2026-09-27", hora: "12:00" };

    const resultado = cancelarReserva(reserva, 24, ahora);

    expect(resultado.error).toBe(MENSAJE_PLAZO_VENCIDO);
    expect(resultado.reserva.estado).toBe("Confirmada");
  });

  test("3. Rechaza la cancelación de una reserva ya cancelada", () => {
    const reserva = { id: "RES-0000", estado: "Cancelada", fecha: "2026-09-30", hora: "10:00" };
    expect(cancelarReserva(reserva, 24, ahora).error).toBe(MENSAJE_ESTADO);
  });

  test("4. Cancela una reserva pendiente dentro del plazo permitido", () => {
    const reserva = { id: "RES-7777", estado: "Pendiente", fecha: "2026-09-29", hora: "10:00" };

    const resultado = cancelarReserva(reserva, 24, ahora);

    expect(resultado.error).toBeNull();
    expect(resultado.reserva.estado).toBe("Cancelada");
  });

  test("5. Rechaza la cancelación de una reserva completada", () => {
    const reserva = { id: "RES-9999", estado: "Completada", fecha: "2026-09-30", hora: "10:00" };
    expect(cancelarReserva(reserva, 24, ahora).error).toBe(MENSAJE_ESTADO);
  });

  test("6. Aplica el plazo de 24 horas por defecto cuando no se indica el límite", () => {
    // 27/09 20:00 -> 10 horas después
    const reserva = { id: "RES-2024", estado: "Confirmada", fecha: "2026-09-27", hora: "20:00" };
    expect(cancelarReserva(reserva, undefined, ahora).error).toBe(MENSAJE_PLAZO_VENCIDO);
  });

  test("7. Respeta un límite personalizado (48 horas) por sobre el valor por defecto", () => {
    // 28/09 16:00 -> 30 horas después: alcanza para 24h, no para 48h
    const reserva = { id: "RES-4848", estado: "Confirmada", fecha: "2026-09-28", hora: "16:00" };
    expect(cancelarReserva(reserva, 48, ahora).error).toBe(MENSAJE_PLAZO_VENCIDO);
  });

  test("8. Permite cancelar cuando el turno está apenas por encima del límite", () => {
    // 28/09 11:00 -> 25 horas después
    const reserva = { id: "RES-2500", estado: "Confirmada", fecha: "2026-09-28", hora: "11:00" };

    const resultado = cancelarReserva(reserva, 24, ahora);

    expect(resultado.error).toBeNull();
    expect(resultado.reserva.estado).toBe("Cancelada");
  });

  test("9. Conserva los datos de la reserva y no modifica el objeto original", () => {
    const original = {
      id: "RES-3030",
      nombre: "Ivy",
      estado: "Confirmada",
      fecha: "2026-09-29",
      hora: "10:00",
    };

    const resultado = cancelarReserva(original, 24, ahora);

    expect(resultado.reserva.id).toBe("RES-3030");
    expect(resultado.reserva.nombre).toBe("Ivy");
    expect(original.estado).toBe("Confirmada");
    expect(original).not.toHaveProperty("canceladaEn");
  });
});
