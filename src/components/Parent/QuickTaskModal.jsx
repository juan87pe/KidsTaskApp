import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';

export const QuickTaskModal = ({ isOpen, onClose, childId }) => {
  const { addQuickTaskToChildDay, data } = useApp();
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(20);
  const [iconSvg, setIconSvg] = useState('⭐');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const child = data.children.find(c => c.id === childId) || data.children[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addQuickTaskToChildDay(childId, {
      title: title.trim(),
      points: Number(points),
      approvalMode: 'kid_request',
      iconSvg,
      note: note.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`➕ Tarea Rápida para ${child.name}`}
      subtitle="Asigna una actividad puntual única solo para el día de hoy"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Título de la Tarea:
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-semibold text-[#1E3A5F] focus:border-sky-400 focus:outline-none"
            placeholder="Ej. Llevar la basura al contenedor"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
              Puntos:
            </label>
            <input
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-bold text-amber-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
              Icono:
            </label>
            <input
              type="text"
              value={iconSvg}
              onChange={(e) => setIconSvg(e.target.value)}
              className="w-full p-2.5 text-center text-xl rounded-squircle-sm bg-white border-2 border-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Instrucciones / Nota (Opcional):
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 rounded-squircle-sm bg-white border-2 border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
            placeholder="Detalles sobre cómo realizar la tarea..."
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
            Asignar a Hoy
          </ChunkyButton>
        </div>
      </form>
    </Modal>
  );
};
