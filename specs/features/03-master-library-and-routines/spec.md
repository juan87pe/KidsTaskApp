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
- **CUANDO** un padre asigne una tarea o rutina, el sistema deberá proveer 5 modalidades de programación persistiendo sus metadatos completos (`scheduleType`, `scheduleDetails`, `scheduleText`):
  1. *Para el Día Actual (Hoy)*.
  2. *Diaria Continua*.
  3. *Semanal / Días Fijos de la Semana* (`[L][M][X][J][V][S][D]`).
  4. *Fecha Específica* (`YYYY-MM-DD`).
  5. *Rango de Fechas / Período* (`fechaInicio` a `fechaFin`).
- **Universal:** La regla de recurrencia deberá registrarse en `assignedChildren` del catálogo maestro, pero la tarea **solo se inyectará de forma inmediata en la lista del día actual (`todayAssignments`) si la modalidad programada aplica efectivamente a la fecha de hoy** según el evaluador temporal `shouldScheduleApplyOnDate`.

### [REQ-LIB-006] Detección Preventiva de Duplicados en Tareas y Rutinas
- **SI** se intenta asignar una tarea maestra individual o inyectar una rutina que contiene una tarea que el niño ya tiene activa para la fecha destino, **ENTONCES** el sistema deberá activar el modal `DuplicateDetectionModal` ofreciendo:
  - *🔘 Omitir duplicado (Recomendado)*: No duplicar la tarea en la lista de hoy, guardando únicamente la regla de programación.
  - *⚪ Permitir como tarea adicional (x2)*: Crear una nueva instancia independiente con tag diferenciado (`instance_2`) preservando `masterTaskId`.

### [REQ-LIB-007] Visor Interactivo de Asignaciones Activas
- **CUANDO** un padre pulse sobre cualquier tarjeta de tarea o rutina en la biblioteca, el sistema deberá desplegar una ficha detallada mostrando:
  - Niños asignados con chips y avatares.
  - Reglas de programación temporal vigentes por cada hijo con detalles (`scheduleDetails`).
  - Estado dinámico de suspensión o pausa (calculado comparando la fecha actual contra `pausedUntil`).
  - Botones de acción rápida: `[ 🔄 Modificar Programación ]`, `[ ❌ Desasignar / Pausar ]`, `[ 🚀 Asignar a un nuevo hijo ]`.

### [REQ-LIB-008] Diálogo Contextual de Desasignación, Pausa Temporal y Alcance por Programación
- **CUANDO** un padre pulse el botón `[ ❌ Desasignar / Pausar ]` en la ficha de asignación de un hijo, el sistema deberá desplegar el modal interactivo `UnassignOrPauseModal` presentando opciones de alcance temporal adaptadas a la modalidad de programación activa de la tarea:
  - **SI** la tarea está programada de forma **Diaria Continua (`daily`)**, **ENTONCES** el sistema deberá ofrecer:
    1. *🔘 Solo por el día de hoy*: Eliminar la tarea únicamente de la jornada actual (`todayAssignments`) de ese niño registrando `skippedDate = today`, preservando la regla recurrente para los días venideros.
    2. *⚪ Pausar temporalmente por N días*: Suspender las asignaciones automáticas durante una cantidad configurable de días (selector numérico de 1 a 30 días con cálculo de fecha de reactivación `pausedUntil`), reanudándose automáticamente al vencer dicho lapso.
    3. *⚪ Desasignar de todas las futuras asignaciones (Permanente)*: Cancelar de forma definitiva la regla de asignación recurrente para ese hijo, removiéndolo de `assignedChildren` en la biblioteca.
  - **SI** la tarea está programada de forma **Semanal / Días Fijos (`weekly`)**, **ENTONCES** el sistema deberá ofrecer opciones contextuales a los días establecidos (ej. *Solo por este [Día] / ocurrencia actual*, *Pausar por N días/semanas*, o *Desasignar permanentemente de los días fijados*).
  - **SI** la tarea está programada para **Fecha Específica (`specific_date`)** o **Para el Día Actual (`today`)**, **ENTONCES** el sistema deberá ofrecer desasignar la instancia de dicha fecha puntual.
  - **SI** la tarea está programada por **Rango de Fechas / Período (`date_range`)**, **ENTONCES** el sistema deberá ofrecer suspender la ocurrencia de hoy o cancelar el período completo restante.
- **Universal:** Ante cualquier opción seleccionada de desasignación o pausa, la plantilla maestra en la biblioteca familiar (`masterTasks`) deberá permanecer intacta e inmutable para futuros usos o asignaciones a otros miembros.

### [REQ-LIB-009] Inyección Directa de Rutina a la Jornada
- **CUANDO** un padre use el botón `"🚀 Inyectar Rutina"` desde la Ficha Diaria de un hijo, el sistema deberá generar las tareas en el orden secuencial de la rutina para la fecha de hoy, aplicando la detección de duplicados correspondiente.

### [REQ-LIB-010] Visibilidad y Unificación de Tareas de Rutina en el Catálogo General
- **Universal:** El sistema deberá mostrar en la pestaña *"Banco de Tareas Maestras"* todas las tareas configuradas en el hogar, incluyendo aquellas que forman parte de una o más rutinas, identificándolas con una insignia o etiqueta con el nombre de la rutina asociada (ej. `[🏷️ Rutina Mañanera]`).
- **CUANDO** un padre cree una nueva tarea directamente dentro del constructor de rutinas (`RoutineMasterModal`), el sistema deberá persistirla simultáneamente en el catálogo general de `masterTasks` para que pueda ser visualizada, editada y asignada de forma individual e independiente.
