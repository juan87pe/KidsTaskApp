import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Star, Award, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '../Common/GlassCard';

export const KidCalendarAchievements = () => {
  const { data, activeChild } = useApp();
  const history = data.calendarHistory || {};
  const availableDates = Object.keys(history).sort().reverse();
  const daysList = availableDates.length > 0 ? availableDates : ['2026-08-25', '2026-08-24', '2026-08-23'];

  const [selectedDate, setSelectedDate] = useState(daysList[0]);

  const dayDetail = history[selectedDate]?.[activeChild?.id];

  return (
    <div className="space-y-5 max-w-md mx-auto pb-24 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1E3A5F]">
              Mi Calendario de Logros
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Tus días exitosos y estrellas ganadas
            </p>
          </div>
        </div>

        <div className="text-2xl">
          {activeChild.avatar}
        </div>
      </div>

      {/* Mini Calendar Carousel */}
      <GlassCard className="p-4 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-600">
          <span>Agosto 2026</span>
          <span>Días con registro ⭐</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {daysList.map(dateStr => {
            const dayEntry = history[dateStr]?.[activeChild.id];
            const isSelected = selectedDate === dateStr;
            const isFull = dayEntry?.status === 'full';
            const isPartial = dayEntry?.status === 'partial';

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-3 rounded-squircle-md border-2 text-center transition-all ${
                  isSelected
                    ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white shadow-md scale-105'
                    : isFull
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : isPartial
                    ? 'border-amber-300 bg-amber-50 text-amber-900'
                    : 'border-red-200 bg-red-50 text-red-900'
                }`}
              >
                <span className="text-[11px] font-bold block opacity-80">
                  {dateStr.split('-')[2]} Ago
                </span>
                <span className="text-xl block my-1">
                  {isFull ? '⭐' : isPartial ? '🟡' : '🔴'}
                </span>
                <span className="text-[10px] font-extrabold block">
                  +{dayEntry?.netPoints || 0} pts
                </span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Selected Day Summary Card */}
      <GlassCard variant="gold" className="p-5 border-2 border-amber-300">
        <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 mb-3">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase">
              Registro del Día
            </span>
            <h4 className="text-lg font-extrabold text-[#78350F]">
              {selectedDate}
            </h4>
          </div>

          <div className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-extrabold text-sm">
            ⭐ +{dayDetail?.netPoints || 0} Ganados
          </div>
        </div>

        {/* Tasks completed list */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-amber-900">
            Tareas realizadas este día:
          </p>
          
          {dayDetail?.tasks?.map(t => (
            <div
              key={t.id}
              className="flex items-center justify-between p-2.5 rounded-squircle-sm bg-white/90 border border-amber-200 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className={t.status === 'approved' ? 'text-emerald-500' : 'text-slate-300'}
                />
                <span className={`font-bold ${t.status === 'approved' ? 'text-slate-800' : 'line-through text-slate-400'}`}>
                  {t.title}
                </span>
              </div>
              <span className="font-bold text-amber-700">
                +{t.points} ⭐
              </span>
            </div>
          ))}

          {(!dayDetail?.tasks || dayDetail.tasks.length === 0) && (
            <p className="text-xs text-slate-400 italic">No hay tareas registradas para esta fecha.</p>
          )}
        </div>

        {/* Redemptions if any */}
        {dayDetail?.redemptions && dayDetail.redemptions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-200 text-xs">
            <p className="font-bold text-amber-900 mb-1">Premios disfrutados:</p>
            {dayDetail.redemptions.map(r => (
              <div key={r.id} className="text-slate-700 font-semibold">
                🎁 {r.rewardTitle} ({r.pointsCost} pts) {r.isRefunded ? '(Reembolsado por papás)' : ''}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

    </div>
  );
};
