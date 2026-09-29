import React, { useState } from 'react';
import { Lock, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';

export const RewardLockModal = ({ isOpen, onClose, targetReward }) => {
  const { toggleRewardLock } = useApp();
  const [duration, setDuration] = useState('2 Días');
  const [reason, setReason] = useState('Descanso de pantallas y enfoque escolar');

  if (!isOpen || !targetReward) return null;

  const handleConfirm = () => {
    let untilStr = '2026-08-28';
    let lockDuration = '2 días';
    if (duration === '1 Día') { untilStr = '2026-08-27'; lockDuration = '1 día'; }
    if (duration === '2 Días') { untilStr = '2026-08-28'; lockDuration = '2 días'; }
    if (duration === '1 Semana') { untilStr = '2026-09-02'; lockDuration = '1 semana'; }
    if (duration === 'Indefinido') { untilStr = null; lockDuration = 'Indefinido'; }

    toggleRewardLock(targetReward.id, {
      lockUntil: untilStr,
      lockReason: reason,
      lockDuration
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🔒 Bloqueo Temporal: ${targetReward.title}`}
      subtitle="Suspende temporalmente el canje de este premio para los niños"
    >
      <div className="space-y-4">
        
        {/* Duration selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Duración de la Restricción:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['1 Día', '2 Días', '1 Semana', 'Indefinido'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setDuration(opt)}
                className={`py-2 px-3 rounded-squircle-sm text-xs font-bold border-2 transition ${
                  duration === opt
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Motivo */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Motivo del Bloqueo (visible para el niño):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-semibold text-[#1E3A5F] focus:border-rose-400 focus:outline-none"
            placeholder="Ej. Descanso por semana de exámenes"
          />
        </div>

        <div className="p-3 rounded-squircle-sm bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle size={15} />
          <span>El botón de canje se deshabilitará con un candado en la tienda del niño.</span>
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
            variant="coral"
            size="sm"
            onClick={handleConfirm}
            className="text-xs font-bold"
          >
            Confirmar Bloqueo 🔒
          </ChunkyButton>
        </div>

      </div>
    </Modal>
  );
};
