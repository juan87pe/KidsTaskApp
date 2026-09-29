import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Lock, Unlock, Plus, Trash2, Edit2, Star, ShieldAlert } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const RewardManager = ({ onOpenCreateReward, onOpenLockModal }) => {
  const { data, deleteReward, toggleRewardLock } = useApp();
  const [filterChild, setFilterChild] = useState('all');

  const filteredRewards = data.rewards.filter(r => {
    if (filterChild === 'all') return true;
    return r.availableFor === 'all' || r.availableFor === filterChild;
  });

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E3A5F]">
            🎁 Catálogo de Recompensas
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Define el valor en puntos y aplica bloqueos temporales preventivos
          </p>
        </div>

        <ChunkyButton
          variant="gold"
          size="sm"
          onClick={onOpenCreateReward}
          className="text-xs font-bold"
        >
          <Plus size={15} /> Nuevo Premio
        </ChunkyButton>
      </div>

      {/* Child Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Mostrar:</span>
        <div className="flex bg-slate-100 p-1 rounded-squircle-sm border border-slate-200">
          <button
            onClick={() => setFilterChild('all')}
            className={`px-3 py-1 text-xs font-bold rounded-squircle-sm transition ${
              filterChild === 'all' ? 'bg-[#1E3A5F] text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Todos
          </button>
          {data.children.map(c => (
            <button
              key={c.id}
              onClick={() => setFilterChild(c.id)}
              className={`px-3 py-1 text-xs font-bold rounded-squircle-sm transition ${
                filterChild === c.id ? 'bg-[#1E3A5F] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              {c.avatar} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredRewards.map(reward => {
          const isLocked = reward.isLocked;

          return (
            <GlassCard
              key={reward.id}
              className={`p-4 border-2 flex flex-col justify-between transition ${
                isLocked ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl p-2 rounded-squircle-sm bg-slate-100 border border-slate-200 inline-block shadow-sm">
                    {reward.iconSvg || '🎁'}
                  </span>

                  <span className="font-extrabold text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                    ⭐ {reward.pointsCost} Puntos
                  </span>
                </div>

                <h4 className="font-bold text-base text-[#1E3A5F] leading-snug">
                  {reward.title}
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold mt-1">
                  <span>Asignado a:</span>
                  <span className="text-slate-600 font-bold">
                    {reward.availableFor === 'all'
                      ? 'Todos los hijos'
                      : data.children.find(c => c.id === reward.availableFor)?.name || 'Hijo'}
                  </span>
                </div>

                {isLocked && (
                  <div className="mt-3 p-2 rounded-squircle-sm bg-red-100 border border-red-200 text-xs text-red-800">
                    <p className="font-bold flex items-center gap-1">
                      <Lock size={12} /> Bloqueo Temporal Activo
                    </p>
                    <p className="text-[11px] mt-0.5">{reward.lockReason || 'Restricción parental'}</p>
                    {reward.lockUntil && (
                      <p className="text-[10px] font-bold text-red-900 mt-1">Hasta: {reward.lockUntil}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenLockModal(reward)}
                  className={`px-3 py-1.5 rounded-squircle-sm text-xs font-bold border flex items-center gap-1 transition ${
                    isLocked
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                  }`}
                >
                  {isLocked ? (
                    <>
                      <Unlock size={13} /> Desbloquear
                    </>
                  ) : (
                    <>
                      <Lock size={13} /> Bloquear
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteReward(reward.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Eliminar premio"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
