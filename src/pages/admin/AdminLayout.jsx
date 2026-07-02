import { useState } from 'react'
import { NavLink, Navigate, Outlet, Link } from 'react-router-dom'
import {
  FaRightFromBracket,
  FaHouse,
  FaBars,
  FaXmark,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6'
import { useAuth } from '../../admin/AuthProvider'
import { Spinner } from '../../admin/ui'
import { SECTIONS } from '../../content/schema'
import { sectionIcon } from '../../admin/sectionIcons'
import SetupNotice from './SetupNotice'

/* ------------------------------------------------------------------ */
/*  Admin shell: auth guard + sidebar navigation around the editor.    */
/* ------------------------------------------------------------------ */

export default function AdminLayout() {
  const { configured, loading, session, isAdmin, user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!configured) return <SetupNotice />
  // isAdmin === null → the admin check is still resolving; keep the spinner
  // so the user never sees a false "Sin acceso" flash right after login.
  if (loading || (session && isAdmin === null)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-ink">
        <Spinner className="h-8 w-8 border-iron border-t-battle" />
      </div>
    )
  }
  if (!session) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <NotAuthorized email={user?.email} onSignOut={signOut} />

  return (
    <div className="min-h-svh bg-ink text-fog lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-iron bg-coal transition-transform lg:static lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-iron px-5 py-4">
            <div>
              <div className="font-display text-2xl leading-none text-chalk">BATTLE READY</div>
              <div className="font-head text-[10px] uppercase tracking-[0.2em] text-battle">
                Panel de contenido
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-smoke hover:text-chalk lg:hidden"
              aria-label="Cerrar menú"
            >
              <FaXmark size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {SECTIONS.map((s) => {
              const Icon = sectionIcon(s.icon)
              return (
                <NavLink
                  key={s.key}
                  to={`/admin/${s.key}`}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-battle/15 font-semibold text-battle'
                        : 'text-fog hover:bg-ink hover:text-chalk'
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0" />
                  {s.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-iron p-3">
            <Link
              to="/"
              target="_blank"
              className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fog hover:bg-ink hover:text-chalk"
            >
              <FaArrowUpRightFromSquare size={14} /> Ver el sitio
            </Link>
            <div className="px-3 pb-2 pt-1 text-[11px] text-smoke">{user?.email}</div>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fog hover:bg-ink hover:text-alert"
            >
              <FaRightFromBracket size={14} /> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-iron bg-coal/80 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setMenuOpen(true)} aria-label="Abrir menú" className="text-chalk">
            <FaBars size={20} />
          </button>
          <Link to="/admin" className="flex items-center gap-2 font-head text-sm font-semibold uppercase tracking-wider text-chalk">
            <FaHouse size={14} /> Panel
          </Link>
        </header>

        <main className="min-w-0 flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NotAuthorized({ email, onSignOut }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ink bg-grid px-5">
      <div className="w-full max-w-sm rounded-2xl border border-iron bg-coal p-6 text-center">
        <h1 className="font-display text-3xl text-chalk">Sin acceso</h1>
        <p className="mt-2 text-sm text-fog">
          La cuenta <strong className="text-chalk">{email}</strong> no está autorizada como
          administrador.
        </p>
        <p className="mt-2 text-xs text-smoke">
          Pide que añadan tu correo a la lista de administradores en Supabase.
        </p>
        <button
          onClick={onSignOut}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-iron px-4 py-2.5 font-head text-xs font-semibold uppercase tracking-wider text-fog hover:text-chalk"
        >
          <FaRightFromBracket size={13} /> Cerrar sesión
        </button>
      </div>
    </div>
  )
}
