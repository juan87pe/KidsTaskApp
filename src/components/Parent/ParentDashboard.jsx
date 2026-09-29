import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, Star, Users, CheckCircle2, Clock, Gift, Lock, Calendar, BookOpen, Plus, AlertTriangle, ArrowRight, Settings } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const ParentDashboard = ({ onOpenQuickPoints, onOpenRewardLock }) => {
  const {
    data,
    activeTutor,
    setActiveParentTab,
    setActiveChildControlId,
    logoutToProfileSelect
  } = useApp();

  const pendingTasks = data.todayAssignments.filter(a => a.status === 'requested');
  const pendingRedemptions = data.pendingRedemptions || [];
  const totalPending = pendingTasks.length + pendingRedemptions.length;

  const lockedRewards = data.rewards.filter(r => r.isLocked);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 select-none">
      
      {/* 1. Header Familiar */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {data.family.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              🛡️ {activeTutor.role}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E3A5F]">
            ¡Hola, {activeTutor.name}! 👋
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveParentTab('settings')}
            className="p-2.5 rounded-squircle-sm bg-white border-2 border-slate-200 text-slate-600 hover:text-[#1E3A5F] hover:border-slate-300 shadow-sm transition"
            title="Ajustes del Hogar"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={logoutToProfileSelect}
            className="px-3 py-2 rounded-squircle-sm bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Salir
          </button>
        </div>
      </div>

      {/* 2. Banner de Atención Requerida (Centro de Aprobaciones) */}
      {totalPending > 0 ? (
        <div
          onClick={() => setActiveParentTab('approvals')}
          className="p-4 rounded-squircle-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-chunky-gold border-2 border-amber-400 cursor-pointer hover:brightness-105 active:translate-y-0.5 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold animate-pulse">
                🔔
              </div>
              <div>
                <h3 className="font-extrabold text-base">
                  {totalPending} Aprobaciones Pendientes
                </h3>
                <p className="text-xs text-amber-100">
                  {pendingTasks.length} tareas por validar • {pendingRedemptions.length} canjes de premios
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold bg-white text-amber-900 px-3 py-1.5 rounded-squircle-sm shadow-sm">
              <span>Revisar Hub</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-squircle-md bg-emerald-50 border-2 border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>¡Todo al día! No hay tareas ni canjes esperando aprobación.</span>
          </div>
          <span className="text-[11px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">🟢 Al día</span>
        </div>
      )}

      {/* 3. Carrusel de Hijos con Acceso a Ficha Diaria y Calendario */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-[#1E3A5F] flex items-center gap-1.5">
            <Users size={18} className="text-sky-600" />
            <span>Fichas de Control por Hijo</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Toca una tarjeta para gestionar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {data.children.map(child => {
            const childTasks = data.todayAssignments.filter(a => a.childId === child.id);
            const doneTasks = childTasks.filter(a => a.status === 'approved').length;
            const requestedTasks = childTasks.filter(a => a.status === 'requested').length;

            return (
              <GlassCard
                key={child.id}
                onClick={() => {
                  setActiveChildControlId(child.id);
                  setActiveParentTab('child_control');
                }}
                className="relative overflow-hidden group hover:border-[#4A90E2] transition border-2"
                style={{ backgroundColor: child.bgColor, borderColor: child.borderColor }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-white border-3 shadow-sm"
                      style={{ borderColor: child.colorTheme }}
                    >
                      {child.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-[#1E3A5F]">
                        {child.name}
                      </h4>
                      <div className="flex items-center gap-1 font-bold text-xs text-amber-700">
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        <span>{child.currentPoints} Puntos</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveChildControlId(child.id);
                      setActiveParentTab('calendar');
                    }}
                    className="p-2 rounded-squircle-sm bg-white/90 border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-300 shadow-sm transition"
                    title="Ver Calendario del Niño"
                  >
                    <Calendar size={16} />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Progreso de hoy: {doneTasks}/{childTasks.length}</span>
                  {requestedTasks > 0 ? (
                    <span className="text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                      ⏳ {requestedTasks} por revisar
                    </span>
                  ) : doneTasks === childTasks.length && childTasks.length > 0 ? (
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                      ✔️ Completado
                    </span>
                  ) : (
                    <span className="text-slate-500">En curso</span>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* 4. Cuadrícula de Acciones Rápidas (1-Tap Grid) */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-[#1E3A5F] px-1">
          Acciones Rápidas ⚡
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onOpenQuickPoints(true)}
            className="p-3.5 rounded-squircle-md bg-white border-2 border-emerald-200 shadow-chunky-green text-center hover:bg-emerald-50 active:translate-y-1 transition"
          >
            <span className="text-2xl block mb-1">🌟</span>
            <span className="text-xs font-bold text-emerald-800 block">Dar Bono</span>
          </button>

          <button
            onClick={() => onOpenQuickPoints(false)}
            className="p-3.5 rounded-squircle-md bg-white border-2 border-rose-200 shadow-chunky-coral text-center hover:bg-rose-50 active:translate-y-1 transition"
          >
            <span className="text-2xl block mb-1">⚠️</span>
            <span className="text-xs font-bold text-rose-800 block">Sanción</span>
          </button>

          <button
            onClick={onOpenRewardLock}
            className="p-3.5 rounded-squircle-md bg-white border-2 border-amber-200 shadow-chunky-gold text-center hover:bg-amber-50 active:translate-y-1 transition"
          >
            <span className="text-2xl block mb-1">🔒</span>
            <span className="text-xs font-bold text-amber-800 block">Bloquear Premio</span>
          </button>

          <button
            onClick={() => setActiveParentTab('library')}
            className="p-3.5 rounded-squircle-md bg-white border-2 border-sky-200 shadow-chunky-sky text-center hover:bg-sky-50 active:translate-y-1 transition"
          >
            <span className="text-2xl block mb-1">📚</span>
            <span className="text-xs font-bold text-sky-800 block">Biblioteca</span>
          </button>
        </div>
      </div>

      {/* 5. Widget de Bloqueos Activos */}
      {lockedRewards.length > 0 && (
        <GlassCard className="p-4 border-2 border-red-200 bg-red-50/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-red-800">
              <Lock size={15} />
              <span>Restricciones de Premios Activas ({lockedRewards.length})</span>
            </div>
            <button
              onClick={() => setActiveParentTab('rewards')}
              className="text-[11px] font-bold text-red-700 hover:underline"
            >
              Gestionar
            </button>
          </div>

          <div className="space-y-1.5">
            {lockedRewards.map(lr => (
              <div
                key={lr.id}
                className="flex items-center justify-between p-2 rounded-squircle-sm bg-white border border-red-200 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <span>{lr.iconSvg}</span>
                  <span>{lr.title}</span>
                </div>
                <span className="text-[11px] font-semibold text-red-600">
                  {lr.lockUntil ? `Hasta ${lr.lockUntil}` : 'Indefinido'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 6. Feed de Actividad Reciente & Enlace a Calendario de Auditoría */}
      <GlassCard className="p-4 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h4 className="font-extrabold text-sm text-[#1E3A5F] flex items-center gap-1.5">
            <Calendar size={16} className="text-slate-500" />
            <span>Auditoría & Calendario Histórico</span>
          </h4>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Revisa días anteriores, tareas realizadas vs omitidas y utiliza las herramientas de corrección retroactiva para revocar o reembolsar puntos.
        </p>

        <button
          onClick={() => setActiveParentTab('calendar')}
          className="w-full py-2.5 px-4 rounded-squircle-md bg-slate-800 text-white text-xs font-bold shadow-chunky-slate flex items-center justify-center gap-2 hover:bg-slate-700 active:translate-y-0.5 transition"
        >
          <span>📅 Ver Calendario Completo e Historial de Auditoría</span>
          <ArrowRight size={14} />
        </button>
      </GlassCard>

    </div>
  );
};
