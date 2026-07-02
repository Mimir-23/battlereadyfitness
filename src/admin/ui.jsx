/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react'
import { FaCircleCheck, FaCircleExclamation, FaXmark } from 'react-icons/fa6'

/* ------------------------------------------------------------------ */
/*  Small shared admin UI: friendly toast notifications + spinner.     */
/* ------------------------------------------------------------------ */

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="fixed bottom-5 right-5 z-[300] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
              t.type === 'error'
                ? 'border-alert/40 bg-alert/15 text-chalk'
                : 'border-battle/40 bg-coal/95 text-chalk'
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {t.type === 'error' ? (
                <FaCircleExclamation className="text-alert" />
              ) : (
                <FaCircleCheck className="text-battle" />
              )}
            </span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-smoke hover:text-chalk"
              aria-label="Cerrar"
            >
              <FaXmark />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink ${className}`}
    />
  )
}
