import { motion } from 'motion/react'
import { FaArrowRightLong, FaClock, FaWhatsapp } from 'react-icons/fa6'
import {
  SCHEDULE,
  SCHEDULE_DAYS,
  PROGRAMS,
  HOURS,
  WHATSAPP,
} from '../data/site'
import { fadeUp, stagger, Reveal, reveal } from '../lib/motion'
import { usePageTitle } from '../lib/usePageTitle'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import CTAButton from '../components/ui/CTAButton'
import Spotlight from '../components/ui/Spotlight'

/** Quick lookup: program name → its icon, for the timetable + legend. */
const ICON_BY_NAME = Object.fromEntries(PROGRAMS.map((p) => [p.name, p.icon]))

/** Today's three-letter label (Mon–Sat), or null on Sunday/rest day. */
const TODAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]

function ClassCell({ name }) {
  if (!name) {
    return <div className="h-full min-h-[58px] rounded-lg border border-dashed border-iron/60" />
  }
  const Icon = ICON_BY_NAME[name]
  return (
    <div className="group flex h-full min-h-[58px] flex-col justify-center gap-1 rounded-lg border border-iron bg-ink p-2.5 transition-colors duration-300 hover:border-battle/60 hover:bg-battle/5">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="text-battle">
            <Icon size={13} />
          </span>
        )}
        <span className="font-head text-[11px] font-semibold uppercase leading-tight tracking-wide text-chalk">
          {name}
        </span>
      </div>
    </div>
  )
}

export default function Schedule() {
  usePageTitle('Class Schedule')
  return (
    <>
      <PageBanner
        kicker="6 Days a Week · Hialeah"
        title="CLASS"
        accent="SCHEDULE"
        subtitle="Lock in your battle. Every slot below is a coached, high-intensity session — just show up ready to work."
        image="/images/bootcamp.jpg"
      />

      {/* Timetable */}
      <section className="bg-ink bg-grid py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading number="01" kicker="Weekly Board" title="PICK YOUR" accent="SLOT" />

          {/* Desktop / tablet grid */}
          <Reveal className="mt-12 hidden overflow-hidden rounded-2xl border border-iron md:block">
            <div
              className="grid"
              style={{ gridTemplateColumns: `120px repeat(${SCHEDULE_DAYS.length}, minmax(0, 1fr))` }}
            >
              {/* header row */}
              <div className="border-b border-iron bg-coal px-4 py-4 font-head text-xs font-semibold uppercase tracking-[0.2em] text-smoke">
                Time
              </div>
              {SCHEDULE_DAYS.map((d) => (
                <div
                  key={d}
                  className={`relative border-b border-l border-iron px-4 py-4 text-center font-head text-sm font-semibold uppercase tracking-widest ${
                    d === TODAY ? 'bg-battle/10 text-battle' : 'bg-coal text-battle'
                  }`}
                >
                  {d}
                  {d === TODAY && (
                    <span className="absolute inset-x-0 bottom-0 mx-auto block h-0.5 w-10 bg-battle" />
                  )}
                </div>
              ))}

              {/* body rows */}
              {SCHEDULE.map((row) => (
                <div key={row.time} className="contents">
                  <div className="flex items-center gap-2 border-b border-iron bg-coal/60 px-4 py-3 font-head text-sm font-semibold text-chalk">
                    <FaClock className="text-battle" size={12} />
                    {row.time}
                  </div>
                  {SCHEDULE_DAYS.map((d) => (
                    <div
                      key={d}
                      className={`border-b border-l border-iron p-1.5 ${
                        d === TODAY ? 'bg-battle/5' : ''
                      }`}
                    >
                      <ClassCell name={row.classes[d]} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Mobile: stacked per time slot */}
          <motion.div
            variants={stagger}
            {...reveal}
            className="mt-10 space-y-4 md:hidden"
          >
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

          {/* Legend */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {PROGRAMS.map((p) => {
              const Icon = p.icon
              return (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-2 rounded-full border border-iron bg-coal px-3.5 py-1.5 font-head text-[11px] font-medium uppercase tracking-wider text-fog"
                >
                  <Icon className="text-battle" size={12} /> {p.name}
                </span>
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
          {HOURS.map(([d, t]) => (
            <Spotlight
              key={d}
              variants={fadeUp}
              tilt={false}
              className="rounded-2xl border border-iron bg-ink p-6 text-center transition-colors duration-300 hover:border-battle/40"
            >
              <div className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-battle">
                {d}
              </div>
              <div className="mt-2 font-display text-2xl text-chalk">{t}</div>
            </Spotlight>
          ))}
        </motion.div>
      </section>
    </>
  )
}
