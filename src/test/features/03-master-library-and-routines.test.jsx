import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AppProvider, useApp } from '../../context/AppContext';
import { App } from '../../App';

describe('Feature 03: Biblioteca Familiar y Rutinas (BDD Scenarios)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Helper to unlock parent mode with PIN 1234 and go to specified tab
  const unlockParentMode = async (targetTab = 'library') => {
    // Click on Parent profile button
    const parentButton = screen.getByText('Ingresar con PIN');
    fireEvent.click(parentButton);

    // Enter PIN 1234
    ['1', '2', '3', '4'].forEach(digit => {
      const pinBtn = screen.getByRole('button', { name: digit });
      fireEvent.click(pinBtn);
    });

    // Wait until in parent mode
    await waitFor(() => {
      expect(screen.getByText(/Modo Padres/i)).toBeInTheDocument();
    });

    // Navigate to target tab if needed
    if (targetTab === 'library') {
      const libraryTabBtn = screen.getAllByRole('button', { name: /Biblioteca/i })[0];
      fireEvent.click(libraryTabBtn);
      await waitFor(() => {
        expect(screen.getByText(/Banco central de tareas y plantillas/i)).toBeInTheDocument();
      });
    } else if (targetTab === 'child_control') {
      const dailyBtn = screen.getAllByRole('button', { name: /Día a Día/i })[0];
      fireEvent.click(dailyBtn);
      await waitFor(() => {
        expect(screen.getByText(/Secuencia Diaria de Tareas/i)).toBeInTheDocument();
      });
    }
  };

  it('Escenario 1: Creación de tarea maestra con nota explicativa [REQ-LIB-001] [REQ-LIB-002]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('library');

    // Click "Nueva Tarea Maestra"
    const newTaskBtn = screen.getByRole('button', { name: /Nueva Tarea Maestra/i });
    fireEvent.click(newTaskBtn);

    // Modal is open
    await waitFor(() => {
      expect(screen.getByText('➕ Nueva Tarea Maestra')).toBeInTheDocument();
    });

    // Fill form
    const titleInput = screen.getByPlaceholderText(/Guardar zapatos en el zapatero/i);
    fireEvent.change(titleInput, { target: { value: 'Recoger juguetes del salón' } });

    const pointsInput = screen.getByDisplayValue('20');
    fireEvent.change(pointsInput, { target: { value: '15' } });

    // Mode of approval: '🚀 El Niño pide visto bueno' is already selected by default

    // Description / Notes
    const descInput = screen.getByPlaceholderText(/Página 45 del libro/i);
    fireEvent.change(descInput, { target: { value: 'Guardar legos en la caja roja y muñecos' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Guardar Tarea Maestra/i });
    fireEvent.click(submitBtn);

    // Verify task is now visible in master catalog with note
    await waitFor(() => {
      const taskTitle = screen.getByText('Recoger juguetes del salón');
      expect(taskTitle).toBeInTheDocument();
      const taskCard = taskTitle.closest('div[class*="border-2"]');
      expect(within(taskCard).getByText(/⭐ \+15 pts/i)).toBeInTheDocument();
      expect(within(taskCard).getByText('Guardar legos en la caja roja y muñecos')).toBeInTheDocument();
    });
  });

  it('Escenario 2: Inyección de rutina con detección preventiva de duplicado [REQ-LIB-003] [REQ-LIB-006] [REQ-LIB-009]', async () => {
    // Custom wrapper to prepare Mateo with "Hacer la cama" only (no "Lavarse los dientes")
    const SetupWrapper = ({ children }) => {
      const { setData } = useApp();
      React.useEffect(() => {
        setData(prev => ({
          ...prev,
          todayAssignments: [
            {
              id: 'asg-test-cama',
              childId: 'child-mateo',
              title: 'Hacer la cama',
              points: 20,
              approvalMode: 'kid_request',
              iconSvg: '🛏️',
              orderIndex: 1,
              status: 'pending',
              note: 'Estirar bien sábanas'
            }
          ]
        }));
      }, [setData]);
      return children;
    };

    render(
      <AppProvider>
        <SetupWrapper>
          <App />
        </SetupWrapper>
      </AppProvider>
    );

    await unlockParentMode('library');

    // Switch to "Plantillas de Rutinas" tab
    const routinesTabBtn = screen.getByRole('button', { name: /Plantillas de Rutinas/i });
    fireEvent.click(routinesTabBtn);

    // Locate "Rutina Mañanera" card and its inject button
    await waitFor(() => {
      expect(screen.getByText('Rutina Mañanera')).toBeInTheDocument();
    });

    const injectRoutineBtn = screen.getByRole('button', { name: /Inyectar Rutina Mañanera/i });
    fireEvent.click(injectRoutineBtn);

    // Inject Routine Modal is open
    await waitFor(() => {
      expect(screen.getByText(/Inyectar Rutina a la Jornada/i)).toBeInTheDocument();
    });

    // Make sure Mateo is selected (child-mateo is first child, default selected)
    // Click "Inyectar Rutina 🚀"
    const confirmInjectBtn = screen.getByRole('button', { name: /Inyectar Rutina 🚀/i });
    fireEvent.click(confirmInjectBtn);

    // Modal DuplicateDetectionModal should trigger alertando: "Hacer la cama ya existe para hoy"
    await waitFor(() => {
      expect(screen.getByText(/Tareas Duplicadas Detectadas/i)).toBeInTheDocument();
      expect(screen.getByText(/Hacer la cama ya existe para hoy/i)).toBeInTheDocument();
    });

    // Select "🔘 Omitir duplicado (Recomendado)"
    const omitBtn = screen.getByText(/🔘 Omitir duplicado \(Recomendado\)/i);
    fireEvent.click(omitBtn);

    // Verify in "Día a Día" that "Hacer la cama" was not duplicated (only 1) and "Lavarse los dientes" was added (+10 pts)
    const dailyNavBtn = screen.getAllByRole('button', { name: /Día a Día/i })[0];
    fireEvent.click(dailyNavBtn);

    await waitFor(() => {
      const camas = screen.getAllByText('Hacer la cama');
      expect(camas).toHaveLength(1);
      expect(screen.getByText('Lavarse los dientes')).toBeInTheDocument();
      expect(screen.getByText(/\+10 pts/i)).toBeInTheDocument();
    });
  });

  it('Escenario 3: Programación temporal semanal en días fijos [REQ-LIB-005]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('library');

    // Locate "Regar las plantas" task card
    await waitFor(() => {
      expect(screen.getByText('Regar las plantas')).toBeInTheDocument();
    });

    const taskTitle = screen.getByText('Regar las plantas');
    const taskCard = taskTitle.closest('div[class*="border-2"]');
    const assignBtn = within(taskCard).getByRole('button', { name: /Asignar Tarea/i });
    fireEvent.click(assignBtn);

    // AssignMasterTaskModal opens
    await waitFor(() => {
      expect(screen.getByText(/Asignar Tarea desde Biblioteca/i)).toBeInTheDocument();
    });

    // Select "⚪ Semanal / Días Fijos"
    const weeklyOption = screen.getByText(/Semanal \/ Días Fijos/i);
    fireEvent.click(weeklyOption);

    // Select days Martes (M) and Jueves (J)
    const martesBtn = screen.getByRole('button', { name: 'M' });
    const juevesBtn = screen.getByRole('button', { name: 'J' });
    fireEvent.click(martesBtn);
    fireEvent.click(juevesBtn);

    // Confirm assignment
    const confirmBtn = screen.getByRole('button', { name: /Confirmar Asignación/i });
    fireEvent.click(confirmBtn);

    // Now expand "Regar las plantas" card in library to view active assignments
    await waitFor(() => {
      expect(screen.queryByText(/Asignar Tarea desde Biblioteca/i)).not.toBeInTheDocument();
    });

    // Click on task card to expand
    fireEvent.click(screen.getByText('Regar las plantas'));

    // Check that interactive viewer displays: "Mateo: Semanal (Martes y Jueves)"
    await waitFor(() => {
      expect(screen.getByText(/Mateo:\s*/i)).toBeInTheDocument();
      expect(screen.getByText(/Semanal \(Martes y Jueves\)/i)).toBeInTheDocument();
    });
  });

  it('Escenario 4: Diálogo contextual de desasignación y desasignación permanente [REQ-LIB-007] [REQ-LIB-008]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('library');

    // Locate "Pasear al perro" which is assigned to Sofía
    await waitFor(() => {
      expect(screen.getByText('Pasear al perro')).toBeInTheDocument();
    });

    // Click on "Pasear al perro" to expand interactive viewer
    fireEvent.click(screen.getByText('Pasear al perro'));

    // Check Sofía's assignment is visible
    await waitFor(() => {
      expect(screen.getByText(/Sofía:\s*/i)).toBeInTheDocument();
      expect(screen.getByText(/Diaria continua/i)).toBeInTheDocument();
    });

    // Click "[ ❌ Desasignar / Pausar ]" -> opens UnassignOrPauseModal
    const unassignBtn = screen.getByRole('button', { name: /Desasignar \/ Pausar/i });
    fireEvent.click(unassignBtn);

    // Modal is opened showing contextual options for daily schedule
    await waitFor(() => {
      expect(screen.getByText(/⚙️ Desasignar o Pausar Tarea/i)).toBeInTheDocument();
      expect(screen.getByText(/Solo por el día de hoy/i)).toBeInTheDocument();
      expect(screen.getByText(/Pausar temporalmente por varios días/i)).toBeInTheDocument();
      expect(screen.getByText(/Desasignar de todas las futuras asignaciones \(Permanente\)/i)).toBeInTheDocument();
    });

    // Select permanent unassignment
    fireEvent.click(screen.getByText(/Desasignar de todas las futuras asignaciones \(Permanente\)/i));

    // Confirm action
    const confirmBtn = screen.getByRole('button', { name: /Confirmar Desasignación/i });
    fireEvent.click(confirmBtn);

    // Sofia is unassigned, viewer shows "Sin asignaciones activas para esta tarea."
    await waitFor(() => {
      expect(screen.getByText(/Sin asignaciones activas para esta tarea/i)).toBeInTheDocument();
    });

    // The master task "Pasear al perro" remains intact in library
    expect(screen.getByText('Pasear al perro')).toBeInTheDocument();
  });

  it('Escenario 4b: Pausar temporalmente por varios días con cálculo de reanudación [REQ-LIB-008]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('library');

    // Locate "Pasear al perro" and expand
    await waitFor(() => {
      expect(screen.getByText('Pasear al perro')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Pasear al perro'));

    // Click "[ ❌ Desasignar / Pausar ]"
    const unassignBtn = screen.getByRole('button', { name: /Desasignar \/ Pausar/i });
    fireEvent.click(unassignBtn);

    await waitFor(() => {
      expect(screen.getByText(/⚙️ Desasignar o Pausar Tarea/i)).toBeInTheDocument();
    });

    // Select "Pausar temporalmente"
    fireEvent.click(screen.getByText(/Pausar temporalmente por varios días/i));

    // Select 5 days
    const fiveDaysBtn = screen.getByRole('button', { name: /5 días/i });
    fireEvent.click(fiveDaysBtn);

    // Confirm pause
    const confirmBtn = screen.getByRole('button', { name: /Pausar por 5 días/i });
    fireEvent.click(confirmBtn);

    // Modal closes and viewer shows paused status badge
    await waitFor(() => {
      expect(screen.getByText(/⏸️ Pausada hasta/i)).toBeInTheDocument();
    });

    // Sofia is still in the assignment list, but marked as paused
    expect(screen.getByText(/Sofía:\s*/i)).toBeInTheDocument();
  });

  it('Escenario 4c: Omitir desasignación solo por el día de hoy manteniendo regla activa [REQ-LIB-008]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('library');

    // Locate "Pasear al perro" and expand
    await waitFor(() => {
      expect(screen.getByText('Pasear al perro')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Pasear al perro'));

    // Click "[ ❌ Desasignar / Pausar ]"
    const unassignBtn = screen.getByRole('button', { name: /Desasignar \/ Pausar/i });
    fireEvent.click(unassignBtn);

    await waitFor(() => {
      expect(screen.getByText(/⚙️ Desasignar o Pausar Tarea/i)).toBeInTheDocument();
    });

    // Select "Solo por el día de hoy"
    fireEvent.click(screen.getByText(/Solo por el día de hoy/i));

    // Confirm action
    const confirmBtn = screen.getByRole('button', { name: /Omitir solo por hoy/i });
    fireEvent.click(confirmBtn);

    // Sofia remains assigned in the library viewer with badge "Omitida hoy"
    await waitFor(() => {
      expect(screen.getByText(/Sofía:\s*/i)).toBeInTheDocument();
      expect(screen.getByText(/⏭️ Omitida hoy/i)).toBeInTheDocument();
    });
  });

  it('Escenario 5: Visualización y disponibilidad de tareas de rutinas en el catálogo general [REQ-LIB-010]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('library');

    // Ensure we are in "Banco de Tareas"
    expect(screen.getByText(/Banco de Tareas/i)).toBeInTheDocument();

    // Both "Hacer la cama" and "Lavarse los dientes" exist in masterTasks
    const camaTask = screen.getByText('Hacer la cama');
    const dientesTask = screen.getByText('Lavarse los dientes');
    expect(camaTask).toBeInTheDocument();
    expect(dientesTask).toBeInTheDocument();

    // Both show the badge [🏷️ Rutina Mañanera]
    const camaCard = camaTask.closest('div[class*="border-2"]');
    const dientesCard = dientesTask.closest('div[class*="border-2"]');

    expect(within(camaCard).getByText(/🏷️ Rutina Mañanera/i)).toBeInTheDocument();
    expect(within(dientesCard).getByText(/🏷️ Rutina Mañanera/i)).toBeInTheDocument();

    // Both have individual "[ 🚀 Asignar Tarea ]" button
    expect(within(camaCard).getByRole('button', { name: /Asignar Tarea/i })).toBeInTheDocument();
    expect(within(dientesCard).getByRole('button', { name: /Asignar Tarea/i })).toBeInTheDocument();
  });

  it('Escenario 6: Detección preventiva de duplicado al asignar tarea maestra individual [REQ-LIB-006]', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    await unlockParentMode('library');

    // Mateo ya tiene "Hacer la cama" en todayAssignments por defecto
    // Intentamos asignarle nuevamente "Hacer la cama" desde la biblioteca
    const camaTask = screen.getByText('Hacer la cama');
    const camaCard = camaTask.closest('div[class*="border-2"]');
    const assignBtn = within(camaCard).getByRole('button', { name: /Asignar Tarea/i });
    fireEvent.click(assignBtn);

    await waitFor(() => {
      expect(screen.getByText(/Configura la asignación de Hacer la cama/i)).toBeInTheDocument();
    });

    // Seleccionamos "Para el Día Actual (Hoy)" y pulsamos Confirmar Asignación
    const confirmAssignBtn = screen.getByRole('button', { name: /Confirmar Asignación/i });
    fireEvent.click(confirmAssignBtn);

    // Debe abrir el modal preventivo de detección de duplicados
    await waitFor(() => {
      expect(screen.getByText('⚠️ Tareas Duplicadas Detectadas')).toBeInTheDocument();
      expect(screen.getByText(/Hacer la cama ya existe para hoy/i)).toBeInTheDocument();
    });

    // Pulsamos "Omitir duplicado (Recomendado)"
    const omitBtn = screen.getByRole('button', { name: /Omitir duplicado/i });
    fireEvent.click(omitBtn);

    // El modal de duplicados se cierra
    await waitFor(() => {
      expect(screen.queryByText('⚠️ Tareas Duplicadas Detectadas')).not.toBeInTheDocument();
    });
  });
});
