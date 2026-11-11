# Matriz de Validación y Criterios BDD: 06. Gamificación y Reglas

> **Módulo:** `06-gamification-and-rules`  
> **Formato:** Gherkin / BDD vinculado a Requerimientos EARS  

---

## 1. Escenarios de Validación BDD

### Escenario: Asignación de bono rápido por comportamiento ejemplar [REQ-GAM-001]
```gherkin
Dado que el niño "Mateo" tiene 100 puntos ⭐
Cuando el padre abre "QuickPointsModal", selecciona "🌟 Otorgar Bono", el valor "+15 ⭐" y el motivo "Ayudar a su hermana"
Y pulsa "Confirmar Bono"
Entonces se emite una transacción de tipo "bonus" por +15 puntos
Y el saldo de Mateo se actualiza inmediatamente a 115 puntos ⭐.
```

### Escenario: Aplicación de sanción rápida por conducta inadecuada [REQ-GAM-002]
```gherkin
Dado que el niño "Mateo" tiene 100 puntos ⭐
Cuando el padre selecciona "⚠️ Aplicar Sanción", el valor "-10 ⭐" y el motivo "No ordenar tras jugar"
Y pulsa "Confirmar Sanción"
Entonces se emite una transacción de tipo "penalty" por -10 puntos
Y el saldo de Mateo se reduce a 90 puntos ⭐.
```

### Escenario: Configuración de modo de acumulación continua [REQ-GAM-003]
```gherkin
Dado que la regla configurada en el hogar es "continuous"
Cuando concluye la jornada a las 23:59:59
Entonces el saldo de puntos de todos los niños se mantiene intacto al día siguiente.
```

### Escenario: Configuración de auto-liquidación de puntos al activar daily_reset [REQ-GAM-007]
```gherkin
Dado que el padre se encuentra en "Ajustes del Hogar"
Cuando selecciona el modo de reinicio "Canje Diario Obligatorio (daily_reset)"
Entonces el sistema despliega el asistente modal de configuración de auto-canje
Cuando el padre activa la auto-liquidación, selecciona recompensa "Dinero / Paga" y tasa "0.10 $ por punto"
Y pulsa "Guardar Política Familiar"
Entonces la configuración queda guardada en "family.autoLiquidation".
```

### Escenario: Ejecución de auto-canje por cierre de jornada con puntos sobrantes [REQ-GAM-008]
```gherkin
Dado que Mateo tiene 40 puntos ⭐ sin canjear a las 23:59:58
Y la auto-liquidación está configurada en modo "Dinero" con tasa de "0.10 $ por punto"
Cuando el reloj del sistema marca las 23:59:59 y se procesa el cierre diario
Entonces se emite una transacción de tipo "reward_redemption" por -40 puntos con razón "Auto-canje por cierre de jornada: 40 pts = $4.00"
Y el saldo de puntos de Mateo queda en 0 ⭐ para el nuevo día
Y en el historial contable se registra la liquidación monetaria de $4.00 para los padres.
```

### Escenario: Progresión de nivel mediante aprobación de tareas [REQ-GAM-006]
```gherkin
Dado que Sofía tiene 90 puntos acumulados en totalPointsEarned y ostenta "Nivel 1 • Principiante"
Cuando el padre le aprueba una tarea de 20 puntos
Entonces su totalPointsEarned sube a 110 puntos
Y su nivel se actualiza inmediatamente a "Nivel 2 • Explorador" (al superar el umbral de 100 puntos).
```

### Escenario: Preservación de puntos entre semana bajo política weekly_reset [REQ-GAM-005]
```gherkin
Dado que la política familiar es "weekly_reset"
Y Mateo cuenta con 150 puntos un día miércoles
Cuando el sistema ejecuta el cierre de jornada del miércoles a las 23:59:59
Entonces el saldo de Mateo permanece en 150 puntos para el jueves
Y los puntos únicamente se liquidan o reinician cuando el cierre corresponde al día domingo.
```

### Escenario: Archivado automático de tareas de la jornada en calendarHistory [REQ-GAM-008]
```gherkin
Dado que Mateo completó y aprobó 2 tareas y dejó 1 pendiente hoy
Cuando el sistema procesa el cierre diario de la fecha actual
Entonces en "calendarHistory" se crea o consolida la entrada para esa fecha y para Mateo
Y la tarea pendiente se archiva con estado "missed"
Y el mapa de calor refleja el balance y cumplimiento exacto de esa jornada.
```

