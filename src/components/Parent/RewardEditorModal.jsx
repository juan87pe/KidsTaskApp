import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';

export const RewardEditorModal = ({ isOpen, onClose, initialReward = null }) => {
  const { saveReward, data } = useApp();
  const [title, setTitle] = useState(initialReward?.title || '');
  const [pointsCost, setPointsCost] = useState(initialReward?.pointsCost || 100);
  const [iconSvg, setIconSvg] = useState(initialReward?.iconSvg || '🎁');
  const [availableFor, setAvailableFor] = useState(initialReward?.availableFor || 'all');

  if (!isOpen) return null;

  const pointPresets = [50, 80, 100, 150, 200, 250];
  const iconList = ['🎮', '🍦', '🎪', '📱', '🍿', '🎁', '🛹', '🍕', '🎬', '📚', '🎯', '🎳'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveReward({
      id: initialReward?.id,
      title: title.trim(),
      pointsCost: Number(pointsCost),
      iconSvg,
      availableFor
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialReward ? '✏️ Editar Recompensa' : '🎁 Nueva Recompensa Familiar'}
      subtitle="Establece el título, icono y costo en puntos de canje"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Nombre del Premio:
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-semibold text-[#1E3A5F] focus:border-amber-400 focus:outline-none"
            placeholder="Ej. 1 hora de piscina el sábado"
          />
        </div>

        {/* Icons */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Icono SVG / Emoji:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {iconList.map(ic => (
              <button
                key={ic}
                type="button"
                onClick={() => setIconSvg(ic)}
                className={`w-9 h-9 rounded-squircle-sm text-lg flex items-center justify-center border-2 transition ${
                  iconSvg === ic ? 'border-amber-500 bg-amber-100 scale-110 shadow-sm' : 'border-slate-200 bg-white'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Cost in points & presets */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Costo en Puntos (Equivalencia):
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {pointPresets.map(pts => (
              <button
                key={pts}
                type="button"
                onClick={() => setPointsCost(pts)}
                className={`px-3 py-1 rounded-squircle-sm text-xs font-extrabold border-2 transition ${
                  pointsCost === pts
                    ? 'border-amber-500 bg-amber-400 text-amber-950 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                ⭐ {pts}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={10}
            step={5}
            value={pointsCost}
            onChange={(e) => setPointsCost(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-bold text-amber-800 focus:outline-none"
          />
        </div>

        {/* Available for which child */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Disponible para:
          </label>
          <select
            value={availableFor}
            onChange={(e) => setAvailableFor(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">Disponible para todos los hijos</option>
            {data.children.map(c => (
              <option key={c.id} value={c.id}>Solo para {c.name}</option>
            ))}
          </select>
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
            type="submit"
            className="text-xs font-bold"
          >
            Guardar Premio
          </ChunkyButton>
        </div>
      </form>
    </Modal>
  );
};
