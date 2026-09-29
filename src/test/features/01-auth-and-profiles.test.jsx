import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import { App } from '../../App';
import { HouseholdSettings } from '../../components/Parent/HouseholdSettings';
import { AddChildModal } from '../../components/Parent/AddChildModal';

describe('Feature 01: Autenticación, Perfiles y Miembros (BDD Scenarios)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('Escenario 1: Entrada directa de un niño a su dashboard [REQ-AUTH-001] [REQ-AUTH-002]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Dado que la aplicación se encuentra en la pantalla de "Selector de Perfil"
    expect(screen.getByText('KidsTaskApp 🚀')).toBeInTheDocument();
    expect(screen.getByText('¿Quién eres hoy para comenzar?')).toBeInTheDocument();

    // Y existen registrados los hijos "Mateo" y "Sofía"
    expect(screen.getByText('Mateo')).toBeInTheDocument();
    expect(screen.getByText('Sofía')).toBeInTheDocument();

    // Cuando el usuario pulsa sobre la tarjeta de "Mateo"
    fireEvent.click(screen.getByText('Mateo'));

    // Entonces el sistema conmuta el rol activo a "child" y no solicita PIN
    await waitFor(() => {
      expect(screen.getByText(/¡Hola,\s*Mateo!/i)).toBeInTheDocument();
      expect(screen.getByText('Mis Tareas')).toBeInTheDocument();
    });
  });

  it('Escenario 2: Acceso exitoso a Modo Padres mediante PIN [REQ-AUTH-003] [REQ-AUTH-004]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Dado que el usuario se encuentra en el "Selector de Perfil"
    // Cuando el usuario pulsa el botón "Ingresar con PIN"
    const parentButton = screen.getByText('Ingresar con PIN');
    fireEvent.click(parentButton);

    // Entonces se despliega el modal "PinGateModal"
    await waitFor(() => {
      expect(screen.getByText('Acceso a Padres')).toBeInTheDocument();
      expect(screen.getByText('Ingresa el PIN de seguridad de 4 dígitos')).toBeInTheDocument();
    });

    // Cuando el usuario pulsa secuencialmente "1", "2", "3", "4"
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));

    // Entonces el modal se cierra y conmuta a "parent" mostrando el Dashboard de Padres
    await waitFor(() => {
      expect(screen.getByText(/KidsTaskApp 🛡️ Modo Padres/i)).toBeInTheDocument();
      expect(screen.getByText(/¡Hola,\s*Papá \(Juan\)!/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('Escenario 3: Intento de acceso parental con PIN erróneo [REQ-AUTH-005]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Abrir modal de PIN
    fireEvent.click(screen.getByText('Ingresar con PIN'));

    await waitFor(() => {
      expect(screen.getByText('Acceso a Padres')).toBeInTheDocument();
    });

    // Ingresar combinación errónea "9", "9", "9", "9"
    const digit9 = screen.getByRole('button', { name: '9' });
    fireEvent.click(digit9);
    fireEvent.click(digit9);
    fireEvent.click(digit9);
    fireEvent.click(digit9);

    // Entonces muestra mensaje de error y el usuario permanece en el modal
    await waitFor(() => {
      expect(screen.getByText(/PIN incorrecto\. Intenta de nuevo\./i)).toBeInTheDocument();
      expect(screen.getByText('Acceso a Padres')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('Escenario 4: Alta de un nuevo hijo en el hogar [REQ-AUTH-006]', async () => {
    const handleClose = vi.fn();

    render(
      <AppProvider>
        <HouseholdSettings onOpenAddChild={() => {}} onOpenAddTutor={() => {}} />
        <AddChildModal isOpen={true} onClose={handleClose} />
      </AppProvider>
    );

    // Completar el formulario de alta de hijo
    const nameInput = screen.getByPlaceholderText(/Ej\.?\s*Lucas/i);
    fireEvent.change(nameInput, { target: { value: 'Lucas' } });

    // Guardar hijo
    const submitButton = screen.getByRole('button', { name: /Crear Perfil de Hijo/i });
    fireEvent.click(submitButton);

    // Comprobar que Lucas aparece en la lista de hijos del hogar
    await waitFor(() => {
      expect(screen.getByText('Lucas')).toBeInTheDocument();
    });
  });

  it('Escenario 5: Respaldo y recuperación de PIN mediante huella digital [REQ-AUTH-009]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Abrir modal de PIN
    fireEvent.click(screen.getByText('Ingresar con PIN'));

    await waitFor(() => {
      expect(screen.getByText('Acceso a Padres')).toBeInTheDocument();
    });

    // Pulsar botón de recuperación biométrica
    const biometricButton = screen.getByText(/¿Olvidaste tu PIN\? Desbloquear con Huella/i);
    fireEvent.click(biometricButton);

    // Debe pasar a modo de restablecimiento de PIN
    await waitFor(() => {
      expect(screen.getByText('Restablecer PIN')).toBeInTheDocument();
      expect(screen.getByText(/Huella validada\. Ingresa tu nuevo PIN/i)).toBeInTheDocument();
    });

    // Ingresar nuevo PIN "5", "5", "5", "5"
    const digit5 = screen.getByRole('button', { name: '5' });
    fireEvent.click(digit5);
    fireEvent.click(digit5);
    fireEvent.click(digit5);
    fireEvent.click(digit5);

    // Debe confirmar actualización y acceder al panel parental
    await waitFor(() => {
      expect(screen.getByText(/¡PIN actualizado con éxito!/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/KidsTaskApp 🛡️ Modo Padres/i)).toBeInTheDocument();
    }, { timeout: 2500 });
  });
});
