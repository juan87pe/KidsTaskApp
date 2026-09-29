import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';
import { Calendar, Check } from 'lucide-react';

export const AssignMasterTaskModal = ({ isOpen, onClose, targetTask = null, targetChildId }) => {
  const { data, assignMasterTaskToChild } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState(targetTask?.id || data.masterTasks[0]?.id || '');
  const [selectedChildId, setSelectedChildId] = useState(targetChildId || data.children[0]?.id || 'child-mateo');
  const [scheduleType, setScheduleType] = useState('today'); // 'today' | 'daily' | 'weekdays' | 'custom'

  if (!isOpen) return null;

  const currentTask = targetTask || data.masterTasks.find(m => m.id === selectedTaskId) || data.masterTasks[0];
  const child = data.children.find(c => c.id === selectedChildId) || data.children[0];

  const handleAssign = () => {
    assignMasterTaskToChild(selectedChildId, currentTask.id, scheduleType);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Asignar Tarea desde Biblioteca"
      subtitle={`Configura la asignación de ${currentTask.title} para ${child.name}`}
    >
      <div className="space-y-4">
        
        {/* Task info summary */}
        <div className="p-3 rounded-squircle-sm bg-sky-50 border border-sky-200 flex items-center gap-3">
          <span className="text-3xl">{currentTask.iconSvg}</span>
          <div>
            <h4 className="font-extrabold text-sm text-[#1E3A5F]">{currentTask.title}</h4>
            <span className="font-bold text-xs text-amber-700">⭐ +{currentTask.defaultPoints} pts</span>
          </div>
        </div>

        {/* Child selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Asignar a:
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

        {/* Programación Temporal */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Modalidad de Programación:
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'today', title: '🔘 Para el Día Actual (Hoy)', desc: 'Se inyecta de inmediato a la lista de hoy' },
              { id: 'daily', title: '⚪ Diaria Continua', desc: 'Aparece todos los días recurrentemente' },
              { id: 'weekdays', title: '⚪ Días de Escuela (Lunes a Viernes)', desc: 'Solo entre semana' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setScheduleType(opt.id)}
                className={`w-full p-2.5 rounded-squircle-sm border-2 text-left transition flex items-center justify-between ${
                  scheduleType === opt.id
                    ? 'border-sky-400 bg-sky-50 text-sky-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div>
                  <span className="text-xs block font-bold">{opt.title}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{opt.desc}</span>
                </div>
                {scheduleType === opt.id && <Check size={16} className="text-sky-600" />}
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
            variant="sky"
            size="sm"
            onClick={handleAssign}
            className="text-xs font-bold"
          >
            Confirmar Asignación
          </ChunkyButton>
        </div>

      </div>
    </Modal>
  );
};
