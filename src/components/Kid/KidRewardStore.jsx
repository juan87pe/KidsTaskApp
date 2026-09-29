import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Lock, Star, Sparkles, Check, Clock } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const KidRewardStore = () => {
  const { data, activeChild, requestRewardRedemption } = useApp();

  const myRewards = data.rewards.filter(r => 
    r.availableFor === 'all' || r.availableFor === activeChild.id
  );

  const pendingRequests = data.pendingRedemptions.filter(r => r.childId === activeChild.id);

  return (
    <div className="space-y-5 max-w-md mx-auto pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-xl">
            🎁
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E3A5F]">
              Tienda de Recompensas
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Canjea tus estrellas por premios reales
            </p>
          </div>
        </div>

        {/* Current Points Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 font-extrabold text-sm shadow-sm">
          <Star size={16} className="fill-amber-500 text-amber-500" />
          <span>{activeChild.currentPoints} pts</span>
        </div>
      </div>

      {/* Pending Redemptions Banner */}
      {pendingRequests.length > 0 && (
        <div className="p-3.5 rounded-squircle-md bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Clock size={15} />
            <span>Premios esperando aprobación de tus papás:</span>
          </div>
          <div className="space-y-1 pl-6">
            {pendingRequests.map(pr => (
              <div key={pr.id} className="font-semibold text-slate-700">
                • {pr.rewardTitle} ({pr.pointsCost} pts) - Pedido a las {pr.requestedAt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {myRewards.map(reward => {
          const isLocked = reward.isLocked;
          const canAfford = activeChild.currentPoints >= reward.pointsCost;
          const pointsNeeded = reward.pointsCost - activeChild.currentPoints;

          return (
            <GlassCard
              key={reward.id}
              className={`relative overflow-hidden flex flex-col justify-between p-4 border-2 transition ${
                isLocked
                  ? 'bg-slate-100/90 border-slate-300 opacity-80'
                  : canAfford
                  ? 'bg-white border-amber-200 hover:border-amber-400 shadow-md'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              {/* Top of Card */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl p-2 rounded-squircle-sm bg-white border border-slate-100 shadow-sm inline-block">
                    {reward.iconSvg || '🎁'}
                  </span>
                  
                  {isLocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                      <Lock size={12} /> Bloqueado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-extrabold text-sm text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      ⭐ {reward.pointsCost}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-base text-[#1E3A5F] leading-snug">
                  {reward.title}
                </h4>

                {isLocked && (
                  <div className="mt-2 p-2 rounded-squircle-sm bg-red-50 border border-red-200 text-[11px] text-red-700">
                    <p className="font-bold">🔒 Restringido por papás:</p>
                    <p className="text-[10px] mt-0.5">{reward.lockReason || 'Bloqueo temporal'}</p>
                    {reward.lockUntil && (
                      <p className="text-[10px] font-bold mt-1">Disponible el: {reward.lockUntil}</p>
                    )}
                  </div>
                )}

                {!isLocked && !canAfford && (
                  <p className="text-[11px] font-bold text-slate-400 mt-2">
                    Te faltan <span className="text-amber-600">{pointsNeeded} estrellas</span> ⭐
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {isLocked ? (
                  <button
                    disabled
                    className="w-full py-2 text-xs font-bold text-slate-400 bg-slate-200 rounded-squircle-sm cursor-not-allowed"
                  >
                    No disponible ahora 🔒
                  </button>
                ) : (
                  <ChunkyButton
                    variant={canAfford ? 'gold' : 'gray'}
                    size="sm"
                    disabled={!canAfford}
                    onClick={() => requestRewardRedemption(reward.id)}
                    className="w-full text-xs font-bold"
                  >
                    {canAfford ? '¡Canjear Ahora! 🎁' : `Faltan ${pointsNeeded} pts`}
                  </ChunkyButton>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
