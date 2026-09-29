import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Plus, Zap, Trash2, Edit2, CheckCircle2, ChevronRight, Calendar, Users } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const MasterLibrary = ({ onOpenCreateTask, onOpenCreateRoutine, onAssignTaskToChild, onInjectRoutineToChild }) => {
  const { data, deleteMasterTask, deleteMasterRoutine } = useApp();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'routines'

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
          {data.masterTasks.map(task => (
            <GlassCard key={task.id} className="p-4 border-2 border-slate-200 hover:border-sky-300 transition">
              <div className="flex items-start justify-between gap-3">
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
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-squircle-sm border border-slate-100">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <ChunkyButton
                    variant="sky"
                    size="sm"
                    onClick={() => onAssignTaskToChild(task)}
                    className="text-xs font-bold whitespace-nowrap"
                  >
                    🚀 Asignar a Hijo
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
            </GlassCard>
          ))}
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
                    🚀 Inyectar Rutina
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

    </div>
  );
};
