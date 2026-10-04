// M04-RF03 - Validación de disponibilidad (sin superposición de turnos).
// Migrado desde SistemaDeReserva-Modulo3 (tests/modulo_04/availability.test.js).
const { validarDisponibilidadHorario } = require("../gestion-reservas");

describe("M04 - Disponibilidad de horarios sin superposición", () => {
  const ocupados = [
    { inicio: "14:00", fin: "14:30" },
    { inicio: "15:00", fin: "16:00" },
  ];

  test("1. Retorna valido:true cuando el rango está libre (entre dos turnos ocupados)", () => {
    const resultado = validarDisponibilidadHorario("14:30", "15:00", ocupados);
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBeNull();
  });

  test("2. Retorna valido:false cuando el rango se superpone con un turno ocupado", () => {
    const resultado = validarDisponibilidadHorario("15:15", "15:45", ocupados);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe("El horario seleccionado ya no está disponible");
  });

  test("3. Retorna valido:false cuando el inicio es posterior o igual al fin", () => {
    const resultado = validarDisponibilidadHorario("17:00", "16:30", ocupados);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe("Rango horario inválido: el inicio debe ser anterior al fin");
  });
});
