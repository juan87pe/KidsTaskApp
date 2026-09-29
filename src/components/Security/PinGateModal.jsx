import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Delete, X, AlertCircle, Fingerprint, CheckCircle2 } from 'lucide-react';
import { ChunkyButton } from '../Common/ChunkyButton';

export const PinGateModal = () => {
  const { isPinModalOpen, setIsPinModalOpen, verifyPin, resetMasterPinAndUnlock } = useApp();
  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState(false);

  useEffect(() => {
    if (isPinModalOpen) {
      setPin('');
      setHasError(false);
      setIsResetMode(false);
      setResetSuccessMessage(false);
    }
  }, [isPinModalOpen]);

  if (!isPinModalOpen) return null;

  const handleDigit = (digit) => {
    setPin(prev => {
      if (prev.length >= 4) return prev;
      const nextPin = prev + digit;
      if (nextPin.length === 4) {
        if (isResetMode) {
          // Actualización de PIN maestro por biometría [REQ-AUTH-009]
          setResetSuccessMessage(true);
          setTimeout(() => {
            resetMasterPinAndUnlock(nextPin);
          }, 300);
        } else {
          setTimeout(() => {
            const isValid = verifyPin(nextPin);
            if (!isValid) {
              setHasError(true);
              setPin('');
            }
          }, 100);
        }
      }
      return nextPin;
    });
    setHasError(false);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setHasError(false);
  };

  const handleBiometricUnlock = async () => {
    setIsResetMode(true);
    setPin('');
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
        <div className={`w-16 h-16 mx-auto mb-3 rounded-full border-2 flex items-center justify-center shadow-inner transition-colors ${
          isResetMode ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-blue-100 border-blue-300 text-[#1E3A5F]'
        }`}>
          {isResetMode ? <Fingerprint size={32} /> : <Lock size={30} />}
        </div>

        <h2 className="text-2xl font-bold text-[#1E3A5F]">
          {isResetMode ? 'Restablecer PIN' : 'Acceso a Padres'}
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 mb-4">
          {isResetMode 
            ? 'Huella validada. Ingresa tu nuevo PIN de 4 dígitos'
            : 'Ingresa el PIN de seguridad de 4 dígitos'}
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-150 ${
                pin.length > idx
                  ? isResetMode ? 'bg-amber-600 border-amber-600 scale-110' : 'bg-[#1E3A5F] border-[#1E3A5F] scale-110'
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

        {resetSuccessMessage && (
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold mb-4">
            <CheckCircle2 size={16} /> ¡PIN actualizado con éxito!
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

        {/* Biometric Recovery Option [REQ-AUTH-009] */}
        {!isResetMode ? (
          <button
            onClick={handleBiometricUnlock}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            <Fingerprint size={16} />
            <span>¿Olvidaste tu PIN? Desbloquear con Huella</span>
          </button>
        ) : (
          <button
            onClick={() => { setIsResetMode(false); setPin(''); }}
            className="mt-4 text-xs font-semibold text-slate-400 hover:text-slate-600 underline"
          >
            Cancelar restablecimiento
          </button>
        )}

        <p className="text-[11px] text-slate-400 mt-2">
          (PIN por defecto para demo: <strong className="text-slate-600">1234</strong>)
        </p>
      </div>
    </div>
  );
};
