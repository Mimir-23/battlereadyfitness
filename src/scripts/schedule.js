import {
  matches,
  dayChip,
  dayChipWithCount,
  chipDot,
  chipCount,
  dayHeader,
  dayHeaderSub,
  dayCell,
  classCell,
  legendPill,
} from '../lib/ui-state.js'
import { setRecessSrc } from './recess.js'

/* Class schedule: day filter (desktop focus + mobile agenda), today marker,
   class highlight from the legend/hover, and picking a class to load it
   straight into the booking terminal. */

const root = document.querySelector('[data-schedule]')

if (root) {
  /** Today's three-letter label (Sun–Sat), in the visitor's local time. */
  const TODAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
  const chips = [...root.querySelectorAll('[data-day-chip]')]
  const heads = [...root.querySelectorAll('[data-day-head]')]
  const cells = [...root.querySelectorAll('[data-day-cell]')]
  const classCells = [...root.querySelectorAll('[data-class-cell]')]
  const legends = [...root.querySelectorAll('[data-legend]')]
  const agendas = [...root.querySelectorAll('[data-agenda]')]
  const days = heads.map((h) => h.dataset.dayHead)

  let activeDay = 'all'
  let hoverClass = null

  const render = () => {
    const focus = activeDay !== 'all'
    for (const chip of chips) {
      const d = chip.dataset.dayChip
      const isActive = activeDay === d
      if (d === 'all') {
        chip.className = dayChip(isActive)
        continue
      }
      chip.className = dayChipWithCount(isActive)
      const dot = chip.querySelector('[data-chip-dot]')
      dot.hidden = d !== TODAY
      dot.className = chipDot(isActive)
      chip.querySelector('[data-chip-count]').className = chipCount(isActive)
    }
    for (const head of heads) {
      const d = head.dataset.dayHead
      const isActive = d === activeDay
      head.className = dayHeader(isActive, d === TODAY, focus && !isActive)
      head.querySelector('[data-head-sub]').className = dayHeaderSub(isActive)
      head.querySelector('[data-today-bar]').hidden = !(d === TODAY && !isActive)
    }
    for (const cell of cells) {
      const d = cell.dataset.dayCell
      const isActive = d === activeDay
      cell.className = dayCell(isActive, d === TODAY, focus && !isActive)
    }
    for (const a of classCells) a.className = classCell(matches(a.dataset.className, hoverClass))
    for (const pill of legends) pill.className = legendPill(matches(hoverClass, pill.dataset.legend))
    for (const list of agendas) list.hidden = list.dataset.agenda !== activeDay
  }

  const setDay = (d) => {
    // Guard against a custom day list that doesn't contain the selection.
    activeDay = d === 'all' || days.includes(d) ? d : 'all'
    render()
  }
  const setHover = (name) => {
    if (name === hoverClass) return
    hoverClass = name
    for (const a of classCells) a.className = classCell(matches(a.dataset.className, hoverClass))
    for (const pill of legends) pill.className = legendPill(matches(hoverClass, pill.dataset.legend))
  }

  chips.forEach((chip) => chip.addEventListener('click', () => setDay(chip.dataset.dayChip)))
  heads.forEach((head) =>
    head.addEventListener('click', () => setDay(head.dataset.dayHead === activeDay ? 'all' : head.dataset.dayHead)),
  )
  cells.forEach((cell) => {
    const name = cell.querySelector('[data-class-cell]')?.dataset.className
    cell.addEventListener('mouseenter', () => name && setHover(name))
    cell.addEventListener('mouseleave', () => setHover(null))
  })
  legends.forEach((pill) => {
    pill.addEventListener('mouseenter', () => setHover(pill.dataset.legend))
    pill.addEventListener('mouseleave', () => setHover(null))
  })

  /* ---------- booking: the terminal loads the class that was picked ---------- */
  const booking = document.querySelector('#book')
  const embed = booking?.querySelector('[data-recess]')
  const bar = booking?.querySelector('[data-selected-bar]')
  const fullCalendar = root.dataset.bookingUrl

  const select = (picked) => {
    if (!embed) return
    bar.hidden = !picked
    if (picked) booking.querySelector('[data-selected-name]').textContent = picked.name
    setRecessSrc(
      embed,
      picked ? picked.src : fullCalendar,
      picked ? `Battle Ready — Book ${picked.name}` : 'Battle Ready — Book a Class',
    )
  }
  root.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-class-name]')
    if (!a) return
    // Classes synced from Recess carry their id; hand-edited ones don't, and
    // the click just goes down to the full calendar.
    select(a.dataset.bookSrc ? { src: a.dataset.bookSrc, name: a.dataset.className } : null)
  })
  booking?.querySelector('[data-clear-selection]')?.addEventListener('click', () => select(null))

  render()
}
