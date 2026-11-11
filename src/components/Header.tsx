import React from 'react';
import { Lock, LogOut, UserPlus, Download } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: 'form' | 'admin') => void;
  isAdmin: boolean;
  onAdminLogout: () => void;
  onOpenAdminLogin: () => void;
  onDownloadZip?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  isAdmin,
  onAdminLogout,
  onOpenAdminLogin,
  onDownloadZip
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4 md:gap-8">
        <button
          onClick={() => setCurrentView('form')}
          className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
        >
          <img
            src="/assets/aistudio/Qodesh_Campus_Church_Logo_61946d9b.png"
            alt="Qodesh Campus Church"
            className="w-10 h-10 rounded-xl shadow-xs border border-purple-100 object-contain p-0.5 bg-white shrink-0 group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 leading-tight truncate">
              Qodesh Campus Church
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-fuchsia-700 tracking-wide truncate">
              GCTU Matriculation Photoshoot
            </span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentView('form')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              currentView === 'form' ? 'text-fuchsia-700 font-semibold' : ''
            }`}
          >
            Registration Form
          </button>
          <button
            onClick={() => (isAdmin ? setCurrentView('admin') : onOpenAdminLogin())}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'admin' ? 'text-fuchsia-700 font-semibold' : ''
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onDownloadZip && (
            <button
              onClick={onDownloadZip}
              title="Download full project source code as .ZIP"
              className="px-2.5 sm:px-3 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-fuchsia-700" />
              <span className="hidden sm:inline">Source .ZIP</span>
            </button>
          )}

          {isAdmin ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'form' : 'admin')}
                className="px-3 sm:px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200 hover:bg-fuchsia-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center"
              >
                {currentView === 'admin' ? 'Register' : 'Dashboard'}
              </button>
              <button
                onClick={onAdminLogout}
                title="Lock Admin Portal"
                className="p-2 min-h-[38px] min-w-[38px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Lock</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="px-3 sm:px-3.5 py-1.5 min-h-[38px] text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline">Admin</span>
            </button>
          )}

          {currentView !== 'form' && (
            <button
              onClick={() => setCurrentView('form')}
              className="px-3 sm:px-3.5 py-1.5 min-h-[38px] text-xs font-semibold text-white bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-600 rounded-lg hover:opacity-95 shadow-xs transition-opacity flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          )}
        </div>
      </div>

      <div className="md:hidden border-t border-slate-100 bg-slate-50/95 px-3 py-1.5 grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
        <button
          onClick={() => setCurrentView('form')}
          className={`min-h-[42px] px-3 py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            currentView === 'form'
              ? 'bg-fuchsia-100/90 text-fuchsia-900 font-bold border border-fuchsia-200/80 shadow-xs'
              : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Registration Form</span>
        </button>
        <button
          onClick={() => (isAdmin ? setCurrentView('admin') : onOpenAdminLogin())}
          className={`min-h-[42px] px-3 py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            currentView === 'admin'
              ? 'bg-fuchsia-100/90 text-fuchsia-900 font-bold border border-fuchsia-200/80 shadow-xs'
              : 'hover:bg-slate-200/60 text-slate-700'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </button>
      </div>
    </header>
  );
};
