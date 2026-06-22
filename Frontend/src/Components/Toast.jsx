import React, { useEffect, useState } from 'react';

// Toast hook - use this in components
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
  };

  return { toasts, toast };
};

// Toast container - render this once per page
const Toast = ({ toasts }) => {
  if (!toasts?.length) return null;

  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-slate-700 text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
            animate-[slideIn_0.3s_ease] min-w-[260px] max-w-[360px] ${styles[t.type]}`}
        >
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            {icons[t.type]}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;