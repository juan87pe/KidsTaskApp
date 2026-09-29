import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';

export const TaskMasterModal = ({ isOpen, onClose, initialTask = null }) => {
  const { saveMasterTask } = useApp();
  const [title, setTitle] = useState(initialTask?.title || '');
  const [defaultPoints, setDefaultPoints] = useState(initialTask?.defaultPoints || 20);
  const [defaultApprovalMode, setDefaultApprovalMode] = useState(initialTask?.defaultApprovalMode || 'kid_request');
  const [iconSvg, setIconSvg] = useState(initialTask?.iconSvg || '🎯');
  const [category, setCategory] = useState(initialTask?.category || 'Hogar');
  const [description, setDescription] = useState(initialTask?.description || '');

  if (!isOpen) return null;

  const iconChoices = ['🛏️', '🪥', '📚', '🧸', '🍽️', '🥦', '🐕', '🎨', '👟', '👕', '🏊‍♂️', '🎯', '✨', '🎸'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveMasterTask({
      id: initialTask?.id,
      title: title.trim(),
      defaultPoints: Number(defaultPoints),
      defaultApprovalMode,
      iconSvg,
      category,
      description: description.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? '✏️ Editar Tarea Maestra' : '➕ Nueva Tarea Maestra'}
      subtitle="Define la plantilla base para el catálogo familiar"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
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
            placeholder="Ej. Guardar zapatos en el zapatero"
          />
        </div>

        {/* Icon selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Icono SVG / Emoji:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {iconChoices.map(ic => (
              <button
                key={ic}
                type="button"
                onClick={() => setIconSvg(ic)}
                className={`w-9 h-9 rounded-squircle-sm text-lg flex items-center justify-center border-2 transition ${
                  iconSvg === ic ? 'border-sky-500 bg-sky-100 scale-110 shadow-sm' : 'border-slate-200 bg-white'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Points & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
              Puntos Base:
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={defaultPoints}
              onChange={(e) => setDefaultPoints(e.target.value)}
              className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-bold text-amber-800 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
              Categoría:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 focus:border-sky-400 focus:outline-none"
            >
              <option value="Hogar">Hogar</option>
              <option value="Higiene">Higiene</option>
              <option value="Estudios">Estudios</option>
              <option value="Salud">Salud</option>
              <option value="Responsabilidad">Responsabilidad</option>
            </select>
          </div>
        </div>

        {/* Approval Mode */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Modo de Aprobación:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDefaultApprovalMode('kid_request')}
              className={`p-2.5 rounded-squircle-sm text-xs font-bold border-2 transition ${
                defaultApprovalMode === 'kid_request'
                  ? 'border-sky-500 bg-sky-50 text-sky-900'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              🚀 El Niño pide visto bueno
            </button>

            <button
              type="button"
              onClick={() => setDefaultApprovalMode('parent_only')}
              className={`p-2.5 rounded-squircle-sm text-xs font-bold border-2 transition ${
                defaultApprovalMode === 'parent_only'
                  ? 'border-[#1E3A5F] bg-slate-100 text-[#1E3A5F]'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              👨 Solo Marcado por Padres
            </button>
          </div>
        </div>

        {/* Optional Description / Instructions */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Instrucciones o Notas para el Niño (Opcional):
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-xs font-medium text-slate-700 focus:border-sky-400 focus:outline-none"
            placeholder="Ej. Página 45 del libro y recoger el estante..."
          />
        </div>

        {/* Submit Buttons */}
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
            Guardar Tarea Maestra
          </ChunkyButton>
        </div>
      </form>
    </Modal>
  );
};
