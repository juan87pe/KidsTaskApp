# ADR 0004: Biblioteca Maestra, Constructor de Rutinas y Detección de Duplicados

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Equipo de Arquitectura KidsTaskApp  

---

## 1. Contexto y Problema

Las familias repiten decenas de tareas a lo largo de la semana. Forzar a los padres a escribir tareas desde cero todos los días genera abandono de la app. Además, al armar rutinas (ej. *"Rutina Mañana"*), los padres necesitan reusar tareas existentes y definir el orden secuencial de ejecución. Por último, asignar una rutina no debe duplicar accidentalmente tareas que el niño ya tenía programadas para hoy, a menos que sea una intención explícita (ej. lavarse los dientes dos veces al día).

---

## 2. Decisión

Se adopta un **Modelo de Catálogo Desacoplado con Motor de Programación Temporal y Detección Preventiva**:
1. **Banco de Tareas Maestras (`masterTasks`):** CRUD centralizado con título, puntos predeterminados, modo de aprobación, icono y descripción/instrucciones opcionales.
2. **Constructor de Rutinas (`masterRoutines`):** Permite ensamblar paquetes de tareas reutilizando elementos del banco de tareas o creando nuevos al vuelo, asignando un `orderIndex` secuencial a cada una.
3. **Motor de Programación Temporal:** Permite programar cualquier tarea o rutina bajo 5 modalidades:
   - *Hoy (Día actual)*.
   - *Diaria continua*.
   - *Semanal (Días fijos `[L][M][X][J][V][S][D]`)*.
   - *Fecha específica (`YYYY-MM-DD`)*.
   - *Rango de fechas / Período (`fechaInicio` a `fechaFin`)*.
4. **Visor de Asignaciones en Tiempo Real:** Al pulsar cualquier tarea o rutina de la biblioteca, se muestran los hijos que la tienen asignada, sus reglas de recurrencia y opciones de modificar/pausar.
5. **Detector Inteligente de Duplicados (`DuplicateDetectionModal`):** Si una asignación coincide con una tarea activa del día para ese niño, se ofrece elegir entre:
   - `Omitir duplicado (Recomendado)`: Evita sobrecargar la lista e inflar puntos.
   - `Permitir como tarea adicional (x2)`: Registra la instancia como tarea extra deliberada.
6. **Visibilidad Unificada de Tareas de Rutina en el Catálogo General:** Todas las tareas que integran una rutina también se muestran de forma accesible e independiente en el Catálogo General de Tareas Maestras (`masterTasks`), identificadas con una insignia que indica a qué rutina(s) pertenecen (ej. `[🏷️ Rutina Mañanera]`). Si un tutor crea una nueva tarea al vuelo dentro de una rutina, esta se registra automáticamente en el catálogo maestro, permitiendo su asignación y reutilización individual.

---

## 3. Consecuencias

### Positivas:
- **Máxima Eficiencia para Padres:** Asignación en 2 clics de semanas completas de actividades.
- **Prevención de Inflación de Puntos:** No se duplican tareas por descuido.
- **Flexibilidad Total:** Soporta tanto rutinas estándar como hábitos repetitivos de varias veces al día.
