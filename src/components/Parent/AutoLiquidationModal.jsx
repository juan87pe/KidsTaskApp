import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { DollarSign, Gift, Sparkles, CheckCircle2 } from 'lucide-react';

export const AutoLiquidationModal = ({
  isOpen,
  onClose,
  initialConfig = {},
  targetRule = 'daily_reset',
  onSave,
  rewards = []
}) => {
  const [enabled, setEnabled] = useState(initialConfig?.enabled ?? true);
  const [rewardType, setRewardType] = useState(initialConfig?.rewardType || 'money_allowance');
  const [conversionRate, setConversionRate] = useState(initialConfig?.conversionRate || 0.10);
  const [currencySymbol, setCurrencySymbol] = useState(initialConfig?.currencySymbol || '$');
  const [customRewardId, setCustomRewardId] = useState(initialConfig?.customRewardId || (rewards[0]?.id || ''));
  const [customRewardTitle, setCustomRewardTitle] = useState(initialConfig?.customRewardTitle || (rewards[0]?.title || ''));

  useEffect(() => {
    if (initialConfig) {
      setEnabled(initialConfig.enabled ?? true);
      setRewardType(initialConfig.rewardType || 'money_allowance');
      setConversionRate(initialConfig.conversionRate || 0.10);
      setCurrencySymbol(initialConfig.currencySymbol || '$');
      if (initialConfig.customRewardId) {
        setCustomRewardId(initialConfig.customRewardId);
        setCustomRewardTitle(initialConfig.customRewardTitle || '');
      }
    }
  }, [initialConfig, isOpen]);

  if (!isOpen) return null;

  const isDaily = targetRule === 'daily_reset';

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      enabled,
      rewardType,
      conversionRate: Number(conversionRate),
      currencySymbol,
      customRewardId: rewardType === 'custom_reward' ? customRewardId : null,
      customRewardTitle: rewardType === 'custom_reward' ? customRewardTitle : ''
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚙️ Auto-Liquidación de Puntos"
      subtitle={`Configura qué ocurre con los puntos no canjeados al cierre ${isDaily ? 'diario (23:59:59)' : 'semanal'}`}
    >
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Toggle Enabled */}
        <div className="p-3.5 rounded-squircle-sm border-2 border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <label className="text-xs font-extrabold text-[#1E3A5F] block cursor-pointer">
              ¿Activar auto-liquidación de puntos al cierre?
            </label>
            <p className="text-[11px] text-slate-500 font-medium">
              Convierte los puntos sobrantes en paga o recompensas para no perder el esfuerzo
            </p>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            aria-label="Activar auto-liquidación"
            className="w-5 h-5 text-emerald-600 rounded cursor-pointer accent-emerald-500"
          />
        </div>

        {enabled && (
          <div className="space-y-4 pt-1 animate-fadeIn">
            {/* Tipo de Recompensa */}
            <div>
              <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
                Tipo de Conversión / Recompensa:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRewardType('money_allowance')}
                  className={`p-3 rounded-squircle-sm border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    rewardType === 'money_allowance'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign size={16} className="text-emerald-600" />
                  <span>Dinero / Paga</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRewardType('custom_reward')}
                  className={`p-3 rounded-squircle-sm border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    rewardType === 'custom_reward'
                      ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Gift size={16} className="text-purple-600" />
                  <span>Premio Personalizado</span>
                </button>
              </div>
            </div>

            {/* Configuración Dinero / Paga */}
            {rewardType === 'money_allowance' && (
              <div className="p-3.5 rounded-squircle-sm bg-emerald-50/50 border border-emerald-200 space-y-3">
                <label className="block text-xs font-extrabold text-emerald-900 uppercase">
                  Tasa de Conversión:
                </label>

                {/* Predefined rate pills */}
                <div className="flex gap-2">
                  {[
                    { label: '0.05 $ por punto', val: 0.05 },
                    { label: '0.10 $ por punto', val: 0.10 },
                    { label: '0.25 $ por punto', val: 0.25 }
                  ].map(pill => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => setConversionRate(pill.val)}
                      className={`flex-1 py-1.5 px-2 rounded-squircle-sm text-xs font-extrabold border-2 transition ${
                        Number(conversionRate) === pill.val
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-600">Equivalencia exacta:</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(e.target.value)}
                    className="w-20 p-2 rounded-squircle-sm border-2 border-slate-200 text-xs font-bold text-[#1E3A5F] bg-white"
                  />
                  <span className="text-xs font-bold text-slate-600">{currencySymbol} por punto (ej. 40 pts = {currencySymbol}{(40 * conversionRate).toFixed(2)})</span>
                </div>
              </div>
            )}

            {/* Configuración Premio Personalizado */}
            {rewardType === 'custom_reward' && (
              <div className="p-3.5 rounded-squircle-sm bg-purple-50/50 border border-purple-200 space-y-2">
                <label className="block text-xs font-extrabold text-purple-900 uppercase">
                  Premio del Catálogo a Asignar:
                </label>
                <select
                  value={customRewardId}
                  onChange={(e) => {
                    const sel = rewards.find(r => r.id === e.target.value);
                    setCustomRewardId(e.target.value);
                    setCustomRewardTitle(sel?.title || '');
                  }}
                  className="w-full p-2.5 rounded-squircle-sm border-2 border-slate-200 text-xs font-bold text-[#1E3A5F] bg-white"
                >
                  <option value="">Selecciona una recompensa...</option>
                  {rewards.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.pointsCost} pts)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-squircle-sm text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <ChunkyButton
            variant="blue"
            size="sm"
            type="submit"
            className="text-xs font-bold"
          >
            Guardar Política Familiar
          </ChunkyButton>
        </div>

      </form>
    </Modal>
  );
};
