// INC-0123 - Los tipos de evento desactivados por el administrador siguen
// apareciendo en la página pública de reservas y los invitados pueden reservarlos.
// Este test reproduce el defecto: falla antes del fix y pasa después.
const { obtenerEventosPublicos } = require("../catalogo-eventos");

describe("INC-0123 - Catálogo público de tipos de evento", () => {
  const eventos = [
    { id: "evt-1", nombre: "Consulta Inicial", activo: false },
    { id: "evt-2", nombre: "Entrevista Técnica", activo: true },
  ];

  test("1. No muestra en la página pública los tipos de evento desactivados", () => {
    const publicos = obtenerEventosPublicos(eventos);

    expect(publicos.map((e) => e.id)).not.toContain("evt-1");
  });

  test("2. Muestra en la página pública los tipos de evento activos", () => {
    const publicos = obtenerEventosPublicos(eventos);

    expect(publicos.map((e) => e.id)).toEqual(["evt-2"]);
  });
});
