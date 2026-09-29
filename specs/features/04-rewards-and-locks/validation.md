# Matriz de Validación y Criterios BDD: 04. Premios y Bloqueos

> **Módulo:** `04-rewards-and-locks`  
> **Formato:** Gherkin / BDD vinculado a Requerimientos EARS  

---

## 1. Escenarios de Validación BDD

### Escenario: Bloqueo temporal de un premio y visualización en la tienda del niño [REQ-REW-004] [REQ-REW-005]
```gherkin
Dado que el premio "30 mins de Consola" está disponible en el catálogo
Cuando el padre abre "RewardLockModal", selecciona duración "2 Días" y motivo "Descanso por exámenes"
Y pulsa "Confirmar Bloqueo"
Entonces el premio queda marcado como bloqueado
Y al abrir la tienda del niño, "30 mins de Consola" muestra la insignia "🔒 Bloqueado por tus papás"
Y muestra el texto "Disponible en: 2 días"
Y el botón de canje queda deshabilitado para el niño.
```

### Escenario: Canje exitoso de premio por el niño y autorización del padre [REQ-REW-006] [REQ-REW-007]
```gherkin
Dado que Mateo tiene un saldo de 150 puntos ⭐
Y el premio "Elegir el postre del domingo" cuesta 80 puntos ⭐
Cuando Mateo pulsa "¡Canjear Ahora! 🎁" en su tienda
Entonces se genera una solicitud en el "Centro de Aprobaciones"
Cuando el padre pulsa "Autorizar Canje 🎁"
Entonces se emite una transacción de -80 puntos
Y el nuevo saldo de Mateo es de 70 puntos ⭐.
```

### Escenario: Desbloqueo manual anticipado de una recompensa [REQ-REW-008]
```gherkin
Dado que el premio "Salida al parque" se encuentra bloqueado
Cuando el padre pulsa el botón "[ 🔓 Desbloquear ]" en la gestión de premios
Entonces el candado se retira inmediatamente
Y el premio vuelve a estar habilitado para canje en la tienda del niño.
```
