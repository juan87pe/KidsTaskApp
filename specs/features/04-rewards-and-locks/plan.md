# Plan de Implementación: 04. Premios y Bloqueos Temporales

> **Módulo:** `04-rewards-and-locks`  
> **Estrategia:** Tareas Atómicas y Verificables  

---

## 1. Arquitectura y Componentes Clave

- **Componentes:**
  - `src/components/Parent/RewardManager.jsx`: Lista de premios, filtros por hijo, acciones de edición, bloqueo y borrado.
  - `src/components/Parent/RewardEditorModal.jsx`: Modal de creación y edición de recompensas y asignación de valor en puntos.
  - `src/components/Parent/RewardLockModal.jsx`: Modal de configuración de bloqueo temporal con selectores de plazo y motivo.
  - `src/components/Kid/KidRewardStore.jsx`: Tienda gamificada del niño con saldo, estados de candado, cuenta regresiva y botón de canje.
  - `src/components/Parent/ApprovalsHub.jsx`: Sección de autorización de canjes de premios.

---

## 2. Checklist de Tareas Atómicas

- [x] `TASK-REW-01`: Modelar la colección `rewards` con soporte para costos dinámicos, `targetChildId`, `isLocked`, `lockUntil` y `lockReason`.
- [x] `TASK-REW-02`: Desarrollar `RewardManager.jsx` con tarjetas informativas y controles parentales.
- [x] `TASK-REW-03`: Implementar `RewardEditorModal.jsx` con selectores de costo en puntos e iconos vectoriales.
- [x] `TASK-REW-04`: Desarrollar `RewardLockModal.jsx` con opciones de duración temporal y cálculo de `lockUntil`.
- [x] `TASK-REW-05`: Construir `KidRewardStore.jsx` con tarjetas interactivas, barra de progreso hacia metas y visualización de candados.
- [x] `TASK-REW-06`: Integrar flujo de canje en `ApprovalsHub.jsx` con emisión de transacción `reward_redemption` y deducción de saldo.
- [x] `TASK-REW-07`: Añadir pruebas de integración para el ciclo de vida de premios, bloqueos temporales y validación de saldo.
