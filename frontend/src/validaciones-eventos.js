// src/validaciones-eventos.js

/**
 * Valida los datos requeridos para dar de alta un tipo de evento.
 */
function validarTipoEvento(datos) {
  if (!datos) return { valido: false, error: "No se enviaron datos" };

  if (!datos.nombre || typeof datos.nombre !== "string" || datos.nombre.trim() === "") {
    return { valido: false, error: "El nombre es obligatorio" };
  }

  const duracionesValidas = [15, 30, 45, 60];
  if (!duracionesValidas.includes(Number(datos.duracion))) {
    return { valido: false, error: "Duración no permitida" };
  }

  const modalidadesValidas = ["Presencial", "Virtual", "Ambas"];
  if (!modalidadesValidas.includes(datos.modalidad)) {
    return { valido: false, error: "Modalidad no válida" };
  }

  return { valido: true, error: null };
}

/**
 * Verifica si el nombre propuesto ya existe dentro del listado existente.
 * Si se proporciona eventoIdActual, lo excluye de la búsqueda (útil para edición).
 */
function esNombreEventoDuplicado(nombre, listaEventos, eventoIdActual = null) {
  if (!nombre || !Array.isArray(listaEventos)) return false;
  const nombreNormalizado = nombre.trim().toLowerCase();
  return listaEventos.some(
    (evento) =>
      evento.nombre.trim().toLowerCase() === nombreNormalizado && evento.id !== eventoIdActual,
  );
}

/**
 * Validar Ids de eliminacion de Eventos
 */

function eliminarTipoEvento(listaEventos, idAEliminar) {
  if (!idAEliminar || idAEliminar.trim() === "") {
    return { error: "ID inválido", eventos: listaEventos };
  }

  const existe = listaEventos.some((e) => e.id === idAEliminar);
  if (!existe) {
    return { error: "El evento no existe", eventos: listaEventos };
  }

  // Devuelve la lista filtrada sin el evento eliminado
  return {
    error: null,
    eventos: listaEventos.filter((e) => e.id !== idAEliminar),
  };
}

module.exports = {
  validarTipoEvento,
  esNombreEventoDuplicado,
  eliminarTipoEvento,
};
