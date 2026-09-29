import React, { useState } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';

export const AddTutorModal = ({ isOpen, onClose }) => {
  const { saveTutor } = useApp();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Administrador');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('👨');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveTutor({
      name: name.trim(),
      role,
      email: email.trim() || 'Acceso Local',
      avatar
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="👨‍👩‍👧 Invitar / Agregar Tutor"
      subtitle="Registra a otro padre, madre o cuidador con acceso PIN"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Nombre del Tutor:
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-sm font-bold text-[#1E3A5F] focus:border-sky-400 focus:outline-none"
            placeholder="Ej. Tía Lucía"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Icono:
          </label>
          <div className="flex gap-2">
            {['👨', '👩', '👵', '👴', '🧑'].map(ic => (
              <button
                key={ic}
                type="button"
                onClick={() => setAvatar(ic)}
                className={`w-10 h-10 rounded-full text-xl flex items-center justify-center border-2 transition ${
                  avatar === ic ? 'border-sky-500 bg-sky-100 scale-110 shadow-sm' : 'border-slate-200 bg-white'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1 uppercase">
            Rol de Permisos:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="Administrador">Administrador (Total control y PIN)</option>
            <option value="Cuidador / Tutor">Cuidador / Tutor (Solo validar tareas)</option>
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
            variant="slate"
            size="sm"
            type="submit"
            className="text-xs font-bold"
          >
            Guardar Tutor
          </ChunkyButton>
        </div>
      </form>
    </Modal>
  );
};
