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

