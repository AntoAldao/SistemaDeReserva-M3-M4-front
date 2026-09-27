// frontend/src/validaciones-reserva.test.js
const { validarDatosInvitado, esSlotDisponible } = require('../validaciones-reserva');

describe('M04 - Validaciones del Proceso de Reserva (Booking Público)', () => {

  // ==========================================
  // FUNCIÓN 1: validarDatosInvitado (3 tests)
  // ==========================================

  // Test 1: Caso exitoso (Happy path)
  test('1. Retorna valido:true cuando nombre, apellido y email son válidos', () => {
    const datosValidos = {
      nombre: 'Lucía',
      apellido: 'Gómez',
      email: 'lucia.gomez@example.com'
    };
    const resultado = validarDatosInvitado(datosValidos);
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBeNull();
  });

  // Test 2: Caso de error (apellido vacío o sólo espacios)
  test('2. Retorna valido:false si el apellido está ausente o vacío', () => {
    const datosSinApellido = {
      nombre: 'Lucía',
      apellido: '   ',
      email: 'lucia@example.com'
    };
    const resultado = validarDatosInvitado(datosSinApellido);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('El apellido es obligatorio');
  });

  // Test 3: Caso de error / límite (email sin formato válido)
  test('3. Retorna valido:false cuando el email no tiene un formato válido (@ o dominio)', () => {
    const datosEmailInvalido = {
      nombre: 'Lucía',
      apellido: 'Gómez',
      email: 'correo-sin-arroba.com'
    };
    const resultado = validarDatosInvitado(datosEmailInvalido);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('Formato de correo electrónico inválido');
  });

  // ==========================================
  // FUNCIÓN 2: esSlotDisponible (2 tests)
  // ==========================================

  // Test 4: Caso de error / slot no disponible (simula el slot 11:00 ocupado)
  test('4. Retorna false si el horario seleccionado figura como ocupado', () => {
    const horarioOcupado = '11:00';
    const resultado = esSlotDisponible(horarioOcupado);
    expect(resultado).toBe(false);
  });

  // Test 5: Caso exitoso / slot libre
  test('5. Retorna true si el horario seleccionado no está dentro de la lista de ocupados', () => {
    const horarioLibre = '14:30';
    const resultado = esSlotDisponible(horarioLibre);
    expect(resultado).toBe(true);
  });

});