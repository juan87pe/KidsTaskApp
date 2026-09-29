# Especificación de Requerimientos: 04. Gestión de Premios, Costos y Bloqueos Temporales

> **Módulo:** `04-rewards-and-locks`  
> **Sintaxis:** EARS (*Easy Approach to Requirements Syntax*)  

---

## 1. Requerimientos Funcionales en Sintaxis EARS

### [REQ-REW-001] Catálogo de Recompensas
- **Universal:** El sistema deberá mantener una lista de recompensas familiares (`rewards`) con título, costo en puntos, icono SVG y estado de restricción.

### [REQ-REW-002] Definición de Costo / Equivalencia en Puntos
- **CUANDO** un padre cree o edite una recompensa en `RewardEditorModal`, el sistema deberá permitir fijar el costo requerido mediante píldoras rápidas (`50, 80, 100, 150, 200 ⭐`) o mediante un campo numérico libre.

### [REQ-REW-003] Asignación por Destinatario
- **Universal:** El sistema deberá permitir configurar una recompensa como exclusiva para un hijo específico o disponible para todos los miembros infantiles del hogar.

### [REQ-REW-004] Bloqueo Temporal de Premio
- **CUANDO** un padre configure un bloqueo en `RewardLockModal` con duración (`1 día, 2 días, 1 semana, personalizada o indefinida`) y motivo, el sistema deberá marcar `isLocked = true`, fijar la marca temporal de expiración (`lockUntil`) y guardar la razón.

### [REQ-REW-005] Despliegue de Candado en la Tienda Infantil
- **MIENTRAS** un premio permanezca bloqueado, la Tienda de Premios del Niño (`KidRewardStore`) deberá mostrar la tarjeta con filtro atenuado, insignia de candado `"🔒 Bloqueado por tus papás"`, contador de días restantes y botón de canje deshabilitado.

### [REQ-REW-006] Solicitud de Canje por el Niño
- **CUANDO** un niño pulse `"¡Canjear Ahora! 🎁"` en un premio desbloqueado y con saldo de puntos suficiente (`currentPoints >= pointsCost`), el sistema deberá registrar la solicitud y notificar al Centro de Aprobaciones.

### [REQ-REW-007] Autorización y Deducción de Puntos
- **CUANDO** un padre autorice el canje en el Centro de Aprobaciones, el sistema deberá emitir una transacción de tipo `reward_redemption` deduciendo el costo del premio del saldo del niño (`currentPoints -= pointsCost`).

### [REQ-REW-008] Desbloqueo Manual Anticipado
- **CUANDO** un padre pulse el botón `[ 🔓 Desbloquear ]` en la gestión de premios, el sistema deberá retirar inmediatamente la restricción y habilitar el premio en la tienda del niño.
