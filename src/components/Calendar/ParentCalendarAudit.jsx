import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, RefreshCw, RotateCcw, AlertTriangle, Users, Star, Gift, ShieldAlert } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const ParentCalendarAudit = () => {
  const {
    data,
    activeChildControlId,
    setActiveChildControlId,
    modifyPastTaskValidation,
    refundPastRedemption,
    revertPastBonusOrPenalty
  } = useApp();

  const history = data.calendarHistory || {};
  const availableDates = Object.keys(history).sort().reverse();
  const daysList = availableDates.length > 0 ? availableDates : ['2026-08-25', '2026-08-24', '2026-08-23'];

  const [selectedDate, setSelectedDate] = useState(daysList[0]);

  const targetChild = data.children.find(c => c.id === activeChildControlId) || data.children[0];
  const dayData = history[selectedDate]?.[targetChild.id];

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 select-none">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E3A5F] flex items-center gap-2">
            <span>📅 Calendario & Auditoría Retroactiva</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Supervisa el historial por fecha y corrige validaciones erróneas o reembolsa canjes
          </p>
        </div>

        {/* Child Selector Pills */}
        <div className="flex bg-slate-100 p-1 rounded-squircle-sm border border-slate-200">
          {data.children.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveChildControlId(c.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-squircle-sm transition ${
                activeChildControlId === c.id
                  ? 'bg-[#1E3A5F] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.avatar} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mini-Calendario con Mapa de Calor */}
      <GlassCard className="p-4 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-600">
          <span>Agosto 2026</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700">🟢 Completo</span>
            <span className="flex items-center gap-1 text-amber-700">🟡 Parcial</span>
            <span className="flex items-center gap-1 text-rose-700">🔴 Sanción/Omisión</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {daysList.map(dateStr => {
            const entry = history[dateStr]?.[targetChild.id];
            const isSelected = selectedDate === dateStr;
            const isFull = entry?.status === 'full';
            const isPartial = entry?.status === 'partial';

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-3.5 rounded-squircle-md border-2 text-center transition-all ${
                  isSelected
                    ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white shadow-md scale-102'
                    : isFull
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-400'
                    : isPartial
                    ? 'border-amber-300 bg-amber-50 text-amber-900 hover:border-amber-400'
                    : 'border-rose-300 bg-rose-50 text-rose-900 hover:border-rose-400'
                }`}
              >
                <span className="text-xs font-bold block opacity-80">
                  {dateStr.split('-')[2]} Ago 2026
                </span>
                <span className="text-2xl block my-1">
                  {isFull ? '🟢' : isPartial ? '🟡' : '🔴'}
                </span>
                <span className="text-xs font-extrabold block">
                  +{entry?.netPoints || 0} pts
                </span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Detalle del Día Seleccionado y Poderes de Corrección */}
      <GlassCard className="p-5 border-2 border-slate-200">
        
        {/* Day Header & Financial summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">
              Auditoría del Día Seleccionado
            </span>
            <h3 className="text-xl font-extrabold text-[#1E3A5F]">
              {selectedDate} ({targetChild.name})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
              ⭐ Balance Neto: +{dayData?.netPoints || 0} pts
            </span>
            {((dayData?.penaltiesList?.length || 0) > 0 || (dayData?.penalties || 0) > 0) && (
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-extrabold text-xs">
                ⚠️ Sanciones registradas
              </span>
            )}
          </div>
        </div>

        {/* Tareas del Día y Botones de Corrección */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider">
            Tareas Realizadas vs Omitidas:
          </p>

          {dayData?.tasks?.map(task => {
            const isApproved = task.status === 'approved';

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-squircle-sm border-2 flex items-center justify-between gap-3 ${
                  isApproved
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isApproved ? (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-rose-500 shrink-0" />
                  )}
                  <div>
                    <h5 className="font-bold text-sm text-[#1E3A5F]">
                      {task.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-bold text-amber-700">+{task.points} pts</span>
                      <span>•</span>
                      <span>{isApproved ? `Aprobado por ${task.approvedBy || 'Papás'}` : 'No realizada'}</span>
                      {task.isRetroactivelyModified && (
                        <span className="text-purple-600 font-bold bg-purple-100 px-1.5 rounded">
                          Modificado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Retroactive Action Button */}
                <button
                  onClick={() => modifyPastTaskValidation(selectedDate, targetChild.id, task.id)}
                  className={`px-3 py-1.5 rounded-squircle-sm text-xs font-bold border flex items-center gap-1 shadow-sm transition ${
                    isApproved
                      ? 'bg-white border-rose-300 text-rose-700 hover:bg-rose-50'
                      : 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600'
                  }`}
                  title="Cambiar estado de aprobación y recalcular puntos"
                >
                  <RefreshCw size={13} />
                  <span>{isApproved ? 'Modificar Validación / Desmarcar (-' + task.points + ')' : 'Validar como Realizada Ahora (+' + task.points + ')'}</span>
                </button>
              </div>
            );
          })}

          {(!dayData?.tasks || dayData.tasks.length === 0) && (
            <p className="text-xs text-slate-400 italic">No hay registros de tareas en esta fecha.</p>
          )}
        </div>

        {/* Bonos Especiales en esta Fecha */}
        {dayData?.bonuses && dayData.bonuses.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
            <p className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">
              Bonos Rápidos Especiales en esta Fecha:
            </p>

            {dayData.bonuses.map(b => (
              <div
                key={b.id}
                className="p-3.5 rounded-squircle-sm border-2 border-amber-200 bg-amber-50/40 flex items-center justify-between gap-3"
              >
                <div>
                  <h5 className="font-bold text-sm text-[#1E3A5F]">
                    ⭐ {b.reason || 'Bono especial'}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Puntos: <strong className="text-amber-700">+{b.points} pts</strong> • {b.timestamp ? new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>

                {b.isReversed ? (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-squircle-sm border border-slate-200">
                    ↩️ Bono Anulado (-{b.points} pts)
                  </span>
                ) : (
                  <button
                    onClick={() => revertPastBonusOrPenalty(selectedDate, targetChild.id, b.id, 'bonus')}
                    className="px-3 py-1.5 rounded-squircle-sm bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold shadow-sm flex items-center gap-1 transition"
                  >
                    <RotateCcw size={13} />
                    <span>Anular Bono (-{b.points})</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sanciones Disciplinarias en esta Fecha */}
        {dayData?.penaltiesList && dayData.penaltiesList.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
            <p className="text-xs font-extrabold text-rose-700 uppercase tracking-wider">
              Sanciones Disciplinarias en esta Fecha:
            </p>

            {dayData.penaltiesList.map(p => (
              <div
                key={p.id}
                className="p-3.5 rounded-squircle-sm border-2 border-rose-200 bg-rose-50/40 flex items-center justify-between gap-3"
              >
                <div>
                  <h5 className="font-bold text-sm text-[#1E3A5F]">
                    ⚠️ {p.reason || 'Sanción disciplinaria'}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Descuento: <strong className="text-rose-700">{p.points} pts</strong> • {p.timestamp ? new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>

                {p.isReversed ? (
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-squircle-sm border border-slate-200">
                    ↩️ Sanción Anulada (+{Math.abs(p.points)} pts devueltos)
                  </span>
                ) : (
                  <button
                    onClick={() => revertPastBonusOrPenalty(selectedDate, targetChild.id, p.id, 'penalty')}
                    className="px-3 py-1.5 rounded-squircle-sm bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 text-xs font-bold shadow-sm flex items-center gap-1 transition"
                  >
                    <RotateCcw size={13} />
                    <span>Anular Sanción (+{Math.abs(p.points)})</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Premios Canjeados y Reembolsos */}
        {dayData?.redemptions && dayData.redemptions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
            <p className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
              Canjes de Premios en esta Fecha:
            </p>

            {dayData.redemptions.map(red => (
              <div
                key={red.id}
                className="p-3.5 rounded-squircle-sm border-2 border-purple-200 bg-purple-50/40 flex items-center justify-between gap-3"
              >
                <div>
                  <h5 className="font-bold text-sm text-[#1E3A5F]">
                    🎁 {red.rewardTitle}
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Costo: <strong className="text-purple-700">-{red.pointsCost} pts</strong> • {red.redeemedAt}
                  </p>
                </div>

                {red.isRefunded ? (
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-squircle-sm border border-purple-200">
                    ↩️ Reembolsado (+{red.pointsCost} pts devueltos)
                  </span>
                ) : (
                  <button
                    onClick={() => refundPastRedemption(selectedDate, targetChild.id, red.id)}
                    className="px-3 py-1.5 rounded-squircle-sm bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 text-xs font-bold shadow-sm flex items-center gap-1 transition"
                  >
                    <RotateCcw size={13} />
                    <span>Anular y Reembolsar Canje (+{red.pointsCost})</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </GlassCard>

    </div>
  );
};
