import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUp, ArrowDown, Trash2, CheckCircle2, Clock, Plus, BookOpen, Zap, Calendar, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const ChildDailyControlView = ({ onOpenInjectRoutine, onOpenQuickTask, onOpenAssignMaster }) => {
  const {
    data,
    controlChild,
    activeChildControlId,
    setActiveChildControlId,
    setActiveParentTab,
    toggleTaskDirectly,
    moveTaskOrder,
    removeTaskFromDay
  } = useApp();

  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleNote = (id) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Get current child tasks sorted by orderIndex
  const tasks = data.todayAssignments
    .filter(a => a.childId === activeChildControlId)
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-24 select-none">
      
      {/* Top Bar with Child Context & Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-squircle-lg border-2 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl border-3 shadow-inner"
            style={{ backgroundColor: controlChild.bgColor, borderColor: controlChild.colorTheme }}
          >
            {controlChild.avatar}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E3A5F]">
              Ficha Diaria: {controlChild.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-extrabold text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                ⭐ {controlChild.currentPoints} Puntos
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {tasks.filter(t => t.status === 'approved').length}/{tasks.length} listas hoy
              </span>
            </div>
          </div>
        </div>

        {/* Child Selector Pills & Calendar link */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-squircle-sm border border-slate-200">
            {data.children.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveChildControlId(c.id)}
                className={`px-3 py-1 text-xs font-bold rounded-squircle-sm transition ${
                  activeChildControlId === c.id
                    ? 'bg-[#1E3A5F] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.avatar} {c.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveParentTab('calendar')}
            className="p-2 rounded-squircle-sm bg-white border border-slate-200 text-slate-600 hover:text-sky-600 shadow-sm transition"
            title="Calendario"
          >
            <Calendar size={16} />
          </button>
        </div>
      </div>

      {/* Action Toolbar to Assign Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <ChunkyButton
          variant="sky"
          size="sm"
          onClick={() => onOpenAssignMaster(activeChildControlId)}
          className="text-xs font-bold"
        >
          <BookOpen size={14} /> Asignar Tarea Maestra
        </ChunkyButton>

        <ChunkyButton
          variant="gold"
          size="sm"
          onClick={() => onOpenInjectRoutine(activeChildControlId)}
          className="text-xs font-bold"
        >
          <Zap size={14} /> Inyectar Rutina
        </ChunkyButton>

        <ChunkyButton
          variant="gray"
          size="sm"
          onClick={() => onOpenQuickTask(activeChildControlId)}
          className="text-xs font-bold"
        >
          <Plus size={14} /> Tarea Rápida Única
        </ChunkyButton>
      </div>

      {/* Header of Tasks List with Reordering info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-extrabold text-[#1E3A5F]">
            Secuencia Diaria de Tareas
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Reordena el orden de ejecución con las flechas (▲ / ▼)
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {tasks.length} Tareas Asignadas
        </span>
      </div>

      {/* Tasks List with Sequential Controls */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-squircle-lg border-2 border-dashed border-slate-200">
            <span className="text-3xl block mb-2">📋</span>
            <p className="font-bold text-[#1E3A5F]">No hay tareas asignadas para hoy</p>
            <p className="text-xs text-slate-400 mt-1">Usa los botones superiores para asignar tareas o inyectar una rutina.</p>
          </div>
        ) : (
          tasks.map((task, idx) => {
            const isApproved = task.status === 'approved';
            const isRequested = task.status === 'requested';
            const isExpanded = expandedNotes[task.id];

            return (
              <GlassCard
                key={task.id}
                className={`border-2 transition ${
                  isApproved
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : isRequested
                    ? 'bg-amber-50/60 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  
                  {/* Order Index & Icon & Details */}
                  <div className="flex items-center gap-3">
                    
                    {/* Up/Down Reorder Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveTaskOrder(task.id, 'up')}
                        className={`p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition ${
                          idx === 0 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Subir orden"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        disabled={idx === tasks.length - 1}
                        onClick={() => moveTaskOrder(task.id, 'down')}
                        className={`p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition ${
                          idx === tasks.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Bajar orden"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    {/* Sequential Number & Icon */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-squircle-md bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                        {task.iconSvg || '🎯'}
                      </div>
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#1E3A5F] text-white text-[10px] font-bold flex items-center justify-center shadow">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Task Title & Info */}
                    <div>
                      <h4 className={`font-bold text-base ${isApproved ? 'text-slate-500 line-through' : 'text-[#1E3A5F]'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-extrabold text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          ⭐ +{task.points} pts
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {task.approvalMode === 'kid_request' ? 'Pedir visto bueno' : 'Solo padres'}
                        </span>
                        {task.note && (
                          <button
                            onClick={() => toggleNote(task.id)}
                            className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-0.5"
                          >
                            <span>ℹ️ Ver detalle / nota</span>
                            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Direct Check / Delete) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTaskDirectly(task.id)}
                      className={`px-3 py-1.5 rounded-squircle-sm text-xs font-bold border-2 transition ${
                        isApproved
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : isRequested
                          ? 'bg-amber-400 text-amber-900 border-amber-500 shadow-sm animate-pulse'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                      }`}
                    >
                      {isApproved ? 'Aprobada ✔️' : isRequested ? 'Validar ⏳' : 'Marcar'}
                    </button>

                    <button
                      onClick={() => removeTaskFromDay(task.id)}
                      className="p-2 rounded-squircle-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Quitar de hoy"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Note Drawer */}
                {task.note && isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-squircle-sm">
                    <p className="font-semibold text-slate-700">Instrucciones:</p>
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
