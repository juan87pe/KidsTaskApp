import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Delete, X, AlertCircle } from 'lucide-react';
import { ChunkyButton } from '../Common/ChunkyButton';

export const PinGateModal = () => {
  const { isPinModalOpen, setIsPinModalOpen, verifyPin } = useApp();
  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isPinModalOpen) {
      setPin('');
      setHasError(false);
    }
  }, [isPinModalOpen]);

  if (!isPinModalOpen) return null;

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setHasError(false);

      if (newPin.length === 4) {
        setTimeout(() => {
          const isValid = verifyPin(newPin);
          if (!isValid) {
            setHasError(true);
            setPin('');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setHasError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-[#FDFBF7] rounded-squircle-xl border-4 border-white shadow-2xl p-6 text-center">
        {/* Close button */}
        <button
          onClick={() => setIsPinModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition"
        >
          <X size={20} />
        </button>

        {/* Lock Icon Header */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-[#1E3A5F] shadow-inner">
          <Lock size={30} className="text-[#1E3A5F]" />
        </div>

        <h2 className="text-2xl font-bold text-[#1E3A5F]">Acceso a Padres</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-4">
          Ingresa el PIN de seguridad de 4 dígitos
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
                pin.length > idx
                  ? 'bg-[#1E3A5F] border-[#1E3A5F] scale-110'
                  : hasError
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-300 bg-white'
              }`}
            />
          ))}
        </div>

        {hasError && (
          <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-bold mb-4 animate-shake">
            <AlertCircle size={14} /> PIN incorrecto. Intenta de nuevo.
          </div>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(String(num))}
              className="h-14 rounded-squircle-md bg-white border-2 border-slate-200 shadow-chunky-slate font-bold text-2xl text-[#1E3A5F] hover:bg-slate-50 active:translate-y-1 active:border-b-2 transition"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            <span className="text-xs font-bold text-slate-400">PIN: 1234</span>
          </div>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-squircle-md bg-white border-2 border-slate-200 shadow-chunky-slate font-bold text-2xl text-[#1E3A5F] hover:bg-slate-50 active:translate-y-1 active:border-b-2 transition"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-squircle-md bg-rose-50 border-2 border-rose-200 text-rose-600 shadow-chunky-gray flex items-center justify-center active:translate-y-1 transition"
          >
            <Delete size={22} />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-4">
          (PIN por defecto para demo: <strong className="text-slate-600">1234</strong>)
        </p>
      </div>
    </div>
  );
};
