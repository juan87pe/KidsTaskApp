# Especificación de Requerimientos: 05. Calendario de Auditoría y Corrección Retroactiva

> **Módulo:** `05-calendar-and-audit`  
> **Sintaxis:** EARS (*Easy Approach to Requirements Syntax*)  

---

## 1. Requerimientos Funcionales en Sintaxis EARS

### [REQ-CAL-001] Navegación de Calendario y Mapa de Calor
- **Universal:** El sistema deberá proveer un calendario interactivo que clasifique cada día según su estado de cumplimiento:
  - 🟢 **Verde:** 100% de tareas completadas y aprobadas.
  - 🟡 **Amarillo:** Cumplimiento parcial (al menos una tarea completada, con pendientes).
  - 🔴 **Rojo:** Sanciones aplicadas o tareas omitidas/no realizadas.
  - ⚪ **Gris:** Días sin tareas asignadas o fechas futuras.

### [REQ-CAL-002] Resumen de Balance Diario
- **CUANDO** un padre seleccione una fecha en el calendario, el sistema deberá calcular y presentar el resumen financiero neto del día: puntos ganados, penalizaciones aplicadas y premios canjeados.

### [REQ-CAL-003] Validación Retroactiva de Tareas Pasadas
- **CUANDO** un padre pulse `"Validar como Realizada Ahora (+Pts)"` sobre una tarea no realizada de un día anterior, el sistema deberá:
  1. Cambiar el estado de la tarea histórica a `approved`.
  2. Marcar el indicador `isRetroactivelyModified = true`.
  3. Emitir una transacción contable positiva acreditando los puntos al saldo del niño.
  4. Actualizar el color del mapa de calor de esa fecha.

### [REQ-CAL-004] Revocación de Aprobaciones Erróneas Pasadas
- **CUANDO** un padre pulse `"Modificar Validación / Desmarcar"` sobre una tarea previamente aprobada, el sistema deberá:
  1. Cambiar el estado de la tarea histórica a `uncompleted` o `rejected` y actualizar el color del mapa de calor de esa fecha.
  2. Marcar la tarea como modificada retroactivamente (`isRetroactivelyModified = true`).
  3. **DONDE** el hogar opere bajo la política `daily_reset` o `weekly_reset` y la tarea pertenezca a un día pasado ya cerrado, el débito compensatorio de puntos se aplicará al saldo de la **jornada actual (hoy)** si dichos puntos fueron consumidos en un canje o auto-liquidación previa, manteniendo el balance del hogar exacto.

### [REQ-CAL-005] Anulación y Reembolso de Canjes Pasados
- **CUANDO** un padre pulse `"Anular y Reembolsar Canje"` sobre un premio canjeado en una fecha pasada o actual, el sistema deberá:
  1. Marcar la transacción original como `isReversed = true`.
  2. Generar una transacción compensatoria de tipo `refund_reversal` acreditando los puntos devueltos.
  3. **DONDE** el hogar opere bajo la política `daily_reset` o `weekly_reset` y la anulación se realice sobre una fecha pasada ya caducada, el sistema deberá acreditar los puntos devueltos en la **jornada activa del día actual (hoy)** para garantizar que el niño pueda canjearlos antes del siguiente ciclo de reinicio.

### [REQ-CAL-006] Auditoría y Corrección de Bonos/Sanciones
- **CUANDO** un padre elimine o edite un bono o sanción de una fecha pasada en el panel de detalle, el sistema deberá recalcular automáticamente el balance contable del niño.

### [REQ-CAL-007] Calendario Infantil Gamificado (Solo Lectura)
- **Universal:** La vista de calendario del niño (`KidCalendarAchievements`) deberá mostrar insignias de estrellas doradas y tarjetas de logros alcanzados en modo de **estricta solo lectura**, sin permitir modificaciones de datos ni saldos.
