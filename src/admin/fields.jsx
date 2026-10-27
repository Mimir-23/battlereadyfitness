import { useId, useRef, useState } from 'react'
import {
  FaUpload,
  FaPlus,
  FaTrashCan,
  FaArrowUp,
  FaArrowDown,
  FaCopy,
  FaChevronDown,
} from 'react-icons/fa6'
import { ICON_NAMES, ICON_LABELS, getIcon } from '../content/icons'
import { uploadImage } from './contentApi'
import { useToast, Spinner } from './ui'

/* ------------------------------------------------------------------ */
/*  Generic, schema-driven form fields for the admin editor.           */
/* ------------------------------------------------------------------ */

const inputCls =
  'w-full rounded-lg border border-iron bg-ink px-3 py-2 text-sm text-chalk placeholder:text-smoke focus:border-battle focus:outline-none'

/* Simple fields get a real <label for>; composite ones (image, icons,
   lists) are a group named by the same text. */
const LABELLED = new Set(['text', 'textarea', 'number', 'select', undefined])

function Label({ field, htmlFor, id, helpId }) {
  const Tag = htmlFor ? 'label' : 'span'
  return (
    <div className="mb-1 flex items-baseline gap-2">
      <Tag id={id} htmlFor={htmlFor} className="font-head text-xs font-semibold uppercase tracking-wider text-fog">
        {field.label}
        {field.required && (
          <span aria-hidden="true" className="ml-0.5 text-alert">
            *
          </span>
        )}
      </Tag>
      {field.help && (
        <span id={helpId} className="text-[0.6875rem] text-smoke">
          — {field.help}
        </span>
      )}
    </div>
  )
}

/* ---------- Image upload ---------- */
function ImageUploader({ value, onChange, label = 'Imagen' }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const notify = useToast()

  const handleFile = async (file) => {
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
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFile(e.dataTransfer.files?.[0])
      }}
      className={`flex items-start gap-3 rounded-xl border border-dashed p-2 transition-colors ${
        dragging ? 'border-battle bg-battle/10' : 'border-transparent'
      }`}
    >
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title="Cambiar imagen"
        aria-label={`Cambiar imagen: ${label}`}
        className="group h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-iron bg-coal"
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover transition-opacity group-hover:opacity-70" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[0.625rem] text-smoke">
            Sin imagen
          </span>
        )}
      </button>
      <div className="flex-1 space-y-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-battle/50 bg-battle/10 px-3 py-2 font-head text-xs font-semibold uppercase tracking-wider text-battle transition-colors hover:bg-battle/20 disabled:opacity-60"
        >
          {busy ? <Spinner className="border-battle/30 border-t-battle" /> : <FaUpload aria-hidden="true" />}
          {busy ? 'Subiendo…' : 'Subir imagen'}
        </button>
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="o pega una URL de imagen"
          aria-label={`${label}: URL de la imagen`}
          className={inputCls}
        />
        <p className="text-[0.6875rem] text-smoke">También puedes arrastrar y soltar la imagen aquí.</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
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
            aria-label={ICON_LABELS[name] || name}
            aria-pressed={active}
            onClick={() => onChange(name)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
              active
                ? 'border-battle bg-battle text-ink'
                : 'border-iron bg-ink text-fog hover:border-battle/50'
            }`}
          >
            <Icon aria-hidden="true" size={18} />
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
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            value={item}
            onChange={(e) => set(i, e.target.value)}
            aria-label={`${itemLabel} ${i + 1}`}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => move(i, -1)}
            disabled={i === 0}
            className="shrink-0 rounded p-1.5 text-smoke hover:text-chalk disabled:opacity-30"
            aria-label={`Subir ${itemLabel.toLowerCase()} ${i + 1}`}
          >
            <FaArrowUp aria-hidden="true" size={11} />
          </button>
          <button
            type="button"
            onClick={() => move(i, 1)}
            disabled={i === list.length - 1}
            className="shrink-0 rounded p-1.5 text-smoke hover:text-chalk disabled:opacity-30"
            aria-label={`Bajar ${itemLabel.toLowerCase()} ${i + 1}`}
          >
            <FaArrowDown aria-hidden="true" size={11} />
          </button>
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 rounded-lg border border-iron p-2 text-smoke hover:border-alert/50 hover:text-alert"
            aria-label={`Eliminar ${itemLabel.toLowerCase()} ${i + 1}`}
          >
            <FaTrashCan aria-hidden="true" size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-battle hover:underline"
      >
        <FaPlus aria-hidden="true" size={11} /> Añadir {itemLabel.toLowerCase()}
      </button>
    </div>
  )
}

/* ---------- One field (dispatches on type) ---------- */
export function FieldInput({ field, value, onChange, id, labelId, describedBy }) {
  // Accessible wiring from FieldRow: the control's id (for <label for>), the
  // label's id (switches, groups) and the help text.
  const a11y = { id, 'aria-describedby': describedBy, 'aria-required': field.required || undefined }
  const group = (children) => (
    <div role="group" aria-labelledby={labelId} aria-describedby={describedBy}>
      {children}
    </div>
  )
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          {...a11y}
          rows={3}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + ' min-h-20 resize-y'}
        />
      )
    case 'number':
      return (
        <input
          {...a11y}
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className={inputCls}
        />
      )
    case 'select':
      return (
        <select {...a11y} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
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
          aria-labelledby={labelId}
          aria-describedby={describedBy}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-ink transition-transform ${
              value ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      )
    case 'image':
      return group(<ImageUploader value={value} onChange={onChange} label={field.label} />)
    case 'icon':
      return group(<IconPicker value={value} onChange={onChange} />)
    case 'string-list':
      return group(<StringList value={value} onChange={onChange} itemLabel={field.itemLabel} />)
    case 'list':
      return group(<ListField field={field} value={value} onChange={onChange} />)
    default:
      return (
        <input
          {...a11y}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputCls}
        />
      )
  }
}

/* ---------- A set of fields for one object ---------- */
function FieldRow({ field: f, value, onChange }) {
  const id = useId()
  const labelId = `${id}-label`
  const helpId = f.help ? `${id}-help` : undefined
  const wiring = { id, labelId, describedBy: helpId }
  if (f.type === 'boolean') {
    return (
      <div>
        <div className="mb-1" />
        <div className="flex items-center gap-3">
          <FieldInput field={f} value={value} onChange={onChange} {...wiring} />
          <span id={labelId} className="font-head text-xs font-semibold uppercase tracking-wider text-fog">
            {f.label}
          </span>
          {f.help && (
            <span id={helpId} className="text-[0.6875rem] text-smoke">
              — {f.help}
            </span>
          )}
        </div>
      </div>
    )
  }
  return (
    <div>
      <Label field={f} htmlFor={LABELLED.has(f.type) ? id : undefined} id={labelId} helpId={helpId} />
      <FieldInput field={f} value={value} onChange={onChange} {...wiring} />
    </div>
  )
}

export function ObjectFields({ fields, value, onChange }) {
  const obj = value || {}
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <FieldRow key={f.name} field={f} value={obj[f.name]} onChange={(v) => onChange({ ...obj, [f.name]: v })} />
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
  const duplicate = (i) => {
    const next = [...list]
    next.splice(i + 1, 0, JSON.parse(JSON.stringify(list[i])))
    onChange(next)
    setOpen(i + 1)
  }
  const remove = (i) => {
    onChange(list.filter((_, j) => j !== i))
    if (open === i) setOpen(-1)
    else if (open > i) setOpen(open - 1)
  }
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    if (open === i) setOpen(j)
    else if (open === j) setOpen(i)
  }
  const labelOf = (it, i) =>
    typeof field.itemLabel === 'function' ? field.itemLabel(it, i) : `Elemento ${i + 1}`

  return (
    <div className="space-y-2">
      {list.length > 1 && (
        <div className="text-[0.6875rem] text-smoke">
          {list.length} elementos — pulsa uno para abrirlo o cerrarlo.
        </div>
      )}
      {list.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-iron bg-coal">
          <div className="flex items-center gap-1 px-3 py-2">
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="flex flex-1 items-center gap-2 text-left font-head text-sm font-semibold text-chalk"
            >
              <FaChevronDown
                aria-hidden="true"
                size={11}
                className={`shrink-0 text-smoke transition-transform ${open === i ? '' : '-rotate-90'}`}
              />
              <span className="text-smoke">#{i + 1}</span> {labelOf(item, i)}
            </button>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1.5 text-smoke hover:text-chalk disabled:opacity-30" aria-label={`Subir: ${labelOf(item, i)}`} title="Subir">
              <FaArrowUp aria-hidden="true" size={12} />
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="rounded p-1.5 text-smoke hover:text-chalk disabled:opacity-30" aria-label={`Bajar: ${labelOf(item, i)}`} title="Bajar">
              <FaArrowDown aria-hidden="true" size={12} />
            </button>
            <button type="button" onClick={() => duplicate(i)} className="rounded p-1.5 text-smoke hover:text-battle" aria-label={`Duplicar: ${labelOf(item, i)}`} title="Duplicar">
              <FaCopy aria-hidden="true" size={12} />
            </button>
            <button type="button" onClick={() => remove(i)} className="rounded p-1.5 text-smoke hover:text-alert" aria-label={`Eliminar: ${labelOf(item, i)}`} title="Eliminar">
              <FaTrashCan aria-hidden="true" size={13} />
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
        <FaPlus aria-hidden="true" size={12} /> Añadir
      </button>
    </div>
  )
}
