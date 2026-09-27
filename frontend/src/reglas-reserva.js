// Reglas de negocio del booking público (M04), separadas de la interfaz.
// Hoy y las fechas pasadas no se pueden reservar. Un turno además tiene que
// respetar la antelación mínima configurada por el administrador.

function parseFechaISO(fechaIso) {
  if (typeof fechaIso !== 'string') return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaIso.trim());
  if (!match) return null;

  const anio = Number(match[1]);
  const mes = Number(match[2]);
  const dia = Number(match[3]);
  const fecha = new Date(anio, mes - 1, dia);

  if (
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia
  ) {
    return null;
  }

  return fecha;
}

function inicioDelDia(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

/**
 * La fecha es reservable solo si es un día posterior al de referencia.
 * El mismo día se rechaza: un turno de hoy puede haber quedado en el pasado.
 */
function esFechaReservable(fechaIso, referencia = new Date()) {
  const fecha = parseFechaISO(fechaIso);
  if (!fecha || !(referencia instanceof Date) || Number.isNaN(referencia.getTime())) {
    return false;
  }

  return fecha.getTime() > inicioDelDia(referencia).getTime();
}

/**
 * El turno cumple la antelación cuando su inicio es igual o posterior a
 * ahora + antelacionHoras. Menos que ese mínimo no alcanza.
 */
function cumpleAntelacionMinima(fechaIso, hora, antelacionHoras, ahora = new Date()) {
  if (typeof antelacionHoras !== 'number' || !Number.isFinite(antelacionHoras) || antelacionHoras < 0) {
    return false;
  }
  if (!(ahora instanceof Date) || Number.isNaN(ahora.getTime())) return false;

  const fecha = parseFechaISO(fechaIso);
  if (!fecha || typeof hora !== 'string') return false;

  const hm = /^(\d{2}):(\d{2})$/.exec(hora.trim());
  if (!hm) return false;

  const horas = Number(hm[1]);
  const minutos = Number(hm[2]);
  if (horas > 23 || minutos > 59) return false;

  const turno = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    horas,
    minutos,
    0,
    0
  );

  const limite = ahora.getTime() + antelacionHoras * 60 * 60 * 1000;
  return turno.getTime() >= limite;
}

module.exports = {
  esFechaReservable,
  cumpleAntelacionMinima,
};
