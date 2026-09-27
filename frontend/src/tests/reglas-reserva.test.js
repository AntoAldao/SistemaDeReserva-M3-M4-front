// M04 - Tests unitarios de fecha reservable y antelación mínima.
const { esFechaReservable, cumpleAntelacionMinima } = require('../reglas-reserva');

describe('M04 - Reglas de fecha y antelación de la reserva', () => {
  // 27/09/2026 a las 15:30, hora local. Se fija la referencia para no depender del reloj.
  const hoy = new Date(2026, 8, 27, 15, 30, 0);

  test('1. Retorna true cuando la fecha es posterior al día de referencia', () => {
    expect(esFechaReservable('2026-09-28', hoy)).toBe(true);
  });

  test('2. Retorna false cuando la fecha es el mismo día (caso límite)', () => {
    expect(esFechaReservable('2026-09-27', hoy)).toBe(false);
  });

  test('3. Retorna false cuando la fecha ya pasó', () => {
    expect(esFechaReservable('2026-09-26', hoy)).toBe(false);
  });

  test('4. Retorna true cuando el turno cae exactamente en la antelación mínima', () => {
    const ahora = new Date(2026, 8, 27, 10, 0, 0);
    // 28/09 10:00 es exactamente 24 horas después de ahora.
    expect(cumpleAntelacionMinima('2026-09-28', '10:00', 24, ahora)).toBe(true);
  });

  test('5. Retorna false cuando el turno queda por debajo de la antelación mínima', () => {
    const ahora = new Date(2026, 8, 27, 10, 0, 0);
    // 28/09 09:59 es un minuto antes de cumplir las 24 horas.
    expect(cumpleAntelacionMinima('2026-09-28', '09:59', 24, ahora)).toBe(false);
  });
});
