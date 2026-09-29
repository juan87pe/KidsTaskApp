import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full ${maxWidth} bg-[#FDFBF7] rounded-squircle-xl border-4 border-white shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
