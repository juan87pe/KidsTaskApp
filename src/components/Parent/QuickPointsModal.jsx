import React, { useState, useEffect } from 'react';
import { Star, AlertTriangle, Sparkles } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';

export const QuickPointsModal = ({ isOpen, onClose, initialIsBonus = true }) => {
  const { data, applyQuickPoints } = useApp();
  const [selectedChildId, setSelectedChildId] = useState(data.children[0]?.id || 'child-mateo');
  const [isBonus, setIsBonus] = useState(initialIsBonus);
  const [points, setPoints] = useState(10);
  const [reason, setReason] = useState('');

  useEffect(() => {
    setIsBonus(initialIsBonus);
    setPoints(10);
    setReason('');
  }, [initialIsBonus, isOpen]);

  if (!isOpen) return null;

  const quickPills = isBonus ? [5, 10, 15, 20, 50] : [5, 10, 15, 20];
  const commonReasons = isBonus
    ? ['Ayudar a su hermana', 'Excelente actitud', 'Ayudar sin que se lo pidan', 'Comportamiento ejemplar', 'Compartir con hermano']
    : ['No ordenar tras jugar', 'No hacer caso tras 3 avisos', 'Discusión / Falta de respeto', 'No recoger juguetes', 'Uso excesivo de pantallas'];

  const handleSubmit = (e) => {
    e.preventDefault();
    applyQuickPoints(selectedChildId, points, reason || (isBonus ? 'Bono especial' : 'Sanción'), isBonus);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBonus ? '🌟 Otorgar Bono Rápido' : '⚠️ Aplicar Sanción de Puntos'}
      subtitle="Ajusta puntos en tiempo real para incentivar o corregir comportamientos"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Toggle Bonus / Penalty */}
        <div className="flex bg-slate-200 p-1 rounded-squircle-md">
          <button
            type="button"
            onClick={() => setIsBonus(true)}
            className={`flex-1 py-2 rounded-squircle-sm text-xs font-extrabold transition ${
              isBonus ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            🌟 Otorgar Bono
          </button>
          <button
            type="button"
            onClick={() => setIsBonus(false)}
            className={`flex-1 py-2 rounded-squircle-sm text-xs font-extrabold transition ${
              !isBonus ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            ⚠️ Aplicar Sanción
          </button>
        </div>

        {/* Child Selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Hijo:
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
                <span>{c.name} ({c.currentPoints} pts)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Points Quick Selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Cantidad de Puntos:
          </label>
          <div className="flex gap-2 mb-2">
            {quickPills.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPoints(p)}
                className={`flex-1 py-2 rounded-squircle-sm font-extrabold text-sm border-2 transition ${
                  points === p
                    ? isBonus
                      ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                      : 'bg-rose-500 border-rose-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isBonus ? `+${p} ⭐` : `-${p} ⭐`}
              </button>
            ))}
          </div>
        </div>

        {/* Motivo Frecuente */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Motivo / Razón:
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {commonReasons.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setReason(r)}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              >
                {r}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm text-[#1E3A5F] font-semibold focus:border-sky-400 focus:outline-none"
            placeholder="Escribe un motivo personalizado..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-squircle-sm text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <ChunkyButton
            variant={isBonus ? 'green' : 'coral'}
            size="sm"
            type="submit"
            className="text-xs font-bold"
          >
            {isBonus ? 'Confirmar Bono' : 'Confirmar Sanción'}
          </ChunkyButton>
        </div>

      </form>
    </Modal>
  );
};
