import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FaFloppyDisk,
  FaRotateLeft,
  FaTriangleExclamation,
  FaArrowLeftLong,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaCircleCheck,
  FaPenToSquare,
  FaCircleInfo,
  FaArrowUpRightFromSquare,
  FaArrowsRotate,
} from 'react-icons/fa6'
import { SECTIONS, SECTION_BY_KEY, validateSection } from '../../content/schema'
import { DEFAULT_CONTENT } from '../../content/defaults'
import { useContentMeta } from '../../content/ContentProvider'
import { useAuth } from '../../admin/AuthProvider'
import { saveSection, resetSection, fetchSavedMeta } from '../../admin/contentApi'
import { FieldInput, ObjectFields, ListField } from '../../admin/fields'
import ScheduleEditor from '../../admin/ScheduleEditor'
import SectionPreview from '../../admin/preview/Previews'
import PreviewShell from '../../admin/preview/PreviewShell'
import { useToast, useConfirm, useUnsaved, Spinner } from '../../admin/ui'

const clone = (v) => JSON.parse(JSON.stringify(v ?? null))

/** Where each section lives on the public site — for the "see it live" link. */
const SITE_LINK = {
  hero: '/#top',
  nav: '/',
  marquee: '/',
  stats: '/',
  programs: '/#programs',
  why: '/#welcome',
  gallery: '/#gallery',
  videos: '/#videos',
  testimonial: '/',
  cta: '/',
  brand: '/#contact',
  hours: '/#contact',
  schedule: '/schedule',
  plans: '/memberships',
}

export default function AdminSection() {
  const { key } = useParams()
  const section = SECTION_BY_KEY[key]
  const { content, ready } = useContentMeta()

  if (!section) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-fog">Esa sección no existe.</p>
        <Link to="/admin" className="mt-3 inline-block text-battle hover:underline">
          ← Volver al panel
        </Link>
      </div>
    )
  }

  // Wait for the remote content before seeding the editor. Otherwise a direct
  // load of /admin/<key> would edit (and could save over) the defaults instead
  // of the currently published content.
  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8 border-iron border-t-battle" />
      </div>
    )
  }

  // Remount (via key) whenever the section changes so the editor re-seeds its
  // draft from the latest saved content — no setState-in-effect needed.
  return <SectionEditor key={key} sectionKey={key} section={section} initial={content[key]} />
}

function SectionEditor({ sectionKey, section, initial }) {
  const { refresh } = useContentMeta()
  const { user } = useAuth()
  const notify = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const { setDirty: setGlobalDirty } = useUnsaved()
  const key = sectionKey

  const [draft, setDraftRaw] = useState(() => clone(initial))
  const [baseline, setBaseline] = useState(() => clone(initial))
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [errors, setErrors] = useState([])
  // null = still loading · undefined = no override (using defaults)
  const [savedMeta, setSavedMeta] = useState(null)
  // Mobile-only: which pane is on screen (desktop shows both side by side).
  const [tab, setTab] = useState('edit')

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(baseline),
    [draft, baseline],
  )

  // Editing again clears the stale validation list.
  const setDraft = (v) => {
    setDraftRaw(v)
    if (errors.length) setErrors([])
  }

  // Mirror the dirty flag into the shared context so the sidebar can warn
  // before an in-panel navigation drops the draft.
  useEffect(() => {
    setGlobalDirty(dirty)
    return () => setGlobalDirty(false)
  }, [dirty, setGlobalDirty])

  // Warn before closing/reloading the tab with unsaved changes.
  useEffect(() => {
    const handler = (e) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  // Who edited this section last (and whether an override exists at all).
  useEffect(() => {
    let active = true
    fetchSavedMeta()
      .then((m) => {
        if (active) setSavedMeta(m[key])
      })
      .catch(() => {
        if (active) setSavedMeta(undefined)
      })
    return () => {
      active = false
    }
  }, [key])

  const save = async () => {
    const found = validateSection(section, draft)
    if (found.length) {
      setErrors(found)
      notify('Revisa los campos marcados antes de guardar.', 'error')
      return
    }
    setErrors([])
    setSaving(true)
    try {
      await saveSection(key, draft, user?.email)
      await refresh()
      setBaseline(clone(draft))
      setSavedMeta({ updated_at: new Date().toISOString(), updated_by: user?.email })
      notify('Cambios guardados. Ya están en el sitio.')
    } catch (err) {
      notify('No se pudo guardar: ' + (err?.message || 'error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  // Ctrl+S / Cmd+S saves — everyone tries it anyway.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (dirty && !saving) save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const hasOverride = !!savedMeta

  const restoreDefaults = async () => {
    const ok = await confirm({
      title: 'Restaurar contenido original',
      body: 'Esta sección volverá a su contenido de fábrica y se perderá lo que hayas guardado. Esta acción no se puede deshacer.',
      confirmLabel: 'Restaurar',
      danger: true,
    })
    if (!ok) return
    setResetting(true)
    try {
      await resetSection(key)
      await refresh()
      const original = clone(DEFAULT_CONTENT[key])
      setDraftRaw(original)
      setBaseline(original)
      setSavedMeta(undefined)
      setErrors([])
      notify('Sección restaurada a los valores originales.')
    } catch (err) {
      notify('No se pudo restaurar: ' + (err?.message || 'error'), 'error')
    } finally {
      setResetting(false)
    }
  }

  const guardedGo = async (to) => {
    if (dirty) {
      const ok = await confirm({
        title: 'Cambios sin guardar',
        body: 'Si sales ahora perderás los cambios que no has guardado.',
        confirmLabel: 'Salir sin guardar',
        danger: true,
      })
      if (!ok) return
      setGlobalDirty(false)
    }
    navigate(to)
  }

  const idx = SECTIONS.findIndex((s) => s.key === key)
  const prevSection = SECTIONS[idx - 1]
  const nextSection = SECTIONS[idx + 1]

  return (
    <div className="mx-auto max-w-6xl pb-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => guardedGo('/admin')}
          className="inline-flex items-center gap-2 text-sm text-smoke hover:text-chalk"
        >
          <FaArrowLeftLong size={13} /> Panel
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => prevSection && guardedGo(`/admin/${prevSection.key}`)}
            disabled={!prevSection}
            title={prevSection ? `Anterior: ${prevSection.label}` : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg border border-iron px-2.5 py-1.5 text-xs text-smoke hover:text-chalk disabled:opacity-30"
          >
            <FaChevronLeft size={10} />
            <span className="hidden sm:inline">{prevSection?.label || 'Anterior'}</span>
          </button>
          <button
            onClick={() => nextSection && guardedGo(`/admin/${nextSection.key}`)}
            disabled={!nextSection}
            title={nextSection ? `Siguiente: ${nextSection.label}` : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg border border-iron px-2.5 py-1.5 text-xs text-smoke hover:text-chalk disabled:opacity-30"
          >
            <span className="hidden sm:inline">{nextSection?.label || 'Siguiente'}</span>
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="font-display text-4xl text-chalk">{section.label}</h1>
          <a
            href={SITE_LINK[key] || '/'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-iron px-2.5 py-1.5 font-head text-[11px] font-semibold uppercase tracking-wider text-smoke transition-colors hover:border-battle/50 hover:text-battle"
          >
            <FaArrowUpRightFromSquare size={10} /> Ver en el sitio
          </a>
        </div>
        <p className="mt-1 text-sm text-fog">{section.description}</p>
        {savedMeta !== null && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-smoke">
            {hasOverride ? (
              <>
                <FaCircleCheck size={11} className="text-battle" />
                Última edición: {formatDate(savedMeta.updated_at)}
                {savedMeta.updated_by ? ` · ${savedMeta.updated_by}` : ''}
              </>
            ) : (
              'Mostrando el contenido original — aún no se ha editado.'
            )}
          </p>
        )}
      </header>

      {errors.length > 0 && (
        <div className="mb-6 rounded-xl border border-alert/40 bg-alert/10 p-4">
          <div className="flex items-center gap-2 font-head text-xs font-bold uppercase tracking-wider text-alert">
            <FaTriangleExclamation size={13} /> Faltan datos para poder guardar
          </div>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-chalk">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* What-you-see hint for first-time editors */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-iron bg-coal/60 px-4 py-3 text-sm text-fog">
        <FaCircleInfo size={14} className="mt-0.5 shrink-0 text-battle" />
        <p>
          Escribe y la <strong className="text-chalk">vista previa</strong> se actualiza al
          instante. Nada cambia en el sitio real hasta que pulses{' '}
          <strong className="text-chalk">Guardar cambios</strong>.
        </p>
      </div>

      {/* Mobile: switch between editing and preview */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-iron bg-coal p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setTab('edit')}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-head text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === 'edit' ? 'bg-battle text-ink' : 'text-fog'
          }`}
        >
          <FaPenToSquare size={12} /> Editar
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-head text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === 'preview' ? 'bg-battle text-ink' : 'text-fog'
          }`}
        >
          <FaEye size={12} /> Vista previa
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className={tab === 'edit' ? '' : 'hidden lg:block'}>
          {SYNC_PANELS[key] && <RecessSyncPanel {...SYNC_PANELS[key]} />}
          <SectionEditorBody section={section} draft={draft} setDraft={setDraft} />
        </div>

        {/* Live preview */}
        <div
          className={`lg:sticky lg:top-8 lg:self-start ${
            tab === 'preview' ? '' : 'hidden lg:block'
          }`}
        >
          <div className="mb-2 flex items-center gap-2 font-head text-xs font-semibold uppercase tracking-wider text-smoke">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-battle opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-battle" />
            </span>
            Vista previa en vivo — así se verá en el sitio
          </div>
          <PreviewShell draft={draft}>
            <SectionPreview sectionKey={key} draft={draft} />
          </PreviewShell>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-iron bg-coal/95 backdrop-blur lg:left-72">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 lg:px-8">
          {dirty ? (
            <span className="flex items-center gap-2 text-xs text-battle">
              <FaTriangleExclamation size={12} /> Cambios sin guardar
            </span>
          ) : (
            <span className="text-xs text-smoke">Todo guardado</span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={restoreDefaults}
              disabled={resetting || !hasOverride}
              title={
                hasOverride
                  ? 'Vuelve al contenido de fábrica'
                  : 'Esta sección ya muestra el contenido original'
              }
              className="inline-flex items-center gap-2 rounded-lg border border-iron px-3 py-2 font-head text-xs font-semibold uppercase tracking-wider text-smoke hover:text-chalk disabled:opacity-40"
            >
              {resetting ? <Spinner className="border-iron border-t-chalk" /> : <FaRotateLeft size={12} />}
              <span className="hidden sm:inline">Restaurar original</span>
            </button>
            <button
              onClick={() => {
                setDraftRaw(clone(baseline))
                setErrors([])
              }}
              disabled={!dirty}
              className="rounded-lg border border-iron px-3 py-2 font-head text-xs font-semibold uppercase tracking-wider text-smoke hover:text-chalk disabled:opacity-40"
            >
              Descartar
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
              title="Ctrl+S"
              className="inline-flex items-center gap-2 rounded-lg bg-battle px-5 py-2.5 font-head text-xs font-bold uppercase tracking-widest text-ink transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {saving ? <Spinner /> : <FaFloppyDisk size={13} />}
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Qué módulos tienen sincronización con Recess y con qué textos/clave. */
const SYNC_PANELS = {
  plans: {
    settingKey: 'plansSync',
    what: 'los planes',
    activeText:
      'Activa — cada día a las 12 pm los planes se actualizan con los paquetes y precios de Recess.',
    pausedText:
      'Pausada — los planes quedan como están y puedes editarlos sin que se sobrescriban.',
  },
  schedule: {
    settingKey: 'scheduleSync',
    what: 'el horario',
    activeText:
      'Activa — cada día a las 12 pm el horario se actualiza con el calendario de clases de Recess.',
    pausedText:
      'Pausada — el horario queda como está y puedes editarlo sin que se sobrescriba.',
  },
}

/**
 * Interruptor de la sincronización automática con Recess. Es un ajuste, no
 * contenido: se guarda al instante en su propia clave (plansSync /
 * scheduleSync) sin pasar por el borrador/Guardar de la sección.
 */
function RecessSyncPanel({ settingKey, what, activeText, pausedText }) {
  const { content, refresh } = useContentMeta()
  const { user } = useAuth()
  const notify = useToast()
  const [busy, setBusy] = useState(false)
  const paused = !!content[settingKey]?.paused
  const active = !paused

  const toggle = async () => {
    setBusy(true)
    try {
      await saveSection(settingKey, { paused: active }, user?.email)
      await refresh()
      notify(
        active
          ? `Sincronización pausada. No se tocará ${what} hasta que la actives de nuevo.`
          : `Sincronización activada. Recess actualizará ${what} cada día a las 12 pm.`,
      )
    } catch (err) {
      notify('No se pudo cambiar: ' + (err?.message || 'error'), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-5 rounded-xl border border-iron bg-coal p-4">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            active ? 'bg-battle/10 text-battle' : 'bg-iron/40 text-smoke'
          }`}
        >
          <FaArrowsRotate size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-head text-xs font-bold uppercase tracking-wider text-chalk">
            Sincronización automática con Recess
          </div>
          <div className="mt-0.5 text-xs text-smoke">{active ? activeText : pausedText}</div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          role="switch"
          aria-checked={active}
          aria-label="Sincronización automática con Recess"
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
            active ? 'bg-battle' : 'bg-iron'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-transform ${
              active ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

/** Picks the right editor for the section's shape. */
function SectionEditorBody({ section, draft, setDraft }) {
  if (section.shape === 'object') {
    return <ObjectFields fields={section.fields} value={draft} onChange={setDraft} />
  }
  if (section.shape === 'list') {
    return (
      <ListField
        field={{ item: section.item, itemLabel: section.itemLabel, newItem: section.newItem }}
        value={draft}
        onChange={setDraft}
      />
    )
  }
  if (section.shape === 'string-list') {
    return (
      <FieldInput
        field={{ type: 'string-list', itemLabel: section.itemLabel }}
        value={draft}
        onChange={setDraft}
      />
    )
  }
  if (section.shape === 'custom' && section.custom === 'schedule') {
    return <ScheduleEditor value={draft} onChange={setDraft} />
  }
  return <p className="text-sm text-smoke">Editor no disponible.</p>
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
