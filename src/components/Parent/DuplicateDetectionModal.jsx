import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';

export const DuplicateDetectionModal = ({
  isOpen,
  onClose,
  duplicates = [],
  onConfirmOmit,
  onConfirmAllowAll
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚠️ Tareas Duplicadas Detectadas"
      subtitle="El niño ya tiene algunas de estas tareas asignadas para hoy"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-squircle-md bg-amber-50 border-2 border-amber-300 text-xs text-amber-900">
          <p className="font-bold mb-1">Las siguientes tareas ya existen en la jornada:</p>
          <ul className="list-disc pl-5 space-y-0.5 font-semibold text-slate-700">
            {duplicates.map((d, i) => (
              <li key={i}>{d.title} (+{d.points} pts)</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          ¿Cómo deseas proceder con las tareas duplicadas?
        </p>

        <div className="space-y-2 pt-1">
          <button
            onClick={onConfirmOmit}
            className="w-full p-3 rounded-squircle-md bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-bold text-xs text-left hover:bg-emerald-100 flex items-center justify-between transition"
          >
            <div>
              <span className="block font-extrabold text-sm">🔘 Omitir duplicados (Recomendado)</span>
              <span className="text-[11px] font-normal text-emerald-700">Solo asigna las tareas nuevas sin inflar puntos.</span>
            </div>
            <Check size={18} className="text-emerald-600" />
          </button>

          <button
            onClick={onConfirmAllowAll}
            className="w-full p-3 rounded-squircle-md bg-white border-2 border-slate-300 text-slate-700 font-bold text-xs text-left hover:bg-slate-50 flex items-center justify-between transition"
          >
            <div>
              <span className="block font-extrabold text-sm">⚪ Permitir como tareas repetidas (x2)</span>
              <span className="text-[11px] font-normal text-slate-500">Útil para actividades de mañana y tarde (ej. cepillado x2).</span>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};
