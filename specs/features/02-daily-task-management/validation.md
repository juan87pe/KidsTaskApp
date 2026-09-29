# Matriz de Validación y Criterios BDD: 02. Gestión Diaria y Aprobaciones

> **Módulo:** `02-daily-task-management`  
> **Formato:** Gherkin / BDD vinculado a Requerimientos EARS  

---

## 1. Escenarios de Validación BDD

### Escenario: Niño solicita visto bueno para una tarea completada [REQ-TASK-004]
```gherkin
Dado que el niño "Mateo" tiene asignada la tarea "Hacer la cama" (+20 ⭐) con estado "pending"
Cuando Mateo pulsa el botón "¡Ya la hice! 🚀" en su dashboard
Entonces el estado de la tarea cambia a "requested"
Y el botón es reemplazado por la píldora "Esperando a papá/mamá ⏳"
Y la tarea aparece en el "Centro de Aprobaciones" de los padres.
```

### Escenario: Padre aprueba tarea en 1-clic y se acreditan los puntos [REQ-TASK-005]
```gherkin
Dado que Mateo tiene un saldo de 100 puntos ⭐
Y tiene una solicitud pendiente de "Hacer la cama" (+20 ⭐)
Cuando el padre pulsa "Aprobar (+20) ✔️" en el Centro de Aprobaciones
Entonces el estado de la tarea pasa a "approved"
Y se genera una transacción de tipo "task_reward" por +20 puntos
Y el saldo de Mateo se actualiza a 120 puntos ⭐
Y se dispara una animación de confeti en la pantalla.
```

### Escenario: Reordenamiento secuencial de tareas por los padres [REQ-TASK-001] [REQ-TASK-002]
```gherkin
Dado que Mateo tiene asignadas las tareas en orden:
  | 1 | Hacer la cama        |
  | 2 | Desayunar saludable  |
  | 3 | Deberes Escolares    |
Cuando el padre arrastra o pulsa la flecha para mover "Deberes Escolares" a la posición 1
Entonces el sistema actualiza los "orderIndex" correspondientes
Y al abrir la vista de Mateo, "Deberes Escolares" se muestra en la primera posición.
```

### Escenario: Visualización de nota explicativa desplegable [REQ-TASK-003]
```gherkin
Dado que la tarea "Deberes Escolares" tiene la nota: "Página 45 del libro de matemáticas"
Cuando el niño o el padre pulsa "[ ℹ️ Ver detalle / nota ▾ ]"
Entonces se despliega un panel suave con el texto íntegro de la nota
Y al volver a pulsar se colapsa nuevamente.
```

### Escenario: Aprobación masiva de tareas pendientes [REQ-TASK-008]
```gherkin
Dado que existen 3 tareas solicitadas por validar con un valor combinado de 60 puntos ⭐
Cuando el padre pulsa el botón flotante "Aprobar Todas las Tareas (3) 🚀"
Entonces las 3 tareas quedan en estado "approved"
Y se acreditan los 60 puntos de forma inmediata en el saldo de los niños correspondientes.
```

### Escenario: Marcado y completitud de tareas en orden no lineal / práctico [REQ-TASK-004] [REQ-TASK-011]
```gherkin
Dado que Mateo tiene asignadas para hoy en orden secuencial:
  | 1 | Hacer la cama        (pending) |
  | 2 | Desayunar saludable  (pending) |
  | 3 | Deberes Escolares    (pending) |
Cuando Mateo realiza primero sus tareas escolares y pulsa "¡Ya la hice! 🚀" en "Deberes Escolares"
Entonces "Deberes Escolares" cambia su estado a "requested"
Y las tareas "Hacer la cama" y "Desayunar saludable" permanecen en estado "pending" sin verse bloqueadas
Y el sistema permite al padre validar "Deberes Escolares" sin requerir que las anteriores hayan sido completadas.
```

