import { FaPlus, FaTrashCan, FaArrowUp, FaArrowDown } from 'react-icons/fa6'

/* ------------------------------------------------------------------ */
/*  Custom editor for the weekly class timetable.                      */
/*  Value shape: { days: string[], rows: [{ time, classes: {Day:''} }]}*/
/* ------------------------------------------------------------------ */

const inputCls =
  'w-full rounded-md border border-iron bg-ink px-2 py-1.5 text-sm text-chalk placeholder:text-smoke focus:border-battle focus:outline-none'

export default function ScheduleEditor({ value, onChange }) {
  const days = value?.days || []
  const rows = value?.rows || []

  const setRows = (next) => onChange({ ...value, rows: next })
  const setDays = (next) => onChange({ ...value, days: next })

  const setTime = (i, time) => setRows(rows.map((r, j) => (j === i ? { ...r, time } : r)))
  const setCell = (i, day, name) =>
    setRows(
      rows.map((r, j) =>
        j === i ? { ...r, classes: { ...r.classes, [day]: name } } : r,
      ),
    )
  const addRow = () =>
    setRows([...rows, { time: '', classes: Object.fromEntries(days.map((d) => [d, ''])) }])
  const removeRow = (i) => setRows(rows.filter((_, j) => j !== i))
  const moveRow = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= rows.length) return
    const next = [...rows]
    ;[next[i], next[j]] = [next[j], next[i]]
    setRows(next)
  }

  return (
    <div className="space-y-5">
      {/* Days */}
      <div>
        <div className="mb-1 font-head text-xs font-semibold uppercase tracking-wider text-fog">
          Días de la semana
        </div>
        <div className="flex flex-wrap gap-2">
          {days.map((d, i) => (
            <div key={i} className="flex items-center gap-1 rounded-md border border-iron bg-coal px-2 py-1">
              <input
                value={d}
                onChange={(e) => {
                  const old = days[i]
                  const nd = e.target.value
                  // Single onChange: updating days and rows separately would
                  // make the second update overwrite the first (both start
                  // from the same stale value) and lose the rename.
                  onChange({
                    ...value,
                    days: days.map((x, j) => (j === i ? nd : x)),
                    // migrate cell keys to the renamed day
                    rows: rows.map((r) => {
                      const { [old]: v, ...rest } = r.classes || {}
                      return { ...r, classes: { ...rest, [nd]: v ?? '' } }
                    }),
                  })
                }}
                className="w-16 bg-transparent text-sm text-chalk focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setDays(days.filter((_, j) => j !== i))
                }}
                className="text-smoke hover:text-alert"
                aria-label="Quitar día"
              >
                <FaTrashCan size={11} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDays([...days, 'Nuevo'])}
            className="inline-flex items-center gap-1 rounded-md border border-dashed border-iron px-2 py-1 text-xs text-fog hover:border-battle/50 hover:text-battle"
          >
            <FaPlus size={10} /> Día
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-iron bg-coal p-2 text-left font-head text-xs uppercase tracking-wider text-smoke">
                Hora
              </th>
              {days.map((d, i) => (
                <th
                  key={i}
                  className="border border-iron bg-coal p-2 text-left font-head text-xs uppercase tracking-wider text-smoke"
                >
                  {d}
                </th>
              ))}
              <th className="border border-iron bg-coal p-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="border border-iron p-1.5">
                  <input
                    value={r.time || ''}
                    onChange={(e) => setTime(i, e.target.value)}
                    placeholder="6:00 AM"
                    className={inputCls + ' w-24'}
                  />
                </td>
                {days.map((d, di) => (
                  <td key={di} className="border border-iron p-1.5">
                    <input
                      value={r.classes?.[d] || ''}
                      onChange={(e) => setCell(i, d, e.target.value)}
                      placeholder="—"
                      className={inputCls}
                    />
                  </td>
                ))}
                <td className="border border-iron p-1.5">
                  <div className="flex items-center justify-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveRow(i, -1)}
                      disabled={i === 0}
                      className="rounded p-1 text-smoke hover:text-chalk disabled:opacity-30"
                      aria-label="Subir fila"
                      title="Subir"
                    >
                      <FaArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRow(i, 1)}
                      disabled={i === rows.length - 1}
                      className="rounded p-1 text-smoke hover:text-chalk disabled:opacity-30"
                      aria-label="Bajar fila"
                      title="Bajar"
                    >
                      <FaArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="rounded p-1 text-smoke hover:text-alert"
                      aria-label="Eliminar fila"
                      title="Eliminar"
                    >
                      <FaTrashCan size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-iron px-4 py-2.5 font-head text-xs font-semibold uppercase tracking-wider text-fog transition-colors hover:border-battle/50 hover:text-battle"
      >
        <FaPlus size={12} /> Añadir franja horaria
      </button>
    </div>
  )
}
