# Constitución del Sistema: KidsTaskApp

> **Versión:** 1.0.0  
> **Metodología SDD:** Spec-Anchored (Especificación Anclada y Sincronización Continua)  
> **Última Actualización:** 2026-08-28  

---

## 1. Propósito y Misión del Sistema

**KidsTaskApp** es una aplicación progresiva (PWA / Móvil / Web) diseñada para transformar la dinámica familiar del hogar, fomentando la autonomía, responsabilidad y hábitos positivos en los niños mediante una experiencia de gamificación lúdica y clara, combinada con un centro de control parental robusto, auditable y con capacidad de corrección retroactiva.

---

## 1.1 Modelo Operativo Spec-Anchored (Anclaje Continuo y Prevención de Deriva)

El proyecto opera bajo el paradigma **Spec-Anchored**:
1. **El Ancla Viva:** Toda funcionalidad implementada en `src/` está estrictamente anclada a su especificación correspondiente en `specs/features/<modulo>/`.
2. **Prevención de Deriva Arquitectónica (Zero Architectural Drift):** A medida que la aplicación evoluciona o se refactoriza en el código real, cualquier cambio de comportamiento, nuevo caso borde o ajuste de UX debe **anclarse inmediatamente en la especificación** (actualizando los requisitos EARS, los contratos JSON y los escenarios BDD).
3. **Validación Anclada:** Las pruebas BDD de `validation.md` y los esquemas en `contracts/` son los eslabones de verificación que garantizan que el código no se desvíe de la verdad especificada.

---

## 2. Usuarios Objetivo y Personas

1. **🧒 Los Hijos (Niños de 5 a 14 años):**
   - Buscan claridad visual, feedback positivo inmediato (confeti, estrellas ⭐, sonidos reconfortantes) y motivación mediante recompensas deseadas.
   - Requieren una interfaz táctil, amigable, sin frustración y que les muestre qué hacer ahora de manera secuencial y ordenada.
2. **👨‍👩‍👧 Los Padres / Tutores (Uno o múltiples adultos):**
   - Buscan reducir la fricción diaria en las rutinas matutinas y nocturnas.
   - Necesitan un sistema rápido (validación en 1-clic), flexible (reordenar tareas, bonos y sanciones al instante) y auditable (corregir olvidos o errores de días pasados sin descalabros en la contabilidad familiar).

---

## 3. Principios Fundamentales No Negociables (Core Tenets)

### Tenet 1: Separación Estricta de Roles (Bifurcación Segura)
- El **Modo Niños** y el **Modo Padres** operan en universos de experiencia diferenciados.
- Ningún hijo puede acceder a funciones administrativas, creación de tareas, modificación de saldos o configuración de la app sin ingresar el **PIN maestro de 4 dígitos**.

### Tenet 2: Desacoplamiento entre Catálogo Maestro y Operativa Diaria
- El **Banco de Tareas Maestras** y las **Plantillas de Rutinas** residen en la Biblioteca Familiar como modelos reusables.
- Las **Asignaciones Diarias** (`dailyAssignments`) son instancias independientes y fechadas (`YYYY-MM-DD`). Modificar una tarea en el día de un niño no corrompe la plantilla maestra en la biblioteca, y viceversa.

### Tenet 3: Trazabilidad y Ledger Inmutable de Puntos
- El saldo de puntos de cada niño es el resultado de un libro de transacciones (`transactions`).
- Los puntos nunca se modifican por asignación directa sin un registro histórico (`task_reward`, `bonus`, `penalty`, `reward_redemption`, `refund_reversal`).
- Cualquier corrección retroactiva en el calendario genera un asiento contable compensatorio (`refund_reversal` o ajuste auditado).

### Tenet 4: Guía Secuencial con Flexibilidad de Ejecución (Completitud No Lineal)
- La lista de tareas se presenta ordenada cronológicamente (`orderIndex`) como una guía visual estructurada orientada por los padres (1° Cama, 2° Desayuno, 3° Deberes, etc.).
- **Libertad y Autonomía de Marcado:** Los niños tienen total libertad para realizar y marcar sus tareas en cualquier orden que les resulte práctico durante el día. El sistema no impone bloqueos secuenciales estrictos; cualquier tarea pendiente puede ser marcada como realizada independientemente de su posición en la lista.

### Tenet 5: Privacidad Infantil y Ausencia Total de Publicidad
- Prohibición estricta de tracking comercial, anuncios publicitarios o patrones oscuros (*dark patterns*) orientados a la frustración infantil.
- Uso exclusivo de iconografía vectorial SVG limpia y libre de derechos (Lucide Icons).

---

## 4. Límites de Alcance (In Scope vs. Out of Scope)

### ✅ Dentro del Alcance (In Scope):
- Selector de perfil familiar con acceso por PIN para padres y acceso directo para niños.
- Dashboard parental 360° con métricas del día y accesos rápidos (1-tap).
- Ficha de control diario por hijo con reordenamiento secuencial interactivo y notas explicativas desplegables.
- Centro de aprobaciones dedicado para tareas enviadas y canjes de premios pendientes.
- Biblioteca maestra de tareas y constructor de rutinas con reutilización, orden secuencial y prevención inteligente de duplicados.
- Motor de programación temporal (Hoy, Diaria continua, Días semanales fijos, Fecha puntual, Rango de fechas).
- Calendario parental interactivo con mapa de calor y poder de corrección retroactiva (validar pasadas, revocar aprobaciones, reembolsar canjes).
- Tienda de premios con configuración de equivalencia en puntos y sistema de bloqueo temporal con temporizador.
- Calendario infantil gamificado de logros (solo lectura).
- Gestión multi-tutor y multi-hijo con configuración de reglas de puntos (acumulativo, diario, semanal).

### ❌ Fuera del Alcance (Out of Scope para v1.0):
- Integración con pasarelas de pago bancarias o dinero real.
- Conexión con asistentes de voz externos (Alexa/Google Home).
- Chat de mensajería instantánea abierta entre dispositivos.
