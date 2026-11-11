import React from 'react';
import { CircleCheck, UserPlus } from 'lucide-react';

interface SuccessViewProps {
  onRegisterAnother: () => void;
  onOpenAdmin?: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  onRegisterAnother,
  onOpenAdmin
}) => {
  return (
    <div className="max-w-md mx-auto py-12 sm:py-16 px-4 sm:px-6 text-center">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-xs">
          <CircleCheck className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Registration Received!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          Your details have been securely recorded and synced to the Qodesh Campus Church
          database. The photography team will contact you for your session slot.
        </p>

        <div className="space-y-2.5">
          <button
            onClick={onRegisterAnother}
            className="w-full py-3.5 px-5 min-h-[48px] bg-gradient-to-r from-purple-800 via-fuchsia-700 to-pink-600 hover:opacity-95 text-white text-sm font-bold rounded-xl transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Register Another Student</span>
          </button>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full py-3 px-5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View All Registrations (Admin Portal)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
