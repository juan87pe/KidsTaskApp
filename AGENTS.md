# AGENTS.md — Directrices Operativas para Agentes de Inteligencia Artificial

> **Proyecto:** KidsTaskApp (Gestor Familiar de Tareas y Gamificación Infantil)  
> **Metodología Obligatoria:** Spec-Driven Development (SDD) — **Modelo Spec-Anchored**  
> **Estado:** Activo / Vigente  

---

## 1. Rol y Principio Rector de los Agentes

Todo agente de IA que interactúe con este repositorio actúa como **Ingeniero de Software y Arquitecto SDD**. No debe realizar suposiciones, improvisaciones de diseño o modificaciones de código sin verificar y anclar formalmente la especificación correspondiente en el directorio `specs/`.

### Reglas de Oro Inviolables (Modelo Spec-Anchored):
1. **La Especificación como Ancla Viva:** El código en `src/` y las especificaciones en `specs/` deben permanecer en sincronización continua. Toda alteración de componentes, funciones o estados debe tener su reflejo y trazabilidad directa en su especificación funcional (`spec.md`), plan atómico (`plan.md`) y validación BDD (`validation.md`).
2. **Cero Deriva Arquitectónica (Zero Drift):** Si durante la refactorización o ejecución de código se detecta una mejora, caso borde o ajuste, no se considera completado hasta haber actualizado y anclado la especificación.
3. **Sintaxis EARS Obligatoria:** Todo requisito nuevo o modificado debe redactarse siguiendo estrictamente los patrones de *Easy Approach to Requirements Syntax* (EARS).
4. **Flujo Cíclico de 3 Pasos:**
   - **Paso 1 (Spec & ADR):** Leer `specs/constitution.md`, el ADR relevante y `specs/features/<modulo>/spec.md`.
   - **Paso 2 (Plan Atómico):** Ejecutar una única tarea atómica descrita en `specs/features/<modulo>/plan.md`.
   - **Paso 3 (Validación BDD):** Validar la tarea contra los escenarios Gherkin de `specs/features/<modulo>/validation.md` antes de marcarla como completada.

---

## 2. Stack Tecnológico y Restricciones de Implementación

| Componente | Tecnología Seleccionada | Versión / Restricción |
| :--- | :--- | :--- |
| **Framework UI** | React | `^18.3.1` (Functional Components & Hooks) |
| **Tooling & Bundler** | Vite | `^6.2.0` (ESM puro) |
| **Estilos & Tokens** | Tailwind CSS | `^3.4.17` (Tokens temáticos *Kindred Play*) |
| **Iconografía** | Lucide React | `^1.16.0` (**Prohibido el uso de imágenes con copyright**) |
| **Efectos Visuales** | canvas-confetti | `^1.9.4` (Celebración de logros) |
| **Gestión de Estado** | React Context API + LocalStorage / Firestore Sync | Reactivo con persistencia local inmediata |
| **Arquitectura de UI** | Chunky Tactile Design System | Radios `rounded-2xl`/`3xl`, bordes `border-b-4` |

---

## 3. Límites y Prohibiciones Estrictas

- ❌ **PROHIBIDO** crear tareas o pantallas que mezclen el modo Niños con el modo Padres sin pasar por la barrera del PIN de seguridad de 4 dígitos.
- ❌ **PROHIBIDO** permitir que el rol `child` modifique saldos de puntos, apruebe sus propias tareas o elimine restricciones de premios.
- ❌ **PROHIBIDO** mutar directamente el historial de transacciones; toda corrección o reembolso debe registrarse como un nuevo evento auditable en el ledger.
- ❌ **PROHIBIDO** el uso de librerías externas pesadas no declaradas en `package.json` sin previa aprobación del usuario.
- ❌ **PROHIBIDO** hardcodear cadenas de texto críticas de reglas de negocio en los componentes; deben consumirse desde el contexto o el modelo de datos.

---

## 4. Estructura de Directorios del Repositorio

```text
APP DE TAREAS INFANTILES/
├── AGENTS.md                   # Esta constitución de IA
├── specs/                      # Jerarquía formal de especificaciones SDD
│   ├── constitution.md         # Visión, principios no negociables y modelo conceptual
│   ├── index.md                # Matriz de trazabilidad y catálogo maestro
│   ├── adrs/                   # Registros de Decisiones de Arquitectura (0001 - 0005)
│   ├── contracts/              # Esquemas JSON y contratos de estado/eventos
│   ├── features/               # Especificaciones por módulo funcional (01 a 06)
│   │   └── <modulo>/
│   │       ├── spec.md         # Requisitos en sintaxis EARS
│   │       ├── plan.md         # Plan técnico con checklist atómico
│   │       └── validation.md   # Escenarios BDD / Gherkin
│   └── non-functional/         # Seguridad (STRIDE/PIN), Rendimiento y UI Tokens
├── src/                        # Código fuente React
│   ├── assets/                 # SVGs e iconos limpios
│   ├── components/             # Componentes modulares por dominio (Parent, Kid, Common, etc.)
│   ├── context/                # Estado global y persistencia (AppContext)
│   ├── data/                   # Semillas y datos iniciales (initialData.js)
│   ├── styles/                 # Estilos Tailwind y tokens
│   ├── App.jsx                 # Enrutador y orquestador de vistas
│   └── main.jsx                # Punto de entrada
└── package.json
```

---

## 5. Protocolo de Modificación de Código

Cuando el usuario solicite un cambio o nueva funcionalidad:
1. Localiza el módulo en `specs/features/<modulo>/`.
2. Actualiza primero los requisitos EARS en `spec.md` y añade los escenarios Gherkin en `validation.md`.
3. Añade la tarea al checklist de `plan.md`.
4. Ejecuta el código en `src/`.
5. Valida la implementación y actualiza `specs/index.md` si se introdujeron nuevos identificadores de requerimiento.
