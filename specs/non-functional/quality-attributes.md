# Atributos de Calidad y Requerimientos No Funcionales

> **Módulo:** `non-functional/quality-attributes`  
> **Áreas:** Rendimiento, PWA Offline, Usabilidad Táctil y Compatibilidad  

---

## 1. Rendimiento y Métricas de Respuesta (SLOs)

- **Tiempo de Carga Inicial (First Contentful Paint):** $\le 1.2$ segundos en conexiones 4G estándar.
- **Latencia de Respuesta al Toque (Touch Feedback):** $\le 50$ ms al pulsar botones táctiles *Chunky* o indicadores de tareas.
- **Animaciones y Efectos Visuales:** 60 FPS estables durante el lanzamiento de confeti (`canvas-confetti`) y transiciones de modales.

---

## 2. PWA y Resiliencia Offline-First

- **Persistencia Local Inmediata:** Cualquier cambio en tareas, puntos o estados debe persistirse inmediatamente en `localStorage` antes de cualquier sincronización remota.
- **Disponibilidad Offline:** La aplicación debe ser completamente operable sin conexión a internet, encolando eventos para sincronización posterior cuando se reanude la conectividad.

---

## 3. Ergonomía Táctil y Accesibilidad Infantil

- **Áreas de Toque Mínimas:** Todos los botones interactivos infantiles deben tener un área táctil mínima de $48 \times 48\text{ px}$ (idealmente $56\text{ px}$ en botones principales).
- **Contraste de Color:** Razón de contraste mínima de $4.5:1$ en todos los textos sobre fondos de color, cumpliendo con WCAG 2.1 AA.
- **Tipografía:** Tamaños de texto base legibles a distancia de brazo extendido (mínimo `16px` para texto infantil).
