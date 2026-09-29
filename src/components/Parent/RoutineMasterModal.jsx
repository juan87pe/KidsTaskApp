import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export const RoutineMasterModal = ({ isOpen, onClose, initialRoutine = null }) => {
  const { data, saveMasterRoutine } = useApp();
  const [title, setTitle] = useState(initialRoutine?.title || '');
  const [description, setDescription] = useState(initialRoutine?.description || '');
  const [icon, setIcon] = useState(initialRoutine?.icon || '🌅');
  const [tasks, setTasks] = useState(initialRoutine?.tasks || []);

  if (!isOpen) return null;

  const handleAddTaskFromMaster = (masterTaskId) => {
    const mt = data.masterTasks.find(m => m.id === masterTaskId);
    if (!mt) return;

    const newTask = {
      masterTaskId: mt.id,
      title: mt.title,
      points: mt.defaultPoints,
      iconSvg: mt.iconSvg,
      orderIndex: tasks.length + 1
    };

    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleMoveOrder = (idx, dir) => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= tasks.length) return;

    const copy = [...tasks];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setTasks(copy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveMasterRoutine({
      id: initialRoutine?.id,
      title: title.trim(),
      description: description.trim(),
      icon,
      tasks
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRoutine ? '✏️ Editar Rutina' : '🚀 Nueva Plantilla de Rutina'}
      subtitle="Construye una secuencia reutilizable ordenando tareas maestras"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
              Título de la Rutina:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-semibold text-[#1E3A5F] focus:border-amber-400 focus:outline-none"
              placeholder="Ej. Rutina Fin de Semana"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
              Icono:
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-2.5 text-center text-xl rounded-squircle-sm bg-white border-2 border-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Descripción corta:
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-squircle-sm bg-white border-2 border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
            placeholder="Pasos para la mañana antes del cole..."
          />
        </div>

        {/* Selected Ordered Tasks */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-extrabold text-[#1E3A5F] uppercase">
              Secuencia de Tareas ({tasks.length}):
            </label>
            <span className="text-[11px] text-slate-400">Usa las flechas para ordenar</span>
          </div>

          {tasks.length === 0 ? (
            <p className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-squircle-sm border border-dashed border-slate-200">
              Añade tareas maestras desde el selector inferior.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {tasks.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-squircle-sm bg-white border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1E3A5F] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{t.iconSvg}</span>
                    <span className="font-bold text-slate-800">{t.title}</span>
                    <span className="font-extrabold text-amber-700">+{t.points} ⭐</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, 'up')}
                      className={`p-1 rounded bg-slate-100 text-slate-600 ${idx === 0 ? 'opacity-30' : ''}`}
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === tasks.length - 1}
                      onClick={() => handleMoveOrder(idx, 'down')}
                      className={`p-1 rounded bg-slate-100 text-slate-600 ${idx === tasks.length - 1 ? 'opacity-30' : ''}`}
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add from Master Library */}
        <div className="pt-2 border-t border-slate-200">
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Añadir Tarea Maestra a la Rutina:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {data.masterTasks.map(mt => (
              <button
                key={mt.id}
                type="button"
                onClick={() => handleAddTaskFromMaster(mt.id)}
                className="text-xs font-semibold px-2.5 py-1 rounded-squircle-sm bg-slate-100 border border-slate-200 text-slate-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-800 flex items-center gap-1 transition"
              >
                <span>{mt.iconSvg}</span>
                <span>{mt.title}</span>
                <Plus size={12} />
              </button>
            ))}
          </div>
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
            variant="gold"
            size="sm"
            type="submit"
            className="text-xs font-bold"
          >
            Guardar Rutina
          </ChunkyButton>
        </div>
      </form>
    </Modal>
  );
};
