# ADR 0002: Ledger Inmutable de Puntos y Políticas de Gamificación

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Equipo de Arquitectura KidsTaskApp  

---

## 1. Contexto y Problema

El sistema de puntos es el eje motivacional de KidsTaskApp. Si los puntos se gestionan como un simple número entero mutable (`currentPoints += X`), cualquier error de sincronización, ajuste retroactivo, corrección de días pasados o canje cancelado genera inconsistencias matemáticas, pérdida de confianza de los padres y frustración en los niños.

---

## 2. Decisión

Se adopta un **Patrón de Ledger Contable Basado en Eventos Inmutables (`Transactions`)**:
1. Toda alteración de puntos debe registrarse en la colección `transactions` con los campos:
   - `id`: Identificador único.
   - `childId`: ID del hijo afectado.
   - `type`: `'task_reward' | 'bonus' | 'penalty' | 'reward_redemption' | 'refund_reversal' | 'retroactive_adjustment'`.
   - `points`: Cantidad con signo positivo o negativo.
   - `reason`: Descripción del movimiento.
   - `date`: Fecha contable (`YYYY-MM-DD`).
   - `timestamp`: Marca de tiempo ISO.
   - `actor`: Tutor que autorizó o ejecutó la acción.
   - `isReversed`: Booleano para indicar si la transacción fue revertida formalmente.
2. El saldo actual de un niño (`currentPoints`) se calcula o sincroniza garantizando que la suma de sus transacciones no revertidas coincida exactamente con el saldo disponible.
3. Se soportan 3 **Modos de Acumulación**:
   - `continuous` *(Por Defecto)*: Los puntos no caducan; se acumulan indefinidamente para premios grandes.
   - `daily_reset`: Los puntos se reinician a 0 a las 23:59.
   - `weekly_reset`: Los puntos se reinician los domingos a las 23:59.
4. **Auto-Liquidación / Canje por Defecto de Puntos Sobrantes (`autoLiquidation`):** Al activar `daily_reset` o `weekly_reset`, el sistema solicita obligatoriamente si se desea canjear automáticamente los puntos no gastados al llegar las 23:59:59 (por ejemplo, convertirlos a dinero/paga semanal con tasa fija como `$0.10 por punto`, o canjearlos por un premio comodín), liquidando el saldo a 0 mediante una transacción legítima `reward_redemption` para que el esfuerzo del niño no se desvanezca en el vacío.

---

## 3. Consecuencias

### Positivas:
- **Auditoría Completa:** Los padres pueden ver exactamente de dónde proviene cada punto y en qué se gastó.
- **Reversibilidad Segura:** Se pueden deshacer canjes o penalizaciones sin romper la consistencia global.

### Riesgos y Mitigaciones:
- *Riesgo:* Crecimiento del tamaño del array de transacciones con el tiempo y posible impacto en fluidez.
- *Análisis y Mitigación:* 
  1. **Huella de Memoria Mínima:** 1 año completo de uso intensivo para 3 hijos (~7,500 transacciones) ocupa apenas ~1.5 MB en memoria, filtrándose en < 2 ms por CPU.
  2. **Saldo Consolidado en Objeto (`child.currentPoints`):** La UI nunca recalcula todo el historial en tiempo real; lee directamente el saldo consolidado del niño, garantizando 60 FPS constantes.
  3. **Segmentación Temporal por Mes:** El calendario solo carga y procesa los eventos del mes visualizado, evitando sobrecargar el DOM.
  4. **Compactación Histórica Opcional:** Si un hogar supera los 24 meses de uso, el sistema puede consolidar los años anteriores en un único asiento contable de saldo inicial.
