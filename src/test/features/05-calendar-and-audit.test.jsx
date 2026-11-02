import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import { App } from '../../App';

describe('Feature 05: Calendario Histórico, Auditoría y Correcciones Retroactivas (BDD Scenarios)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Helper to unlock parent mode and navigate to Calendar tab
  const unlockParentCalendar = async () => {
    const parentButton = screen.getByText('Ingresar con PIN');
    fireEvent.click(parentButton);

    ['1', '2', '3', '4'].forEach(digit => {
      const pinBtn = screen.getByRole('button', { name: digit });
      fireEvent.click(pinBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Modo Padres/i)).toBeInTheDocument();
    });

    const calendarTabBtn = screen.getAllByRole('button', { name: /Calendario/i })[0];
    fireEvent.click(calendarTabBtn);

    await waitFor(() => {
      expect(screen.getByText(/Calendario & Auditoría Retroactiva/i)).toBeInTheDocument();
    });
  };

  it('Escenario 1: Validación retroactiva de una tarea olvidada [REQ-CAL-003]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Dado que el padre ingresa a Calendario & Auditoría
    await unlockParentCalendar();

    // Y navega a la fecha "2026-08-24" donde Mateo tiene la tarea "Ordenar habitación" (+20) omitida
    const dayBtn = screen.getByRole('button', { name: /24 Ago 2026/i });
    fireEvent.click(dayBtn);

    await waitFor(() => {
      expect(screen.getByText('2026-08-24 (Mateo)')).toBeInTheDocument();
    });

    const taskTitle = screen.getByText('Ordenar habitación');
    const taskContainer = taskTitle.closest('div[class*="rounded-squircle-sm"]');
    expect(within(taskContainer).getByText('No realizada')).toBeInTheDocument();

    // Cuando el padre pulsa "Validar como Realizada Ahora (+20)"
    const validateBtn = within(taskContainer).getByRole('button', {
      name: /Validar como Realizada Ahora/i
    });
    fireEvent.click(validateBtn);

    // Entonces la tarea cambia su estado a aprobada y muestra la etiqueta "Modificado"
    await waitFor(() => {
      expect(within(taskContainer).getByText('Modificado')).toBeInTheDocument();
      expect(within(taskContainer).getByText(/Aprobado por/i)).toBeInTheDocument();
    });

    // Y el botón se transforma en la opción de revocar
    expect(
      within(taskContainer).getByRole('button', {
        name: /Modificar Validación \/ Desmarcar \(-20\)/i
      })
    ).toBeInTheDocument();

    // Y el balance neto del día se actualiza a +50 pts (era 30 + 20)
    expect(screen.getByText(/⭐ Balance Neto: \+50 pts/i)).toBeInTheDocument();
  });

  it('Escenario 2: Revocación de una tarea aprobada por error [REQ-CAL-004]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentCalendar();

    // Dado que en el día "2026-08-25" Mateo tiene la tarea "Hacer la cama" (+20) aprobada
    const dayBtn = screen.getByRole('button', { name: /25 Ago 2026/i });
    fireEvent.click(dayBtn);

    await waitFor(() => {
      expect(screen.getByText('2026-08-25 (Mateo)')).toBeInTheDocument();
    });

    const taskTitle = screen.getByText('Hacer la cama');
    const taskContainer = taskTitle.closest('div[class*="rounded-squircle-sm"]');
    expect(within(taskContainer).getByText(/Aprobado por/i)).toBeInTheDocument();

    // Cuando el padre pulsa "Modificar Validación / Desmarcar (-20)"
    const revokeBtn = within(taskContainer).getByRole('button', {
      name: /Modificar Validación \/ Desmarcar/i
    });
    fireEvent.click(revokeBtn);

    // Entonces la tarea pasa a estado "No realizada" y queda marcada como modificada
    await waitFor(() => {
      expect(within(taskContainer).getByText('No realizada')).toBeInTheDocument();
      expect(within(taskContainer).getByText('Modificado')).toBeInTheDocument();
    });

    // Y el balance neto del día disminuye en 20 pts (de 60 pasa a 40 pts)
    expect(screen.getByText(/⭐ Balance Neto: \+40 pts/i)).toBeInTheDocument();
  });

  it('Escenario 3: Anulación y reembolso inmediato de un canje de premio [REQ-CAL-005]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentCalendar();

    // Dado que el día "2026-08-24" Mateo canjeó "30 mins de Consola" (100 pts)
    const dayBtn = screen.getByRole('button', { name: /24 Ago 2026/i });
    fireEvent.click(dayBtn);

    await waitFor(() => {
      expect(screen.getByText(/30 mins de Consola/i)).toBeInTheDocument();
    });

    // Cuando el padre pulsa "Anular y Reembolsar Canje (+100)"
    const refundBtn = screen.getByRole('button', {
      name: /Anular y Reembolsar Canje \(\+100\)/i
    });
    fireEvent.click(refundBtn);

    // Entonces el canje se marca como reembolsado y desaparece el botón de reembolso
    await waitFor(() => {
      expect(
        screen.getByText(/↩️ Reembolsado \(\+100 pts devueltos\)/i)
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('button', { name: /Anular y Reembolsar Canje/i })
    ).not.toBeInTheDocument();
  });

  it('Escenario 4: Modo solo lectura en calendario del niño [REQ-CAL-007]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Dado que el niño "Mateo" ingresa a la aplicación
    const mateoBtn = screen.getByText('Mateo');
    fireEvent.click(mateoBtn);

    await waitFor(() => {
      expect(screen.getByText(/¡Hola, Mateo!/i)).toBeInTheDocument();
    });

    // Cuando pulsa la pestaña "Logros 🌟"
    const achievementsTab = screen.getByRole('button', { name: /Logros/i });
    fireEvent.click(achievementsTab);

    // Entonces visualiza su "Calendario de Logros" con estrellas y puntos ganados
    await waitFor(() => {
      expect(screen.getByText('Mi Calendario de Logros')).toBeInTheDocument();
      expect(screen.getByText(/Registro del Día/i)).toBeInTheDocument();
      expect(screen.getByText(/Tareas realizadas este día/i)).toBeInTheDocument();
    });

    // Y la interfaz no presenta botones para validar, revocar o alterar saldos
    expect(
      screen.queryByRole('button', { name: /Validar como Realizada Ahora/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Modificar Validación/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Anular y Reembolsar/i })
    ).not.toBeInTheDocument();
  });

  it('Escenario 5: Conmutación de niños y navegación de mapa de calor [REQ-CAL-001] [REQ-CAL-002]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentCalendar();

    // Verificamos que por defecto se muestra Mateo
    expect(screen.getByText(/2026-08-25 \(Mateo\)/i)).toBeInTheDocument();

    // Conmutamos a Sofía en las píldoras de hijos
    const sofiaPill = screen.getByRole('button', { name: /Sofía/i });
    fireEvent.click(sofiaPill);

    // Entonces la vista de auditoría se actualiza para Sofía
    await waitFor(() => {
      expect(screen.getByText(/2026-08-25 \(Sofía\)/i)).toBeInTheDocument();
    });

    // Y se muestran las tareas de Sofía para esa fecha (ej: "Guardar peluches")
    expect(screen.getByText('Guardar peluches')).toBeInTheDocument();
  });
});
