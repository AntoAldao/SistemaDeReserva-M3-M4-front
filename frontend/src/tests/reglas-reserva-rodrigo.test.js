// M04 - Tests unitarios de casos borde de fecha y antelación.
const { esFechaReservable, cumpleAntelacionMinima } = require('../reglas-reserva');

describe('M04 - Casos borde de las reglas de reserva', () => {
  // Se fija la fecha de referencia para que las pruebas no dependan del reloj.
  const referencia = new Date(2026, 8, 27, 15, 30, 0);
  const ahora = new Date(2026, 8, 27, 10, 0, 0);

  test('1. Retorna false cuando la fecha ISO no existe en el calendario', () => {
    expect(esFechaReservable('2026-02-30', referencia)).toBe(false);
  });

  test('2. Retorna false cuando la fecha no tiene el formato ISO esperado', () => {
    expect(esFechaReservable('27/09/2026', referencia)).toBe(false);
  });

  test('3. Retorna false cuando la fecha de referencia es inválida', () => {
    const fechaReferenciaInvalida = new Date(Number.NaN);
    expect(esFechaReservable('2026-09-28', fechaReferenciaInvalida)).toBe(false);
    expect(cumpleAntelacionMinima('2026-09-28', '10:00', 24, fechaReferenciaInvalida)).toBe(false);
  });

  test('4. Retorna false si la antelación no es un número válido no negativo', () => {
    expect(cumpleAntelacionMinima('2026-09-28', '10:00', '24', ahora)).toBe(false);
    expect(cumpleAntelacionMinima('2026-09-28', '10:00', -1, ahora)).toBe(false);
    expect(cumpleAntelacionMinima('2026-09-28', '10:00', Number.NaN, ahora)).toBe(false);
  });

  test('5. Retorna false cuando la hora tiene formato o valores fuera de rango', () => {
    for (const hora of ['10', '24:00', '10:60']) {
      expect(cumpleAntelacionMinima('2026-09-28', hora, 24, ahora)).toBe(false);
    }
  });
});
