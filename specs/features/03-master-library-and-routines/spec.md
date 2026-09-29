# Especificación de Requerimientos: 03. Biblioteca Familiar, Rutinas y Detección de Duplicados

> **Módulo:** `03-master-library-and-routines`  
> **Sintaxis:** EARS (*Easy Approach to Requirements Syntax*)  

---

## 1. Requerimientos Funcionales en Sintaxis EARS

### [REQ-LIB-001] Catálogo Maestro de Tareas
- **Universal:** El sistema deberá mantener un banco de tareas maestras reutilizables (`masterTasks`) independiente de las asignaciones diarias de los niños.

### [REQ-LIB-002] Creación y Edición de Tarea Maestra
- **CUANDO** un padre complete el formulario `TaskMasterModal` con título, puntos predeterminados, modo de aprobación, icono SVG y descripción/instrucciones opcionales, el sistema deberá guardar o actualizar la plantilla en el catálogo familiar.

### [REQ-LIB-003] Constructor de Rutinas con Reutilización
- **CUANDO** un padre configure una rutina en `RoutineMasterModal`, el sistema deberá permitir seleccionar tareas existentes del banco maestro mediante un checklist o agregar nuevas tareas al vuelo.

### [REQ-LIB-004] Orden Secuencial dentro de Rutinas
- **Universal:** El constructor de rutinas deberá permitir establecer el orden exacto (1°, 2°, 3°, 4°) en que se deben ejecutar las tareas dentro del paquete.

### [REQ-LIB-005] Motor de Programación Temporal de Tareas y Rutinas
- **CUANDO** un padre asigne una tarea o rutina, el sistema deberá proveer 5 modalidades de programación:
  1. *Para el Día Actual (Hoy)*.
  2. *Diaria Continua*.
  3. *Semanal / Días Fijos de la Semana* (`[L][M][X][J][V][S][D]`).
  4. *Fecha Específica* (`YYYY-MM-DD`).
  5. *Rango de Fechas / Período* (`fechaInicio` a `fechaFin`).

### [REQ-LIB-006] Detección Preventiva de Duplicados
- **SI** se intenta asignar una tarea o inyectar una rutina que contiene una tarea que el niño ya tiene activa para la fecha destino, **ENTONCES** el sistema deberá activar el modal `DuplicateDetectionModal` ofreciendo:
  - *🔘 Omitir duplicado (Recomendado)*: No duplicar la tarea.
  - *⚪ Permitir como tarea adicional (x2)*: Crear una nueva instancia independiente con tag diferenciado.

### [REQ-LIB-007] Visor Interactivo de Asignaciones Activas
- **CUANDO** un padre pulse sobre cualquier tarjeta de tarea o rutina en la biblioteca, el sistema deberá desplegar una ficha detallada mostrando:
  - Niños asignados con chips y avatares.
  - Reglas de programación temporal vigentes por cada hijo.
  - Botones de acción rápida: `[ 🔄 Modificar Programación ]`, `[ ❌ Desasignar / Pausar ]`, `[ 🚀 Asignar a un nuevo hijo ]`.

### [REQ-LIB-008] Desasignación sin Borrado de Catálogo
- **CUANDO** un padre desasigne o pause una tarea de un hijo, el sistema deberá suspender las futuras asignaciones diarias de ese niño manteniendo intacta la plantilla maestra en la biblioteca.

### [REQ-LIB-009] Inyección Directa de Rutina a la Jornada
- **CUANDO** un padre use el botón `"🚀 Inyectar Rutina"` desde la Ficha Diaria de un hijo, el sistema deberá generar las tareas en el orden secuencial de la rutina para la fecha de hoy, aplicando la detección de duplicados correspondiente.

### [REQ-LIB-010] Visibilidad y Unificación de Tareas de Rutina en el Catálogo General
- **Universal:** El sistema deberá mostrar en la pestaña *"Banco de Tareas Maestras"* todas las tareas configuradas en el hogar, incluyendo aquellas que forman parte de una o más rutinas, identificándolas con una insignia o etiqueta con el nombre de la rutina asociada (ej. `[🏷️ Rutina Mañanera]`).
- **CUANDO** un padre cree una nueva tarea directamente dentro del constructor de rutinas (`RoutineMasterModal`), el sistema deberá persistirla simultáneamente en el catálogo general de `masterTasks` para que pueda ser visualizada, editada y asignada de forma individual e independiente.
