// frontend/src/gestion-reservas.js
// Reglas de estado, disponibilidad, bloqueo y cancelación de reservas (M03 / M04).
// Migrado desde los services del repo SistemaDeReserva-Modulo3 y adaptado a
// los nombres y valores que usa el frontend ("Automatica"/"Manual", fecha + hora).

const { validarDatosInvitado } = require("./validaciones-reserva");
const { esFechaReservable, cumpleAntelacionMinima } = require("./reglas-reserva");

const ESTADOS_CANCELABLES = ["Confirmada", "Pendiente"];
const MINUTOS_BLOQUEO_SLOT = 10;

/**
 * Determina el estado inicial de una reserva según el tipo de confirmación
 * del evento (M03-RF03): Automatica -> Confirmada, Manual -> Pendiente.
 */
function determinarEstadoReserva(confirmacion) {
  if (!confirmacion || typeof confirmacion !== "string") {
    return { estado: null, error: "El tipo de confirmación es obligatorio" };
  }

  const normalizado = confirmacion.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  if (normalizado === "automatica") return { estado: "Confirmada", error: null };
  if (normalizado === "manual") return { estado: "Pendiente", error: null };

  return { estado: null, error: "Tipo de confirmación no válido" };
}

/**
 * Cambia el tipo de confirmación de un evento. Las reservas ya registradas
 * conservan su estado: el cambio solo aplica a las reservas nuevas.
 */
function actualizarConfirmacionEvento(evento, nuevaConfirmacion, reservas = []) {
  const { error } = determinarEstadoReserva(nuevaConfirmacion);
  if (error) return { error, evento, reservas };

  return {
    error: null,
    evento: { ...evento, confirmacion: nuevaConfirmacion },
    reservas: reservas.map((reserva) => ({ ...reserva })),
  };
}

/**
 * Crea una reserva a partir de los datos del invitado y del turno elegido.
 * Si no se indica estado, la reserva queda "Pendiente".
 */
function crearReserva(datos, ahora = new Date()) {
  const validacion = validarDatosInvitado(datos);
  if (!validacion.valido) return { error: validacion.error, reserva: null };

  if (!datos.fecha || !datos.hora) {
    return { error: "La fecha y el horario de la reserva son obligatorios", reserva: null };
  }

  if (!esFechaReservable(datos.fecha, ahora)) {
    return { error: "La fecha de la reserva debe ser posterior al día de hoy", reserva: null };
  }

  return {
    error: null,
    reserva: {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      ...datos,
      creadaEn: ahora.toISOString(),
      estado: datos.estado || "Pendiente",
    },
  };
}

function aMinutos(hora) {
  if (typeof hora !== "string") return null;

  const hm = /^(\d{2}):(\d{2})$/.exec(hora.trim());
  if (!hm) return null;

  const horas = Number(hm[1]);
  const minutos = Number(hm[2]);
  if (horas > 23 || minutos > 59) return null;

  return horas * 60 + minutos;
}

/**
 * Valida que el rango [inicio, fin) no se superponga con ningún turno ocupado
 * (M04-RF03). Los horarios se expresan como "HH:MM".
 */
function validarDisponibilidadHorario(inicio, fin, ocupados = []) {
  const desde = aMinutos(inicio);
  const hasta = aMinutos(fin);

  if (desde === null || hasta === null) {
    return { valido: false, error: "Formato de horario inválido" };
  }

  if (desde >= hasta) {
    return { valido: false, error: "Rango horario inválido: el inicio debe ser anterior al fin" };
  }

  // Dos rangos se superponen si (inicioA < finB) y (finA > inicioB)
  const haySuperposicion = ocupados.some(
    (turno) => desde < aMinutos(turno.fin) && hasta > aMinutos(turno.inicio),
  );

  if (haySuperposicion) {
    return { valido: false, error: "El horario seleccionado ya no está disponible" };
  }

  return { valido: true, error: null };
}

/**
 * Bloquea temporalmente un slot por 10 minutos para el usuario que lo eligió
 * (M04-RF02). Si otro usuario tiene un bloqueo vigente sobre el mismo slot,
 * se informa el conflicto.
 */
function bloquearSlot(slot, usuario, bloqueos = [], ahora = new Date()) {
  const vigentes = bloqueos.filter((b) => b.expiraEn > ahora.getTime());

  const conflicto = vigentes.some(
    (b) => b.fecha === slot.fecha && b.hora === slot.hora && b.usuario !== usuario,
  );
  if (conflicto) {
    return {
      error: "Este horario acaba de ser seleccionado por otro usuario. Por favor, elegí uno nuevo",
      bloqueo: null,
      bloqueos,
    };
  }

  const bloqueo = {
    fecha: slot.fecha,
    hora: slot.hora,
    usuario,
    expiraEn: ahora.getTime() + MINUTOS_BLOQUEO_SLOT * 60 * 1000,
  };

  // Un usuario solo mantiene un slot bloqueado a la vez
  const otros = vigentes.filter((b) => b.usuario !== usuario);
  return { error: null, bloqueo, bloqueos: [...otros, bloqueo] };
}

/**
 * Devuelve el tiempo restante de un bloqueo con formato "MM:SS".
 */
function tiempoRestanteBloqueo(bloqueo, ahora = new Date()) {
  const segundos = Math.max(0, Math.ceil((bloqueo.expiraEn - ahora.getTime()) / 1000));
  const mm = String(Math.floor(segundos / 60)).padStart(2, "0");
  const ss = String(segundos % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/**
 * Cancela una reserva (M04-RF07). Solo se cancelan reservas confirmadas o
 * pendientes, y con al menos `limiteHoras` de anticipación al turno.
 */
function cancelarReserva(reserva, limiteHoras = 24, ahora = new Date()) {
  if (!ESTADOS_CANCELABLES.includes(reserva.estado)) {
    return { error: "Solo se pueden cancelar reservas confirmadas o pendientes", reserva };
  }

  if (!cumpleAntelacionMinima(reserva.fecha, reserva.hora, limiteHoras, ahora)) {
    return {
      error:
        "El plazo de cancelación de esta reserva venció. Contactá directamente al profesional.",
      reserva,
    };
  }

  return {
    error: null,
    reserva: { ...reserva, estado: "Cancelada", canceladaEn: ahora.toISOString() },
  };
}

module.exports = {
  determinarEstadoReserva,
  actualizarConfirmacionEvento,
  crearReserva,
  validarDisponibilidadHorario,
  bloquearSlot,
  tiempoRestanteBloqueo,
  cancelarReserva,
};
