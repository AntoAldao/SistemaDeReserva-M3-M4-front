// M04-RF05 - Registro de la reserva confirmada por el invitado.
// Migrado desde SistemaDeReserva-Modulo3 (tests/modulo_04/booking.test.js y
// tests/modulo_03/duration-boundaries.test.js).
const { crearReserva } = require("../gestion-reservas");

describe("M04 - Creación de la reserva", () => {
  // 27/09/2026 a las 15:30, hora local. Se fija la referencia para no depender del reloj.
  const ahora = new Date(2026, 8, 27, 15, 30, 0);
  const datosBase = {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    fecha: "2026-09-28",
    hora: "10:00",
  };

  test("1. Registra la reserva con id, fecha de creación y el estado indicado", () => {
    const resultado = crearReserva({ ...datosBase, estado: "Confirmada" }, ahora);

    expect(resultado.error).toBeNull();
    expect(resultado.reserva).toHaveProperty("id");
    expect(resultado.reserva).toHaveProperty("creadaEn");
    expect(resultado.reserva.nombre).toBe("Juan");
    expect(resultado.reserva.estado).toBe("Confirmada");
  });

  test("2. Asigna estado 'Pendiente' por defecto cuando no se indica estado", () => {
    const resultado = crearReserva(datosBase, ahora);
    expect(resultado.reserva.estado).toBe("Pendiente");
  });

  test("3. Retorna error si el nombre del invitado está vacío", () => {
    const resultado = crearReserva({ ...datosBase, nombre: "   " }, ahora);
    expect(resultado.reserva).toBeNull();
    expect(resultado.error).toBe("El nombre es obligatorio");
  });

  test("4. Retorna error si el email del invitado no tiene un formato válido", () => {
    const resultado = crearReserva({ ...datosBase, email: "juan_sin_arroba.com" }, ahora);
    expect(resultado.reserva).toBeNull();
    expect(resultado.error).toBe("Formato de correo electrónico inválido");
  });

  test("5. Retorna error si falta la fecha o el horario del turno", () => {
    const resultado = crearReserva({ ...datosBase, hora: undefined }, ahora);
    expect(resultado.reserva).toBeNull();
    expect(resultado.error).toBe("La fecha y el horario de la reserva son obligatorios");
  });

  test("6. Retorna error si la fecha de la reserva ya pasó", () => {
    const resultado = crearReserva({ ...datosBase, fecha: "2026-09-26" }, ahora);
    expect(resultado.reserva).toBeNull();
    expect(resultado.error).toBe("La fecha de la reserva debe ser posterior al día de hoy");
  });
});
