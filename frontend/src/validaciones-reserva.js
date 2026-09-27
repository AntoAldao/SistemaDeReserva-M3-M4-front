// frontend/src/validaciones-reserva.js

/**
 * Valida los datos personales requeridos al confirmar una reserva.
 */
function validarDatosInvitado(datos) {
  if (!datos) return { valido: false, error: 'No se enviaron datos del invitado' };

  if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    return { valido: false, error: 'El nombre es obligatorio' };
  }

  if (!datos.apellido || typeof datos.apellido !== 'string' || datos.apellido.trim() === '') {
    return { valido: false, error: 'El apellido es obligatorio' };
  }

  // Validación de formato de correo estándar
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!datos.email || !emailRegex.test(datos.email.trim())) {
    return { valido: false, error: 'Formato de correo electrónico inválido' };
  }

  return { valido: true, error: null };
}

/**
 * Determina si un horario (slot) está libre para reservar.
 */
function esSlotDisponible(hora, slotsOcupados = ['11:00']) {
  if (!hora || typeof hora !== 'string') return false;
  return !slotsOcupados.includes(hora.trim());
}

module.exports = {
  validarDatosInvitado,
  esSlotDisponible
};