import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, Star, Users, ArrowRight } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';
import { ChunkyButton } from '../Common/ChunkyButton';

export const ProfileSelector = () => {
  const { data, selectKidProfile, openParentGate } = useApp();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* Container Box */}
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF6E5] border border-[#FDE68A] text-[#92400E] text-xs font-bold shadow-sm">
            <Sparkles size={14} className="text-[#F59E0B]" />
            <span>{data.family.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E3A5F] tracking-tight">
            KidsTaskApp 🚀
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            ¿Quién eres hoy para comenzar?
          </p>
        </div>

        {/* Children Profile Cards */}
        <div className="space-y-3.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Espacio de los Niños
          </p>
          
          {data.children.map(child => (
            <GlassCard
              key={child.id}
              onClick={() => selectKidProfile(child.id)}
              className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200 border-2"
              style={{ borderColor: child.borderColor, backgroundColor: child.bgColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar Icon */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4 bg-white shadow-md"
                    style={{ borderColor: child.colorTheme }}
                  >
                    {child.avatar}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-1.5">
                      {child.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-600">
                      {child.level}
                    </p>
                    <div className="flex items-center gap-1 mt-1 font-bold text-sm text-[#B45309]">
                      <Star size={15} className="fill-[#F59E0B] text-[#F59E0B]" />
                      <span>{child.currentPoints} Puntos</span>
                    </div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-[#1E3A5F] shadow-sm group-hover:bg-[#88D1F1] group-hover:text-white group-hover:border-[#60A5FA] transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Parent Mode Gate Card */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
            Administración Familiar
          </p>
          
          <GlassCard
            variant="slate"
            onClick={() => openParentGate('parent_dash')}
            className="flex items-center justify-between p-4 bg-[#1E3A5F] border-2 border-[#2D4B73] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-squircle-md bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Shield size={24} className="text-[#88D1F1]" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  Panel de Padres 🛡️
                </h4>
                <p className="text-xs text-slate-300">
                  Gestión 360°, aprobaciones y biblioteca
                </p>
              </div>
            </div>

            <ChunkyButton
              variant="sky"
              size="sm"
              onClick={(e) => { e.stopPropagation(); openParentGate('parent_dash'); }}
              className="whitespace-nowrap font-bold"
            >
              Ingresar con PIN
            </ChunkyButton>
          </GlassCard>
        </div>

        {/* Family info footer */}
        <div className="text-center pt-2 text-xs text-slate-400">
          <span>Modo {data.family.pointsRule === 'cumulative' ? '⭐ Puntos Acumulativos' : 'Puntos Diarios'}</span> • PIN demo: 1234
        </div>
      </div>
    </div>
  );
};
