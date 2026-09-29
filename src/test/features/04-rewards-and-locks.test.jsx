import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { AppProvider, useApp } from '../../context/AppContext';
import { App } from '../../App';

describe('Feature 04: Premios, Costos y Bloqueos Temporales (BDD Scenarios)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Helper to unlock parent mode with PIN 1234 and go to specified tab
  const unlockParentMode = async (targetTab = 'rewards') => {
    const parentButton = screen.getByText('Ingresar con PIN');
    fireEvent.click(parentButton);

    ['1', '2', '3', '4'].forEach(digit => {
      const pinBtn = screen.getByRole('button', { name: digit });
      fireEvent.click(pinBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Modo Padres/i)).toBeInTheDocument();
    });

    if (targetTab === 'rewards') {
      const rewardsTabBtn = screen.getAllByRole('button', { name: /Premios/i })[0];
      fireEvent.click(rewardsTabBtn);
      await waitFor(() => {
        expect(screen.getByText(/Catálogo de Recompensas/i)).toBeInTheDocument();
      });
    } else if (targetTab === 'approvals') {
      const approvalsBtn = screen.getAllByRole('button', { name: /Aprobaciones/i })[0];
      fireEvent.click(approvalsBtn);
      await waitFor(() => {
        expect(screen.getByText(/Centro de Aprobaciones/i)).toBeInTheDocument();
      });
    }
  };

  it('Escenario 1: Bloqueo temporal de un premio y visualización en la tienda del niño [REQ-REW-004] [REQ-REW-005]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Dado que el premio "30 mins de Consola" está disponible en el catálogo
    await unlockParentMode('rewards');
    expect(screen.getByText('30 mins de Consola')).toBeInTheDocument();

    // Cuando el padre abre "RewardLockModal" pulsando "Bloquear"
    const consolaTitle = screen.getByText('30 mins de Consola');
    const consolaCard = consolaTitle.closest('div[class*="border-2"]');
    const lockBtn = within(consolaCard).getByRole('button', { name: /Bloquear/i });
    fireEvent.click(lockBtn);

    // Modal RewardLockModal opens
    await waitFor(() => {
      expect(screen.getByText(/Bloqueo Temporal: 30 mins de Consola/i)).toBeInTheDocument();
    });

    // Selecciona duración "2 Días" y motivo "Descanso por exámenes"
    const durationBtn = screen.getByRole('button', { name: '2 Días' });
    fireEvent.click(durationBtn);

    const reasonInput = screen.getByPlaceholderText(/Descanso por semana de exámenes/i);
    fireEvent.change(reasonInput, { target: { value: 'Descanso por exámenes' } });

    // Y pulsa "Confirmar Bloqueo"
    const confirmBtn = screen.getByRole('button', { name: /Confirmar Bloqueo/i });
    fireEvent.click(confirmBtn);

    // Entonces el premio queda marcado como bloqueado
    await waitFor(() => {
      expect(within(consolaCard).getByText(/Bloqueo Temporal Activo/i)).toBeInTheDocument();
    });

    // Regresar al selector de perfil y entrar al perfil de Mateo
    const backBtn = screen.getByTitle('Volver a Selección de Perfil');
    fireEvent.click(backBtn);

    await waitFor(() => {
      expect(screen.getByText('Mateo')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Mateo'));

    // Navegar a la Tienda de Premios
    await waitFor(() => {
      expect(screen.getByText(/¡Hola,\s*Mateo!/i)).toBeInTheDocument();
    });
    const storeNavBtn = screen.getByRole('button', { name: /Premios 🎁/i });
    fireEvent.click(storeNavBtn);

    // Y al abrir la tienda del niño, "30 mins de Consola" muestra la insignia "🔒 Bloqueado por tus papás"
    await waitFor(() => {
      expect(screen.getByText('30 mins de Consola')).toBeInTheDocument();
    });

    const kidConsolaTitle = screen.getByText('30 mins de Consola');
    const kidConsolaCard = kidConsolaTitle.closest('div[class*="border-2"]');

    expect(within(kidConsolaCard).getByText(/🔒 Bloqueado por tus papás/i)).toBeInTheDocument();

    // Y muestra el texto "Disponible en: 2 días"
    expect(within(kidConsolaCard).getByText(/Disponible en:\s*2 días/i)).toBeInTheDocument();

    // Y el botón de canje queda deshabilitado para el niño
    const actionBtn = within(kidConsolaCard).getByRole('button');
    expect(actionBtn).toBeDisabled();
    expect(actionBtn).toHaveTextContent(/No disponible ahora 🔒/i);
  });

  it('Escenario 2: Canje exitoso de premio por el niño y autorización del padre [REQ-REW-006] [REQ-REW-007]', async () => {
    let appContextValue;
    const TestInspector = () => {
      appContextValue = useApp();
      return null;
    };

    render(
      <AppProvider>
        <TestInspector />
        <App />
      </AppProvider>
    );

    // Dado que Mateo tiene un saldo de 150 puntos ⭐
    fireEvent.click(screen.getByText('Mateo'));

    await waitFor(() => {
      expect(screen.getByText(/¡Hola,\s*Mateo!/i)).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    // Navegar a la tienda del niño
    const storeNavBtn = screen.getByRole('button', { name: /Premios 🎁/i });
    fireEvent.click(storeNavBtn);

    // Y el premio "Elegir el postre del domingo" cuesta 80 puntos ⭐
    await waitFor(() => {
      expect(screen.getByText('Elegir el postre del domingo')).toBeInTheDocument();
    });

    const postreTitle = screen.getByText('Elegir el postre del domingo');
    const postreCard = postreTitle.closest('div[class*="border-2"]');
    expect(within(postreCard).getByText(/⭐ 80/i)).toBeInTheDocument();

    // Cuando Mateo pulsa "¡Canjear Ahora! 🎁" en su tienda
    const redeemBtn = within(postreCard).getByRole('button', { name: /¡Canjear Ahora! 🎁/i });
    fireEvent.click(redeemBtn);

    // Entonces se genera una solicitud en el "Centro de Aprobaciones"
    // Volvemos a selector de perfil y entramos como Padres
    act(() => {
      appContextValue.logoutToProfileSelect();
    });

    await waitFor(() => {
      expect(screen.getByText('Ingresar con PIN')).toBeInTheDocument();
    });

    await unlockParentMode('approvals');

    // Comprobar que en Solicitudes de Canje de Premios aparece "Elegir el postre del domingo"
    await waitFor(() => {
      expect(screen.getByText(/Solicitudes de Canje de Premios/i)).toBeInTheDocument();
      expect(screen.getByText('Elegir el postre del domingo')).toBeInTheDocument();
    });

    // Cuando el padre pulsa "Autorizar Canje 🎁"
    const authorizeBtn = screen.getByRole('button', { name: /Autorizar Canje/i });
    fireEvent.click(authorizeBtn);

    // Entonces se emite una transacción de -80 puntos en el ledger
    await waitFor(() => {
      const redemptionTx = appContextValue.data.transactions.find(
        t => t.type === 'reward_redemption' && t.childId === 'child-mateo'
      );
      expect(redemptionTx).toBeDefined();
      expect(redemptionTx.points).toBe(-80);
      expect(redemptionTx.reason).toContain('Elegir el postre del domingo');
    });

    // Y el nuevo saldo de Mateo es de 70 puntos ⭐
    const mateo = appContextValue.data.children.find(c => c.id === 'child-mateo');
    expect(mateo.currentPoints).toBe(70);
  });

  it('Escenario 3: Desbloqueo manual anticipado de una recompensa [REQ-REW-008]', async () => {
    let appContextValue;
    const TestInspector = () => {
      appContextValue = useApp();
      return null;
    };

    render(
      <AppProvider>
        <TestInspector />
        <App />
      </AppProvider>
    );

    // Dado que el premio "Salida al parque" se encuentra bloqueado
    await unlockParentMode('rewards');

    await waitFor(() => {
      expect(screen.getByText('Salida al parque')).toBeInTheDocument();
    });

    const parqueTitle = screen.getByText('Salida al parque');
    const parqueCard = parqueTitle.closest('div[class*="border-2"]');
    expect(within(parqueCard).getByText(/Bloqueo Temporal Activo/i)).toBeInTheDocument();

    // Cuando el padre pulsa el botón "[ 🔓 Desbloquear ]" en la gestión de premios
    const unlockBtn = within(parqueCard).getByRole('button', { name: /Desbloquear/i });
    fireEvent.click(unlockBtn);

    // Entonces el candado se retira inmediatamente
    await waitFor(() => {
      expect(within(parqueCard).queryByText(/Bloqueo Temporal Activo/i)).not.toBeInTheDocument();
    });

    // Y el premio vuelve a estar habilitado para canje en la tienda del niño
    const backBtn = screen.getByTitle('Volver a Selección de Perfil');
    fireEvent.click(backBtn);

    await waitFor(() => {
      expect(screen.getByText('Mateo')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Mateo'));

    const storeNavBtn = screen.getByRole('button', { name: /Premios 🎁/i });
    fireEvent.click(storeNavBtn);

    await waitFor(() => {
      expect(screen.getByText('Salida al parque')).toBeInTheDocument();
    });

    const kidParqueTitle = screen.getByText('Salida al parque');
    const kidParqueCard = kidParqueTitle.closest('div[class*="border-2"]');

    // No debe tener insignia de candado
    expect(within(kidParqueCard).queryByText(/🔒 Bloqueado por tus papás/i)).not.toBeInTheDocument();

    // Y el botón está habilitado o muestra puntos faltantes (no disabled por candado)
    expect(within(kidParqueCard).queryByText(/No disponible ahora 🔒/i)).not.toBeInTheDocument();
  });

  it('Prueba complementaria: Creación de recompensa con selector de costos en píldoras [REQ-REW-001] [REQ-REW-002]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('rewards');

    // Abrir modal de nuevo premio
    const newRewardBtn = screen.getByRole('button', { name: /Nuevo Premio/i });
    fireEvent.click(newRewardBtn);

    await waitFor(() => {
      expect(screen.getByText(/Nueva Recompensa Familiar/i)).toBeInTheDocument();
    });

    // Título
    const titleInput = screen.getByPlaceholderText(/1 hora de piscina el sábado/i);
    fireEvent.change(titleInput, { target: { value: 'Tarde de bolos' } });

    // Elegir preset de 150 puntos
    const preset150Btn = screen.getByRole('button', { name: /⭐ 150/i });
    fireEvent.click(preset150Btn);

    // Guardar
    const submitBtn = screen.getByRole('button', { name: /Guardar Premio/i });
    fireEvent.click(submitBtn);

    // Verificar en catálogo
    await waitFor(() => {
      expect(screen.getByText('Tarde de bolos')).toBeInTheDocument();
      expect(screen.getByText(/⭐ 150 Puntos/i)).toBeInTheDocument();
    });
  });
});
