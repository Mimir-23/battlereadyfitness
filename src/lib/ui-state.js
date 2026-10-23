/* ------------------------------------------------------------------ */
/*  State → class lists for the interactive sections. The server uses    */
/*  them for the initial HTML and the client scripts re-apply them on    */
/*  every state change, so both always produce the exact same markup     */
/*  (the same classes the React components computed).                   */
/* ------------------------------------------------------------------ */

/* ---------- Coaches: "choose your fighter" accordion strip ---------- */
export function coachStrip(on) {
  return {
    btn: `group relative cursor-pointer overflow-hidden rounded-2xl border text-left transition-all duration-700 ease-power ${
      on
        ? 'flex-[2.6] border-battle/70 shadow-[0_0_60px_-14px_rgba(255,210,0,0.5)]'
        : 'flex-1 border-iron hover:border-battle/40'
    }`,
    img: `absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ${
      on ? 'scale-100 grayscale-0' : 'scale-105 grayscale'
    }`,
    shade: `absolute inset-0 transition-colors duration-700 ${
      on ? 'bg-gradient-to-t from-ink via-ink/25 to-transparent' : 'bg-gradient-to-t from-ink/95 via-ink/50 to-ink/30'
    }`,
    num: `absolute left-3 top-3 font-display text-2xl leading-none transition-colors duration-500 ${
      on ? 'text-battle' : 'text-stroke-chalk opacity-60'
    }`,
    vname: `pointer-events-none absolute inset-0 hidden items-center justify-center transition-opacity duration-500 sm:flex ${
      on ? 'opacity-0' : 'opacity-100'
    }`,
    hname: `pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 transition-opacity duration-500 sm:hidden ${
      on ? 'opacity-0' : 'opacity-100'
    }`,
    card: `absolute inset-x-0 bottom-0 block p-5 transition-all duration-500 sm:p-7 ${
      on ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
    }`,
    tape: `bg-hazard absolute inset-x-0 bottom-0 h-1.5 transition-opacity duration-500 ${on ? 'opacity-90' : 'opacity-0'}`,
  }
}

/* ---------- Gallery: the "scanner" lock on one photo ---------- */
export function galleryTile(locked, span = '', reduced = false) {
  return {
    figure: `group relative overflow-hidden rounded-2xl border transition-colors duration-500 ${
      locked ? 'border-battle/60' : 'border-iron'
    } ${span || ''}`,
    img: `h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 ${
      reduced ? 'grayscale-0' : locked ? 'grayscale-0 scale-105' : 'grayscale brightness-[.85]'
    }`,
    frame: `pointer-events-none absolute inset-0 transition-opacity duration-500 ${locked ? 'opacity-100' : 'opacity-0'}`,
    caption: `absolute bottom-0 left-0 flex items-center gap-2 p-5 transition-all duration-500 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${
      locked ? 'lg:translate-y-0 lg:opacity-100' : 'lg:translate-y-2 lg:opacity-0'
    }`,
  }
}

/* ---------- Testimonials: pagination dots ---------- */
export const quoteDot = (active) =>
  `h-1.5 cursor-pointer rounded-full transition-all duration-300 ${active ? 'w-7 bg-battle' : 'w-1.5 bg-iron hover:bg-smoke'}`

/* ---------- Schedule ---------- */
export const dayChip = (active) =>
  `shrink-0 snap-start cursor-pointer rounded-full border px-4 py-2 font-head text-[11px] font-semibold uppercase tracking-wider transition-colors ${
    active ? 'border-battle bg-battle text-ink' : 'border-iron bg-coal text-fog hover:border-battle/50 hover:text-chalk'
  }`

export const dayChipWithCount = (active) =>
  `group relative flex shrink-0 snap-start cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-head text-[11px] font-semibold uppercase tracking-wider transition-colors ${
    active ? 'border-battle bg-battle text-ink' : 'border-iron bg-coal text-fog hover:border-battle/50 hover:text-chalk'
  }`

export const chipDot = (active) => `h-1.5 w-1.5 rounded-full ${active ? 'bg-ink' : 'bg-battle'}`

export const chipCount = (active) =>
  `rounded-full px-1.5 text-[9px] tabular-nums ${active ? 'bg-ink/15 text-ink' : 'bg-ink text-smoke'}`

export function dayHeader(active, today, dimmed) {
  return `relative cursor-pointer border-b border-l border-iron px-3 py-4 text-center font-head text-sm font-semibold uppercase tracking-widest transition-all duration-300 ${
    active ? 'bg-battle text-ink' : today ? 'bg-battle/10 text-battle' : 'bg-coal text-battle hover:bg-battle/5'
  } ${dimmed ? 'opacity-40' : ''}`
}

export const dayHeaderSub = (active) =>
  `mt-0.5 block text-[9px] font-medium tracking-normal ${active ? 'text-ink/70' : 'text-smoke'}`

export function dayCell(active, today, dimmed) {
  return `border-b border-l border-iron p-1.5 transition-opacity duration-300 ${
    active ? 'bg-battle/5' : today ? 'bg-battle/5' : ''
  } ${dimmed ? 'opacity-30' : ''}`
}

export const classCell = (highlight) =>
  `group flex h-full min-h-[58px] cursor-pointer flex-col justify-center gap-1 rounded-lg border p-2.5 transition-all duration-300 ${
    highlight ? 'border-battle bg-battle/10' : 'border-iron bg-ink hover:border-battle/60 hover:bg-battle/5'
  }`

export const legendPill = (on) =>
  `inline-flex cursor-default items-center gap-2 rounded-full border px-3.5 py-1.5 font-head text-[11px] font-medium uppercase tracking-wider transition-colors ${
    on ? 'border-battle bg-battle/10 text-chalk' : 'border-iron bg-coal text-fog'
  }`

/** "Bootcamp upper strength" ↔ "Bootcamp": flexible match both ways, so long
    Recess class names inherit the program's icon and highlight. */
export function matches(a, b) {
  if (!a || !b) return false
  const x = a.toLowerCase()
  const y = b.toLowerCase()
  return x.includes(y) || y.includes(x)
}
