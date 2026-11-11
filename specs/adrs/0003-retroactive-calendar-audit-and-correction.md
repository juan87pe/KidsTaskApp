# ADR 0003: Calendario de Auditoría con Poder de Corrección Retroactiva

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Equipo de Arquitectura KidsTaskApp  

---

## 1. Contexto y Problema

En la vida familiar real, los padres con frecuencia olvidan validar una tarea antes de que termine el día, o validan una tarea por error creyendo que estaba terminada cuando no lo estaba, o autorizan un canje de premio que luego no se realiza (ej. *"salida al parque suspendida por lluvia"*). Las aplicaciones tradicionales bloquean los días pasados impidiendo correcciones o generan descuadres en los balances.

---

## 2. Decisión

Se diseña el módulo **Calendario y Auditoría con Corrección Retroactiva** (`ParentCalendarAudit`):
1. **Navegación Histórica Completa:** El padre puede seleccionar cualquier fecha pasada (`YYYY-MM-DD`) en el mini-calendario con mapa de calor (🟢 Verde, 🟡 Amarillo, 🔴 Rojo, ⚪ Gris).
2. **Separación Estructural de Sanciones y Bonos:** Las sanciones no deben representarse como tareas con puntos negativos dentro del array `tasks`. El esquema de cada fecha histórica segrega:
   - `tasks`: Tareas programadas con puntos positivos (`points > 0`).
   - `bonuses`: Bonos otorgados en la fecha.
   - `penaltiesList` y `penalties`: Sanciones aplicadas en la fecha.
   - `redemptions`: Premios canjeados en la fecha.
3. **Validación Retroactiva:** Si una tarea de un día anterior quedó en estado `uncompleted`, `missed` o `pending`, el padre dispone de un botón `[ ➕ Validar como Realizada Ahora ]`, que actualiza la tarea a `approved`, marca `isRetroactivelyModified = true`, emite una transacción `retroactive_adjustment` y acredita los puntos al saldo del niño y a `totalPointsEarned`.
4. **Revocación de Aprobación Errónea:** Si una tarea fue aprobada indebidamente en el pasado, el botón `[ 🔄 Modificar Validación / Desmarcar ]` revierte el estado a `uncompleted` o `missed`, marca `isRetroactivelyModified = true`, emite un débito contable y descuenta de `totalPointsEarned`.
5. **Reembolso Idempotente de Canje de Premio:** Si un premio fue canjeado en una fecha pasada, el botón `[ ↩️ Anular y Reembolsar Canje ]` (disponible únicamente si `isRefunded === false`) marca la transacción original como `isReversed = true`, asigna `isRefunded = true` en el historial e inyecta una transacción compensatoria de tipo `refund_reversal`, reintegrando los puntos inmediatamente al niño.
6. **Corrección de Bonos y Sanciones Pasadas:** El padre puede anular una sanción o bono erróneo del pasado, recalculando el `currentPoints`, `netPoints` y el estado del mapa de calor de esa fecha.
7. **Calendario Infantil Gamificado (Solo Lectura):** Los niños disponen de una versión visual simplificada con estrellas y logros para reforzar su autoestima, sin controles de edición.

---

## 3. Consecuencias

### Positivas:
- **Adaptación a la Realidad Parental:** Elimina el estrés de tener que cerrar o validar el día antes de medianoche.
- **Justicia y Transparencia:** Permite corregir cualquier malentendido familiar de forma pacífica y trazable.

### Riesgos y Mitigaciones:
- *Riesgo:* Descuadre de saldos si un saldo llega a ser negativo por una revocación retroactiva.
- *Mitigación:* Si una revocación retroactiva dejase el saldo menor a 0, el sistema muestra una alerta de advertencia y fija el piso mínimo en 0 puntos o saldo pendiente.
