# Especificación de Requerimientos: 01. Autenticación, Selector de Perfiles y Miembros del Hogar

> **Módulo:** `01-auth-and-profiles`  
> **Sintaxis:** EARS (*Easy Approach to Requirements Syntax*)  

---

## 1. Requerimientos Funcionales en Sintaxis EARS

### [REQ-AUTH-001] Selección de Perfil Familiar
- **Universal:** El sistema deberá presentar una pantalla inicial (`ProfileSelector`) mostrando la lista de avatares de los hijos registrados y un botón destacado de acceso a *"Modo Padres"*.

### [REQ-AUTH-002] Entrada Directa para Niños
- **CUANDO** el usuario pulse sobre la tarjeta/avatar de un hijo en el selector de perfiles, el sistema deberá conmutar el rol a `child`, establecer dicho hijo como `activeChild` y redirigir inmediatamente a `KidDashboard` sin solicitar contraseña.

### [REQ-AUTH-003] Compuerta de Seguridad PIN para Padres
- **CUANDO** el usuario seleccione *"Modo Padres"* desde el selector de perfil o desde el botón de candado en la vista infantil, el sistema deberá desplegar el teclado numérico virtual de 4 dígitos (`PinGateModal`).

### [REQ-AUTH-004] Validación Exitosa de PIN
- **CUANDO** el usuario introduzca los 4 dígitos coincidentes con `family.masterPin`, el sistema deberá conmutar el rol a `parent`, cerrar el modal y redirigir al `ParentDashboard`.

### [REQ-AUTH-005] Manejo de PIN Erróneo
- **SI** el usuario introduce una combinación de 4 dígitos que no coincide con `family.masterPin`, **ENTONCES** el sistema deberá activar una animación de sacudida (*shake feedback*), borrar los dígitos ingresados y emitir un sonido o vibración de error.

### [REQ-AUTH-006] Alta de Nuevo Hijo
- **CUANDO** un padre autenticado complete el formulario `AddChildModal` con nombre, avatar, tema de color y saldo inicial, el sistema deberá persistir el nuevo registro en la colección `children` e inicializar sus estadísticas.

### [REQ-AUTH-007] Gestión Multi-Tutor
- **CUANDO** un padre autenticado agregue un nuevo tutor desde `AddTutorModal` con nombre y rol, el sistema deberá registrar el nuevo tutor en `tutors` con permisos de administración familiar.

### [REQ-AUTH-008] Actualización de PIN Maestro
- **CUANDO** un padre confirme el cambio de PIN maestro en `HouseholdSettings`, el sistema deberá actualizar `family.masterPin` y exigir el nuevo PIN en el siguiente intento de acceso.

### [REQ-AUTH-009] Respaldo y Recuperación de PIN por Biometría del Dispositivo
- **DONDE** el dispositivo soporte autenticación biométrica (Huella Digital / Face ID / WebAuthn) y el padre active la opción *"¿Olvidaste tu PIN?"*, **CUANDO** la autenticación biométrica sea validada con éxito por el sistema operativo, el sistema deberá permitir restablecer un nuevo PIN maestro de 4 dígitos y conceder acceso al Modo Padres.
