import { useRef, useState } from 'react'
import {
  FaUpload,
  FaPlus,
  FaTrashCan,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa6'
import { ICON_NAMES, ICON_LABELS, getIcon } from '../content/icons'
import { uploadImage } from './contentApi'
import { useToast, Spinner } from './ui'

/* ------------------------------------------------------------------ */
/*  Generic, schema-driven form fields for the admin editor.           */
/* ------------------------------------------------------------------ */

const inputCls =
  'w-full rounded-lg border border-iron bg-ink px-3 py-2 text-sm text-chalk placeholder:text-smoke focus:border-battle focus:outline-none'

function Label({ field }) {
  return (
    <div className="mb-1 flex items-baseline gap-2">
      <label className="font-head text-xs font-semibold uppercase tracking-wider text-fog">
        {field.label}
        {field.required && <span className="ml-0.5 text-alert">*</span>}
      </label>
      {field.help && <span className="text-[11px] text-smoke">— {field.help}</span>}
    </div>
  )
}

/* ---------- Image upload ---------- */
function ImageUploader({ value, onChange }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const notify = useToast()

  const pick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      notify('El archivo debe ser una imagen.', 'error')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      notify('La imagen es muy pesada (máx. 8 MB).', 'error')
      return
    }
    setBusy(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
      notify('Imagen subida.')
    } catch (err) {
      notify('No se pudo subir la imagen: ' + (err?.message || 'error'), 'error')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-iron bg-coal">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-smoke">
            Sin imagen
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-battle/50 bg-battle/10 px-3 py-2 font-head text-xs font-semibold uppercase tracking-wider text-battle transition-colors hover:bg-battle/20 disabled:opacity-60"
        >
          {busy ? <Spinner className="border-battle/30 border-t-battle" /> : <FaUpload />}
          {busy ? 'Subiendo…' : 'Subir imagen'}
        </button>
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="o pega una URL de imagen"
          className={inputCls}
        />
        <input ref={fileRef} type="file" accept="image/*" onChange={pick} className="hidden" />
      </div>
    </div>
  )
}

/* ---------- Icon picker ---------- */
function IconPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ICON_NAMES.map((name) => {
        const Icon = getIcon(name)
        const active = value === name
        return (
          <button
            key={name}
            type="button"
            title={ICON_LABELS[name] || name}
            onClick={() => onChange(name)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
              active
                ? 'border-battle bg-battle text-ink'
                : 'border-iron bg-ink text-fog hover:border-battle/50'
            }`}
          >
            <Icon size={18} />
          </button>
        )
      })}
    </div>
  )
}

/* ---------- List of plain strings ---------- */
function StringList({ value, onChange, itemLabel = 'Elemento' }) {
  const list = Array.isArray(value) ? value : []
  const set = (i, v) => onChange(list.map((x, j) => (j === i ? v : x)))
  const add = () => onChange([...list, ''])
  const remove = (i) => onChange(list.filter((_, j) => j !== i))
  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={item} onChange={(e) => set(i, e.target.value)} className={inputCls} />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 rounded-lg border border-iron p-2 text-smoke hover:border-alert/50 hover:text-alert"
            aria-label="Eliminar"
          >
            <FaTrashCan size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-battle hover:underline"
      >
        <FaPlus size={11} /> Añadir {itemLabel.toLowerCase()}
      </button>
    </div>
  )
}

/* ---------- One field (dispatches on type) ---------- */
export function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          rows={3}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )
    case 'number':
      return (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className={inputCls}
        />
      )
    case 'select':
      return (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
    case 'boolean':
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            value ? 'bg-battle' : 'bg-iron'
          }`}
          role="switch"
          aria-checked={!!value}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-transform ${
              value ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      )
    case 'image':
      return <ImageUploader value={value} onChange={onChange} />
    case 'icon':
      return <IconPicker value={value} onChange={onChange} />
    case 'string-list':
      return <StringList value={value} onChange={onChange} itemLabel={field.itemLabel} />
    case 'list':
      return <ListField field={field} value={value} onChange={onChange} />
    default:
      return (
        <input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputCls}
        />
      )
  }
}

/* ---------- A set of fields for one object ---------- */
export function ObjectFields({ fields, value, onChange }) {
  const obj = value || {}
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          {f.type !== 'boolean' ? (
            <Label field={f} />
          ) : (
            <div className="mb-1" />
          )}
          {f.type === 'boolean' ? (
            <div className="flex items-center gap-3">
              <FieldInput
                field={f}
                value={obj[f.name]}
                onChange={(v) => onChange({ ...obj, [f.name]: v })}
              />
              <span className="font-head text-xs font-semibold uppercase tracking-wider text-fog">
                {f.label}
              </span>
            </div>
          ) : (
            <FieldInput
              field={f}
              value={obj[f.name]}
              onChange={(v) => onChange({ ...obj, [f.name]: v })}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ---------- A list of object items (add / remove / reorder) ---------- */
export function ListField({ field, value, onChange }) {
  const list = Array.isArray(value) ? value : []
  const [open, setOpen] = useState(0)

  const update = (i, item) => onChange(list.map((x, j) => (j === i ? item : x)))
  const add = () => {
    onChange([...list, field.newItem ? field.newItem() : {}])
    setOpen(list.length)
  }
  const remove = (i) => onChange(list.filter((_, j) => j !== i))
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const labelOf = (it, i) =>
    typeof field.itemLabel === 'function' ? field.itemLabel(it, i) : `Elemento ${i + 1}`

  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-iron bg-coal">
          <div className="flex items-center gap-1 px-3 py-2">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex-1 text-left font-head text-sm font-semibold text-chalk"
            >
              <span className="text-smoke">#{i + 1}</span> {labelOf(item, i)}
            </button>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1.5 text-smoke hover:text-chalk disabled:opacity-30" aria-label="Subir">
              <FaArrowUp size={12} />
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="rounded p-1.5 text-smoke hover:text-chalk disabled:opacity-30" aria-label="Bajar">
              <FaArrowDown size={12} />
            </button>
            <button type="button" onClick={() => remove(i)} className="rounded p-1.5 text-smoke hover:text-alert" aria-label="Eliminar">
              <FaTrashCan size={13} />
            </button>
          </div>
          {open === i && (
            <div className="border-t border-iron p-4">
              <ObjectFields fields={field.item} value={item} onChange={(it) => update(i, it)} />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-iron px-4 py-2.5 font-head text-xs font-semibold uppercase tracking-wider text-fog transition-colors hover:border-battle/50 hover:text-battle"
      >
        <FaPlus size={12} /> Añadir
      </button>
    </div>
  )
}
