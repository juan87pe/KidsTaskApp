# Matriz de Validación y Criterios BDD: 03. Biblioteca Familiar y Rutinas

> **Módulo:** `03-master-library-and-routines`  
> **Formato:** Gherkin / BDD vinculado a Requerimientos EARS  

---

## 1. Escenarios de Validación BDD

### Escenario: Creación de tarea maestra con nota explicativa [REQ-LIB-001] [REQ-LIB-002]
```gherkin
Dado que un padre se encuentra en la pestaña "Banco de Tareas"
Cuando abre "TaskMasterModal" e ingresa:
  | Título       | Recoger juguetes del salón             |
  | Puntos       | 15                                      |
  | Aprobación   | Solicitud Niño                          |
  | Nota         | Guardar legos en la caja roja y muñecos |
Y pulsa "Guardar Tarea Maestra"
Entonces la tarea aparece disponible en el catálogo familiar
Y su nota de instrucciones queda registrada para futuras asignaciones.
```

### Escenario: Inyección de rutina con detección preventiva de duplicado [REQ-LIB-003] [REQ-LIB-006] [REQ-LIB-009]
```gherkin
Dado que el niño "Mateo" ya tiene asignada la tarea "Hacer la cama" para el día de hoy
Y el padre pulsa "🚀 Inyectar Rutina Mañanera" (la cual contiene "Hacer la cama" y "Lavarse los dientes")
Cuando el sistema procesa la inserción
Entonces se despliega el modal "DuplicateDetectionModal" alertando: "Hacer la cama ya existe para hoy"
Cuando el padre selecciona "🔘 Omitir duplicado (Recomendado)"
Entonces "Hacer la cama" no se duplica en el día de Mateo
Y "Lavarse los dientes" se agrega correctamente manteniendo la correlación de puntos.
```

### Escenario: Programación temporal semanal en días fijos [REQ-LIB-005]
```gherkin
Dado que el padre selecciona la tarea maestra "Regar las plantas"
Cuando abre el modal de asignación y selecciona "⚪ Semanal / Días Fijos"
Y marca los días "[ M ] Martes" y "[ J ] Jueves" para el hijo "Mateo"
Entonces el sistema guarda la regla de asignación recurrente para Mateo
Y el visor interactivo de la tarea muestra: "Mateo: Semanal (Martes y Jueves)".
```

### Escenario: Visor interactivo y desasignación sin borrado de plantilla [REQ-LIB-007] [REQ-LIB-008]
```gherkin
Dado que la tarea "Pasear al perro" está asignada a "Sofía"
Cuando el padre pulsa la tarjeta de la tarea en la biblioteca
Entonces se expande la ficha con la información de asignación de Sofía
Cuando el padre pulsa "[ ❌ Desasignar / Pausar ]"
Entonces Sofía deja de tener la tarea programada
Y la plantilla "Pasear al perro" permanece intacta en el catálogo familiar para futuros usos.
```

### Escenario: Visualización y disponibilidad de tareas de rutinas en el catálogo general [REQ-LIB-010]
```gherkin
Dado que existe la rutina "Rutina Mañanera" que contiene las tareas "Hacer la cama" y "Lavarse los dientes"
Cuando el padre navega a la pestaña "Banco de Tareas" del catálogo general
Entonces ambas tareas ("Hacer la cama" y "Lavarse los dientes") se muestran en la lista de tareas maestras
Y cada una muestra una insignia visible indicando "[🏷️ Rutina Mañanera]"
Y el padre puede pulsar "[ 🚀 Asignar Tarea ]" sobre cualquiera de ellas de forma individual e independiente de la rutina.
```

