// src/validaciones-eventos.test.js
const { validarTipoEvento, esNombreEventoDuplicado, eliminarTipoEvento } = require('../validaciones-eventos');

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

// ================================================
// TESTS DE EDICIÓN DE EVENTOS
// ================================================

describe('M03 - Edición de Tipos de Evento', () => {

  // Test 1: Validar evento editado con datos válidos
  test('1. Retorna valido:true al editar evento con todos los campos correctos', () => {
    const eventoEditado = {
      nombre: 'Consulta Nutricional',
      duracion: 30,
      modalidad: 'Presencial'
    };
    const resultado = validarTipoEvento(eventoEditado);
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBeNull();
  });

  // Test 2: Detectar nombre duplicado al intentar cambiar nombre
  test('2. Retorna true si se intenta cambiar a nombre duplicado (diferente ID)', () => {
    const eventosExistentes = [
      { id: 'evt-1', nombre: 'Consulta Inicial' },
      { id: 'evt-2', nombre: 'Entrevista Técnica' }
    ];
    // Editando evt-1 e intentando cambiar a nombre de evt-2
    const resultado = esNombreEventoDuplicado('Entrevista Técnica', eventosExistentes, 'evt-1');
    expect(resultado).toBe(true);
  });

  // Test 3: Permitir mantener el mismo nombre al editar
  test('3. Retorna false cuando se mantiene el mismo nombre del evento siendo editado', () => {
    const eventosExistentes = [
      { id: 'evt-1', nombre: 'Consulta Inicial' },
      { id: 'evt-2', nombre: 'Entrevista Técnica' }
    ];
    // Editando evt-1 con su propio nombre (sin cambios)
    const resultado = esNombreEventoDuplicado('Consulta Inicial', eventosExistentes, 'evt-1');
    expect(resultado).toBe(false);
  });

  // Test 4: Rechazar duración inválida al editar
  test('4. Retorna valido:false si se intenta cambiar a duración no permitida', () => {
    const eventoConDuracionInvalida = {
      nombre: 'Taller Grupal',
      duracion: 25 // 25 no está entre [15, 30, 45, 60]
    };
    const resultado = validarTipoEvento(eventoConDuracionInvalida);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('Duración no permitida');
  });

  // Test 5: Rechazar modalidad inválida al editar
  test('5. Retorna valido:false si se intenta cambiar a modalidad no válida', () => {
    const eventoConModalidadInvalida = {
      nombre: 'Sesión Online',
      duracion: 45,
      modalidad: 'Híbrida' // No es Presencial, Virtual o Ambas
    };
    const resultado = validarTipoEvento(eventoConModalidadInvalida);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('Modalidad no válida');
  });

});

// ================================================
// TESTS DE CASOS BORDE (Ignacio Berridy)
// ================================================

describe('M03 - Casos borde de validación de Tipos de Evento', () => {

  // Test 1: Caso de error (no se envía ningún dato del evento)
  test('1. Retorna valido:false cuando no se envían datos del evento', () => {
    const resultado = validarTipoEvento(null);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('No se enviaron datos');
  });

  // Test 2: Caso límite (la duración llega como string desde el formulario)
  test('2. Retorna valido:true cuando la duración permitida llega como string', () => {
    const eventoDuracionTexto = {
      nombre: 'Mentoría',
      duracion: '45', // el <select> del formulario entrega el valor como texto
      modalidad: 'Ambas'
    };
    const resultado = validarTipoEvento(eventoDuracionTexto);
    expect(resultado.valido).toBe(true);
    expect(resultado.error).toBeNull();
  });

});


// ================================================
// TESTS DE ELIMINACION DE EVENTOS (Ramos Ignacio)
// ================================================


describe('M03 - Casos de lógica de eliminación de Tipos de Evento', () => {
  
  const listaBase = [
    { id: 'evt-1', nombre: 'Consulta Inicial' },
    { id: 'evt-2', nombre: 'Entrevista Técnica' }
  ];

  // Test 1: Caso exitoso (elimina correctamente un evento que sí existe)
  test('1. Retorna error:null y la lista actualizada cuando el ID del evento existe', () => {
    const resultado = eliminarTipoEvento(listaBase, 'evt-1');
    expect(resultado.error).toBeNull();
    expect(resultado.eventos).toHaveLength(1);
    expect(resultado.eventos[0].id).toBe('evt-2');
  });

  // Test 2: Caso de error (se intenta borrar un ID que no pertenece a ningún evento)
  test('2. Retorna error y la lista original intacta cuando el ID no existe', () => {
    const resultado = eliminarTipoEvento(listaBase, 'evt-99');
    expect(resultado.error).toBe('El evento no existe');
    expect(resultado.eventos).toHaveLength(2);
  });

  // Test 3: Caso de error (ausencia de datos en el ID)
  test('3. Retorna error por ID inválido cuando se envía un valor nulo', () => {
    const resultado = eliminarTipoEvento(listaBase, null);
    expect(resultado.error).toBe('ID inválido');
    expect(resultado.eventos).toHaveLength(2);
  });

  // Test 4: Caso borde (el ID llega como un string compuesto solo por espacios)
  test('4. Retorna error por ID inválido cuando el string está vacío o tiene solo espacios', () => {
    const resultado = eliminarTipoEvento(listaBase, '   ');
    expect(resultado.error).toBe('ID inválido');
    expect(resultado.eventos).toHaveLength(2);
  });

  // Test 5: Caso límite (la lista inicial contiene un solo evento y se elimina)
  test('5. Retorna error:null y deja la lista de eventos completamente vacía', () => {
    const listaUnica = [{ id: 'evt-1', nombre: 'Consulta Inicial' }];
    const resultado = eliminarTipoEvento(listaUnica, 'evt-1');
    expect(resultado.error).toBeNull();
    expect(resultado.eventos).toHaveLength(0);
  });

});


