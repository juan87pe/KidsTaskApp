import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, CheckCircle2, Clock, Shield, Sparkles, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const KidDashboard = () => {
  const { data, activeChild, markTaskAsRequestedByKid, openParentGate, logoutToProfileSelect } = useApp();
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleNote = (taskId) => {
    setExpandedNotes(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Get tasks for this child sorted by sequential order
  const myTasks = data.todayAssignments
    .filter(a => a.childId === activeChild.id)
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  const completedCount = myTasks.filter(t => t.status === 'approved').length;

  return (
    <div className="space-y-5 max-w-md mx-auto pb-24 select-none">
      
      {/* Top Bar / Kid Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl border-4 bg-white shadow-md cursor-pointer hover:scale-105 transition"
            style={{ borderColor: activeChild.colorTheme }}
            onClick={logoutToProfileSelect}
            title="Cambiar de perfil"
          >
            {activeChild.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-extrabold text-[#1E3A5F]">
                ¡Hola, {activeChild.name}!
              </h2>
              <span className="text-sm">👋</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              {activeChild.level}
            </span>
          </div>
        </div>

        {/* Parent Mode Quick Switcher */}
        <button
          onClick={() => openParentGate('parent_dash')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-squircle-sm bg-slate-800 text-white text-xs font-bold shadow-chunky-slate hover:bg-slate-700 active:translate-y-0.5 transition"
        >
          <Lock size={13} className="text-[#88D1F1]" />
          <span>Padres</span>
        </button>
      </div>

      {/* Points Banner Card */}
      <GlassCard variant="gold" className="relative overflow-hidden p-5 border-2 border-amber-300">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Tus Estrellas Acumuladas ⭐
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-[#78350F]">
                {activeChild.currentPoints}
              </span>
              <span className="text-lg font-bold text-amber-700">Puntos</span>
            </div>
            <p className="text-xs font-medium text-amber-800/80 mt-1">
              ¡Sigue completando tareas para canjear increíbles premios!
            </p>
          </div>

          <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-inner animate-subtle-bounce">
            ⭐
          </div>
        </div>

        {/* Progress Bar for Today */}
        <div className="mt-4 pt-3 border-t border-amber-200/80">
          <div className="flex justify-between text-xs font-bold text-amber-900 mb-1.5">
            <span>Progreso de Hoy</span>
            <span>{completedCount} de {myTasks.length} listas</span>
          </div>
          <div className="w-full h-3.5 bg-white rounded-full overflow-hidden p-0.5 border border-amber-300">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-[#48BB78] rounded-full transition-all duration-500"
              style={{ width: `${myTasks.length ? (completedCount / myTasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Tasks Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          <h3 className="text-lg font-extrabold text-[#1E3A5F]">
            Tus Tareas para Hoy
          </h3>
        </div>
        <span className="text-xs font-bold text-slate-400">
          En orden cronológico ⏱️
        </span>
      </div>

      {/* Task Cards List (Sequential Order) */}
      <div className="space-y-3">
        {myTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-squircle-lg border-2 border-dashed border-slate-200">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="font-bold text-[#1E3A5F]">¡No tienes tareas pendientes para hoy!</p>
            <p className="text-xs text-slate-400 mt-1">Descansa o pide a tus papás una rutina.</p>
          </div>
        ) : (
          myTasks.map((task, idx) => {
            const isApproved = task.status === 'approved';
            const isRequested = task.status === 'requested';
            const isPending = task.status === 'pending';
            const isExpanded = expandedNotes[task.id];

            return (
              <GlassCard
                key={task.id}
                className={`border-2 transition-all duration-200 ${
                  isApproved
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : isRequested
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Task Icon & Sequential Number */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-squircle-md bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-inner">
                        {task.iconSvg || '⭐'}
                      </div>
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#1E3A5F] text-white text-[10px] font-bold flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className={`font-bold text-base ${isApproved ? 'line-through text-slate-400' : 'text-[#1E3A5F]'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 font-bold text-xs text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                          ⭐ +{task.points} pts
                        </span>
                        {task.note && (
                          <button
                            onClick={() => toggleNote(task.id)}
                            className="text-[11px] font-bold text-sky-700 hover:underline flex items-center gap-0.5"
                          >
                            <span>ℹ️ Ver detalle / nota</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status / Action Button */}
                  <div className="flex items-center">
                    {isApproved && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-squircle-sm bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>¡Lista!</span>
                      </div>
                    )}

                    {isRequested && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-squircle-sm bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold animate-pulse">
                        <Clock size={15} />
                        <span>Esperando a papá/mamá ⏳</span>
                      </div>
                    )}

                    {isPending && task.approvalMode === 'kid_request' && (
                      <ChunkyButton
                        variant="sky"
                        size="sm"
                        onClick={() => markTaskAsRequestedByKid(task.id)}
                        className="font-bold text-xs"
                      >
                        ¡Ya la hice! 🚀
                      </ChunkyButton>
                    )}

                    {isPending && task.approvalMode === 'parent_only' && (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-squircle-sm border border-slate-200">
                        Marca Papá 👨
                      </span>
                    )}
                  </div>
                </div>

                {/* Optional Expandable Note / Instruction */}
                {task.note && isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-squircle-sm border border-amber-200/60">
                    <p className="font-semibold text-amber-900">📝 Nota de tus papás:</p>
                    <p className="mt-0.5">{task.note}</p>
                  </div>
                )}
              </GlassCard>
            );
          })
        )}
      </div>

    </div>
  );
};
