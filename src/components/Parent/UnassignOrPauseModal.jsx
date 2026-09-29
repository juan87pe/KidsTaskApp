import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { Calendar, Check, Clock, AlertTriangle, PauseCircle, Trash2, CalendarX2 } from 'lucide-react';

export const UnassignOrPauseModal = ({
  isOpen,
  onClose,
  task,
  child,
  assignment,
  onConfirm
}) => {
  const scheduleType = assignment?.scheduleType || 'daily';
  const scheduleDetails = assignment?.scheduleDetails || '';
  const scheduleText = assignment?.scheduleText || 'Diaria continua';

  // State
  const [selectedScope, setSelectedScope] = useState('today'); // 'today' | 'pause' | 'permanent'
  const [pauseDays, setPauseDays] = useState(3);

  useEffect(() => {
    if (scheduleType === 'specific_date' || scheduleType === 'today') {
      setSelectedScope('permanent');
    } else {
      setSelectedScope('today');
    }
    setPauseDays(3);
  }, [scheduleType, isOpen]);

  if (!isOpen || !task || !child) return null;

  // Calculate resume date
  const resumeDate = new Date();
  resumeDate.setDate(resumeDate.getDate() + Number(pauseDays));
  const resumeDateStr = resumeDate.toISOString().split('T')[0];
  const formattedResumeDate = resumeDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const handleConfirm = () => {
    onConfirm({
      scope: selectedScope,
      pauseDays: Number(pauseDays),
      pauseUntil: resumeDateStr
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚙️ Desasignar o Pausar Tarea"
      subtitle={`Elige el alcance de la modificación para ${child.name}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 select-none">
        
        {/* Resumen de Tarea y Programación Actual */}
        <div className="p-3.5 rounded-squircle-md bg-slate-100 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{task.iconSvg || '🎯'}</span>
            <div>
              <h4 className="font-extrabold text-sm text-[#1E3A5F]">{task.title}</h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold">
                  <span>{child.avatar || '🧒'}</span>
                  <span>{child.name}</span>
                </span>
                <span>•</span>
                <span className="bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 rounded-full text-[11px]">
                  📅 {scheduleText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje contextual */}
        <p className="text-xs font-semibold text-slate-600">
          ¿Cómo deseas aplicar esta desasignación o pausa según la programación de la tarea?
        </p>

        {/* Opciones según scheduleType */}
        <div className="space-y-2">

          {/* CASO: Diaria Continua */}
          {scheduleType === 'daily' && (
            <>
              {/* Opción 1: Solo por hoy */}
              <button
                type="button"
                onClick={() => setSelectedScope('today')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition flex items-start justify-between ${
                  selectedScope === 'today'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-[#1E3A5F]">
                      🔘 Solo por el día de hoy
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Se quita de la lista de tareas de hoy de {child.name}. Mañana volverá a aparecer automáticamente.
                  </p>
                </div>
                {selectedScope === 'today' && <Check size={18} className="text-sky-600 shrink-0 mt-0.5" />}
              </button>

              {/* Opción 2: Pausar temporalmente por N días */}
              <div
                onClick={() => setSelectedScope('pause')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition cursor-pointer space-y-2.5 ${
                  selectedScope === 'pause'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs text-amber-900 block">
                      ⚪ Pausar temporalmente por varios días
                    </span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Suspende la aparición de la tarea durante una cantidad configurable de días.
                    </p>
                  </div>
                  {selectedScope === 'pause' && <Check size={18} className="text-amber-600 shrink-0 mt-0.5" />}
                </div>

                {selectedScope === 'pause' && (
                  <div
                    className="p-3 bg-white rounded-squircle-sm border border-amber-200 space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[11px] font-extrabold text-slate-700 block">
                      Selecciona la cantidad de días de suspensión:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {[1, 2, 3, 5, 7, 14].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setPauseDays(d)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                            pauseDays === d
                              ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {d} {d === 1 ? 'día' : 'días'}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] font-semibold text-amber-800 bg-amber-100/60 p-2 rounded-squircle-sm">
                      🕒 Se reactivará automáticamente el: <strong>{formattedResumeDate}</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Opción 3: Desasignar permanente de futuras asignaciones */}
              <button
                type="button"
                onClick={() => setSelectedScope('permanent')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition flex items-start justify-between ${
                  selectedScope === 'permanent'
                    ? 'border-rose-400 bg-rose-50/80 text-rose-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-rose-900 block">
                    ⚪ Desasignar de todas las futuras asignaciones (Permanente)
                  </span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Cancela de forma definitiva la regla de asignación diaria para {child.name}. La plantilla seguirá en la biblioteca.
                  </p>
                </div>
                {selectedScope === 'permanent' && <Check size={18} className="text-rose-600 shrink-0 mt-0.5" />}
              </button>
            </>
          )}

          {/* CASO: Semanal / Días Fijos */}
          {scheduleType === 'weekly' && (
            <>
              {/* Opción 1: Solo por esta ocurrencia / hoy */}
              <button
                type="button"
                onClick={() => setSelectedScope('today')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition flex items-start justify-between ${
                  selectedScope === 'today'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-[#1E3A5F] block">
                    🔘 Solo por la ocurrencia de hoy / este día ({scheduleDetails || 'día programado'})
                  </span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Se omite únicamente la asignación de este día, manteniendo intactos los siguientes días fijados de las próximas semanas.
                  </p>
                </div>
                {selectedScope === 'today' && <Check size={18} className="text-sky-600 shrink-0 mt-0.5" />}
              </button>

              {/* Opción 2: Pausar temporalmente */}
              <div
                onClick={() => setSelectedScope('pause')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition cursor-pointer space-y-2.5 ${
                  selectedScope === 'pause'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs text-amber-900 block">
                      ⚪ Pausar temporalmente por varias semanas / días
                    </span>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Suspende las ocurrencias semanales hasta una fecha determinada.
                    </p>
                  </div>
                  {selectedScope === 'pause' && <Check size={18} className="text-amber-600 shrink-0 mt-0.5" />}
                </div>

                {selectedScope === 'pause' && (
                  <div
                    className="p-3 bg-white rounded-squircle-sm border border-amber-200 space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[11px] font-extrabold text-slate-700 block">
                      Selecciona la cantidad de días de suspensión:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {[7, 14, 21, 30].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setPauseDays(d)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                            pauseDays === d
                              ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {d} días ({d / 7} {d === 7 ? 'semana' : 'semanas'})
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] font-semibold text-amber-800 bg-amber-100/60 p-2 rounded-squircle-sm">
                      🕒 Se reanudará el: <strong>{formattedResumeDate}</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Opción 3: Desasignar permanente de los días fijados */}
              <button
                type="button"
                onClick={() => setSelectedScope('permanent')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition flex items-start justify-between ${
                  selectedScope === 'permanent'
                    ? 'border-rose-400 bg-rose-50/80 text-rose-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-rose-900 block">
                    ⚪ Desasignar permanentemente de los días programados ({scheduleDetails || 'semanales'})
                  </span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Cancela de forma permanente la recurrencia semanal fijada para {child.name}.
                  </p>
                </div>
                {selectedScope === 'permanent' && <Check size={18} className="text-rose-600 shrink-0 mt-0.5" />}
              </button>
            </>
          )}

          {/* CASO: Rango de Fechas / Período */}
          {scheduleType === 'date_range' && (
            <>
              <button
                type="button"
                onClick={() => setSelectedScope('today')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition flex items-start justify-between ${
                  selectedScope === 'today'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-[#1E3A5F] block">
                    🔘 Omitir solo por el día de hoy
                  </span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Se suspende solo para hoy; seguirá activa durante el resto del período ({scheduleDetails}).
                  </p>
                </div>
                {selectedScope === 'today' && <Check size={18} className="text-sky-600 shrink-0 mt-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedScope('permanent')}
                className={`w-full p-3 rounded-squircle-md border-2 text-left transition flex items-start justify-between ${
                  selectedScope === 'permanent'
                    ? 'border-rose-400 bg-rose-50/80 text-rose-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-rose-900 block">
                    ⚪ Cancelar todo el período restante
                  </span>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Cancela la asignación de este período por completo para {child.name}.
                  </p>
                </div>
                {selectedScope === 'permanent' && <Check size={18} className="text-rose-600 shrink-0 mt-0.5" />}
              </button>
            </>
          )}

          {/* CASO: Fecha Específica o Hoy */}
          {(scheduleType === 'specific_date' || scheduleType === 'today') && (
            <button
              type="button"
              onClick={() => setSelectedScope('permanent')}
              className="w-full p-3 rounded-squircle-md border-2 border-rose-400 bg-rose-50/80 text-rose-950 font-bold text-left flex items-start justify-between"
            >
              <div className="space-y-0.5">
                <span className="font-extrabold text-xs text-rose-900 block">
                  🔘 Eliminar asignación de esta fecha ({scheduleDetails || 'Hoy'})
                </span>
                <p className="text-[11px] text-slate-500 font-normal">
                  Retira la tarea asignada puntualmente para este día.
                </p>
              </div>
              <Check size={18} className="text-rose-600 shrink-0 mt-0.5" />
            </button>
          )}

        </div>

        {/* Universal Invariant Notice */}
        <div className="p-2.5 rounded-squircle-sm bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
          <span>🛡️</span>
          <span>
            <strong>Garantía de Biblioteca:</strong> La plantilla maestra "{task.title}" nunca se eliminará del catálogo familiar y seguirá disponible para otros hijos o futuras asignaciones.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-squircle-sm border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
          >
            Cancelar
          </button>

          <ChunkyButton
            variant={selectedScope === 'permanent' ? 'rose' : selectedScope === 'pause' ? 'gold' : 'sky'}
            size="sm"
            onClick={handleConfirm}
            className="text-xs font-bold"
          >
            {selectedScope === 'permanent'
              ? '❌ Confirmar Desasignación'
              : selectedScope === 'pause'
              ? `⏸️ Pausar por ${pauseDays} días`
              : '✅ Omitir solo por hoy'}
          </ChunkyButton>
        </div>

      </div>
    </Modal>
  );
};
