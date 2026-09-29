# Plan de Implementación: 06. Gamificación y Reglas de Puntos

> **Módulo:** `06-gamification-and-rules`  
> **Estrategia:** Tareas Atómicas y Verificables  

---

## 1. Arquitectura y Componentes Clave

- **Componentes:**
  - `src/components/Parent/QuickPointsModal.jsx`: Modal interactivo de ajuste rápido con conmutador Bono/Sanción, píldoras y motivos predefinidos.
  - `src/components/Parent/HouseholdSettings.jsx`: Selector de política de puntos familiar (`pointsRule`).
- **Estado Contextual:** `addBonusOrPenalty(childId, points, reason, type)` en `AppContext.jsx`.

---

## 2. Checklist de Tareas Atómicas

- [ ] `TASK-GAM-01`: Modelar transacciones `bonus` y `penalty` en el ledger general.
- [ ] `TASK-GAM-02`: Desarrollar `QuickPointsModal.jsx` con soporte táctil, conmutador de modo y selector de motivos frecuentes.
- [ ] `TASK-GAM-03`: Implementar lógica de cálculo de nivel infantil en base a hitos de puntos ganados.
- [ ] `TASK-GAM-04`: Integrar persistencia y selector de políticas de reinicio (`continuous`, `daily_reset`, `weekly_reset`) en `HouseholdSettings.jsx`.
- [ ] `TASK-GAM-05`: Añadir pruebas automatizadas para la aplicación de bonos, sanciones y políticas de reinicio.
- [ ] `TASK-GAM-06`: Desarrollar asistente modal de configuración de auto-liquidación de puntos al activar `daily_reset` e implementar la rutina de auto-canje a las 23:59:59.

