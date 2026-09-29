# Especificación No Funcional: Seguridad y Modelo de Amenazas (STRIDE)

> **Módulo:** `non-functional/security`  
> **Estándar:** STRIDE & Principios de Privacidad Infantil  

---

## 1. Modelo de Amenazas STRIDE

| Amenaza (STRIDE) | Vector Potencial | Mitigación Implementada |
| :--- | :--- | :--- |
| **Spoofing (Suplantación)** | Un niño intentando acceder al panel de administración para autoaprobarse tareas o cambiarse puntos. | Compuerta modal de PIN de 4 dígitos (`PinGateModal`) con teclado virtual aislado y validación estricta en memoria. |
| **Tampering (Manipulación)** | Alteración no autorizada del saldo de puntos en el estado de la aplicación. | Saldo calculado a partir de un ledger inmutable de transacciones (`transactions`). Toda deducción o adición requiere evento auditable. |
| **Repudiation (Repudio)** | Negativa de haber aprobado una tarea o aplicado una sanción por parte de un tutor. | Todo movimiento en el ledger registra `actor` (ID del tutor) y marca temporal ISO (`timestamp`). |
| **Information Disclosure (Fuga de Información)** | Exposición de notas privadas o datos familiares a terceros. | Almacenamiento local en cliente (LocalStorage) y reglas de seguridad NoSQL basadas en ID familiar (`familyId`). Cero analítica de terceros. |
| **Denial of Service (Denegación de Servicio)** | Intentos masivos por fuerza bruta en el teclado PIN. | Retardo progresivo tras 3 intentos fallidos consecutivos con feedback visual de error. |
| **Elevation of Privilege (Elevación de Privilegios)** | Inyección de roles administrativos desde la consola del navegador. | Validación contextual en los despachadores de acciones; solo el rol `parent` verificado puede invocar métodos de mutación administrativa. |

---

## 2. Privacidad y Protección de Menores

1. **COPPA / GDPR-K Compliance:** No se recopila información personal sensible ni geolocalización de los menores.
2. **Cero Publicidad / Cero Rastreadores:** Prohibición absoluta de SDKs de monetización publicitaria.
3. **Imágenes y Recursos:** Se emplean exclusivamente iconos SVG libres y avatares predeterminados para evitar la subida innecesaria de fotos de menores a servidores públicos.
