# Plan de Implementación: 02. Gestión Diaria de Tareas y Aprobaciones

> **Módulo:** `02-daily-task-management`  
> **Estrategia:** Tareas Atómicas y Verificables  

---

## 1. Arquitectura y Componentes Clave

- **Componentes:**
  - `src/components/Kid/KidDashboard.jsx`: Vista principal del niño con tareas ordenadas por `orderIndex`, botón `"¡Ya la hice! 🚀"` y desplegables de notas.
  - `src/components/Parent/ChildDailyControlView.jsx`: Ficha de control diario del hijo con reordenamiento mediante Drag & Drop / botones de flecha, edición rápida y eliminación.
  - `src/components/Parent/ApprovalsHub.jsx`: Centro de validación dedicado para solicitudes de tareas y canjes con aprobación masiva en 1-clic.
- **Hooks y Utilidades:**
  - `reorderTasks(childId, date, sourceIndex, destIndex)` en `AppContext.jsx`.
  - `requestTaskApproval(taskId)` / `approveTask(taskId)` / `rejectTask(taskId)`.

---

## 2. Checklist de Tareas Atómicas

- [x] `TASK-TASK-01`: Modelar las entidades `dailyAssignments` con atributos `orderIndex`, `approvalMode`, `instanceTag`, `description` y `status`.
- [x] `TASK-TASK-02`: Implementar renderizado secuencial de tareas en `KidDashboard.jsx` respetando `orderIndex`.
- [x] `TASK-TASK-03`: Añadir botón desplegable de instrucciones/notas `[ ℹ️ Ver detalle / nota ▾ ]` en `KidDashboard.jsx` y `ChildDailyControlView.jsx`.
- [x] `TASK-TASK-04`: Desarrollar mecanismo de reordenamiento de tareas (Drag & Drop y botones de flecha ▲/▼) en `ChildDailyControlView.jsx`.
- [x] `TASK-TASK-05`: Implementar flujo de solicitud infantil `"¡Ya la hice! 🚀"` con cambio de estado a `requested`.
- [x] `TASK-TASK-06`: Construir `ApprovalsHub.jsx` con tarjetas de aprobación individual y botón global `"Aprobar Todas las Tareas (X) 🚀"`.
- [x] `TASK-TASK-07`: Integrar emisión de transacciones contables `task_reward` al aprobar tareas con disparo de confeti reactivo.
- [x] `TASK-TASK-08`: Añadir controles de edición puntual y borrado de tareas del día en `ChildDailyControlView.jsx`.
- [x] `TASK-TASK-09`: Crear suite de pruebas de integración para el ciclo de vida completo de tareas y reordenamiento.
