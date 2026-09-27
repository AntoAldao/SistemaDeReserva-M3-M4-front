describe('AgendaYA - M03: Gestión de Tipos de Evento', () => {

  // Hook que se ejecuta de forma automática antes de cada test
  beforeEach(() => {
    // Carga la página principal del frontend sobre la URL configurada en baseUrl
    cy.visit('/index.html')
  })

  /* ==========================================================================
     TEST 1: Flujo Exitoso (Happy Path)
     Propósito: Verificar que un usuario administrador puede dar de alta un
     nuevo tipo de evento completando todos los campos requeridos, y que el
     sistema confirma la acción e incorpora el elemento a la lista visual.
     ========================================================================== */
  it('Test 1 [Happy Path]: Debe permitir registrar un tipo de evento completando campos válidos', () => {
    
    // ------------------------------------------------------------------------
    // ARRANGE: Preparación del escenario de prueba
    // Se completan los campos obligatorios del formulario utilizando selectores data-cy
    // ------------------------------------------------------------------------
    cy.get('[data-cy="event-name-input"]')
      .type('Consulta Nutricional') // Ingresa el nombre del evento
      
    cy.get('[data-cy="event-duration-select"]')
      .select('30') // Selecciona la duración (30 minutos)
      
    cy.get('[data-cy="event-modality-virtual"]')
      .check() // Marca la modalidad Virtual
      
    cy.get('[data-cy="event-confirmation-auto"]')
      .check() // Marca el tipo de confirmación Automática
      
    cy.get('[data-cy="event-description-input"]')
      .type('Primera sesión informativa online.') // Agrega una descripción pública

    // ------------------------------------------------------------------------
    // ACT: Ejecución de la acción del usuario
    // Dispara el evento submit presionando el botón "Guardar"
    // ------------------------------------------------------------------------
    cy.get('[data-cy="submit-event"]').click()

    // ------------------------------------------------------------------------
    // ASSERT: Verificación de los resultados esperados
    // Se comprueba que la interfaz reaccione conforme a las reglas de negocio
    // ------------------------------------------------------------------------
    
    // Verificación 1: El cartel de confirmación o éxito debe estar visible para el usuario
    cy.get('[data-cy="event-confirmation"]')
      .should('be.visible')

    // Verificación 2: El nuevo evento registrado debe figurar dentro del contenedor de listado
    cy.get('[data-cy="events-list"]')
      .should('contain', 'Consulta Nutricional')
    
    // Verificación 3: El mensaje que indica "lista vacía" debe quedar oculto
    cy.get('[data-cy="events-empty"]')
      .should('have.class', 'hidden')
  })

  /* ==========================================================================
     TEST 2: Flujo de Error / Validación (Negative Test)
     Propósito: Verificar que el sistema bloquea el guardado cuando los campos
     obligatorios están vacíos, impidiendo crear el evento y mostrando un
     mensaje de error visible.
     ========================================================================== */
  it('Test 2 [Caso de Error]: Debe bloquear el envío y mostrar mensaje de error al dejar campos requeridos vacíos', () => {
    
    // ------------------------------------------------------------------------
    // ARRANGE: Preparación del escenario con datos inválidos
    // Nos aseguramos de que el campo de nombre quede completamente vacío
    // ------------------------------------------------------------------------
    cy.get('[data-cy="event-name-input"]').clear()

    // ------------------------------------------------------------------------
    // ACT: Ejecución de la acción
    // Intenta enviar el formulario sin completar los datos requeridos
    // ------------------------------------------------------------------------
    cy.get('[data-cy="submit-event"]').click()

    // ------------------------------------------------------------------------
    // ASSERT: Verificación de la validación del sistema
    // ------------------------------------------------------------------------
    
    // Verificación 1: El contenedor del mensaje de error debe ser visible y no poseer la clase hidden
    cy.get('[data-cy="event-error"]')
      .should('be.visible')
      .and('not.have.class', 'hidden')

    // Verificación 2: El cartel de confirmación exitosa NO debe aparecer bajo ninguna circunstancia
    cy.get('[data-cy="event-confirmation"]')
      .should('have.class', 'hidden')
  })

})