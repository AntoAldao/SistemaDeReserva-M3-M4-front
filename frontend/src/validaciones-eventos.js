// src/validaciones-eventos.js

/**
 * Valida los datos requeridos para dar de alta un tipo de evento.
 */
function validarTipoEvento(datos) {
  if (!datos) return { valido: false, error: 'No se enviaron datos' };
  
  if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    return { valido: false, error: 'El nombre es obligatorio' };
  }

  const duracionesValidas = [15, 30, 45, 60];
  if (!duracionesValidas.includes(Number(datos.duracion))) {
    return { valido: false, error: 'Duración no permitida' };
  }

  const modalidadesValidas = ['Presencial', 'Virtual', 'Ambas'];
  if (!modalidadesValidas.includes(datos.modalidad)) {
    return { valido: false, error: 'Modalidad no válida' };
  }

  return { valido: true, error: null };
}

/**
 * Verifica si el nombre propuesto ya existe dentro del listado existente.
 */
function esNombreEventoDuplicado(nombre, listaEventos) {
  if (!nombre || !Array.isArray(listaEventos)) return false;
  const nombreNormalizado = nombre.trim().toLowerCase();
  return listaEventos.some(evento => evento.nombre.trim().toLowerCase() === nombreNormalizado);
}

module.exports = {
  validarTipoEvento,
  esNombreEventoDuplicado
};