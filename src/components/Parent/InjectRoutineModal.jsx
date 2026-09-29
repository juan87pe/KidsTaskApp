import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';
import { Zap, Check, AlertTriangle } from 'lucide-react';

export const InjectRoutineModal = ({ isOpen, onClose, targetChildId, onTriggerDuplicateModal, initialRoutineId }) => {
  const { data, checkDuplicatesForRoutine, injectRoutine } = useApp();
  const [selectedRoutineId, setSelectedRoutineId] = useState(initialRoutineId || data.masterRoutines[0]?.id || '');
  const [selectedChildId, setSelectedChildId] = useState(targetChildId || data.children[0]?.id || 'child-mateo');

  useEffect(() => {
    if (initialRoutineId) setSelectedRoutineId(initialRoutineId);
    if (targetChildId) setSelectedChildId(targetChildId);
  }, [initialRoutineId, targetChildId, isOpen]);

  if (!isOpen) return null;

  const child = data.children.find(c => c.id === selectedChildId) || data.children[0];

  const handleInject = () => {
    const dups = checkDuplicatesForRoutine(selectedChildId, selectedRoutineId);
    if (dups.length > 0) {
      // Trigger prevention duplicate modal
      onTriggerDuplicateModal(selectedChildId, selectedRoutineId, dups);
      onClose();
    } else {
      injectRoutine(selectedChildId, selectedRoutineId, false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Inyectar Rutina a la Jornada"
      subtitle={`Carga la secuencia completa de tareas en la lista de hoy de ${child.name}`}
    >
      <div className="space-y-4">
        
        {/* Child selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Hijo Destinatario:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {data.children.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedChildId(c.id)}
                className={`p-2.5 rounded-squircle-sm border-2 font-bold text-xs flex items-center justify-center gap-2 transition ${
                  selectedChildId === c.id
                    ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>{c.avatar}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Routine selection */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Selecciona la Plantilla de Rutina:
          </label>
          <div className="space-y-2">
            {data.masterRoutines.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoutineId(r.id)}
                className={`w-full p-3 rounded-squircle-sm border-2 text-left transition flex items-center justify-between ${
                  selectedRoutineId === r.id
                    ? 'border-amber-400 bg-amber-50 text-amber-950 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#1E3A5F]">{r.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">{r.tasks.length} tareas secuenciales</p>
                  </div>
                </div>

                {selectedRoutineId === r.id && (
                  <Check size={18} className="text-amber-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-squircle-sm text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <ChunkyButton
            variant="gold"
            size="sm"
            onClick={handleInject}
            className="text-xs font-bold"
          >
            Inyectar Rutina 🚀
          </ChunkyButton>
        </div>

      </div>
    </Modal>
  );
};
