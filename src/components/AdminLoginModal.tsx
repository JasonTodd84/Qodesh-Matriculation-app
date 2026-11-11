import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, CircleAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '777') {
      setError(null);
      setPin('');
      onSuccess();
    } else {
      setError('Incorrect passcode. Please enter the valid administrator code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
      >
        <div className="bg-gradient-to-r from-purple-900 via-fuchsia-900 to-purple-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 border border-white/20">
            <Lock className="w-6 h-6 text-fuchsia-300" />
          </div>
          <h2 id="admin-dialog-title" className="text-xl font-bold tracking-tight">
            Administrator Access
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            Qodesh Campus Church · GCTU Matriculation Photoshoot Registry
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Enter Dashboard PIN
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter passcode..."
                autoFocus
                className="w-full px-4 py-3 text-lg font-mono tracking-widest bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-600 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label={showPin ? 'Hide passcode' : 'Show passcode'}
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <CircleAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 px-4 min-h-[44px] text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 px-4 min-h-[44px] text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-700 to-fuchsia-700 hover:from-purple-800 hover:to-fuchsia-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
