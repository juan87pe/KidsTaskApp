# Plan de Implementación: 01. Autenticación, Perfiles y Miembros

> **Módulo:** `01-auth-and-profiles`  
> **Estrategia:** Tareas Atómicas y Verificables  

---

## 1. Arquitectura del Módulo y Componentes Clave

- **Componentes:**
  - `src/components/Profile/ProfileSelector.jsx`: Renderizado de tarjetas de hijos y botón de padres.
  - `src/components/Security/PinGateModal.jsx`: Teclado numérico táctil (60px), 4 círculos indicadores `[● ● ○ ○]`.
  - `src/components/Parent/HouseholdSettings.jsx`: Vista de administración de miembros y PIN.
  - `src/components/Parent/AddChildModal.jsx`: Modal de creación/edición de hijos.
  - `src/components/Parent/AddTutorModal.jsx`: Modal de alta de tutores.
- **Estado Contextual:** `AppContext.jsx` (`family`, `children`, `tutors`, `activeRole`, `activeChildId`).

---

## 2. Checklist de Tareas Atómicas

- [x] `TASK-AUTH-01`: Definir esquema y estructura inicial de `family`, `children` y `tutors` en `initialData.js`.
- [x] `TASK-AUTH-02`: Implementar `ProfileSelector.jsx` con soporte para selección de niños y apertura de modal PIN.
- [x] `TASK-AUTH-03`: Desarrollar `PinGateModal.jsx` con teclado táctil virtual, feedback de error y validación de 4 dígitos.
- [x] `TASK-AUTH-04`: Integrar selector y conmutador de roles en `AppContext.jsx` (`selectRole`, `selectChild`, `validatePin`).
- [x] `TASK-AUTH-05`: Implementar `HouseholdSettings.jsx` para gestión de hijos, tutores y reglas de acumulación.
- [x] `TASK-AUTH-06`: Desarrollar `AddChildModal.jsx` y `AddTutorModal.jsx` con persistencia en el estado global.
- [x] `TASK-AUTH-07`: Añadir suite de pruebas unitarias y de integración para flujo de autenticación y PIN.
