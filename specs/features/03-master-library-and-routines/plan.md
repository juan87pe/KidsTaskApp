# Plan de Implementación: 03. Biblioteca Familiar y Rutinas

> **Módulo:** `03-master-library-and-routines`  
> **Estrategia:** Tareas Atómicas y Verificables  

---

## 1. Arquitectura y Componentes Clave

- **Componentes:**
  - `src/components/Parent/MasterLibrary.jsx`: Vista de biblioteca con pestañas "Banco de Tareas" y "Plantillas de Rutinas", visor interactivo de asignaciones.
  - `src/components/Parent/TaskMasterModal.jsx`: Modal CRUD de tareas maestras (puntos, icono, modo aprobación, notas).
  - `src/components/Parent/RoutineMasterModal.jsx`: Constructor de rutinas con selección de tareas y orden secuencial.
  - `src/components/Parent/AssignMasterTaskModal.jsx`: Modal con selector de 5 modalidades de programación temporal.
  - `src/components/Parent/InjectRoutineModal.jsx`: Modal de inyección directa de rutinas a un hijo.
  - `src/components/Parent/DuplicateDetectionModal.jsx`: Modal preventivo para omitir o duplicar (x2).
- **Estado Contextual:** `masterTasks`, `masterRoutines`, `assignMasterTask()`, `injectRoutine()`, `toggleTaskAssignment()`.

---

## 2. Checklist de Tareas Atómicas

- [x] `TASK-LIB-01`: Diseñar esquema de persistencia para `masterTasks` y `masterRoutines` en `AppContext.jsx`.
- [x] `TASK-LIB-02`: Desarrollar `MasterLibrary.jsx` con navegación por pestañas y buscador/filtro.
- [x] `TASK-LIB-03`: Implementar `TaskMasterModal.jsx` con soporte para icono, puntos, modo de aprobación y campo opcional de notas.
- [x] `TASK-LIB-04`: Construir `RoutineMasterModal.jsx` permitiendo selección de tareas del catálogo y reordenamiento de secuencia.
- [x] `TASK-LIB-05`: Implementar `AssignMasterTaskModal.jsx` con soporte completo para las 5 modalidades temporales (Hoy, Diaria, Semanal, Fecha, Rango).
- [x] `TASK-LIB-06`: Desarrollar el visor interactivo de asignaciones activas dentro de `MasterLibrary.jsx` (hijos, recurrencia, botones de acción).
- [x] `TASK-LIB-07`: Implementar `DuplicateDetectionModal.jsx` y la lógica de detección previa al insertar tareas en `dailyAssignments`.
- [x] `TASK-LIB-08`: Desarrollar `InjectRoutineModal.jsx` para inyección en 1-clic desde la Ficha Diaria.
- [x] `TASK-LIB-09`: Crear pruebas de integración para el motor de duplicados, reutilización de tareas y programación temporal.
- [x] `TASK-LIB-10`: Unificar la visualización de tareas en el catálogo general (`masterTasks`) para incluir todas las tareas de rutinas con sus insignias asociadas y persistencia bidireccional al crear tareas dentro de una rutina.

