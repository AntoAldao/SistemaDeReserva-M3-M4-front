// =====================================================================
// AgendaYA - Frontend mínimo TP6 (M03 - Tipos de Evento / M04 - Booking)
// Datos guardados en memoria (no hay backend real).
// =====================================================================

// ---- Estado global ----
let events = [
  {
    id: "evt-1",
    nombre: "Consulta Inicial",
    duracion: "45",
    modalidad: "Virtual",
    confirmacion: "Automatica",
    descripcion: "Primera reunión de diagnóstico.",
    activo: true,
  },
  {
    id: "evt-2",
    nombre: "Entrevista Técnica",
    duracion: "30",
    modalidad: "Presencial",
    confirmacion: "Manual",
    descripcion: "Entrevista de evaluación técnica.",
    activo: true,
  },
];

let bookings = []; // reservas confirmadas: { eventId, fecha, hora, nombre, apellido, email }

// Slots base ofrecidos para cualquier fecha (simulación de disponibilidad M02)
const BASE_SLOTS = ["09:00", "10:00", "11:00", "14:00", "16:00"];

let editingEventId = null; // si no es null, el form de M03 está en modo edición

let bookingState = {
  eventId: null,
  fecha: null,
  hora: null,
};

// =====================================================================
// NAVEGACIÓN ENTRE VISTAS (Admin / Público)
// =====================================================================
function showView(view) {
  document.getElementById("view-admin").classList.toggle("active-view", view === "admin");
  document.getElementById("view-public").classList.toggle("active-view", view === "public");
  document.getElementById("nav-admin").classList.toggle("active", view === "admin");
  document.getElementById("nav-public").classList.toggle("active", view === "public");

  if (view === "public") {
    resetBookingFlow();
  }
}

// =====================================================================
// M03 - GESTIÓN DE TIPOS DE EVENTO (ABM)
// =====================================================================

document.getElementById("event-form").addEventListener("submit", function (e) {
  e.preventDefault();
  handleEventSubmit();
});

function handleEventSubmit() {
  const nombre = document.getElementById("event-name-input").value.trim();
  const duracion = document.getElementById("event-duration-select").value;
  const modalidad = document.querySelector('input[name="modalidad"]:checked');
  const confirmacion = document.querySelector('input[name="confirmacion"]:checked');
  const descripcion = document.getElementById("event-description-input").value.trim();

  const errorBox = document.getElementById("event-error");

  // Validación: campos obligatorios (M03-RNF05)
  if (!nombre || !duracion || !modalidad || !confirmacion) {
    showError(errorBox, "Todos los campos marcados con * son obligatorios.");
    return;
  }

  // Validación: nombre de evento duplicado (excepto si estoy editando el mismo)
  const nombreDuplicado = events.some(
    (ev) => ev.nombre.toLowerCase() === nombre.toLowerCase() && ev.id !== editingEventId
  );
  if (nombreDuplicado) {
    showError(errorBox, "Ya existe un tipo de evento con ese nombre.");
    return;
  }

  hideError(errorBox);

  if (editingEventId) {
    // Editar evento existente
    const ev = events.find((e) => e.id === editingEventId);
    ev.nombre = nombre;
    ev.duracion = duracion;
    ev.modalidad = modalidad.value;
    ev.confirmacion = confirmacion.value;
    ev.descripcion = descripcion;

    showSuccess(document.getElementById("event-confirmation"), `Tipo de evento "${nombre}" modificado correctamente.`);
    cancelEdit();
  } else {
    // Crear nuevo evento
    const newEvent = {
      id: "evt-" + Date.now(),
      nombre,
      duracion,
      modalidad: modalidad.value,
      confirmacion: confirmacion.value,
      descripcion,
      activo: true,
    };
    events.push(newEvent);
    showSuccess(document.getElementById("event-confirmation"), `Tipo de evento "${nombre}" creado correctamente.`);
    document.getElementById("event-form").reset();
  }

  renderEventsList();
}

function editEvent(id) {
  const ev = events.find((e) => e.id === id);
  if (!ev) return;

  editingEventId = id;
  document.getElementById("event-id-hidden").value = id;
  document.getElementById("event-name-input").value = ev.nombre;
  document.getElementById("event-duration-select").value = ev.duracion;
  document.querySelector(`input[name="modalidad"][value="${ev.modalidad}"]`).checked = true;
  document.querySelector(`input[name="confirmacion"][value="${ev.confirmacion}"]`).checked = true;
  document.getElementById("event-description-input").value = ev.descripcion;

  document.getElementById("form-title").textContent = "Editar Tipo de Evento";
  document.getElementById("cancel-edit-event").classList.remove("hidden");
  hideError(document.getElementById("event-error"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  editingEventId = null;
  document.getElementById("event-form").reset();
  document.getElementById("event-id-hidden").value = "";
  document.getElementById("form-title").textContent = "Crear Tipo de Evento";
  document.getElementById("cancel-edit-event").classList.add("hidden");
}

function deleteEvent(id) {
  events = events.filter((e) => e.id !== id);
  renderEventsList();
}

function toggleEventActive(id) {
  const ev = events.find((e) => e.id === id);
  if (ev) ev.activo = !ev.activo;
  renderEventsList();
}

function renderEventsList() {
  const list = document.getElementById("events-list");
  const emptyMsg = document.getElementById("events-empty");
  list.innerHTML = "";

  if (events.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");

  events.forEach((ev) => {
    const row = document.createElement("div");
    row.className = "event-row" + (ev.activo ? "" : " inactive");
    row.setAttribute("data-cy", `event-row-${ev.id}`);

    row.innerHTML = `
      <div class="event-info">
        <strong>${ev.nombre}</strong>
        <small>${ev.duracion} min · ${ev.modalidad} · ${ev.confirmacion} · ${ev.activo ? "Activo" : "Inactivo"}</small>
      </div>
      <div class="actions">
        <button data-cy="edit-event-${ev.id}">Editar</button>
        <button data-cy="toggle-event-${ev.id}">${ev.activo ? "Desactivar" : "Activar"}</button>
        <button data-cy="delete-event-${ev.id}">Eliminar</button>
      </div>
    `;

    row.querySelector(`[data-cy="edit-event-${ev.id}"]`).addEventListener("click", () => editEvent(ev.id));
    row.querySelector(`[data-cy="toggle-event-${ev.id}"]`).addEventListener("click", () => toggleEventActive(ev.id));
    row.querySelector(`[data-cy="delete-event-${ev.id}"]`).addEventListener("click", () => deleteEvent(ev.id));

    list.appendChild(row);
  });
}

// =====================================================================
// M04 - PROCESO DE RESERVA (BOOKING PÚBLICO)
// =====================================================================

function goToStep(stepNumber) {
  document.querySelectorAll(".booking-step").forEach((s) => s.classList.remove("active-step"));
  document.getElementById(`step-${stepNumber}`).classList.add("active-step");

  document.querySelectorAll(".stepper .step").forEach((s, idx) => {
    s.classList.toggle("active", idx === stepNumber - 1);
  });
}

function renderCatalog() {
  const catalog = document.getElementById("event-catalog");
  const emptyMsg = document.getElementById("catalog-empty");
  catalog.innerHTML = "";

  const activeEvents = events.filter((e) => e.activo);

  if (activeEvents.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");

  activeEvents.forEach((ev) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.setAttribute("data-cy", `event-card-${ev.id}`);
    card.innerHTML = `
      <strong>${ev.nombre}</strong>
      <small>${ev.duracion} min · ${ev.modalidad}</small>
      <p>${ev.descripcion || ""}</p>
    `;
    card.addEventListener("click", () => selectEvent(ev.id));
    catalog.appendChild(card);
  });
}

function selectEvent(eventId) {
  bookingState.eventId = eventId;
  const ev = events.find((e) => e.id === eventId);
  document.getElementById("selected-event-name").textContent = ev.nombre;

  // Reset fecha/hora al cambiar de evento
  bookingState.fecha = null;
  bookingState.hora = null;
  document.getElementById("date-input").value = "";
  document.getElementById("slots-container").innerHTML = "";

  goToStep(2);
}

document.getElementById("date-input").addEventListener("change", function () {
  bookingState.fecha = this.value;
  bookingState.hora = null;
  renderSlots();
});

function renderSlots() {
  const container = document.getElementById("slots-container");
  container.innerHTML = "";

  if (!bookingState.fecha) return;

  // Simulación: el slot 11:00 figura como ya reservado (para probar el caso "no disponible")
  const ocupados = ["11:00"];

  BASE_SLOTS.forEach((hora) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slot-btn";
    btn.textContent = hora;
    btn.setAttribute("data-cy", `slot-${hora.replace(":", "")}`);

    if (ocupados.includes(hora)) {
      btn.classList.add("unavailable");
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => selectSlot(hora, btn));
    }

    container.appendChild(btn);
  });
}

function selectSlot(hora, btnEl) {
  document.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));
  btnEl.classList.add("selected");
  bookingState.hora = hora;
  hideError(document.getElementById("booking-error-step2"));
}

function goToStep3() {
  const errorBox = document.getElementById("booking-error-step2");

  if (!bookingState.fecha || !bookingState.hora) {
    showError(errorBox, "Debés seleccionar una fecha y un horario disponible antes de continuar.");
    return;
  }
  hideError(errorBox);

  const ev = events.find((e) => e.id === bookingState.eventId);
  document.getElementById("booking-summary").innerHTML = `
    <strong>${ev.nombre}</strong><br/>
    ${formatDate(bookingState.fecha)} · ${bookingState.hora} hs · Confirmación ${ev.confirmacion}
  `;

  goToStep(3);
}

function confirmBooking() {
  const nombre = document.getElementById("guest-name-input").value.trim();
  const apellido = document.getElementById("guest-lastname-input").value.trim();
  const email = document.getElementById("guest-email-input").value.trim();
  const errorBox = document.getElementById("booking-error-step3");

  // Validación de campos obligatorios
  if (!nombre || !apellido || !email) {
    showError(errorBox, "Nombre, apellido y correo electrónico son obligatorios.");
    return;
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError(errorBox, "Por favor, ingresá un correo electrónico válido.");
    return;
  }

  hideError(errorBox);

  const ev = events.find((e) => e.id === bookingState.eventId);
  const estado = ev.confirmacion === "Automatica" ? "Confirmada" : "Pendiente";

  bookings.push({
    eventId: ev.id,
    fecha: bookingState.fecha,
    hora: bookingState.hora,
    nombre,
    apellido,
    email,
    estado,
  });

  document.getElementById("booking-confirmation").innerHTML = `
    <h2>✔ Reserva ${estado === "Confirmada" ? "confirmada" : "registrada, pendiente de aprobación"}</h2>
    <div class="details">
      <strong>${ev.nombre}</strong><br/>
      ${formatDate(bookingState.fecha)} · ${bookingState.hora} hs<br/>
      Invitado: ${nombre} ${apellido}<br/>
      Email: ${email}<br/>
      Estado: ${estado}
    </div>
  `;

  goToStep(4);
}

function resetBookingFlow() {
  bookingState = { eventId: null, fecha: null, hora: null };
  document.getElementById("guest-name-input").value = "";
  document.getElementById("guest-lastname-input").value = "";
  document.getElementById("guest-email-input").value = "";
  hideError(document.getElementById("booking-error-step2"));
  hideError(document.getElementById("booking-error-step3"));
  renderCatalog();
  goToStep(1);
}

// =====================================================================
// HELPERS
// =====================================================================
function showError(el, message) {
  el.textContent = message;
  el.classList.remove("hidden");
}

function hideError(el) {
  el.classList.add("hidden");
  el.textContent = "";
}

function showSuccess(el, message) {
  el.textContent = message;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 3000);
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

// =====================================================================
// INIT
// =====================================================================
renderEventsList();
renderCatalog();
