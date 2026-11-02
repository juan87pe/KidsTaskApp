# Catálogo Maestro de Especificaciones y Matriz de Trazabilidad SDD

> **Proyecto:** KidsTaskApp  
> **Metodología SDD:** Spec-Anchored (Anclaje Bidireccional y Prevención de Deriva)  
> **Estado:** 100% Especificado, Anclado y Trazable  

---

## 1. Mapa General de Especificaciones

```text
specs/
├── constitution.md                      # Principios inviolables y visión del sistema
├── index.md                             # Este catálogo maestro y matriz de trazabilidad
├── adrs/                                # Decisiones de Arquitectura
│   ├── 0001-dual-mode-role-architecture.md
│   ├── 0002-transaction-ledger-and-points-rules.md
│   ├── 0003-retroactive-calendar-audit-and-correction.md
│   ├── 0004-master-library-and-duplicate-prevention.md
│   └── 0005-chunky-play-design-system.md
├── contracts/                           # Contratos Formales
│   ├── entities.schema.json             # Esquema JSON de entidades NoSQL
│   └── state-and-events.contract.md     # Máquinas de estado y contratos de eventos
├── features/                            # Módulos Funcionales (EARS + Plan + BDD)
│   ├── 01-auth-and-profiles/
│   ├── 02-daily-task-management/
│   ├── 03-master-library-and-routines/
│   ├── 04-rewards-and-locks/
│   ├── 05-calendar-and-audit/
│   └── 06-gamification-and-rules/
└── non-functional/                      # Calidad y Seguridad
    ├── security.md                      # Modelo de amenazas STRIDE y privacidad infantil
    └── quality-attributes.md            # SLOs, PWA Offline y usabilidad táctil
```

---

## 2. Matriz de Trazabilidad Completa (EARS ↔ BDD ↔ ADR ↔ Código)

| ID Requerimiento EARS | Descripción Resumida | Módulo | ADR Asociado | Escenario BDD (Validation) | Componente UI / Lógica Principal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `[REQ-AUTH-001]` | Selector de Perfil y Botón Padres | `01-auth-and-profiles` | `ADR-0001` | Escenario: Entrada directa de un niño | `ProfileSelector.jsx` |
| `[REQ-AUTH-002]` | Entrada directa sin contraseña a niños | `01-auth-and-profiles` | `ADR-0001` | Escenario: Entrada directa de un niño | `ProfileSelector.jsx`, `AppContext.jsx` |
| `[REQ-AUTH-003]` | Teclado PIN de 4 dígitos para padres | `01-auth-and-profiles` | `ADR-0001` | Escenario: Acceso exitoso a Modo Padres | `PinGateModal.jsx` |
| `[REQ-AUTH-004]` | Validación de PIN y apertura de Dashboard | `01-auth-and-profiles` | `ADR-0001` | Escenario: Acceso exitoso a Modo Padres | `PinGateModal.jsx`, `ParentDashboard.jsx` |
| `[REQ-AUTH-005]` | Feedback visual ante PIN erróneo | `01-auth-and-profiles` | `ADR-0001` | Escenario: Intento de acceso con PIN erróneo | `PinGateModal.jsx` |
| `[REQ-AUTH-006]` | Alta de nuevo hijo en el hogar | `01-auth-and-profiles` | `ADR-0001` | Escenario: Alta de un nuevo hijo | `AddChildModal.jsx`, `HouseholdSettings.jsx` |
| `[REQ-AUTH-007]` | Gestión multi-tutor del hogar | `01-auth-and-profiles` | `ADR-0001` | Escenario: Alta de tutor | `AddTutorModal.jsx`, `HouseholdSettings.jsx` |
| `[REQ-AUTH-008]` | Modificación de PIN maestro | `01-auth-and-profiles` | `ADR-0001` | Escenario: Actualización de PIN | `HouseholdSettings.jsx` |
| `[REQ-AUTH-009]` | Recuperación de PIN por biometría/huella| `01-auth-and-profiles` | `ADR-0001` | Escenario: Respaldo y recuperación de PIN | `PinGateModal.jsx`, `AppContext.jsx` |
| `[REQ-TASK-001]` | Orden cronológico secuencial de tareas | `02-daily-task-management` | `ADR-0004` | Escenario: Reordenamiento secuencial | `KidDashboard.jsx`, `ChildDailyControlView.jsx` |
| `[REQ-TASK-002]` | Reordenamiento por padres (Drag & Drop) | `02-daily-task-management` | `ADR-0004` | Escenario: Reordenamiento secuencial | `ChildDailyControlView.jsx`, `AppContext.jsx` |
| `[REQ-TASK-003]` | Notas desplegables con instrucciones | `02-daily-task-management` | `ADR-0004` | Escenario: Visualización de nota explicativa | `KidDashboard.jsx`, `ChildDailyControlView.jsx` |
| `[REQ-TASK-004]` | Solicitud infantil "¡Ya la hice! 🚀" | `02-daily-task-management` | `ADR-0001` | Escenario: Solicitud de visto bueno | `KidDashboard.jsx` |
| `[REQ-TASK-005]` | Aprobación parental en 1-clic (+Puntos) | `02-daily-task-management` | `ADR-0002` | Escenario: Aprobación en 1-clic | `ApprovalsHub.jsx`, `ChildDailyControlView.jsx` |
| `[REQ-TASK-006]` | Rechazo de solicitud de tarea | `02-daily-task-management` | `ADR-0002` | Escenario: Rechazo de solicitud | `ApprovalsHub.jsx` |
| `[REQ-TASK-007]` | Tareas exclusivas de control parental | `02-daily-task-management` | `ADR-0001` | Escenario: Tareas solo padres | `KidDashboard.jsx`, `ChildDailyControlView.jsx` |
| `[REQ-TASK-008]` | Aprobación masiva de tareas pendientes | `02-daily-task-management` | `ADR-0002` | Escenario: Aprobación masiva | `ApprovalsHub.jsx` |
| `[REQ-TASK-009]` | Edición puntual de tarea para hoy | `02-daily-task-management` | `ADR-0004` | Escenario: Edición puntual de tarea | `ChildDailyControlView.jsx` |
| `[REQ-TASK-010]` | Eliminación de tarea de la jornada | `02-daily-task-management` | `ADR-0004` | Escenario: Borrado de tarea diaria | `ChildDailyControlView.jsx` |
| `[REQ-TASK-011]` | Marcado flexible y completitud no lineal| `02-daily-task-management` | `ADR-0001` | Escenario: Marcado de tareas en orden no lineal | `KidDashboard.jsx`, `AppContext.jsx` |
| `[REQ-LIB-001]` | Banco central de tareas maestras | `03-master-library-and-routines` | `ADR-0004` | Escenario: Creación de tarea maestra | `MasterLibrary.jsx` |
| `[REQ-LIB-002]` | Creación/Edición con notas en catálogo | `03-master-library-and-routines` | `ADR-0004` | Escenario: Creación de tarea maestra | `TaskMasterModal.jsx` |
| `[REQ-LIB-003]` | Constructor de rutinas con reutilización | `03-master-library-and-routines` | `ADR-0004` | Escenario: Inyección de rutina | `RoutineMasterModal.jsx` |
| `[REQ-LIB-004]` | Orden secuencial en rutinas | `03-master-library-and-routines` | `ADR-0004` | Escenario: Inyección de rutina | `RoutineMasterModal.jsx` |
| `[REQ-LIB-005]` | Motor de programación temporal (5 modos)| `03-master-library-and-routines` | `ADR-0004` | Escenario: Programación temporal semanal | `AssignMasterTaskModal.jsx` |
| `[REQ-LIB-006]` | Detección preventiva de duplicados | `03-master-library-and-routines` | `ADR-0004` | Escenario: Inyección con detección duplicado | `DuplicateDetectionModal.jsx` |
| `[REQ-LIB-007]` | Visor interactivo de asignaciones activas | `03-master-library-and-routines` | `ADR-0004` | Escenario: Visor interactivo y desasignación | `MasterLibrary.jsx` |
| `[REQ-LIB-008]` | Desasignación/Pausa contextual por programación | `03-master-library-and-routines` | `ADR-0004` | Escenario: Visor interactivo y apertura del diálogo contextual | `UnassignOrPauseModal.jsx`, `MasterLibrary.jsx` |
| `[REQ-LIB-009]` | Inyección de rutina a jornada diaria | `03-master-library-and-routines` | `ADR-0004` | Escenario: Inyección con detección duplicado | `InjectRoutineModal.jsx` |
| `[REQ-LIB-010]` | Tareas de rutina en catálogo general | `03-master-library-and-routines` | `ADR-0004` | Escenario: Tareas de rutinas en catálogo general | `MasterLibrary.jsx`, `AppContext.jsx` |
| `[REQ-REW-001]` | Catálogo de recompensas familiares | `04-rewards-and-locks` | `ADR-0002` | Escenario: Bloqueo temporal de premio | `RewardManager.jsx` |
| `[REQ-REW-002]` | Definición de costo en puntos de premios| `04-rewards-and-locks` | `ADR-0002` | Escenario: Canje exitoso de premio | `RewardEditorModal.jsx` |
| `[REQ-REW-003]` | Asignación de premios por destinatario | `04-rewards-and-locks` | `ADR-0002` | Escenario: Canje exitoso de premio | `RewardEditorModal.jsx` |
| `[REQ-REW-004]` | Bloqueo temporal con selector de plazo | `04-rewards-and-locks` | `ADR-0002` | Escenario: Bloqueo temporal de premio | `RewardLockModal.jsx` |
| `[REQ-REW-005]` | Candado visual y cuenta regresiva | `04-rewards-and-locks` | `ADR-0005` | Escenario: Bloqueo temporal de premio | `KidRewardStore.jsx` |
| `[REQ-REW-006]` | Solicitud de canje desde tienda del niño| `04-rewards-and-locks` | `ADR-0002` | Escenario: Canje exitoso de premio | `KidRewardStore.jsx` |
| `[REQ-REW-007]` | Autorización de canje y débito de puntos| `04-rewards-and-locks` | `ADR-0002` | Escenario: Canje exitoso de premio | `ApprovalsHub.jsx` |
| `[REQ-REW-008]` | Desbloqueo manual anticipado de premios | `04-rewards-and-locks` | `ADR-0002` | Escenario: Desbloqueo manual anticipado | `RewardManager.jsx` |
| `[REQ-CAL-001]` | Calendario con mapa de calor tetracolor | `05-calendar-and-audit` | `ADR-0003` | Escenario: Navegación de calendario | `ParentCalendarAudit.jsx` |
| `[REQ-CAL-002]` | Resumen de balance neto por fecha | `05-calendar-and-audit` | `ADR-0003` | Escenario: Resumen diario | `ParentCalendarAudit.jsx` |
| `[REQ-CAL-003]` | Validación retroactiva de tareas pasadas| `05-calendar-and-audit` | `ADR-0003` | Escenario: Validación retroactiva | `ParentCalendarAudit.jsx`, `AppContext.jsx` |
| `[REQ-CAL-004]` | Revocación de aprobaciones pasadas | `05-calendar-and-audit` | `ADR-0003` | Escenario: Revocación de tarea aprobada | `ParentCalendarAudit.jsx`, `AppContext.jsx` |
| `[REQ-CAL-005]` | Reembolso inmediato de canjes erróneos | `05-calendar-and-audit` | `ADR-0003` | Escenario: Reembolso de canje | `ParentCalendarAudit.jsx`, `AppContext.jsx` |
| `[REQ-CAL-006]` | Corrección de bonos y sanciones pasadas | `05-calendar-and-audit` | `ADR-0002` | Escenario: Corrección de bonos pasados | `ParentCalendarAudit.jsx` |
| `[REQ-CAL-007]` | Calendario infantil de logros (Read-only)| `05-calendar-and-audit` | `ADR-0003` | Escenario: Modo solo lectura infantil | `KidCalendarAchievements.jsx` |
| `[REQ-GAM-001]` | Otorgamiento de bono instantáneo | `06-gamification-and-rules` | `ADR-0002` | Escenario: Asignación de bono rápido | `QuickPointsModal.jsx`, `AppContext.jsx` |
| `[REQ-GAM-002]` | Aplicación de sanción instantánea | `06-gamification-and-rules` | `ADR-0002` | Escenario: Aplicación de sanción rápida | `QuickPointsModal.jsx`, `AppContext.jsx` |
| `[REQ-GAM-003]` | Política de acumulación continua | `06-gamification-and-rules` | `ADR-0002` | Escenario: Modo de acumulación continua | `HouseholdSettings.jsx`, `AppContext.jsx` |
| `[REQ-GAM-004]` | Política de canje diario obligatorio | `06-gamification-and-rules` | `ADR-0002` | Escenario: Canje diario obligatorio | `HouseholdSettings.jsx` |
| `[REQ-GAM-005]` | Política de reinicio semanal | `06-gamification-and-rules` | `ADR-0002` | Escenario: Reinicio semanal | `HouseholdSettings.jsx` |
| `[REQ-GAM-006]` | Nivel gamificado del niño | `06-gamification-and-rules` | `ADR-0002` | Escenario: Cálculo de nivel | `KidDashboard.jsx` |
| `[REQ-GAM-007]` | Configuración de auto-liquidación diaria | `06-gamification-and-rules` | `ADR-0002` | Escenario: Configuración de auto-liquidación | `HouseholdSettings.jsx`, `AutoLiquidationModal.jsx`, `AppContext.jsx` |
| `[REQ-GAM-008]` | Ejecución de auto-canje a las 23:59:59 | `06-gamification-and-rules` | `ADR-0002` | Escenario: Ejecución de auto-canje | `AppContext.jsx` |

