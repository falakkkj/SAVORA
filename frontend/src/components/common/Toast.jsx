import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isAi = type === 'ai';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn flex items-center gap-3 glass-panel px-4 py-3 rounded-2xl border border-white/20 shadow-2xl glow-brand">
      {isAi ? (
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
      ) : isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400" />
      )}
      <span className="text-xs font-bold text-white">{message}</span>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
