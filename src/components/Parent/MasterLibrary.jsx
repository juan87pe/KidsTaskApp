import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Plus, Zap, Trash2, Edit2, CheckCircle2, ChevronRight, Calendar, Users, ChevronDown, ChevronUp, UserCheck, X } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';
import { UnassignOrPauseModal } from './UnassignOrPauseModal';

export const MasterLibrary = ({ onOpenCreateTask, onOpenCreateRoutine, onAssignTaskToChild, onInjectRoutineToChild }) => {
  const { data, deleteMasterTask, deleteMasterRoutine, unassignChildFromTask } = useApp();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'routines'
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [unassignModalState, setUnassignModalState] = useState({
    isOpen: false,
    task: null,
    child: null,
    assignment: null
  });

  const toggleTaskExpand = (taskId) => {
    setExpandedTaskId(prev => prev === taskId ? null : taskId);
  };

  const handleOpenUnassign = (task, child, assignment) => {
    setUnassignModalState({
      isOpen: true,
      task,
      child,
      assignment
    });
  };

  const handleConfirmUnassign = ({ scope, pauseDays, pauseUntil }) => {
    if (unassignModalState.task && unassignModalState.child) {
      unassignChildFromTask(unassignModalState.task.id, unassignModalState.child.id, {
        scope,
        pauseDays,
        pauseUntil
      });
    }
    setUnassignModalState({ isOpen: false, task: null, child: null, assignment: null });
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E3A5F]">
            📚 Biblioteca Familiar
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Banco central de tareas y plantillas de rutinas reutilizables
          </p>
        </div>

        {activeTab === 'tasks' ? (
          <ChunkyButton
            variant="sky"
            size="sm"
            onClick={onOpenCreateTask}
            className="text-xs font-bold"
          >
            <Plus size={15} /> Nueva Tarea Maestra
          </ChunkyButton>
        ) : (
          <ChunkyButton
            variant="gold"
            size="sm"
            onClick={onOpenCreateRoutine}
            className="text-xs font-bold"
          >
            <Plus size={15} /> Nueva Rutina
          </ChunkyButton>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-squircle-md border border-slate-300 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 rounded-squircle-sm text-xs font-extrabold transition ${
            activeTab === 'tasks'
              ? 'bg-[#1E3A5F] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Banco de Tareas ({data.masterTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('routines')}
          className={`flex-1 py-2 rounded-squircle-sm text-xs font-extrabold transition ${
            activeTab === 'routines'
              ? 'bg-[#1E3A5F] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Plantillas de Rutinas ({data.masterRoutines.length})
        </button>
      </div>

      {/* Pestaña 1: Banco de Tareas Maestras */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {data.masterTasks.map(task => {
            const isExpanded = expandedTaskId === task.id;
            const parentRoutines = data.masterRoutines.filter(r =>
              r.tasks.some(rt => rt.masterTaskId === task.id || rt.title?.toLowerCase() === task.title?.toLowerCase())
            );
            const assignedList = task.assignedChildren || [];

            return (
              <GlassCard
                key={task.id}
                className="p-4 border-2 border-slate-200 hover:border-sky-300 transition"
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => toggleTaskExpand(task.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-squircle-md bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-inner">
                      {task.iconSvg || '🎯'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-[#1E3A5F]">
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-extrabold text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          ⭐ +{task.defaultPoints} pts
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {task.category}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {task.defaultApprovalMode === 'kid_request' ? 'Pedir visto bueno' : 'Solo padres'}
                        </span>
                        {/* Routine Badges [REQ-LIB-010] */}
                        {parentRoutines.map(r => (
                          <span
                            key={r.id}
                            className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1"
                          >
                            🏷️ {r.title}
                          </span>
                        ))}
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-squircle-sm border border-slate-100">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex flex-col sm:flex-row items-end sm:items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChunkyButton
                      variant="sky"
                      size="sm"
                      onClick={() => onAssignTaskToChild(task)}
                      className="text-xs font-bold whitespace-nowrap"
                    >
                      🚀 Asignar Tarea
                    </ChunkyButton>

                    <button
                      onClick={() => deleteMasterTask(task.id)}
                      className="p-2 rounded-squircle-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Eliminar de catálogo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Visor interactivo de asignaciones activas [REQ-LIB-007] [REQ-LIB-008] */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-200/80 bg-slate-50/80 -mx-4 -mb-4 p-4 rounded-b-squircle-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-extrabold text-[#1E3A5F] flex items-center gap-1.5 uppercase tracking-wider">
                        <Users size={14} className="text-sky-600" />
                        <span>Ficha de Asignaciones Activas ({assignedList.length})</span>
                      </h5>
                      <ChunkyButton
                        variant="sky"
                        size="sm"
                        onClick={() => onAssignTaskToChild(task)}
                        className="text-[11px] font-bold py-1 px-2.5"
                      >
                        🚀 Asignar a un nuevo hijo
                      </ChunkyButton>
                    </div>

                    {assignedList.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium">
                        Sin asignaciones activas para esta tarea.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {assignedList.map((ac, idx) => {
                          const childId = ac.childId || ac;
                          const child = data.children.find(c => c.id === childId);
                          const scheduleLabel = ac.scheduleText || 'Diaria continua';

                          const isPaused = ac.isPaused || (ac.pausedUntil && new Date(ac.pausedUntil) >= new Date());
                          const isSkippedToday = ac.skippedToday;

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-squircle-sm bg-white border border-slate-200 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{child?.avatar || '🧒'}</span>
                                <div>
                                  <span className="font-extrabold text-slate-800">{child?.name}: </span>
                                  <span className="font-semibold text-slate-600">{scheduleLabel}</span>
                                  {isPaused && (
                                    <span className="ml-2 font-extrabold text-[10px] text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      ⏸️ Pausada hasta {ac.pausedUntil}
                                    </span>
                                  )}
                                  {isSkippedToday && !isPaused && (
                                    <span className="ml-2 font-extrabold text-[10px] text-sky-800 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      ⏭️ Omitida hoy
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => handleOpenUnassign(task, child, ac)}
                                className="px-2.5 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs transition flex items-center gap-1"
                              >
                                <X size={12} />
                                <span>❌ Desasignar / Pausar</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Pestaña 2: Plantillas de Rutinas */}
      {activeTab === 'routines' && (
        <div className="space-y-4">
          {data.masterRoutines.map(routine => (
            <GlassCard key={routine.id} className="p-5 border-2 border-amber-200 bg-amber-50/30">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-squircle-md bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
                    {routine.icon || '🚀'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#1E3A5F]">
                      {routine.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {routine.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChunkyButton
                    variant="gold"
                    size="sm"
                    onClick={() => onInjectRoutineToChild(routine)}
                    className="text-xs font-bold whitespace-nowrap"
                  >
                    🚀 Inyectar {routine.title}
                  </ChunkyButton>

                  <button
                    onClick={() => deleteMasterRoutine(routine.id)}
                    className="p-2 rounded-squircle-sm text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Eliminar rutina"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Sequential Steps in Routine */}
              <div className="space-y-1.5 pl-2 border-l-2 border-amber-300">
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Secuencia de tareas ({routine.tasks.length} pasos):
                </p>
                {routine.tasks.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2 rounded-squircle-sm border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{t.iconSvg}</span>
                    <span>{t.title}</span>
                    <span className="ml-auto font-bold text-amber-700">+{t.points} ⭐</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Modal Contextual de Desasignación o Pausa [REQ-LIB-008] */}
      <UnassignOrPauseModal
        isOpen={unassignModalState.isOpen}
        onClose={() => setUnassignModalState({ isOpen: false, task: null, child: null, assignment: null })}
        task={unassignModalState.task}
        child={unassignModalState.child}
        assignment={unassignModalState.assignment}
        onConfirm={handleConfirmUnassign}
      />

    </div>
  );
};
