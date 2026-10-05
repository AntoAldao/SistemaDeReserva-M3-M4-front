// frontend/src/catalogo-eventos.js
// Reglas del catálogo público de reservas (M03 / M04).
// Se carga en el navegador antes de app.js y también se exporta para Jest.

/**
 * Devuelve los tipos de evento que se muestran en la página pública de reservas.
 * Solo se publican los eventos activos (INC-0123).
 */
function obtenerEventosPublicos(eventos) {
  if (!Array.isArray(eventos)) return [];
  return eventos.filter((e) => e.activo === true);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { obtenerEventosPublicos };
}
