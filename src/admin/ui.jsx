/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { FaCircleCheck, FaCircleExclamation, FaXmark, FaTriangleExclamation } from 'react-icons/fa6'

/* ------------------------------------------------------------------ */
/*  Small shared admin UI: toasts, spinner, confirm dialog and the     */
/*  shared "unsaved changes" flag that guards in-panel navigation.     */
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

/* ---------- Confirm dialog (replaces window.confirm) ---------- */

const ConfirmContext = createContext(() => Promise.resolve(true))

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null)

  const confirm = useCallback(
    (opts) => new Promise((resolve) => setDialog({ ...opts, resolve })),
    [],
  )
  const close = useCallback(
    (ok) => {
      dialog?.resolve(ok)
      setDialog(null)
    },
    [dialog],
  )

  useEffect(() => {
    if (!dialog) return
    const onKey = (e) => {
      if (e.key === 'Escape') close(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog, close])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-ink/70 px-5 backdrop-blur-sm"
          onClick={() => close(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-iron bg-coal p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  dialog.danger ? 'bg-alert/15 text-alert' : 'bg-battle/15 text-battle'
                }`}
              >
                <FaTriangleExclamation size={16} />
              </span>
              <div>
                <h2 className="font-head text-sm font-bold uppercase tracking-wide text-chalk">
                  {dialog.title}
                </h2>
                {dialog.body && <p className="mt-1.5 text-sm text-fog">{dialog.body}</p>}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => close(false)}
                className="rounded-lg border border-iron px-4 py-2 font-head text-xs font-semibold uppercase tracking-wider text-fog hover:text-chalk"
              >
                Cancelar
              </button>
              <button
                autoFocus
                onClick={() => close(true)}
                className={`rounded-lg px-4 py-2 font-head text-xs font-bold uppercase tracking-wider ${
                  dialog.danger
                    ? 'bg-alert text-chalk hover:bg-alert/90'
                    : 'bg-battle text-ink hover:bg-battle/90'
                }`}
              >
                {dialog.confirmLabel || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  return useContext(ConfirmContext)
}

/* ---------- Global unsaved-changes flag ---------- */
/* The section editor sets it; the sidebar reads it to warn before a
   navigation inside the SPA would silently drop an unsaved draft
   (beforeunload only covers closing/reloading the tab). */

const UnsavedContext = createContext({ dirty: false, setDirty: () => {} })

export function UnsavedProvider({ children }) {
  const [dirty, setDirty] = useState(false)
  return (
    <UnsavedContext.Provider value={{ dirty, setDirty }}>{children}</UnsavedContext.Provider>
  )
}

export function useUnsaved() {
  return useContext(UnsavedContext)
}
