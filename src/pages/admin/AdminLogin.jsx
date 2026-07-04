import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FaLock, FaArrowRightLong, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { useAuth } from '../../admin/AuthProvider'
import { Spinner } from '../../admin/ui'
import SetupNotice from './SetupNotice'

/** Admin sign-in screen. */
export default function AdminLogin() {
  const { signIn, session, isAdmin, loading, configured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!configured) return <SetupNotice />
  if (loading || (session && isAdmin === null)) return <CenterSpinner />
  if (session && isAdmin) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Escribe tu correo y contraseña.')
      return
    }
    setBusy(true)
    const err = await signIn(email.trim(), password)
    setBusy(false)
    if (err) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink bg-grid px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-battle text-ink">
            <FaLock size={22} />
          </div>
          <h1 className="font-display text-4xl text-chalk">PANEL DE CONTROL</h1>
          <p className="mt-1 text-sm text-smoke">Battle Ready Fitness — Administración</p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-iron bg-coal p-6"
        >
          {session && isAdmin === false && (
            <p className="rounded-lg border border-alert/40 bg-alert/10 px-3 py-2 text-sm text-chalk">
              Esta cuenta no tiene permiso de administrador.
            </p>
          )}
          <div>
            <label className="mb-1 block font-head text-xs font-semibold uppercase tracking-wider text-fog">
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-iron bg-ink px-3 py-2.5 text-sm text-chalk focus:border-battle focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-head text-xs font-semibold uppercase tracking-wider text-fog">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-iron bg-ink px-3 py-2.5 pr-10 text-sm text-chalk focus:border-battle focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-smoke hover:text-chalk"
              >
                {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-alert">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-battle px-4 py-3 font-head text-sm font-bold uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {busy ? <Spinner /> : <>Entrar <FaArrowRightLong /></>}
          </button>
        </form>
      </div>
    </div>
  )
}

function CenterSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ink">
      <Spinner className="h-8 w-8 border-iron border-t-battle" />
    </div>
  )
}
