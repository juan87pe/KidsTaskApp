import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';

export const AddChildModal = ({ isOpen, onClose }) => {
  const { saveChild } = useApp();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦁');
  const [initialPoints, setInitialPoints] = useState(50);
  const [colorTheme, setColorTheme] = useState('#F59E0B');

  if (!isOpen) return null;

  const avatars = ['🦁', '🦄', '🐼', '🦊', '🚀', '⭐', '🐯', '🐬', '🦖', '⚽'];
  const colors = [
    { label: 'Ámbar', hex: '#F59E0B', bg: '#FEF3C7', border: '#FDE68A' },
    { label: 'Rosa', hex: '#EC4899', bg: '#FCE7F3', border: '#FBCFE8' },
    { label: 'Azul', hex: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
    { label: 'Verde', hex: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
    { label: 'Morado', hex: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedCol = colors.find(c => c.hex === colorTheme) || colors[0];

    saveChild({
      name: name.trim(),
      avatar,
      currentPoints: Number(initialPoints),
      level: 'Nivel 1 • Principiante',
      colorTheme: selectedCol.hex,
      bgColor: selectedCol.bg,
      borderColor: selectedCol.border
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🧒 Agregar Nuevo Hijo al Hogar"
      subtitle="Crea un perfil infantil con saldo inicial y personalización"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Nombre del Hijo/a:
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-bold text-[#1E3A5F] focus:border-sky-400 focus:outline-none"
            placeholder="Ej. Lucas"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Elige su Avatar:
          </label>
          <div className="flex flex-wrap gap-2">
            {avatars.map(av => (
              <button
                key={av}
                type="button"
                onClick={() => setAvatar(av)}
                className={`w-11 h-11 rounded-full text-2xl flex items-center justify-center border-2 transition ${
                  avatar === av ? 'border-[#1E3A5F] bg-blue-100 scale-110 shadow-sm' : 'border-slate-200 bg-white'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Tema de Color:
          </label>
          <div className="flex gap-2">
            {colors.map(col => (
              <button
                key={col.hex}
                type="button"
                onClick={() => setColorTheme(col.hex)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  colorTheme === col.hex ? 'scale-125 border-slate-900 shadow-md' : 'border-white'
                }`}
                style={{ backgroundColor: col.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Saldo Inicial de Puntos:
          </label>
          <input
            type="number"
            min={0}
            value={initialPoints}
            onChange={(e) => setInitialPoints(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-bold text-amber-800 focus:outline-none"
          />
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
            type="submit"
            className="text-xs font-bold"
          >
            Crear Perfil de Hijo
          </ChunkyButton>
        </div>
      </form>
    </Modal>
  );
};
