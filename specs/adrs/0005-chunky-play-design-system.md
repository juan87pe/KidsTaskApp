# ADR 0005: Sistema de Diseño Visual "Kindred Play" y Componentes Chunky

> **Estado:** Aceptado  
> **Fecha:** 2026-08-28  
> **Decisores:** Equipo de Arquitectura KidsTaskApp  

---

## 1. Contexto y Problema

Las interfaces para niños y familias requieren un balance delicado: no deben verse infantiles al punto de parecer un juego desechable, pero tampoco pueden ser grises o corporativas como un software de oficina. Los niños necesitan botones táctiles claros con feedback físico simulado, y los padres necesitan legibilidad y velocidad de uso.

---

## 2. Decisión

Se adopta el **Sistema de Diseño Visual "Kindred Play"**:
1. **Paleta de Colores Específica:**
   - `Sky Blue` (`#88D1F1`): Botones de acción, cabeceras vivas.
   - `Denim Slate` (`#1E3A5F` / `#4A90E2`): Tipografía contrastada y acentos.
   - `Golden Biscuit` (`#F6C877`): Estrellas ⭐, badges de puntos y aros de avatar.
   - `Creamy Honey` (`#FFF6E5`): Banners motivacionales y fondos suaves.
   - `Eucalyptus Green` (`#48BB78`): Éxito, completitud y aprobaciones (🟢).
   - `Amber Yellow` (`#F59E0B`): Estados en espera y advertencias (🟡).
   - `Coral Red` (`#EF4444`): Sanciones, bloqueos y rechazos (🔴).
   - `Cloud Cream` (`#FDFBF7`): Fondo principal de la app.
2. **Botones Táctiles "Chunky" (`ChunkyButton`):**
   - Bordes inferiores gruesos (`border-b-4`) que se comprimen visualmente al pulsar (`active:translate-y-1 active:border-b-0`).
3. **Contenedores Squircle Glass (`GlassCard`):**
   - Radios pronunciados (`rounded-2xl` a `rounded-3xl`), fondo blanco semitransparente con borde sutil.
4. **Iconografía Exclusiva Vectorial:**
   - Uso de `lucide-react` para garantizar escalabilidad, carga ligera y legalidad de uso.

---

## 3. Consecuencias

### Positivas:
- Experiencia sensorial placentera tanto en pantallas táctiles (móviles/tablets) como en ratón/teclado.
- Coherencia estilística total en toda la suite de pantallas y modales.
