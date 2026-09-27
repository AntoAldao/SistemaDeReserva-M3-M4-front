// src/validaciones-eventos.test.js
const { validarTipoEvento, esNombreEventoDuplicado } = require('../validaciones-eventos');

describe('M03 - Validaciones de Tipos de Evento', () => {

  // ==========================================
  // FUNCIÓN 1: validarTipoEvento (3 tests)
  // ==========================================

  // Caso 1: Caso normal / válido (Happy path)
  test('1. Retorna valido:true cuando todos los campos son correctos', () => {
    const eventoValido = {
      nombre: 'Consulta Médica',
      duracion: 30,
      modalidad: 'Virtual'
    };
    const resultado = validarTipoEvento(eventoValido);
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBeNull();
  });

  // Caso 2: Caso de error (nombre vacío o sólo espacios)
  test('2. Retorna valido:false si el nombre está vacío', () => {
    const eventoInvalido = {
      nombre: '   ',
      duracion: 30,
      modalidad: 'Virtual'
    };
    const resultado = validarTipoEvento(eventoInvalido);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('El nombre es obligatorio');
  });

  // Caso 3: Caso de error / límite (duración inválida o fuera de las permitidas)
  test('3. Retorna valido:false si la duración no es un valor estándar permitido', () => {
    const eventoDuracionInvalida = {
      nombre: 'Taller Grupal',
      duracion: 20, // 20 no está entre [15, 30, 45, 60]
      modalidad: 'Presencial'
    };
    const resultado = validarTipoEvento(eventoDuracionInvalida);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('Duración no permitida');
  });

  // ==========================================
  // FUNCIÓN 2: esNombreEventoDuplicado (2 tests)
  // ==========================================

  // Caso 4: Caso positivo / detección de duplicado insensible a mayúsculas
  test('4. Retorna true si ya existe un evento con el mismo nombre (ignora mayúsculas/minúsculas)', () => {
    const eventosExistentes = [
      { id: 1, nombre: 'Consulta Inicial' },
      { id: 2, nombre: 'Seguimiento' }
    ];
    const resultado = esNombreEventoDuplicado('consulta inicial', eventosExistentes);
    expect(resultado).toBe(true);
  });

  // Caso 5: Caso normal (nombre nuevo no existente)
  test('5. Retorna false cuando el nombre no coincide con ningún evento previo', () => {
    const eventosExistentes = [
      { id: 1, nombre: 'Consulta Inicial' }
    ];
    const resultado = esNombreEventoDuplicado('Asesoría Legal', eventosExistentes);
    expect(resultado).toBe(false);
  });

});