import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPenToSquare, FaClockRotateLeft, FaCircleCheck } from 'react-icons/fa6'
import { SECTIONS, SECTION_BY_KEY } from '../../content/schema'
import { sectionIcon } from '../../admin/sectionIcons'
import { fetchSavedMeta, fetchHistory } from '../../admin/contentApi'
import { Spinner } from '../../admin/ui'

/** Overview: every editable section as a card, plus a simple change log. */
export default function AdminDashboard() {
  const [meta, setMeta] = useState({})
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="font-display text-4xl text-chalk lg:text-5xl">Contenido del sitio</h1>
        <p className="mt-2 text-sm text-fog">
          Elige una sección para editar sus textos e imágenes. Los cambios se ven en el
          sitio apenas los guardas.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => {
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
              {edited && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-battle">
                  <FaCircleCheck size={11} /> Editado {formatDate(edited.updated_at)}
                </div>
              )}
            </Link>
          )
        })}
      </div>

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
              {history.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="text-chalk">
                    {SECTION_BY_KEY[h.key]?.label || h.key}
                  </span>
                  <span className="text-right text-xs text-smoke">
                    {h.changed_by || '—'} · {formatDate(h.changed_at)}
                  </span>
                </li>
              ))}
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
