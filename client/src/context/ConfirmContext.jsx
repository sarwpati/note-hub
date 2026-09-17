import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle, Info, Trash2, LogOut } from 'lucide-react';

/* ── Types ──────────────────────────────────────────────────────────────
   variant: 'danger' | 'warning' | 'info'
─────────────────────────────────────────────────────────────────────── */

const iconMap = {
  danger: <Trash2 size={22} className="text-red-500" />,
  warning: <AlertTriangle size={22} className="text-amber-500" />,
  logout: <LogOut size={22} className="text-red-500" />,
  info: <Info size={22} className="text-[#5f54f7]" />,
};

const confirmBtnMap = {
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200',
  logout: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200',
  info: 'bg-[#5f54f7] hover:bg-[#4d45d8] text-white shadow-md shadow-[#5f54f7]/25',
};

const ConfirmModal = ({ config, onConfirm, onCancel }) => {
  if (!config) return null;

  const { title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'info' } = config;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Dimmed overlay */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          {/* Icon + Title */}
          <div className="mb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${
              variant === 'danger' || variant === 'logout' ? 'bg-red-50' :
              variant === 'warning' ? 'bg-amber-50' : 'bg-[#eef0ff]'
            }`}>
              {iconMap[variant] || iconMap.info}
            </div>
            <h2 id="confirm-title" className="text-[15px] font-bold text-slate-800">
              {title}
            </h2>
          </div>

          {/* Message */}
          <p className="mb-6 text-sm leading-relaxed text-slate-500">{message}</p>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${confirmBtnMap[variant] || confirmBtnMap.info}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Context ─────────────────────────────────────────────────────────── */
const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setConfig(options);
    });
  }, []);

  const handleConfirm = () => {
    resolverRef.current?.(true);
    setConfig(null);
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    setConfig(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal config={config} onConfirm={handleConfirm} onCancel={handleCancel} />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};
