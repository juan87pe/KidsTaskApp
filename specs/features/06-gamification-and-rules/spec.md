# Especificación de Requerimientos: 06. Gamificación, Bonos, Sanciones y Reglas de Puntos

> **Módulo:** `06-gamification-and-rules`  
> **Sintaxis:** EARS (*Easy Approach to Requirements Syntax*)  

---

## 1. Requerimientos Funcionales en Sintaxis EARS

### [REQ-GAM-001] Otorgamiento de Bono Instantáneo
- **CUANDO** un padre configure y confirme un bono en `QuickPointsModal` seleccionando un hijo, valor (`+5, +10, +15, +20 ⭐`) y motivo, el sistema deberá emitir una transacción de tipo `bonus` e incrementar el saldo del niño al instante.

### [REQ-GAM-002] Aplicación de Sanción Instantánea
- **CUANDO** un padre confirme una sanción en `QuickPointsModal` seleccionando un valor (`-5, -10, -15 ⭐`) y motivo, el sistema deberá emitir una transacción de tipo `penalty` y deducir los puntos del saldo del niño.

### [REQ-GAM-003] Regla de Acumulación Continua (Default)
- **MIENTRAS** la regla de puntos familiar esté fijada en `continuous`, el saldo acumulado no caducará y persistirá a través de los días y semanas para permitir metas a largo plazo.

### [REQ-GAM-004] Regla de Canje Diario Obligatorio
- **MIENTRAS** la regla de puntos familiar esté fijada en `daily_reset`, los puntos no canjeados antes de las 23:59:59 se liquidarán a 0 al comenzar la jornada siguiente.

### [REQ-GAM-005] Regla de Reinicio Semanal
- **MIENTRAS** la regla de puntos familiar esté fijada en `weekly_reset`, los puntos acumulados se restablecerán a 0 los domingos a las 23:59:59.

### [REQ-GAM-006] Nivel de Progreso del Niño
- **Universal:** El sistema deberá calcular el nivel del niño (`"Nivel X • Explorador / Campeón"`) en función del histórico total de puntos acumulados durante su trayectoria en la app.

### [REQ-GAM-007] Configuración de Auto-Liquidación / Canje por Defecto
- **CUANDO** un padre seleccione la política de puntos `daily_reset` (o `weekly_reset`) en `HouseholdSettings`, el sistema deberá desplegar un asistente interactivo solicitando si desea activar la auto-liquidación de puntos sobrantes al cierre del ciclo, permitiendo definir:
  1. *Tipo de Recompensa:* Dinero/Paga o Premio Personalizado del catálogo.
  2. *Tasa de Conversión / Equivalencia:* Valor monetario por punto (ej. `$0.10 / punto`) o premio comodín aplicable.

### [REQ-GAM-008] Ejecución Automática de Canje al Cierre de Jornada (23:59:59)
- **DONDE** la auto-liquidación esté habilitada y el niño cuente con saldo positivo (`currentPoints > 0`) al llegar las 23:59:59, **CUANDO** el ciclo de reinicio se ejecute, el sistema deberá emitir automáticamente una transacción de tipo `reward_redemption` liquidando el saldo a 0 y registrando en el ledger el valor ganado (ej. `Canje automático por cierre: 40 pts = $4.00`), evitando la pérdida del esfuerzo del niño.
