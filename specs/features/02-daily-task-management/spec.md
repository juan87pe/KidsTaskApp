# Especificación de Requerimientos: 02. Gestión Diaria de Tareas y Flujo de Aprobaciones

> **Módulo:** `02-daily-task-management`  
> **Sintaxis:** EARS (*Easy Approach to Requirements Syntax*)  

---

## 1. Requerimientos Funcionales en Sintaxis EARS

### [REQ-TASK-001] Visualización Cronológica Diaria
- **Universal:** El sistema deberá mostrar la lista de tareas asignadas al niño para la fecha actual ordenadas de forma sugerida por su índice secuencial (`orderIndex`), sirviendo como guía visual del día.

### [REQ-TASK-002] Reordenamiento Secuencial por Padres
- **CUANDO** un padre autenticado arrastre una tarea o use las flechas de reordenamiento (▲ / ▼) en la Ficha de Control Diario, el sistema deberá actualizar el valor `orderIndex` de todas las tareas afectadas y sincronizar inmediatamente la vista del niño.

### [REQ-TASK-003] Despliegue de Instrucciones y Notas
- **DONDE** una tarea posea una descripción o instrucciones redactadas, el sistema deberá mostrar un botón desplegable `[ ℹ️ Ver detalle / nota ▾ ]` tanto en la vista infantil como en la vista parental.

### [REQ-TASK-004] Solicitud de Validación por el Niño (Ejecución No Lineal)
- **CUANDO** un niño en modo `child` pulse el botón `"¡Ya la hice! 🚀"` en **cualquier tarea** con modo `kid_request` (sin importar su posición o si existen tareas previas sin completar), el sistema deberá cambiar el estado de dicha tarea a `requested`, mostrar la píldora `"Esperando a papá/mamá ⏳"` e incrementar el contador de tareas pendientes en el Centro de Aprobaciones.

### [REQ-TASK-005] Aprobación Parental en 1-Clic
- **CUANDO** un padre pulse `"Aprobar ✔️"` en el Centro de Aprobaciones o en la Ficha Diaria, el sistema deberá:
  1. Cambiar el estado de la tarea a `approved`.
  2. Registrar la marca de tiempo de completado (`completedAt`).
  3. Emitir una transacción de tipo `task_reward` sumando los puntos al saldo del niño (`currentPoints += points`).
  4. Disparar confeti visual y feedback auditivo de felicitación.

### [REQ-TASK-006] Rechazo de Solicitud de Tarea
- **CUANDO** un padre pulse `"Rechazar ✕"` en una tarea pendiente de visto bueno, el sistema deberá revertir el estado de la tarea a `pending` para permitir que el niño la vuelva a intentar, sin otorgar puntos.

### [REQ-TASK-007] Validación Directa por Padres (Modo Solo Padres)
- **DONDE** una tarea esté configurada como `parent_only`, el botón interactivo no estará disponible para el niño y mostrará la leyenda `"Marcado por Padres 👨‍👩‍👦"`, permitiendo su validación únicamente desde el rol parental.

### [REQ-TASK-008] Aprobación Masiva de Tareas Pendientes
- **CUANDO** un padre pulse el botón flotante `"Aprobar Todas las Tareas 🚀"` en el Centro de Aprobaciones, el sistema deberá aprobar en lote todas las solicitudes pendientes y acreditar la suma total de puntos acumulados.

### [REQ-TASK-009] Edición Rápida de Tarea para el Día
- **CUANDO** un padre edite los puntos o título de una tarea asignada en la Ficha Diaria, el sistema deberá actualizar únicamente la instancia de hoy sin modificar la plantilla maestra en la biblioteca.

### [REQ-TASK-010] Eliminación de Tarea de la Jornada
- **CUANDO** un padre confirme la eliminación de una tarea desde la Ficha Diaria, el sistema deberá removerla de la lista de hoy de ese niño sin afectar otros días ni a otros hermanos.

### [REQ-TASK-011] Autonomía y Marcado Flexible No Lineal
- **Universal:** El sistema no deberá imponer dependencias ni bloqueos lineales entre tareas; cada tarea asignada en el día es una unidad autónoma que puede ser realizada, solicitada o validada en cualquier orden cronológico según la conveniencia práctica del niño.
