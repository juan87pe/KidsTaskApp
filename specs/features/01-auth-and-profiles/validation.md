# Matriz de Validación y Criterios BDD: 01. Autenticación y Perfiles

> **Módulo:** `01-auth-and-profiles`  
> **Formato:** Gherkin / BDD vinculado a Requerimientos EARS  

---

## 1. Escenarios de Validación BDD

### Escenario: Entrada directa de un niño a su dashboard [REQ-AUTH-001] [REQ-AUTH-002]
```gherkin
Dado que la aplicación se encuentra en la pantalla de "Selector de Perfil"
Y existen registrados los hijos "Mateo" y "Sofía"
Cuando el usuario pulsa sobre la tarjeta de "Mateo"
Entonces el sistema conmuta el rol activo a "child"
Y se establece "Mateo" como el hijo activo
Y se visualiza el "Dashboard Principal del Niño" con el saludo y saldo de Mateo
Y no se solicita ninguna contraseña ni PIN.
```

### Escenario: Acceso exitoso a Modo Padres mediante PIN [REQ-AUTH-003] [REQ-AUTH-004]
```gherkin
Dado que el usuario se encuentra en el "Selector de Perfil"
Y el PIN maestro configurado es "1234"
Cuando el usuario pulsa el botón "Panel de Padres 🔒"
Entonces se despliega el modal "PinGateModal" con el teclado de 4 dígitos
Cuando el usuario pulsa secuencialmente "1", "2", "3", "4"
Entonces el modal se cierra automáticamente
Y el rol activo cambia a "parent"
Y se visualiza el "Dashboard General 360° de Padres".
```

### Escenario: Intento de acceso parental con PIN erróneo [REQ-AUTH-005]
```gherkin
Dado que el modal "PinGateModal" está abierto con PIN maestro "1234"
Cuando el usuario ingresa "9", "9", "9", "9"
Entonces los 4 indicadores parpadean en rojo con animación de sacudida
Y los dígitos ingresados se limpian a "0000"
Y el usuario permanece bloqueado en el modal sin acceder al Modo Padres.
```

### Escenario: Alta de un nuevo hijo en el hogar [REQ-AUTH-006]
```gherkin
Dado que un padre autenticado se encuentra en "Ajustes del Hogar"
Cuando abre "AddChildModal" e ingresa el nombre "Lucas", avatar "🚀", y saldo inicial "50"
Y pulsa "Guardar Hijo"
Entonces "Lucas" aparece en la lista de hijos del hogar
Y se refleja como opción seleccionable en el "Selector de Perfil".
```

### Escenario: Respaldo y recuperación de PIN mediante huella digital [REQ-AUTH-009]
```gherkin
Dado que el padre olvidó su PIN maestro de 4 dígitos
Y se encuentra en el modal "PinGateModal" en un smartphone compatible
Cuando pulsa el botón "¿Olvidaste tu PIN? Desbloquear con Huella"
Y el sensor biométrico del teléfono valida satisfactoriamente la huella del propietario
Entonces el sistema desbloquea la compuerta de seguridad
Y solicita ingresar un nuevo PIN de 4 dígitos para actualizar "family.masterPin"
Y conmuta el rol activo a "parent" desplegando el Dashboard Parental.
```

