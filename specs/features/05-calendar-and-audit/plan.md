# Plan de Implementación: 05. Calendario y Auditoría

> **Módulo:** `05-calendar-and-audit`  
> **Estrategia:** Tareas Atómicas y Verificables  

---

## 1. Arquitectura y Componentes Clave

- **Componentes:**
  - `src/components/Calendar/ParentCalendarAudit.jsx`: Calendario mensual interactivo con mapa de calor, selector de hijo y panel detallado de auditoría diaria.
  - `src/components/Kid/KidCalendarAchievements.jsx`: Calendario gamificado de estrellas y logros para los niños.
- **Operaciones de Corrección Retroactiva en Contexto:**
  - `retroactiveValidateTask(taskId, childId, date)`
  - `retroactiveRevokeTask(taskId, childId, date)`
  - `refundRedemption(transactionId, childId)`

---

## 2. Checklist de Tareas Atómicas

- [x] `TASK-CAL-01`: Diseñar algoritmo de cálculo de color del mapa de calor por fecha (Verde/Amarillo/Rojo/Gris) basado en `dailyAssignments` y `transactions`.
- [x] `TASK-CAL-02`: Desarrollar `ParentCalendarAudit.jsx` con navegación de mes/año y panel de desglose financiero del día.
- [x] `TASK-CAL-03`: Implementar lógica de validación retroactiva de tareas (`retroactiveValidateTask`) con ajuste de puntos y bandera `isRetroactivelyModified`.
- [x] `TASK-CAL-04`: Implementar lógica de revocación de tareas previamente aprobadas (`retroactiveRevokeTask`) con deducción contable.
- [x] `TASK-CAL-05`: Implementar función de reembolso de canjes de premios (`refundRedemption`) con emisión de `refund_reversal`.
- [x] `TASK-CAL-06`: Construir `KidCalendarAchievements.jsx` con visualización lúdica de estrellas y tarjetas de logros.
- [x] `TASK-CAL-07`: Añadir pruebas automatizadas para el recálculo contable y consistencia de saldos en correcciones históricas (`src/test/features/05-calendar-and-audit.test.jsx`).
- [x] `TASK-CAL-08`: Segregar estructuralmente las sanciones (`penaltiesList`) de las tareas en `calendarHistory` y adaptar la UI de `ParentCalendarAudit.jsx`.
- [x] `TASK-CAL-09`: Implementar función de reversión de bonos y sanciones pasadas (`revertPastBonusOrPenalty`) con recálculo de balance neto y mapa de calor.
- [x] `TASK-CAL-10`: Garantizar idempotencia en reembolsos de canjes (`isRefunded`) y emisión estricta del tipo `retroactive_adjustment` en el ledger.
