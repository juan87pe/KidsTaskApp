# Matriz de Validación y Criterios BDD: 05. Calendario y Corrección Retroactiva

> **Módulo:** `05-calendar-and-audit`  
> **Formato:** Gherkin / BDD vinculado a Requerimientos EARS  

---

## 1. Escenarios de Validación BDD

### Escenario: Validación retroactiva de una tarea olvidada [REQ-CAL-003]
```gherkin
Dado que el día "2026-08-20" Mateo tenía la tarea "Recoger juguetes" (+15 ⭐) con estado "uncompleted"
Y Mateo cuenta con un saldo actual de 50 puntos ⭐
Cuando el padre navega en el calendario al "20 de Agosto de 2026"
Y pulsa el botón "[ ➕ Validar como Realizada Ahora (+15) ]"
Entonces la tarea cambia su estado a "approved" y se marca "isRetroactivelyModified = true"
Y se genera una transacción de ajuste por +15 puntos
Y el saldo actual de Mateo se incrementa inmediatamente a 65 puntos ⭐.
```

### Escenario: Revocación de una tarea aprobada por error [REQ-CAL-004]
```gherkin
Dado que en el día "2026-08-22" la tarea "Leer 20 mins" (+20 ⭐) fue aprobada por error
Y Mateo cuenta con un saldo actual de 80 puntos ⭐
Cuando el padre pulsa "[ 🔄 Modificar Validación / Desmarcar ]" en la vista del día 22
Entonces la tarea pasa a estado "uncompleted"
Y se emite un asiento compensatorio de -20 puntos
Y el saldo de Mateo se recalcula en 60 puntos ⭐.
```

### Escenario: Anulación y reembolso inmediato de un canje de premio [REQ-CAL-005]
```gherkin
Dado que el día de ayer se autorizó un canje de "30 mins de Consola" (-100 ⭐) a Mateo
Y el saldo actual de Mateo es de 20 puntos ⭐
Cuando el padre pulsa "[ ↩️ Anular y Reembolsar Canje ]" en el panel del día anterior
Entonces la transacción original se marca como "isReversed = true"
Y se crea una transacción compensatoria de tipo "refund_reversal" por +100 puntos
Y el saldo de Mateo pasa inmediatamente a 120 puntos ⭐.
```

### Escenario: Modo solo lectura en calendario del niño [REQ-CAL-007]
```gherkin
Dado que el niño "Mateo" ingresa a la pantalla "Mi Calendario & Historial de Logros"
Cuando inspecciona cualquier fecha pasada con tareas cumplidas
Entonces visualiza estrellas doradas y sus logros detallados
Y la interfaz no presenta botones de edición, validación ni modificación de saldo.
```

### Escenario: Reversión de sanción pasada en el panel de auditoría [REQ-CAL-006] [REQ-CAL-008]
```gherkin
Dado que en el día "2026-08-23" Mateo tiene registrada una sanción de -10 puntos en "penaltiesList"
Y el saldo actual de Mateo es de 150 puntos
Cuando el padre pulsa "Anular Sanción (+10)" en la sección de sanciones de ese día
Entonces la sanción se marca como "isReversed: true"
Y se emite una transacción de tipo "retroactive_adjustment" por +10 puntos
Y el saldo de Mateo se incrementa inmediatamente a 160 puntos
Y el resumen de penalizaciones del día se actualiza a 0 puntos.
```

### Escenario: Idempotencia en el reembolso de un canje de premio [REQ-CAL-005]
```gherkin
Dado que un canje de premio ya fue reembolsado y figura con "isRefunded: true"
Cuando el padre inspecciona el detalle del día en el calendario
Entonces la tarjeta del canje muestra la insignia de "Reembolsado"
Y el botón de reembolso ya no se encuentra disponible, impidiendo acreditar puntos por duplicado.
```

### Escenario: Compensación justa en revocación de días cerrados [REQ-CAL-004]
```gherkin
Dado que el hogar opera bajo "daily_reset"
Y en un día pasado Mateo obtuvo 20 puntos por una tarea que luego caducaron a 0 sin haber sido canjeados
Cuando el padre revoca retroactivamente dicha tarea
Entonces la tarea histórica pasa a estado "uncompleted" y su netPoints se ajusta
Pero el saldo de la jornada actual de Mateo permanece intacto sin deducción injusta.
```
