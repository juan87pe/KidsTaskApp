import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Clock, Gift, Star, CheckCheck, Sparkles } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const ApprovalsHub = () => {
  const {
    data,
    approveTask,
    rejectTask,
    approveAllPendingTasks,
    authorizeRedemption,
    denyRedemption
  } = useApp();

  const pendingTasks = data.todayAssignments.filter(a => a.status === 'requested');
  const pendingRedemptions = data.pendingRedemptions || [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E3A5F] flex items-center gap-2">
            <span>📬 Centro de Aprobaciones</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Valida en 1-clic las tareas hechas y canjes de premios solicitados
          </p>
        </div>

        {pendingTasks.length > 1 && (
          <ChunkyButton
            variant="green"
            size="sm"
            onClick={approveAllPendingTasks}
            className="text-xs font-bold whitespace-nowrap"
          >
            <CheckCheck size={16} /> Aprobar Todas ({pendingTasks.length}) 🚀
          </ChunkyButton>
        )}
      </div>

      {/* Bloque 1: Validación de Tareas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-[#1E3A5F] flex items-center gap-2">
            <Clock size={16} className="text-amber-500" />
            <span>Tareas Esperando Visto Bueno ({pendingTasks.length})</span>
          </h3>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-squircle-lg border-2 border-slate-200 text-slate-400 text-xs font-semibold">
            ✨ No hay tareas pendientes de validación
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingTasks.map(task => {
              const child = data.children.find(c => c.id === task.childId);

              return (
                <GlassCard
                  key={task.id}
                  className="p-4 border-2 border-amber-300 bg-amber-50/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 bg-white shadow-sm"
                      style={{ borderColor: child?.colorTheme }}
                    >
                      {child?.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#1E3A5F]">
                          {child?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {task.completedAt ? `Enviada a las ${task.completedAt}` : 'Hoy'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1E3A5F] mt-0.5">
                        {task.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1">
                        ⭐ +{task.points} pts
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveTask(task.id)}
                      className="px-3.5 py-2 rounded-squircle-sm bg-emerald-500 text-white font-bold text-xs shadow-chunky-green hover:bg-emerald-600 active:translate-y-0.5 transition flex items-center gap-1"
                    >
                      <CheckCircle2 size={15} />
                      <span>Aprobar (+{task.points})</span>
                    </button>
                    <button
                      onClick={() => rejectTask(task.id)}
                      className="p-2 rounded-squircle-sm bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                      title="Rechazar"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Bloque 2: Autorización de Canjes de Premios */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-[#1E3A5F] flex items-center gap-2">
            <Gift size={16} className="text-purple-500" />
            <span>Solicitudes de Canje de Premios ({pendingRedemptions.length})</span>
          </h3>
        </div>

        {pendingRedemptions.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-squircle-lg border-2 border-slate-200 text-slate-400 text-xs font-semibold">
            🎁 No hay canjes de premios pendientes
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingRedemptions.map(red => {
              const child = data.children.find(c => c.id === red.childId);
              const hasBalance = (child?.currentPoints || 0) >= red.pointsCost;

              return (
                <GlassCard
                  key={red.id}
                  className="p-4 border-2 border-purple-300 bg-purple-50/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-squircle-md bg-white border border-purple-200 flex items-center justify-center text-2xl shadow-sm">
                      {red.iconSvg || '🎁'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#1E3A5F]">
                          {child?.avatar} {child?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {red.requestedAt}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1E3A5F] mt-0.5">
                        {red.rewardTitle}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          ⭐ -{red.pointsCost} pts
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Saldo niño: {child?.currentPoints} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Redemptions Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      disabled={!hasBalance}
                      onClick={() => authorizeRedemption(red.id)}
                      className={`px-3.5 py-2 rounded-squircle-sm font-bold text-xs shadow-chunky-gold transition flex items-center gap-1 ${
                        hasBalance
                          ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 active:translate-y-0.5'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Gift size={15} />
                      <span>Autorizar Canje</span>
                    </button>
                    <button
                      onClick={() => denyRedemption(red.id)}
                      className="p-2 rounded-squircle-sm bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
                      title="Posponer / Denegar"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
