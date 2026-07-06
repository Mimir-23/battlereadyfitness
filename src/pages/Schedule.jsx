import { createElement, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { FaArrowRightLong, FaClock, FaWhatsapp, FaBoltLightning, FaLayerGroup, FaMoon } from 'react-icons/fa6'
import { useContent } from '../content/ContentProvider'
import { getIcon } from '../content/icons'
import { whatsappUrl } from '../content/defaults'
import { fadeUp, stagger, Reveal, reveal } from '../lib/motion'
import { usePageTitle } from '../lib/usePageTitle'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import CTAButton from '../components/ui/CTAButton'
import Spotlight from '../components/ui/Spotlight'

/** Today's three-letter label (Sun–Sat). */
const TODAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]

/** A single class in the grid. Highlights when it matches the hovered legend. */
function ClassCell({ name, iconName, highlight }) {
  if (!name) {
    return (
      <div className="flex h-full min-h-[58px] items-center justify-center rounded-lg border border-dashed border-iron/50">
        <span className="h-1 w-1 rounded-full bg-iron" />
      </div>
    )
  }
  return (
    <div
      className={`group flex h-full min-h-[58px] flex-col justify-center gap-1 rounded-lg border p-2.5 transition-all duration-300 ${
        highlight
          ? 'border-battle bg-battle/10'
          : 'border-iron bg-ink hover:border-battle/60 hover:bg-battle/5'
      }`}
    >
      <div className="flex items-center gap-2">
        {iconName && (
          <span className="text-battle">{createElement(getIcon(iconName), { size: 13 })}</span>
        )}
        <span className="font-head text-[11px] font-semibold uppercase leading-tight tracking-wide text-chalk">
          {name}
        </span>
      </div>
    </div>
  )
}

/** Day filter pills — control both the desktop focus and the mobile agenda. */
function DayChips({ days, dayStats, active, onSelect }) {
  return (
    <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={`shrink-0 snap-start cursor-pointer rounded-full border px-4 py-2 font-head text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          active === 'all'
            ? 'border-battle bg-battle text-ink'
            : 'border-iron bg-coal text-fog hover:border-battle/50 hover:text-chalk'
        }`}
      >
        Toda la semana
      </button>
      {days.map((d) => {
        const isActive = active === d
        const count = dayStats[d] || 0
        return (
          <button
            key={d}
            type="button"
            onClick={() => onSelect(d)}
            className={`group relative flex shrink-0 snap-start cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-head text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              isActive
                ? 'border-battle bg-battle text-ink'
                : 'border-iron bg-coal text-fog hover:border-battle/50 hover:text-chalk'
            }`}
          >
            {d === TODAY && (
              <span
                className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-ink' : 'bg-battle'}`}
                style={{ animation: 'var(--animate-blink)' }}
              />
            )}
            {d}
            <span
              className={`rounded-full px-1.5 text-[9px] tabular-nums ${
                isActive ? 'bg-ink/15 text-ink' : 'bg-ink text-smoke'
              }`}
            >
              {count || '—'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Schedule() {
  usePageTitle('Class Schedule')
  const { schedule, programs: PROGRAMS, hours: HOURS, brand } = useContent()
  const SCHEDULE = schedule.rows
  const SCHEDULE_DAYS = schedule.days
  const WHATSAPP = whatsappUrl(brand)
  const ICON_BY_NAME = Object.fromEntries(PROGRAMS.map((p) => [p.name, p.icon]))

  const [activeDay, setActiveDay] = useState('all')
  const [hoverClass, setHoverClass] = useState(null)

  // Guard against a custom day list that doesn't contain the current selection.
  const effectiveDay =
    activeDay === 'all' || SCHEDULE_DAYS.includes(activeDay) ? activeDay : 'all'
  const focus = effectiveDay !== 'all'

  // Per-day class counts + overall stats.
  const { dayStats, totalClasses, classTypes } = useMemo(() => {
    const stats = {}
    const types = new Set()
    for (const d of SCHEDULE_DAYS) stats[d] = 0
    for (const row of SCHEDULE) {
      for (const d of SCHEDULE_DAYS) {
        if (row.classes[d]) {
          stats[d] += 1
          types.add(row.classes[d])
        }
      }
    }
    return {
      dayStats: stats,
      totalClasses: Object.values(stats).reduce((a, b) => a + b, 0),
      classTypes: types.size,
    }
  }, [SCHEDULE, SCHEDULE_DAYS])

  const trainingDays = SCHEDULE_DAYS.filter((d) => dayStats[d] > 0).length
  const stats = [
    { icon: FaBoltLightning, value: totalClasses, label: 'Sesiones / semana' },
    { icon: FaLayerGroup, value: classTypes, label: 'Tipos de clase' },
    { icon: FaClock, value: trainingDays, label: 'Días de entreno' },
  ]

  // Mobile agenda rows for the focused day.
  const agendaRows = focus ? SCHEDULE.filter((r) => r.classes[effectiveDay]) : []

  return (
    <>
      <PageBanner
        kicker={`${SCHEDULE_DAYS.length} Days a Week · Hialeah`}
        title="CLASS"
        accent="SCHEDULE"
        subtitle="Lock in your battle. Every slot below is a coached, high-intensity session — just show up ready to work."
        image="/images/bootcamp.webp"
      />

      {/* Timetable */}
      <section className="relative overflow-hidden bg-ink bg-grid py-24">
        <div className="pointer-events-none absolute -right-40 top-1/4 h-[440px] w-[440px] rounded-full bg-battle/10 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading number="01" kicker="Weekly Board" title="PICK YOUR" accent="SLOT" />

          {/* Stats */}
          <motion.div
            variants={stagger}
            {...reveal}
            className="mt-12 grid grid-cols-3 gap-3 sm:gap-4"
          >
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="flex items-center gap-3 rounded-2xl border border-iron bg-coal px-4 py-4 sm:px-6"
                >
                  <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-battle/10 text-battle sm:flex">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block font-display text-3xl leading-none text-battle sm:text-4xl">
                      {s.value}
                    </span>
                    <span className="mt-1 block font-head text-[9px] font-semibold uppercase tracking-[0.15em] text-smoke sm:text-[10px]">
                      {s.label}
                    </span>
                  </span>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Day filter */}
          <Reveal className="mt-8">
            <DayChips
              days={SCHEDULE_DAYS}
              dayStats={dayStats}
              active={effectiveDay}
              onSelect={setActiveDay}
            />
          </Reveal>

          {/* Desktop / tablet grid */}
          <Reveal className="mt-6 hidden overflow-hidden rounded-2xl border border-iron md:block">
            <div
              className="grid"
              style={{ gridTemplateColumns: `120px repeat(${SCHEDULE_DAYS.length}, minmax(0, 1fr))` }}
            >
              {/* header row */}
              <div className="flex items-center border-b border-iron bg-coal px-4 py-4 font-head text-xs font-semibold uppercase tracking-[0.2em] text-smoke">
                Time
              </div>
              {SCHEDULE_DAYS.map((d) => {
                const isActive = d === effectiveDay
                const dimmed = focus && !isActive
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setActiveDay(isActive ? 'all' : d)}
                    className={`relative cursor-pointer border-b border-l border-iron px-3 py-4 text-center font-head text-sm font-semibold uppercase tracking-widest transition-all duration-300 ${
                      isActive
                        ? 'bg-battle text-ink'
                        : d === TODAY
                          ? 'bg-battle/10 text-battle'
                          : 'bg-coal text-battle hover:bg-battle/5'
                    } ${dimmed ? 'opacity-40' : ''}`}
                  >
                    {d}
                    <span
                      className={`mt-0.5 block text-[9px] font-medium tracking-normal ${
                        isActive ? 'text-ink/70' : 'text-smoke'
                      }`}
                    >
                      {dayStats[d] ? `${dayStats[d]} clases` : 'Descanso'}
                    </span>
                    {d === TODAY && !isActive && (
                      <span className="absolute inset-x-0 bottom-0 mx-auto block h-0.5 w-10 bg-battle" />
                    )}
                  </button>
                )
              })}

              {/* body rows */}
              {SCHEDULE.map((row) => (
                <div key={row.time} className="contents">
                  <div className="flex items-center gap-2 border-b border-iron bg-coal/60 px-4 py-3 font-head text-sm font-semibold text-chalk">
                    <FaClock className="text-battle" size={12} />
                    {row.time}
                  </div>
                  {SCHEDULE_DAYS.map((d) => {
                    const isActive = d === effectiveDay
                    const dimmed = focus && !isActive
                    const name = row.classes[d]
                    return (
                      <div
                        key={d}
                        onMouseEnter={() => name && setHoverClass(name)}
                        onMouseLeave={() => setHoverClass(null)}
                        className={`border-b border-l border-iron p-1.5 transition-opacity duration-300 ${
                          isActive ? 'bg-battle/5' : d === TODAY ? 'bg-battle/5' : ''
                        } ${dimmed ? 'opacity-30' : ''}`}
                      >
                        <ClassCell
                          name={name}
                          iconName={ICON_BY_NAME[name]}
                          highlight={!!name && name === hoverClass}
                        />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Mobile */}
          <div className="mt-6 md:hidden">
            {focus ? (
              agendaRows.length > 0 ? (
                <motion.div variants={stagger} {...reveal} className="space-y-3">
                  {agendaRows.map((row) => {
                    const name = row.classes[effectiveDay]
                    const Icon = getIcon(ICON_BY_NAME[name])
                    return (
                      <motion.div
                        key={row.time}
                        variants={fadeUp}
                        className="flex items-center gap-4 rounded-2xl border border-iron bg-coal p-4"
                      >
                        <div className="flex w-20 shrink-0 flex-col">
                          <span className="font-head text-sm font-bold text-chalk">
                            {row.time.replace(/ ?(AM|PM)/i, '')}
                          </span>
                          <span className="font-head text-[10px] uppercase tracking-wider text-smoke">
                            {/(AM|PM)/i.exec(row.time)?.[0] || ''}
                          </span>
                        </div>
                        <span className="h-10 w-px shrink-0 bg-iron" />
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-battle/10 text-battle">
                            <Icon size={16} />
                          </span>
                          <span className="font-head text-sm font-semibold uppercase tracking-wide text-chalk">
                            {name}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-iron bg-coal px-6 py-12 text-center">
                  <FaMoon className="text-battle" size={22} />
                  <div className="font-head text-sm font-semibold uppercase tracking-widest text-chalk">
                    Rest &amp; Recover
                  </div>
                  <p className="max-w-xs text-sm text-smoke">
                    No hay clases el {effectiveDay}. Recarga para la batalla de mañana.
                  </p>
                </div>
              )
            ) : (
              <motion.div variants={stagger} {...reveal} className="space-y-4">
                {SCHEDULE.map((row) => (
                  <motion.div
                    key={row.time}
                    variants={fadeUp}
                    className="rounded-2xl border border-iron bg-coal p-4"
                  >
                    <div className="flex items-center gap-2 font-head text-sm font-semibold uppercase tracking-widest text-battle">
                      <FaClock size={13} /> {row.time}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {SCHEDULE_DAYS.filter((d) => row.classes[d]).map((d) => (
                        <div key={d} className="rounded-lg border border-iron bg-ink p-2.5">
                          <div className="font-head text-[10px] uppercase tracking-[0.2em] text-smoke">
                            {d}
                          </div>
                          <div className="mt-0.5 font-head text-xs font-semibold uppercase text-chalk">
                            {row.classes[d]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {PROGRAMS.map((p) => {
              const Icon = getIcon(p.icon)
              const on = hoverClass === p.name
              return (
                <button
                  key={p.name}
                  type="button"
                  onMouseEnter={() => setHoverClass(p.name)}
                  onMouseLeave={() => setHoverClass(null)}
                  className={`inline-flex cursor-default items-center gap-2 rounded-full border px-3.5 py-1.5 font-head text-[11px] font-medium uppercase tracking-wider transition-colors ${
                    on
                      ? 'border-battle bg-battle/10 text-chalk'
                      : 'border-iron bg-coal text-fog'
                  }`}
                >
                  <Icon className="text-battle" size={12} /> {p.name}
                </button>
              )
            })}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-smoke">
            Schedule may vary on holidays. Booking is handled through our Recess
            portal — grab a membership to reserve your spot.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton to="/memberships">
              Book Through Memberships <FaArrowRightLong />
            </CTAButton>
            <CTAButton href={WHATSAPP} target="_blank" variant="ghost">
              <FaWhatsapp size={16} /> Ask About Times
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Opening hours strip */}
      <section className="border-y border-iron bg-coal py-16">
        <motion.div
          variants={stagger}
          {...reveal}
          className="mx-auto grid max-w-5xl gap-6 px-5 sm:grid-cols-3 lg:px-8"
        >
          {HOURS.map(({ day, time }) => (
            <Spotlight
              key={day}
              variants={fadeUp}
              tilt={false}
              className="rounded-2xl border border-iron bg-ink p-6 text-center transition-colors duration-300 hover:border-battle/40"
            >
              <div className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-battle">
                {day}
              </div>
              <div className="mt-2 font-display text-2xl text-chalk">{time}</div>
            </Spotlight>
          ))}
        </motion.div>
      </section>
    </>
  )
}
