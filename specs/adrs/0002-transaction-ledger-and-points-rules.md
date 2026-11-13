# ADR 0002: Ledger Inmutable de Puntos y Políticas de Gamificación

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28 (Revisado y Actualizado: 2026-11-12)  
> **Decisores:** Equipo de Arquitectura KidsTaskApp  

---

## 1. Contexto y Problema

El sistema de gestión de puntos constituye el núcleo de incentivos de KidsTaskApp. Si los saldos se gestionan como valores enteros mutables (`currentPoints += X`), cualquier fallo de sincronización, ajuste retroactivo, corrección de jornadas pasadas o anulación de canjes produce inconsistencias contables acumulativas, estados irreproducibles y falta de trazabilidad en las operaciones familiares.

### Metas
- Garantizar consistencia e integridad matemática en los balances de puntos mediante un registro de eventos auditable e inmutable.
- Permitir la reversión segura y transparente de premios, bonos y sanciones sin mutar registros históricos.
- Aislar el saldo operativo disponible del ciclo activo frente a correcciones extemporáneas sobre jornadas anteriores ya cerradas.
- Soportar modos de acumulación continua y reinicios cíclicos (diario y semanal) con auto-liquidación configurable.

### No-Metas
- Integración con pasarelas de pago bancarias o transferencias de dinero real (el manejo de paga monetaria es un marcador simbólico de acuerdo offline en el hogar, conforme a [constitution.md](../constitution.md#L75)).
- Soporte para saldos fraccionarios o decimales (los puntos se representan como valores enteros discretos).
- Transferencias o préstamos directos de puntos entre perfiles de hermanos.

---

## 2. Decisión

Se adopta un **Patrón de Ledger Contable Basado en Eventos Inmutables (`Transactions`)**:

1. **Estructura del Asiento Contable (`Transaction`):** Toda alteración de puntos debe registrarse en la colección `transactions` con los campos:
   - `id`: Identificador único generado mediante `crypto.randomUUID()` o clave determinista en eventos de cierre.
   - `familyId`: Identificador del hogar.
   - `childId`: Identificador del hijo afectado.
   - `type`: `'task_reward' | 'bonus' | 'penalty' | 'reward_redemption' | 'refund_reversal' | 'retroactive_adjustment' | 'points_expiration'`.
   - `points`: Cantidad entera con signo positivo o negativo.
   - `reason`: Descripción textual auditable del movimiento.
   - `date`: Fecha contable a la que corresponde la operación (`YYYY-MM-DD`).
   - `timestamp`: Marca de tiempo ISO exacta de emisión.
   - `actor`: Nombre del tutor que autorizó o ejecutó la acción (o `'Sistema'`).
   - `sourceRefId`: Identificador opcional de la entidad origen que detonó el asiento (`dailyAssignmentId`, `redemptionId`, `bonusId`).
   - `isReversed`: Booleano para control de idempotencia y auditoría de anulaciones.

2. **Reconciliación Estricta del Saldo y Prevención de Deuda Oculta:** El saldo operativo disponible del niño (`currentPoints`) se deriva del ledger mediante reducers puros:
   - En política `continuous`: `currentPoints` se calcula acumulando secuencialmente las transacciones del niño con piso cero por movimiento para prevenir deuda latente:
     $$\text{currentPoints} = \text{transactions.reduce}((acc, tx) \to \max(0, acc + tx.points), 0)$$
   - En políticas `daily_reset` y `weekly_reset`: `currentPoints` acumula secuencialmente únicamente las transacciones cuya fecha contable (`tx.date`) pertenezca a la ventana temporal del ciclo activo en curso (jornada actual o semana vigente).
   - Ninguna mutación ocurre fuera del ledger; toda alteración de balance genera un asiento contable.

3. **Semántica de Reversión e Inmutabilidad:** Los registros contables no se eliminan físicamente ni se alteran sus importes. Para anular una transacción previa:
   - Se registra una nueva transacción compensatoria de tipo `refund_reversal` con importe positivo (+puntos).
   - El atributo `isReversed: true` en el asiento original actúa exclusivamente como bandera de auditoría e idempotencia para la interfaz, impidiendo reembolsos dobles. La suma del ledger neutraliza matemáticamente el movimiento original mediante el contra-asiento compensatorio.

4. **Cálculo de Nivel y Acumulado Histórico (`totalPointsEarned`):** El nivel gamificado del niño (`level`) se deriva de forma monótona a partir de `totalPointsEarned` conforme a los umbrales de escala definidos en [06-gamification-and-rules/spec.md](../features/06-gamification-and-rules/spec.md#L25-L26). Dicho total se incrementa con toda tarea aprobada (del día o retroactiva) y bonos instantáneos, sin verse reducido por canjes de premios ni por expiraciones de fin de ciclo.

5. **Modos de Acumulación Temporal:**
   - `continuous` *(Por Defecto)*: Los puntos no caducan; persisten indefinidamente para metas a mediano y largo plazo.
   - `daily_reset`: El saldo diario no gastado expira o se liquida al cierre de cada jornada.
   - `weekly_reset`: Los puntos se acumulan durante la semana y expiran o se liquidan exclusivamente los domingos al cierre.

6. **Auto-Liquidación o Expiración al Cierre de Ciclo:**
   - Si la opción `autoLiquidation` está habilitada en la configuración del hogar, el saldo sobrante al cerrar el ciclo se convierte en una recompensa pactada: paga manual en efectivo (acuerdo familiar simbólico offline) o un premio comodín seleccionado del catálogo de recompensas de [04-rewards-and-locks/spec.md](../features/04-rewards-and-locks/spec.md). Dicha liquidación emite una transacción `reward_redemption` con el total del saldo en negativo, llevando la billetera a 0.
   - Si `autoLiquidation` está deshabilitada, el saldo sobrante se reinicia a 0 registrando una transacción `points_expiration`, garantizando la trazabilidad continua del balance.

7. **Cierre de Jornada Reactivo (`Lazy Catch-Up`) e Idempotencia:** Al tratarse de una arquitectura cliente local (PWA/React), el cierre de ciclo se ejecuta de forma reactiva (`executeDailyReset`) al iniciar o interactuar con la aplicación cuando la fecha del sistema supera la última fecha procesada. Para evitar duplicaciones ante aperturas concurrentes en múltiples dispositivos o pestañas:
   - Se asigna un identificador determinista: `id: tx-reset-${childId}-${cycleClosingDate}`.
   - Se aplica una verificación de idempotencia previa: si el identificador determinista ya existe en el ledger, la operación se omite.

8. **Regla de Revocación en Ciclos Cerrados:** Si una tarea validada en un ciclo pasado ya cerrado se revoca retroactivamente bajo políticas `daily_reset` o `weekly_reset`:
   - Se deduce del acumulado histórico `totalPointsEarned` (nivel del niño).
   - Se registra una transacción compensatoria `retroactive_adjustment` asociada a la fecha contable cerrada.
   - El saldo operativo de la jornada activa actual (`currentPoints`) no se altera, evitando saldos negativos o deducciones sobre la jornada actual por movimientos de ciclos contables ya cerrados.

9. **Predicado Temporal para Validaciones Retroactivas:** Cuando un tutor valida una tarea olvidada de una fecha pasada:
   - Si la fecha pertenece al ciclo activo (o bajo política `continuous`), los puntos se acreditan tanto al saldo disponible de la jornada como a `totalPointsEarned`.
   - Si la fecha pertenece a un ciclo anterior ya cerrado bajo `daily_reset` o `weekly_reset`, los puntos se acreditan exclusivamente a `totalPointsEarned` con una transacción `retroactive_adjustment`, respetando el cierre definitivo del ciclo pasado.

10. **Delegación del Ciclo de Vida de Tareas y Calendario:** El ciclo de vida de asignaciones diarias (`todayAssignments`), transiciones a `'missed'` y la estructura del historial visual se delegan al módulo de auditoría gobernado por [ADR 0003](0003-retroactive-calendar-audit-and-correction.md) y [state-and-events.contract.md](../contracts/state-and-events.contract.md).

---

## 3. Ejemplos Prácticos por Situación

A continuación se ilustra cada escenario gobernado por las reglas de la Sección 2, partiendo de estados concretos verificables en el ledger. *(Umbrales de referencia para nivel: `< 100` Nivel 1 • Principiante; `>= 100` Nivel 2 • Explorador; `>= 250` Nivel 3 • Aventurero).*

### Situación 1 — Ganancia por Aprobación de Tarea (`task_reward`) y Subida de Nivel
* **Estado inicial (`2026-11-13`):** `currentPoints = 30`, `totalPointsEarned = 85` (`Nivel 1 • Principiante`).
* **Evento:** El tutor aprueba la tarea `"Tender la cama"` (`+20 pts`).
* **Asiento emitido:** `{ type: 'task_reward', points: +20, date: '2026-11-13', sourceRefId: 'assign-bed-2026-11-13', isReversed: false }`.
* **Resultado:** `currentPoints = 50`, `totalPointsEarned = 105`. Al alcanzar o superar `100`, `level` asciende automáticamente a `Nivel 2 • Explorador`.

### Situación 2 — Bono Instantáneo (`bonus`) vs. Rechazo de Solicitud sin Ganancia
* **Caso A (Bono instantáneo):** Partiendo de `currentPoints = 50` y `totalPointsEarned = 105`, el tutor otorga un bono `"Ayudó a recoger la mesa"` (`+10 pts`). Se emite `{ type: 'bonus', points: +10, date: '2026-11-13', isReversed: false }`. Resultado: `currentPoints = 60`, `totalPointsEarned = 115`.
* **Caso B (Rechazo de tarea solicitada):** El niño solicita aprobación de `"Barrer el patio"` (`requested`), pero el tutor la rechaza (`rejected`). No se emite ninguna transacción al ledger; `currentPoints` (`60`) y `totalPointsEarned` (`115`) permanecen intactos.

### Situación 3 — Sanción (`penalty`) con Saldo Suficiente vs. Prevención de Deuda Oculta (Piso Cero Secuencial)
* **Caso A (Con saldo suficiente):** Partiendo de `currentPoints = 30` y `totalPointsEarned = 115`, el tutor aplica una sanción `"No guardó sus útiles"` (`-10 pts`). Se emite `{ type: 'penalty', points: -10, date: '2026-11-13' }`. Cálculo: `max(0, 30 + (-10)) = 20`. Resultado: `currentPoints = 20`; `totalPointsEarned` permanece en `115` (las sanciones nunca reducen el progreso histórico).
* **Caso B (Con saldo insuficiente — Piso cero por movimiento):** El niño inicia con `currentPoints = 5` y `totalPointsEarned = 115`. Recibe una sanción de `-15 pts` (`tx1`) y más tarde completa una tarea de `+20 pts` (`tx2`):
  1. Al procesar `tx1` (`-15`): `acc = max(0, 5 + (-15)) = 0` *(el excedente de `-10` queda absorbido y no genera deuda latente)*.
  2. Al procesar `tx2` (`+20`): `acc = max(0, 0 + 20) = 20`.
  * **Resultado:** `currentPoints = 20` (y no `10`), `totalPointsEarned = 135`.

### Situación 4 — Canje de Premio (`reward_redemption`)
* **Estado inicial:** `currentPoints = 60`, `totalPointsEarned = 115` (`Nivel 2 • Explorador`).
* **Evento:** El tutor autoriza el canje de `"30 min de videojuegos"` con costo de `40 pts`.
* **Asiento emitido:** `{ type: 'reward_redemption', points: -40, date: '2026-11-13', sourceRefId: 'redemp-game-01', isReversed: false }`.
* **Resultado:** `currentPoints = 20` (`60 - 40`), mientras que `totalPointsEarned` permanece en `115` y `level` se mantiene en `Nivel 2 • Explorador`.

### Situación 5 — Reversión / Reembolso de Canje (`refund_reversal` + `isReversed`)
* **Estado inicial:** Existe `tx-orig` (`type: 'reward_redemption'`, `points: -40`, `isReversed: false`), `currentPoints = 20`, `totalPointsEarned = 115`.
* **Evento:** El tutor reembolsa el canje porque el premio no pudo entregarse.
* **Operación inmutable en el ledger:**
  1. `tx-orig` conserva `points: -40` sin borrarse ni editarse y marca únicamente `isReversed: true`.
  2. Se inserta un nuevo asiento compensatorio `{ type: 'refund_reversal', points: +40, date: '2026-11-13', sourceRefId: 'redemp-game-01' }`.
* **Resultado:** En política `continuous`, la secuencia neutraliza el cargo original (`-40` y `+40`) dejando `currentPoints = 60`. `totalPointsEarned` continúa en `115` (un reembolso no cuenta como nuevos puntos ganados). Un segundo intento de reembolso queda bloqueado al verificar `tx-orig.isReversed === true`.

### Situación 6 — Anulación de Tarea del Día Activo y Reversión de Bonos o Sanciones Pasadas
* **Caso A (Desmarcar tarea aprobada hoy):** La tarea `"Tender la cama"` (`+20 pts`) aprobada hoy se desmarca (`approved -> uncompleted`). Se registra un ajuste compensatorio de `-20 pts` con fecha de hoy: `currentPoints` baja en `20` y `totalPointsEarned` baja en `20`.
* **Caso B (Revertir un bono pasado de `+15 pts`):** Se marca el bono original con `isReversed: true` y se registra una compensación por `-15 pts`; descuenta `15` de `totalPointsEarned` (y de `currentPoints` si corresponde al ciclo activo o modo `continuous`).
* **Caso C (Revertir una sanción pasada de `-10 pts`):** Se marca la sanción original con `isReversed: true` y se emite `{ type: 'refund_reversal', points: +10, date: '2026-11-13' }`; suma `+10` al saldo operativo actual sin incrementar `totalPointsEarned`.

### Situación 7 — Modos de Acumulación Temporal (`continuous` vs. `daily_reset` vs. `weekly_reset`)
* **Escenario común:** Un niño ganó `+30 pts` el lunes `2026-11-09` y `+20 pts` el martes `2026-11-10`, sin haber hecho canjes.
  * **`continuous`:** Al finalizar el martes dispone de `currentPoints = 50` (arrastra todas las fechas) y `totalPointsEarned = 50`.
  * **`daily_reset`:** Al comenzar el martes `2026-11-10`, los `30 pts` del lunes ya cerraron; el saldo del martes inició en `0` y tras la tarea de hoy queda en `currentPoints = 20`, mientras `totalPointsEarned = 50`.
  * **`weekly_reset`:** De lunes a domingo las transacciones pertenecen a la misma semana activa; el martes dispone de `currentPoints = 50` y `totalPointsEarned = 50`. El cierre ocurre únicamente al terminar el domingo `2026-11-15`.

### Situación 8 — Cierre de Ciclo con `autoLiquidation` Activada vs. Desactivada (`points_expiration`)
* **Estado previo al cierre del `2026-11-12`:** Saldo sobrante `currentPoints = 40`, `totalPointsEarned = 140`.
* **Caso A (`autoLiquidation` activada, ej. tarifa `$0.10 / punto` o premio comodín):** El cierre emite `{ type: 'reward_redemption', points: -40, reason: 'Auto-liquidación fin de ciclo ($4.00)', date: '2026-11-12', actor: 'Sistema' }`. El saldo operativo baja a `0` y `totalPointsEarned` permanece en `140`.
* **Caso B (`autoLiquidation` desactivada):** El cierre emite `{ type: 'points_expiration', points: -40, reason: 'Expiración de puntos al cierre de ciclo', date: '2026-11-12', actor: 'Sistema' }`. El saldo operativo baja a `0` y `totalPointsEarned` permanece en `140`.

### Situación 9 — Cierre Reactivo (`Lazy Catch-Up`) e Idempotencia Multi-Dispositivo
* **Escenario:** Modo `daily_reset`. El `2026-11-12` cerró con `25 pts` sobrantes para `child-1`, pero nadie abrió la app a medianoche. El `2026-11-13` a las `08:00`, ambos tutores abren la app en teléfonos distintos.
* **Dispositivo A (`08:00:01`):** Detecta que `hoy ('2026-11-13') > lastResetDate ('2026-11-12')`, ejecuta `executeDailyReset` e inserta el asiento con identificador determinista `id: 'tx-reset-child-1-2026-11-12'` (`points: -25`).
* **Dispositivo B (`08:00:05`):** Ejecuta `executeDailyReset` para la misma fecha, detecta que `tx-reset-child-1-2026-11-12` ya existe en el ledger y omite el registro, impidiendo un descuento duplicado.

### Situación 10 — Revocación Retroactiva en Ciclo Cerrado vs. Ciclo Abierto
* **Estado inicial hoy `2026-11-13` (bajo `daily_reset`):** `currentPoints = 20`, `totalPointsEarned = 120` (`Nivel 2 • Explorador`). El tutor descubre que la tarea del `2026-11-11` (`+15 pts`) no se realizó y la revoca.
* **Caso A (Ciclo pasado cerrado — `daily_reset` o semana cerrada en `weekly_reset`):**
  - Se deduce `15` de `totalPointsEarned` (`120 - 15 = 105`).
  - Se registra `{ type: 'retroactive_adjustment', points: -15, date: '2026-11-11' }`.
  - Como `2026-11-11` está fuera del ciclo activo (`2026-11-13`), `currentPoints` de hoy **permanece intacto en `20`**.
* **Caso B (Ciclo abierto — política `continuous`, o fecha dentro de la semana vigente en `weekly_reset`):**
  - El ajuste afecta tanto al saldo operativo como al acumulado histórico: `currentPoints = max(0, 20 - 15) = 5` y `totalPointsEarned = 105`.

### Situación 11 — Validación Retroactiva de Tarea Olvidada en Ciclo Cerrado vs. Ciclo Abierto
* **Estado inicial hoy `2026-11-13`:** `currentPoints = 20`, `totalPointsEarned = 90` (`Nivel 1 • Principiante`). El tutor aprueba hoy una tarea olvidada del `2026-11-11` que vale `+15 pts`.
* **Caso A (Ciclo pasado cerrado — `daily_reset` o semana anterior en `weekly_reset`):**
  - Se registra `{ type: 'retroactive_adjustment', points: +15, date: '2026-11-11' }`.
  - `currentPoints` de la jornada actual **no cambia** (sigue en `20`).
  - `totalPointsEarned` aumenta a `105`, promoviendo al niño a `Nivel 2 • Explorador`.
* **Caso B (Ciclo abierto — `continuous` o misma semana en `weekly_reset`):**
  - Los `+15 pts` pertenecen a la ventana activa del balance: `currentPoints` sube a `35` (`20 + 15`) y `totalPointsEarned` sube a `105` (`Nivel 2 • Explorador`).

---

## 4. Alternativas Consideradas

| Alternativa | Descripción Técnica | Razón de Rechazo |
| :--- | :--- | :--- |
| **1. Contador Entero Mutable Directo** | Almacenar únicamente `child.currentPoints` e incrementar/decrementar con un log auxiliar no vinculante. | **Rechazada por riesgo de deriva contable.** Cualquier error de sincronización local o anulación de canje provoca inconsistencias acumuladas sin trazabilidad forense ni capacidad de auditoría confiable. |
| **2. Event Sourcing Completo (CQRS)** | Separar comandos y consultas mediante un EventStore formal con proyecciones y reproductores de eventos completos. | **Rechazada por sobre-ingeniería.** Introduce alta sobrecarga de serialización y complejidad arquitectónica desproporcionada para el ámbito de una aplicación familiar cliente-servidor ligera. |
| **3. Base de Datos Relacional Local (SQLite / IndexedDB)** | Persistir el libro mayor en tablas relacionales con soporte transaccional ACID nativo del navegador. | **Rechazada para v1.0.** Incrementa el acoplamiento a APIs de almacenamiento asíncrono complejas en lugar de mantener el estado puro serializable en React Context con sincronización a LocalStorage y Firestore. |

---

## 5. Consecuencias

### Consecuencias Positivas
- **Auditoría Integral y Consistencia Matemática:** Toda alteración de balance está respaldada por un evento auditable, eliminando divergencias entre la billetera y el ledger.
- **Inmutabilidad Estricta:** Reversiones realizadas mediante asientos compensatorios (`refund_reversal`) sin borrado físico de transacciones.
- **Aislamiento de Ciclos:** Protección del saldo activo de los niños frente a correcciones de jornadas pasadas en esquemas de reinicio diario o semanal.
- **Claridad de Dominios:** Separación precisa entre transacciones financieras del ledger y estados del calendario de tareas (ADR 0003).

### Riesgos y Mitigaciones

| Riesgo Identificado | Modo de Falla Potencial | Estrategia de Mitigación Arquitectónica |
| :--- | :--- | :--- |
| **Crecimiento de Volumen en Almacenamiento Local** | Saturación de memoria en dispositivos tras años de uso (~7,500 transacciones para 3 hijos). | **Huella Acotada y Filtrado Eficiente:** El volumen representa ~1.5 MB en JSON estructurado. Las operaciones de filtrado corresponden a escaneos lineales $O(N)$ en memoria. La UI accede a la propiedad proyectada en tiempo constante $O(1)$ sin recalcular el historial completo en cada render. |
| **Concurrencia Multi-Dispositivo en Cierres** | Emisión duplicada de transacciones de cierre cuando ambos tutores abren la app al inicio del día. | **Idempotencia Determinista:** Generación de identificadores canónicos `tx-reset-${childId}-${cycleClosingDate}` con verificación previa de existencia antes de registrar el asiento. |
| **Desincronización de Reloj del Cliente** | Dispositivos con hora local alterada que puedan adelantar o atrasar el cierre de ciclo. | **Anclaje en Timestamps ISO y Fecha Servidor:** Las marcas temporales se formatean con fecha ISO estandarizada; en sincronizaciones remotas Firestore prevalece la marca de tiempo del servidor. |
| **Manipulación no Autorizada de Transacciones** | Intento de alteración de puntos desde interfaces infantiles. | **Barrera de Seguridad por PIN y Contratos:** El rol `child` no tiene permisos ni interfaces para emitir transacciones; toda modificación requiere validación del PIN maestro parental de 4 dígitos ([ADR 0001](0001-dual-mode-role-architecture.md)). |
