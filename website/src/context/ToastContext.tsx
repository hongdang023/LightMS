import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sparkles, AlertOctagon, AlertTriangle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((toast) => {
          let bgClass = 'bg-[#15333B] border-teal-800/30 text-white';
          let iconNode = <Sparkles size={16} className="text-amber-400 shrink-0" />;

          if (toast.type === 'error') {
            bgClass = 'bg-rose-950 border-rose-800/40 text-rose-200';
            iconNode = <AlertOctagon size={16} className="text-rose-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-950 border-amber-800/40 text-amber-200';
            iconNode = <AlertTriangle size={16} className="text-amber-400 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 animate-slide-up ${bgClass}`}
            >
              <div className="flex items-center gap-2.5 text-xs font-bold">
                {iconNode}
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white border-0 bg-transparent cursor-pointer font-bold flex items-center justify-center p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
