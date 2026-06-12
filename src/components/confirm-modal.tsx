import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  
  variant?: 'danger' | 'warning'; 
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Sim, excluir",
  cancelText = "Cancelar",
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDanger ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

       
        <div className="p-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

       
        <div className="p-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-300 bg-transparent hover:bg-slate-700 rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose(); 
            }}
            className={`px-4 py-2 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-95 ${
              isDanger 
                ? 'bg-rose-600 hover:bg-rose-500 hover:shadow-rose-500/25' 
                : 'bg-amber-600 hover:bg-amber-500 hover:shadow-amber-500/25'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};