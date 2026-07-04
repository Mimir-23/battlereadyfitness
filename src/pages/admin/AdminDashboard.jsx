import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaPenToSquare,
  FaClockRotateLeft,
  FaCircleCheck,
  FaMagnifyingGlass,
  FaArrowUpRightFromSquare,
  FaXmark,
  FaShieldHalved,
} from 'react-icons/fa6'
import { SECTIONS, SECTION_BY_KEY } from '../../content/schema'
import { sectionIcon } from '../../admin/sectionIcons'
import { fetchSavedMeta, fetchHistory } from '../../admin/contentApi'
import { Spinner } from '../../admin/ui'

/** Overview: every editable section as a card, plus a simple change log. */
export default function AdminDashboard() {
  const [meta, setMeta] = useState({})
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showGuide, setShowGuide] = useState(
    () => localStorage.getItem('br-admin-guide') !== 'off',
  )

  const dismissGuide = () => {
    localStorage.setItem('br-admin-guide', 'off')
    setShowGuide(false)
  }

  useEffect(() => {
    let active = true
    Promise.all([fetchSavedMeta().catch(() => ({})), fetchHistory(12).catch(() => [])]).then(
      ([m, h]) => {
        if (!active) return
        setMeta(m)
        setHistory(h)
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [])

  const editedCount = Object.keys(meta).filter((k) => SECTION_BY_KEY[k]).length
  const lastChange = history[0]

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SECTIONS
    return SECTIONS.filter(
      (s) =>
        s.label.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="font-display text-4xl text-chalk lg:text-5xl">Contenido del sitio</h1>
        <p className="mt-2 text-sm text-fog">
          Elige una sección para editar sus textos e imágenes. Los cambios se ven en el
          sitio apenas los guardas.
        </p>
      </header>

      {/* First-time guide */}
      {showGuide && (
        <div className="relative mb-6 rounded-2xl border border-battle/30 bg-battle/5 p-5">
          <button
            type="button"
            onClick={dismissGuide}
            aria-label="Ocultar la guía"
            className="absolute right-3 top-3 rounded p-1.5 text-smoke hover:text-chalk"
          >
            <FaXmark size={14} />
          </button>
          <h2 className="font-head text-sm font-bold uppercase tracking-wider text-battle">
            ¿Cómo cambio algo del sitio?
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ['Elige una sección', 'Pulsa la tarjeta de lo que quieres cambiar: fotos, textos, horarios…'],
              ['Edita y mira la vista previa', 'Lo que escribas se muestra al momento tal como se verá en el sitio.'],
              ['Pulsa «Guardar cambios»', 'Recién ahí se publica. Si te arrepientes, puedes descartar o restaurar.'],
            ].map(([title, desc], i) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-battle font-head text-xs font-bold text-ink">
                  {i + 1}
                </span>
                <div>
                  <div className="font-head text-xs font-semibold uppercase tracking-wide text-chalk">
                    {title}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-fog">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-xs text-smoke">
            <FaShieldHalved size={12} className="text-battle" />
            Tranquilo: no puedes romper nada. Cada sección tiene un botón para volver al
            contenido original.
          </p>
        </div>
      )}

      {/* Quick stats + search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-iron bg-coal px-3 py-1.5 text-fog">
            {SECTIONS.length} secciones
          </span>
          <span className="rounded-full border border-battle/40 bg-battle/10 px-3 py-1.5 text-battle">
            {loading ? '…' : `${editedCount} personalizadas`}
          </span>
          {lastChange && (
            <span className="rounded-full border border-iron bg-coal px-3 py-1.5 text-smoke">
              Último cambio: {formatDate(lastChange.changed_at)}
            </span>
          )}
        </div>
        <div className="relative sm:w-64">
          <FaMagnifyingGlass
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-smoke"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar sección…"
            className="w-full rounded-lg border border-iron bg-coal py-2 pl-9 pr-3 text-sm text-chalk placeholder:text-smoke focus:border-battle focus:outline-none"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-iron bg-coal px-4 py-8 text-center text-sm text-smoke">
          Ninguna sección coincide con “{query}”.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => {
            const Icon = sectionIcon(s.icon)
            const edited = meta[s.key]
            return (
              <Link
                key={s.key}
                to={`/admin/${s.key}`}
                className="group flex flex-col rounded-2xl border border-iron bg-coal p-5 transition-colors hover:border-battle/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-battle/15 text-battle">
                    <Icon size={18} />
                  </div>
                  <FaPenToSquare className="text-smoke transition-colors group-hover:text-battle" size={15} />
                </div>
                <h2 className="mt-4 font-head text-base font-semibold uppercase tracking-wide text-chalk">
                  {s.label}
                </h2>
                <p className="mt-1 flex-1 text-sm text-smoke">{s.description}</p>
                <div className="mt-3 text-[11px]">
                  {edited ? (
                    <span className="flex items-center gap-1.5 text-battle">
                      <FaCircleCheck size={11} /> Editado {formatDate(edited.updated_at)}
                    </span>
                  ) : (
                    <span className="text-smoke">Contenido original</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* History */}
      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-head text-sm font-semibold uppercase tracking-wider text-fog">
          <FaClockRotateLeft className="text-battle" /> Historial de cambios
        </h2>
        <div className="mt-4 rounded-2xl border border-iron bg-coal p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="border-iron border-t-battle" />
            </div>
          ) : history.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-smoke">Aún no hay cambios registrados.</p>
          ) : (
            <ul className="divide-y divide-iron">
              {history.map((h) => {
                const section = SECTION_BY_KEY[h.key]
                const row = (
                  <>
                    <span className="flex items-center gap-2 text-chalk">
                      {section?.label || h.key}
                      {section && (
                        <FaArrowUpRightFromSquare
                          size={10}
                          className="text-smoke transition-colors group-hover:text-battle"
                        />
                      )}
                    </span>
                    <span className="text-right text-xs text-smoke">
                      {h.changed_by || '—'} · {formatDate(h.changed_at)}
                    </span>
                  </>
                )
                return (
                  <li key={h.id}>
                    {section ? (
                      <Link
                        to={`/admin/${h.key}`}
                        className="group flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-ink"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                        {row}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('es', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
