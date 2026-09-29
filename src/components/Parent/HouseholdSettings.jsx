import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Shield, Key, Plus, Trash2, Edit2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const HouseholdSettings = ({ onOpenAddChild, onOpenAddTutor }) => {
  const {
    data,
    saveChild,
    deleteChild,
    updateFamilySettings,
    resetAllData
  } = useApp();

  const [pinInput, setPinInput] = useState(data.family.masterPin);
  const [pinSavedMessage, setPinSavedMessage] = useState(false);

  const handleSavePin = (e) => {
    e.preventDefault();
    if (pinInput.length === 4) {
      updateFamilySettings({ masterPin: pinInput });
      setPinSavedMessage(true);
      setTimeout(() => setPinSavedMessage(false), 2000);
    }
  };

  const handleRuleChange = (rule) => {
    updateFamilySettings({ pointsRule: rule });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 select-none">
      
      {/* Header */}
      <div className="pt-2">
        <h2 className="text-2xl font-extrabold text-[#1E3A5F]">
          ⚙️ Miembros del Hogar & Ajustes
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Gestiona hijos, tutores administradores, reglas de puntos y seguridad familiar
        </p>
      </div>

      {/* 1. Sección Hijos del Hogar */}
      <GlassCard className="p-5 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧒</span>
            <h3 className="font-extrabold text-base text-[#1E3A5F]">
              Hijos Registrados ({data.children.length})
            </h3>
          </div>

          <ChunkyButton
            variant="sky"
            size="sm"
            onClick={onOpenAddChild}
            className="text-xs font-bold"
          >
            <Plus size={14} /> Agregar Hijo
          </ChunkyButton>
        </div>

        <div className="space-y-2.5">
          {data.children.map(child => (
            <div
              key={child.id}
              className="flex items-center justify-between p-3 rounded-squircle-sm border-2 bg-white"
              style={{ borderColor: child.borderColor }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-2xl border-2 shadow-sm"
                  style={{ backgroundColor: child.bgColor, borderColor: child.colorTheme }}
                >
                  {child.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1E3A5F]">
                    {child.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>{child.level}</span>
                    <span>•</span>
                    <span className="text-amber-700 font-bold">⭐ {child.currentPoints} pts</span>
                  </div>
                </div>
              </div>

              <button
                disabled={data.children.length <= 1}
                onClick={() => deleteChild(child.id)}
                className={`p-2 rounded text-slate-400 hover:text-rose-600 transition ${
                  data.children.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                }`}
                title="Eliminar hijo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 2. Sección Padres y Tutores */}
      <GlassCard className="p-5 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">👨‍👩‍👧</span>
            <h3 className="font-extrabold text-base text-[#1E3A5F]">
              Padres & Tutores ({data.tutors.length})
            </h3>
          </div>

          <ChunkyButton
            variant="gray"
            size="sm"
            onClick={onOpenAddTutor}
            className="text-xs font-bold"
          >
            <Plus size={14} /> Agregar Tutor
          </ChunkyButton>
        </div>

        <div className="space-y-2.5">
          {data.tutors.map(tutor => (
            <div
              key={tutor.id}
              className="flex items-center justify-between p-3 rounded-squircle-sm bg-slate-50 border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tutor.avatar || '👤'}</span>
                <div>
                  <h4 className="font-bold text-sm text-[#1E3A5F]">
                    {tutor.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {tutor.email || 'Acceso Local'} • <strong className="text-sky-700">{tutor.role}</strong>
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                Activo
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 3. Reglas de Acumulación de Puntos */}
      <GlassCard className="p-5 border-2 border-slate-200">
        <h3 className="font-extrabold text-base text-[#1E3A5F] mb-1">
          ⚙️ Reglas de Puntos & Gamificación
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Elige cómo caducan o se conservan las estrellas ganadas por los niños
        </p>

        <div className="space-y-2">
          {[
            {
              id: 'cumulative',
              title: '⭐ Modo Acumulativo Continuo (Recomendado)',
              desc: 'Los puntos nunca caducan; se guardan día a día para canjear premios mayores.'
            },
            {
              id: 'daily_reset',
              title: '🔄 Modo Canje Diario Obligatorio',
              desc: 'Los puntos se reinician a 0 cada noche a las 23:59.'
            },
            {
              id: 'weekly_reset',
              title: '📅 Modo Reinicio Semanal',
              desc: 'Se reinician los domingos a medianoche para empezar cada lunes desde cero.'
            }
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleRuleChange(opt.id)}
              className={`w-full p-3.5 rounded-squircle-sm border-2 text-left transition flex items-center justify-between ${
                data.family.pointsRule === opt.id
                  ? 'border-[#1E3A5F] bg-blue-50/50 text-[#1E3A5F] shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="font-extrabold text-xs block">{opt.title}</span>
                <span className="text-[11px] font-medium text-slate-500 mt-0.5 block">{opt.desc}</span>
              </div>
              {data.family.pointsRule === opt.id && (
                <Check size={18} className="text-sky-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 4. PIN Maestro de Seguridad */}
      <GlassCard className="p-5 border-2 border-slate-200">
        <h3 className="font-extrabold text-base text-[#1E3A5F] mb-1 flex items-center gap-1.5">
          <Key size={16} className="text-amber-500" />
          <span>PIN Maestro de Acceso a Padres</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Código de 4 dígitos requerido para entrar al panel administrativo
        </p>

        <form onSubmit={handleSavePin} className="flex items-center gap-3">
          <input
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            className="w-32 p-2.5 text-center tracking-widest font-extrabold text-xl rounded-squircle-sm bg-white border-2 border-slate-300 focus:border-[#1E3A5F] focus:outline-none"
            placeholder="••••"
          />

          <ChunkyButton
            variant="slate"
            size="sm"
            type="submit"
            className="text-xs font-bold"
          >
            Actualizar PIN
          </ChunkyButton>

          {pinSavedMessage && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
              <Check size={14} /> ¡PIN Guardado!
            </span>
          )}
        </form>
      </GlassCard>

      {/* 5. Peligro: Reiniciar Datos Demo */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            if (window.confirm('¿Deseas restablecer todos los datos al estado inicial de demostración?')) {
              resetAllData();
            }
          }}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center justify-center gap-1 mx-auto transition"
        >
          <RotateCcw size={13} /> Restablecer datos de prueba iniciales
        </button>
      </div>

    </div>
  );
};
