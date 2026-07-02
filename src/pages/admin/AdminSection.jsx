import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FaFloppyDisk,
  FaRotateLeft,
  FaTriangleExclamation,
  FaArrowLeftLong,
  FaEye,
} from 'react-icons/fa6'
import { SECTION_BY_KEY, validateSection } from '../../content/schema'
import { DEFAULT_CONTENT } from '../../content/defaults'
import { useContentMeta } from '../../content/ContentProvider'
import { useAuth } from '../../admin/AuthProvider'
import { saveSection, resetSection } from '../../admin/contentApi'
import { FieldInput, ObjectFields, ListField } from '../../admin/fields'
import ScheduleEditor from '../../admin/ScheduleEditor'
import SectionPreview from '../../admin/preview/Previews'
import { useToast, Spinner } from '../../admin/ui'

const clone = (v) => JSON.parse(JSON.stringify(v ?? null))

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
  const key = sectionKey

  const [draft, setDraft] = useState(() => clone(initial))
  const [baseline, setBaseline] = useState(() => clone(initial))
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(baseline),
    [draft, baseline],
  )

  // Warn before leaving with unsaved changes.
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

  const save = async () => {
    const errors = validateSection(section, draft)
    if (errors.length) {
      notify(errors[0], 'error')
      return
    }
    setSaving(true)
    try {
      await saveSection(key, draft, user?.email)
      await refresh()
      setBaseline(clone(draft))
      notify('Cambios guardados. Ya están en el sitio.')
    } catch (err) {
      notify('No se pudo guardar: ' + (err?.message || 'error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const restoreDefaults = async () => {
    if (!window.confirm('¿Restaurar esta sección a su contenido original? Se perderán tus cambios guardados.')) return
    setResetting(true)
    try {
      await resetSection(key)
      await refresh()
      const original = clone(DEFAULT_CONTENT[key])
      setDraft(original)
      setBaseline(original)
      notify('Sección restaurada a los valores originales.')
    } catch (err) {
      notify('No se pudo restaurar: ' + (err?.message || 'error'), 'error')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl pb-24">
      <Link to="/admin" className="mb-4 inline-flex items-center gap-2 text-sm text-smoke hover:text-chalk">
        <FaArrowLeftLong size={13} /> Panel
      </Link>

      <header className="mb-6">
        <h1 className="font-display text-4xl text-chalk">{section.label}</h1>
        <p className="mt-1 text-sm text-fog">{section.description}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div>
          <SectionEditorBody section={section} draft={draft} setDraft={setDraft} />
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <div className="mb-2 flex items-center gap-2 font-head text-xs font-semibold uppercase tracking-wider text-smoke">
            <FaEye size={13} /> Vista previa en vivo
          </div>
          <div className="rounded-2xl border border-iron bg-ink p-4">
            <SectionPreview sectionKey={key} draft={draft} />
          </div>
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
              disabled={resetting}
              className="inline-flex items-center gap-2 rounded-lg border border-iron px-3 py-2 font-head text-xs font-semibold uppercase tracking-wider text-smoke hover:text-chalk disabled:opacity-50"
            >
              {resetting ? <Spinner className="border-iron border-t-chalk" /> : <FaRotateLeft size={12} />}
              <span className="hidden sm:inline">Restaurar original</span>
            </button>
            <button
              onClick={() => setDraft(clone(baseline))}
              disabled={!dirty}
              className="rounded-lg border border-iron px-3 py-2 font-head text-xs font-semibold uppercase tracking-wider text-smoke hover:text-chalk disabled:opacity-40"
            >
              Descartar
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
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
