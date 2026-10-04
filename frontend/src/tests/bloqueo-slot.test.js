// M04-RF02 - Bloqueo temporal de 10 minutos del horario seleccionado.
// Migrado desde SistemaDeReserva-Modulo3 (tests/modulo_04/catalogue-selection.test.tsx).
// El original probaba un componente React; acá se prueba la regla de negocio pura.
const { bloquearSlot, tiempoRestanteBloqueo } = require("../gestion-reservas");

describe("M04 - Bloqueo temporal del horario seleccionado", () => {
  const ahora = new Date(2026, 8, 27, 10, 0, 0);
  const slot = { fecha: "2026-09-28", hora: "10:00" };

  test("1. Al seleccionar un horario libre se bloquea por 10 minutos", () => {
    const resultado = bloquearSlot(slot, "invitado-1", [], ahora);

    expect(resultado.error).toBeNull();
    expect(resultado.bloqueos).toHaveLength(1);
    expect(tiempoRestanteBloqueo(resultado.bloqueo, ahora)).toBe("10:00");
  });

  test("2. Retorna error si otro usuario ya tiene bloqueado el mismo horario", () => {
    const { bloqueos } = bloquearSlot(slot, "invitado-1", [], ahora);

    const resultado = bloquearSlot(slot, "invitado-2", bloqueos, ahora);

    expect(resultado.bloqueo).toBeNull();
    expect(resultado.error).toMatch(/Este horario acaba de ser seleccionado por otro usuario/);
  });

  test("3. Permite tomar el horario cuando el bloqueo anterior ya venció", () => {
    const { bloqueos } = bloquearSlot(slot, "invitado-1", [], ahora);
    const onceMinutosDespues = new Date(ahora.getTime() + 11 * 60 * 1000);

    const resultado = bloquearSlot(slot, "invitado-2", bloqueos, onceMinutosDespues);

    expect(resultado.error).toBeNull();
    expect(resultado.bloqueos).toHaveLength(1);
    expect(resultado.bloqueos[0].usuario).toBe("invitado-2");
  });

  test("4. El tiempo restante disminuye con el paso del tiempo y no baja de 00:00", () => {
    const { bloqueo } = bloquearSlot(slot, "invitado-1", [], ahora);

    expect(tiempoRestanteBloqueo(bloqueo, new Date(ahora.getTime() + 90 * 1000))).toBe("08:30");
    expect(tiempoRestanteBloqueo(bloqueo, new Date(ahora.getTime() + 20 * 60 * 1000))).toBe(
      "00:00",
    );
  });
});
