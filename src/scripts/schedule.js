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
import { announce } from './core.js'

/* Class schedule: day filter (desktop focus + mobile agenda), today marker,
   class highlight from the legend/hover, and picking a class to load it
   straight into the booking terminal. */

export function initSchedule() {
  const root = document.querySelector('[data-schedule]')
  if (!root) return

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
  // A legend pill pressed (click, Enter or Space) keeps its program
  // highlighted; hovering or focusing previews another one.
  let pinnedClass = null

  const render = () => {
    const focus = activeDay !== 'all'
    for (const chip of chips) {
      const d = chip.dataset.dayChip
      const isActive = activeDay === d
      chip.setAttribute('aria-pressed', String(isActive))
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
      head.setAttribute('aria-pressed', String(isActive))
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

  const DAY_NAMES = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }
  const countFor = (d) => classCells.filter((a) => a.closest('[data-day-cell]').dataset.dayCell === d).length

  const setDay = (d) => {
    // Guard against a custom day list that doesn't contain the selection.
    activeDay = d === 'all' || days.includes(d) ? d : 'all'
    render()
    if (activeDay === 'all') announce('Showing the whole week')
    else {
      const n = countFor(activeDay)
      announce(`${DAY_NAMES[activeDay] || activeDay}: ${n ? `${n} ${n === 1 ? 'class' : 'classes'}` : 'rest day, no classes'}`)
    }
  }
  const setHover = (name) => {
    if (name === hoverClass) return
    hoverClass = name
    for (const a of classCells) a.className = classCell(matches(a.dataset.className, hoverClass))
    for (const pill of legends) pill.className = legendPill(matches(hoverClass, pill.dataset.legend))
  }
  const release = () => setHover(pinnedClass)

  chips.forEach((chip) => chip.addEventListener('click', () => setDay(chip.dataset.dayChip)))
  heads.forEach((head) =>
    head.addEventListener('click', () => setDay(head.dataset.dayHead === activeDay ? 'all' : head.dataset.dayHead)),
  )
  cells.forEach((cell) => {
    const name = cell.querySelector('[data-class-cell]')?.dataset.className
    cell.addEventListener('mouseenter', () => name && setHover(name))
    cell.addEventListener('mouseleave', release)
  })
  legends.forEach((pill) => {
    const name = pill.dataset.legend
    pill.addEventListener('mouseenter', () => setHover(name))
    pill.addEventListener('mouseleave', release)
    pill.addEventListener('focus', () => setHover(name))
    pill.addEventListener('blur', release)
    pill.addEventListener('click', () => {
      pinnedClass = pinnedClass === name ? null : name
      legends.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.legend === pinnedClass)))
      setHover(pinnedClass ?? name)
      const n = classCells.filter((a) => matches(a.dataset.className, name)).length
      announce(pinnedClass ? `${name} highlighted: ${n} ${n === 1 ? 'session' : 'sessions'} a week` : `${name} highlight off`)
    })
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
    announce(picked ? `Booking calendar showing ${picked.name}` : 'Booking calendar showing all classes')
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
