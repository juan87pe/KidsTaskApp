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
2. **Validación Retroactiva:** Si una tarea de un día anterior quedó en estado `uncompleted` o `pending`, el padre dispone de un botón `[ ➕ Validar como Realizada Ahora ]`, que actualiza la tarea a `approved`, marca `isRetroactivelyModified = true`, y genera la transacción positiva correspondiente.
3. **Revocación de Aprobación Errónea:** Si una tarea fue aprobada indebidamente en el pasado, el botón `[ 🔄 Modificar Validación / Desmarcar ]` revierte el estado a `uncompleted` o `rejected` y descuenta los puntos mediante un asiento contable.
4. **Reembolso de Canje de Premio:** Si un premio fue canjeado en una fecha pasada, el botón `[ ↩️ Anular y Reembolsar Canje ]` marca la transacción original como `isReversed = true` e inyecta una transacción compensatoria de tipo `refund_reversal`, reintegrando los puntos inmediatamente al niño.
5. **Calendario Infantil Gamificado (Solo Lectura):** Los niños disponen de una versión visual simplificada con estrellas y logros para reforzar su autoestima, sin controles de edición.

---

## 3. Consecuencias

### Positivas:
- **Adaptación a la Realidad Parental:** Elimina el estrés de tener que cerrar o validar el día antes de medianoche.
- **Justicia y Transparencia:** Permite corregir cualquier malentendido familiar de forma pacífica y trazable.

### Riesgos y Mitigaciones:
- *Riesgo:* Descuadre de saldos si un saldo llega a ser negativo por una revocación retroactiva.
- *Mitigación:* Si una revocación retroactiva dejase el saldo menor a 0, el sistema muestra una alerta de advertencia y fija el piso mínimo en 0 puntos o saldo pendiente.
