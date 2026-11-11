import { useState, useEffect } from 'react';
import { Registration } from './types';
import {
  getLocalRegistrations,
  subscribeToRegistrations,
  createRegistration,
  updateRegistrationRecord,
  deleteRegistrationRecord,
  clearAllRegistrations
} from './services/firebase';
import { Header } from './components/Header';
import { RegistrationForm } from './components/RegistrationForm';
import { SuccessView } from './components/SuccessView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Download } from 'lucide-react';

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    getLocalRegistrations()
  );
  const [currentView, setCurrentView] = useState<'form' | 'admin'>('form');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToRegistrations((data) => {
      setRegistrations(data);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRegister = async (
    data: Omit<Registration, 'id' | 'registrationNumber' | 'createdAt' | 'status'>
  ) => {
    try {
      setIsSubmitting(true);
      const newRecord = await createRegistration(data, registrations.length);
      setRegistrations((prev) =>
        prev.some((r) => r.id === newRecord.id) ? prev : [newRecord, ...prev]
      );
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Registration submission error:', err);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Registration>) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    await updateRegistrationRecord(id, updates);
  };

  const handleDelete = async (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    await deleteRegistrationRecord(id);
  };

  const handleClearAll = async () => {
    const copy = [...registrations];
    setRegistrations([]);
    await clearAllRegistrations(copy);
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setIsAdminModalOpen(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setCurrentView('form');
  };

  const handleOpenAdminLogin = () => {
    setIsAdminModalOpen(true);
  };

  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/matriculation-photoshoot-source-code.zip';
    link.setAttribute('download', 'matriculation-photoshoot-source-code.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-950">
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'admin') {
            if (isAdmin) {
              setCurrentView('admin');
            } else {
              handleOpenAdminLogin();
            }
          } else {
            setIsAdmin(false);
            setCurrentView(view);
            setIsSuccess(false);
          }
        }}
        isAdmin={isAdmin}
        onAdminLogout={handleAdminLogout}
        onOpenAdminLogin={handleOpenAdminLogin}
        onDownloadZip={handleDownloadZip}
      />

      <main className="flex-1 pb-16">
        {currentView === 'admin' && isAdmin ? (
          <AdminDashboard
            registrations={registrations}
            onUpdateRegistration={handleUpdate}
            onDeleteRegistration={handleDelete}
            onAddRegistration={async (data) => {
              const newRec = await createRegistration(data, registrations.length);
              setRegistrations((prev) => [newRec, ...prev]);
            }}
            onClearAll={handleClearAll}
            onLogout={handleAdminLogout}
            onSwitchToForm={() => {
              setIsAdmin(false);
              setCurrentView('form');
              setIsSuccess(false);
            }}
          />
        ) : isSuccess ? (
          <SuccessView
            onRegisterAnother={() => {
              setIsSuccess(false);
              setCurrentView('form');
            }}
            onOpenAdmin={() => {
              setIsSuccess(false);
              handleOpenAdminLogin();
            }}
          />
        ) : (
          <RegistrationForm
            onSubmit={handleRegister}
            onOpenAdmin={handleOpenAdminLogin}
            isSubmitting={isSubmitting}
          />
        )}
      </main>

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/Qodesh_Campus_Church_Logo_61946d9b.png"
              alt="Logo"
              className="w-5 h-5 rounded object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="font-semibold text-slate-800">Qodesh Campus Church</span>
            <span>·</span>
            <span>Ghana Communication Technology University (GCTU)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-500">
            <button
              onClick={() => {
                setIsAdmin(false);
                setCurrentView('form');
                setIsSuccess(false);
              }}
              className="py-1.5 px-2 hover:text-slate-900 transition-colors cursor-pointer min-h-[38px] flex items-center"
            >
              Registration Form
            </button>
            <span>·</span>
            <button
              onClick={handleOpenAdminLogin}
              className="py-1.5 px-2 hover:text-fuchsia-800 font-medium transition-colors cursor-pointer min-h-[38px] flex items-center"
            >
              Administrator Dashboard
            </button>
            <span>·</span>
            <button
              onClick={handleDownloadZip}
              className="py-1.5 px-2 text-fuchsia-700 hover:text-fuchsia-900 font-semibold transition-colors cursor-pointer min-h-[38px] flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Source .ZIP</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
