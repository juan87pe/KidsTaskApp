import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { AppProvider, useApp } from '../../context/AppContext';
import { App } from '../../App';

describe('Feature 06: Gamificación, Bonos, Sanciones y Reglas de Puntos (BDD Scenarios)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Helper to unlock parent mode with PIN 1234
  const unlockParentMode = async (targetTab = 'parent_dash') => {
    const parentButton = screen.getByText('Ingresar con PIN');
    fireEvent.click(parentButton);

    ['1', '2', '3', '4'].forEach(digit => {
      const pinBtn = screen.getByRole('button', { name: digit });
      fireEvent.click(pinBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Modo Padres/i)).toBeInTheDocument();
    });

    if (targetTab === 'settings') {
      const settingsTabBtn = screen.getAllByRole('button', { name: /Ajustes/i })[0];
      fireEvent.click(settingsTabBtn);
      await waitFor(() => {
        expect(screen.getByText(/Miembros del Hogar & Ajustes/i)).toBeInTheDocument();
      });
    }
  };

  it('Escenario 1: Asignación de bono rápido por comportamiento ejemplar [REQ-GAM-001]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Dado que el padre ingresa al panel de control
    await unlockParentMode('parent_dash');

    // Y pulsa el botón "Dar Bono"
    const darBonoBtn = screen.getByRole('button', { name: /Dar Bono/i });
    fireEvent.click(darBonoBtn);

    // Cuando selecciona el valor "+15 ⭐", el motivo "Ayudar a su hermana"
    await waitFor(() => {
      expect(screen.getByText('🌟 Otorgar Bono Rápido')).toBeInTheDocument();
    });

    const pill15 = screen.getByRole('button', { name: /\+15 ⭐/i });
    fireEvent.click(pill15);

    const reasonBtn = screen.getByRole('button', { name: 'Ayudar a su hermana' });
    fireEvent.click(reasonBtn);

    // Y pulsa "Confirmar Bono"
    const confirmBtn = screen.getByRole('button', { name: 'Confirmar Bono' });
    fireEvent.click(confirmBtn);

    // Entonces el saldo de Mateo se incrementa en +15 puntos (de 150 pasa a 165)
    await waitFor(() => {
      expect(screen.queryByText('🌟 Otorgar Bono Rápido')).not.toBeInTheDocument();
      expect(screen.getByText(/165 Puntos/i)).toBeInTheDocument();
    });
  });

  it('Escenario 2: Aplicación de sanción rápida por conducta inadecuada [REQ-GAM-002]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('parent_dash');

    // Dado que el padre pulsa el botón "Sanción"
    const sancionBtn = screen.getByRole('button', { name: /Sanción/i });
    fireEvent.click(sancionBtn);

    await waitFor(() => {
      expect(screen.getByText('⚠️ Aplicar Sanción de Puntos')).toBeInTheDocument();
    });

    // Cuando selecciona "-10 ⭐", el motivo "No ordenar tras jugar"
    const pillMinus10 = screen.getByRole('button', { name: /-10 ⭐/i });
    fireEvent.click(pillMinus10);

    const reasonBtn = screen.getByRole('button', { name: 'No ordenar tras jugar' });
    fireEvent.click(reasonBtn);

    // Y pulsa "Confirmar Sanción"
    const confirmBtn = screen.getByRole('button', { name: 'Confirmar Sanción' });
    fireEvent.click(confirmBtn);

    // Entonces el saldo de Mateo se reduce en 10 puntos (de 150 pasa a 140)
    await waitFor(() => {
      expect(screen.queryByText('⚠️ Aplicar Sanción de Puntos')).not.toBeInTheDocument();
      expect(screen.getByText(/140 Puntos/i)).toBeInTheDocument();
    });
  });

  it('Escenario 3: Configuración de modo de acumulación continua [REQ-GAM-003]', async () => {
    let contextValues;
    const TestConsumer = () => {
      contextValues = useApp();
      return null;
    };

    render(
      <AppProvider>
        <App />
        <TestConsumer />
      </AppProvider>
    );

    await unlockParentMode('settings');

    // Dado que el padre selecciona "Modo Acumulativo Continuo"
    const continuousBtn = screen.getByRole('button', {
      name: /Modo Acumulativo Continuo/i
    });
    fireEvent.click(continuousBtn);

    expect(contextValues.data.family.pointsRule).toBe('continuous');

    // Cuando se ejecuta la rutina de cierre de jornada a las 23:59:59
    const initialMateoPoints = contextValues.data.children[0].currentPoints;
    act(() => {
      contextValues.executeDailyReset();
    });

    // Entonces los puntos de los niños no se reinician y persisten intactos
    expect(contextValues.data.children[0].currentPoints).toBe(initialMateoPoints);
  });

  it('Escenario 4: Configuración de auto-liquidación de puntos al activar daily_reset [REQ-GAM-007]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('settings');

    // Dado que el padre pulsa "Modo Canje Diario Obligatorio"
    const dailyResetBtn = screen.getByRole('button', {
      name: /Modo Canje Diario Obligatorio/i
    });
    fireEvent.click(dailyResetBtn);

    // Entonces se abre el asistente modal de auto-liquidación
    await waitFor(() => {
      expect(screen.getByText('⚙️ Auto-Liquidación de Puntos')).toBeInTheDocument();
    });

    // Cuando el padre activa la auto-liquidación
    const toggleCheckbox = screen.getByRole('checkbox', { name: /Activar auto-liquidación/i });
    if (!toggleCheckbox.checked) {
      fireEvent.click(toggleCheckbox);
    }

    // Y selecciona "Dinero / Paga" y la tasa de "0.10 $ por punto"
    const moneyBtn = screen.getByRole('button', { name: /Dinero \/ Paga/i });
    fireEvent.click(moneyBtn);

    const ratePill = screen.getByRole('button', { name: '0.10 $ por punto' });
    fireEvent.click(ratePill);

    // Y pulsa "Guardar Política Familiar"
    const saveBtn = screen.getByRole('button', { name: 'Guardar Política Familiar' });
    fireEvent.click(saveBtn);

    // Entonces el modal se cierra y el indicador de auto-liquidación queda visible
    await waitFor(() => {
      expect(screen.queryByText('⚙️ Auto-Liquidación de Puntos')).not.toBeInTheDocument();
      expect(screen.getByText(/💡 Auto-liquidación activa al cierre:/i)).toBeInTheDocument();
      expect(screen.getByText(/0.1 \$ por punto/i)).toBeInTheDocument();
    });
  });

  it('Escenario 5: Ejecución de auto-canje por cierre de jornada con puntos sobrantes [REQ-GAM-008]', async () => {
    let contextValues;
    const TestConsumer = () => {
      contextValues = useApp();
      return null;
    };

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    // Dado que Mateo tiene 40 puntos sobrantes y la familia tiene daily_reset con auto-liquidación activa
    act(() => {
      contextValues.updateFamilySettings({
        pointsRule: 'daily_reset',
        autoLiquidation: {
          enabled: true,
          rewardType: 'money_allowance',
          conversionRate: 0.10,
          currencySymbol: '$'
        }
      });
      // Fijar saldo de Mateo en 40
      contextValues.saveChild({
        ...contextValues.data.children[0],
        currentPoints: 40
      });
    });

    expect(contextValues.data.children[0].currentPoints).toBe(40);

    // Cuando el sistema procesa el cierre de jornada a las 23:59:59
    act(() => {
      contextValues.executeDailyReset('2026-08-25');
    });

    // Entonces el saldo de puntos de Mateo se liquida a 0 para el nuevo día
    expect(contextValues.data.children[0].currentPoints).toBe(0);

    // Y se emite en el ledger una transacción de tipo reward_redemption con el desglose monetario
    const autoLiqTx = contextValues.data.transactions.find(
      tx => tx.childId === 'child-mateo' && tx.reason.includes('Auto-canje por cierre')
    );
    expect(autoLiqTx).toBeDefined();
    expect(autoLiqTx.points).toBe(-40);
    expect(autoLiqTx.type).toBe('reward_redemption');
    expect(autoLiqTx.reason).toContain('40 pts = $4.00');
  });

  it('Escenario 6: Cálculo y progresión del nivel del niño según hitos de puntos [REQ-GAM-006]', async () => {
    let contextValues;
    const TestConsumer = () => {
      contextValues = useApp();
      return null;
    };

    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    const childId = 'child-mateo';

    // Dado que se otorga un bono masivo que eleva los puntos a más de 500
    act(() => {
      contextValues.applyQuickPoints(childId, 400, 'Super bono por proyecto escolar', true);
    });

    // Entonces el nivel del niño sube automáticamente a "Nivel 4 • Campeón"
    const mateo = contextValues.data.children.find(c => c.id === childId);
    expect(mateo.level).toBe('Nivel 4 • Campeón');
  });
});
