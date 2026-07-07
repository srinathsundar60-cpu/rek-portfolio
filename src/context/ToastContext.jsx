import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type, hiding: false }]);

    // Trigger hiding animation before removal
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, hiding: true } : t))
      );
    }, duration - 400);

    // Remove from state
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const icons = { info: 'ℹ️', success: '✅', error: '❌' };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div id="toastContainer">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type} ${t.hiding ? 'hiding' : ''}`}>
              <span className="toast-icon">{icons[t.type] || '💬'}</span>
              <span className="toast-msg">{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};
