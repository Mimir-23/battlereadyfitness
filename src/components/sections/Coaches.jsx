import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  FaInstagram,
  FaWhatsapp,
  FaFireFlameCurved,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRightLong,
} from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { whatsappUrl } from '../../content/defaults'
import { fadeUp, reveal, EASE, prefersReducedMotion } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import Parallax from '../ui/Parallax'
import EmberField from '../ui/EmberField'
import CTAButton from '../ui/CTAButton'
import Counter from '../ui/Counter'

/* ------------------------------------------------------------------ */
/*  Coaches — "CHOOSE YOUR FIGHTER"                                     */
/*  Acordeón de paneles estilo pantalla VS: cada coach es una franja    */
/*  alta; la activa se expande a color con nombre gigante, OVR y sus    */
/*  números, las demás quedan comprimidas en blanco y negro con el      */
/*  nombre en vertical. Rota sola como demo de arcade hasta que el      */
/*  visitante pasa el mouse; el clic abre el perfil completo en un      */
/*  modal con radar de atributos y navegación entre luchadores.         */
/* ------------------------------------------------------------------ */

const STAT_KEYS = [
  { key: 'strength', label: 'Strength', abbr: 'STR' },
  { key: 'cardio', label: 'Cardio', abbr: 'CRD' },
  { key: 'technique', label: 'Technique', abbr: 'TEC' },
  { key: 'discipline', label: 'Discipline', abbr: 'DSC' },
  { key: 'energy', label: 'Energy', abbr: 'NRG' },
]

const AUTOPLAY_MS = 4200
const clamp = (v) => Math.max(0, Math.min(100, Number(v) || 0))
const ovrOf = (c) =>
  Math.round(STAT_KEYS.reduce((sum, s) => sum + clamp(c[s.key]), 0) / STAT_KEYS.length)

/** Lista minimalista de atributos: etiqueta completa, número que cuenta y una
    línea fina que se llena — separadas por hairlines, sin cajas ni adornos. */
function StatList({ coach }) {
  return (
    <div>
      <div className="border-b border-iron pb-3 font-head text-[10px] font-bold uppercase tracking-[0.3em] text-smoke">
        Combat Stats
      </div>
      {STAT_KEYS.map((s, row) => {
        const v = clamp(coach[s.key])
        return (
          <div key={s.key} className="border-b border-iron/60 py-3.5 last:border-0">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-head text-[11px] font-semibold uppercase tracking-[0.2em] text-fog">
                {s.label}
              </span>
              <span className="font-display text-2xl leading-none text-battle">
                <Counter value={v} />
              </span>
            </div>
            <div className="mt-2.5 h-0.5 overflow-hidden rounded-full bg-iron/60">
              <motion.div
                initial={prefersReducedMotion ? false : { width: 0 }}
                animate={{ width: `${v}%` }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 + row * 0.08 }}
                className="h-full rounded-full bg-battle"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Perfil a pantalla completa: cierra con la X, Esc o el fondo; navega con
    flechas, teclado o swipe. */
function FighterModal({ items, index, onChange, whatsapp }) {
  const isOpen = index >= 0
  const coach = isOpen ? items[index] : null
  const many = items.length > 1
  const [touchX, setTouchX] = useState(null)

  // Teclado + bloqueo de scroll mientras el perfil está abierto.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onChange(-1)
      else if (e.key === 'ArrowLeft' && many) onChange((index - 1 + items.length) % items.length)
      else if (e.key === 'ArrowRight' && many) onChange((index + 1) % items.length)
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [isOpen, index, many, items.length, onChange])

  const step = (d) => onChange((index + d + items.length) % items.length)
  const ovr = coach ? ovrOf(coach) : 0

  return (
    <AnimatePresence>
      {coach && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Coach profile: ${coach.name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md"
        >
          {/* atmósfera del ring */}
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-battle/10 blur-[150px]" />
          <div className="bg-hazard pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-70" />
          <EmberField count={12} />

          {/* cerrar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange(-1)
            }}
            aria-label="Close profile"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/85 text-chalk backdrop-blur-sm transition-colors hover:border-battle hover:text-battle"
          >
            <FaXmark size={18} />
          </button>

          {/* navegación entre luchadores */}
          {many && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label="Previous coach"
                className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/85 text-chalk backdrop-blur-sm transition-colors hover:border-battle hover:text-battle sm:left-5"
              >
                <FaChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label="Next coach"
                className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/85 text-chalk backdrop-blur-sm transition-colors hover:border-battle hover:text-battle sm:right-5"
              >
                <FaChevronRight size={16} />
              </button>
            </>
          )}

          {/* Scroll propio del modal. m-auto (y no justify-center) para que en
              pantallas bajas el contenido haga scroll sin cortarse arriba.
              data-lenis-prevent: Lenis debe dejar pasar la rueda aquí. */}
          <div
            data-lenis-prevent
            onClick={() => onChange(-1)}
            onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX === null || !many) return
              const dx = e.changedTouches[0].clientX - touchX
              setTouchX(null)
              if (Math.abs(dx) > 56) step(dx < 0 ? 1 : -1)
            }}
            className="relative z-10 h-full overflow-y-auto overscroll-contain"
          >
            <div className="flex min-h-full">
              <div
                className="m-auto w-full max-w-6xl px-5 py-16 sm:px-12 lg:px-16"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -18 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10"
              >
                {/* ---------- retrato "recortado" ---------- */}
                <div className="relative order-1 mx-auto w-full max-w-sm lg:max-w-none">
                  {/* resplandor de contorno */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-battle/15 blur-[100px]" />

                  {/* apodo gigante detrás del retrato */}
                  <div className="pointer-events-none absolute inset-x-0 -top-6 z-0 overflow-hidden text-center">
                    <span className="whitespace-nowrap font-display text-[4.5rem] uppercase leading-none text-stroke-chalk opacity-30 sm:text-[6rem]">
                      {coach.alias || coach.name}
                    </span>
                  </div>

                  <motion.img
                    src={coach.image}
                    alt={coach.name}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="relative z-10 h-[42svh] w-full object-cover object-top sm:h-[48svh] lg:h-[64svh]"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)',
                      WebkitMaskImage:
                        'linear-gradient(to bottom, black 78%, transparent 100%)',
                    }}
                  />

                  {/* medalla OVR */}
                  <div className="absolute right-2 top-2 z-20 -skew-x-6 border-2 border-battle bg-ink/85 px-3 py-1.5 shadow-[0_10px_40px_-10px_rgba(255,210,0,0.6)] backdrop-blur-sm">
                    <div className="skew-x-6 text-center">
                      <div className="font-display text-3xl leading-none text-battle">{ovr}</div>
                      <div className="mt-0.5 font-head text-[8px] font-bold uppercase tracking-[0.25em] text-smoke">
                        Overall
                      </div>
                    </div>
                  </div>
                </div>

                {/* ---------- ficha del luchador ---------- */}
                <div className="order-2">
                  <div className="flex items-center justify-between gap-3">
                    {coach.alias ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-battle/50 bg-ink/75 px-3 py-1 font-head text-[10px] font-bold uppercase tracking-[0.25em] text-battle backdrop-blur-sm">
                        <FaFireFlameCurved size={10} /> “{coach.alias}”
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="shrink-0 font-head text-[10px] font-semibold uppercase tracking-[0.3em] text-smoke">
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {String(items.length).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.85] text-chalk">
                    {coach.name}
                  </h3>
                  <div className="mt-3 inline-block bg-battle px-2.5 py-1 font-head text-[11px] font-bold uppercase tracking-[0.25em] text-ink">
                    {coach.role}
                  </div>

                  {coach.quote && (
                    <blockquote className="mt-5 border-l-2 border-battle pl-4 font-head text-base font-medium leading-snug text-fog sm:text-lg">
                      “{coach.quote}”
                    </blockquote>
                  )}

                  {/* atributos, en lista limpia */}
                  <div className="mt-7">
                    <StatList coach={coach} />
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <CTAButton href={whatsapp} target="_blank" small>
                      <FaWhatsapp size={14} /> Train With {coach.name}
                    </CTAButton>
                    {coach.instagram && (
                      <a
                        href={coach.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Instagram of ${coach.name}`}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-iron text-fog transition-colors hover:border-battle hover:bg-battle hover:text-ink"
                      >
                        <FaInstagram size={16} />
                      </a>
                    )}
                  </div>
                </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Coaches() {
  const { coaches, brand } = useContent()
  const items = Array.isArray(coaches?.items) ? coaches.items : []
  const WHATSAPP = whatsappUrl(brand)

  const [active, setActive] = useState(0) // franja expandida del acordeón
  const [open, setOpen] = useState(-1) // -1 = modal cerrado
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const wallRef = useRef(null)

  const safe = active < items.length ? active : 0

  useEffect(() => {
    if (prefersReducedMotion || !wallRef.current) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    })
    io.observe(wallRef.current)
    return () => io.disconnect()
  }, [])

  // Demo de arcade: el foco recorre los paneles solo, hasta que hay hover
  // o el perfil está abierto.
  useEffect(() => {
    if (!inView || paused || open >= 0 || prefersReducedMotion || items.length < 2) return
    const t = setInterval(() => setActive((v) => (v + 1) % items.length), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [inView, paused, open, items.length])

  if (items.length === 0) return null

  return (
    <section id="coaches" className="relative overflow-hidden border-y border-iron bg-ink py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      {/* banda de peligro cruzando en diagonal detrás del muro */}
      <div
        aria-hidden="true"
        className="bg-hazard pointer-events-none absolute left-1/2 top-[56%] h-10 w-[140vw] -translate-x-1/2 -rotate-3 opacity-20"
      />

      <Parallax speed={70} className="pointer-events-none absolute -left-40 top-1/4">
        <div className="h-[420px] w-[420px] rounded-full bg-battle/10 blur-[140px]" />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          number="03"
          kicker={coaches.kicker}
          title={coaches.titleLine1}
          accent={coaches.accent}
        />
        {coaches.paragraph && (
          <p className="mx-auto mt-4 max-w-xl text-center text-fog">{coaches.paragraph}</p>
        )}

        {/* ============ muro VS: acordeón de luchadores ============ */}
        <motion.div variants={fadeUp} {...reveal} className="mt-14">
          <p className="text-center font-head text-[11px] font-bold uppercase tracking-[0.35em] text-battle">
            — Select your coach —
          </p>

          <div
            ref={wallRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="mt-6 flex h-[150svh] max-h-[860px] min-h-[560px] flex-col gap-2.5 sm:h-[62svh] sm:max-h-[640px] sm:min-h-[480px] sm:flex-row sm:gap-3"
          >
            {items.map((c, i) => {
              const on = i === safe
              return (
                <button
                  key={`${c.name}-${i}`}
                  type="button"
                  data-cursor
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => {
                    setActive(i)
                    setOpen(i)
                  }}
                  aria-label={`View coach profile: ${c.name}`}
                  aria-haspopup="dialog"
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border text-left transition-all duration-700 ease-power ${
                    on
                      ? 'flex-[2.6] border-battle/70 shadow-[0_0_60px_-14px_rgba(255,210,0,0.5)]'
                      : 'flex-1 border-iron hover:border-battle/40'
                  }`}
                >
                  {/* foto */}
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ${
                      on ? 'scale-100 grayscale-0' : 'scale-105 grayscale'
                    }`}
                  />
                  <div
                    className={`absolute inset-0 transition-colors duration-700 ${
                      on
                        ? 'bg-gradient-to-t from-ink via-ink/25 to-transparent'
                        : 'bg-gradient-to-t from-ink/95 via-ink/50 to-ink/30'
                    }`}
                  />

                  {/* número de franja */}
                  <span
                    className={`absolute left-3 top-3 font-display text-2xl leading-none transition-colors duration-500 ${
                      on ? 'text-battle' : 'text-stroke-chalk opacity-60'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* OVR */}
                  <span className="absolute right-3 top-3 rounded-md border border-battle/50 bg-ink/80 px-1.5 py-0.5 font-display text-sm leading-tight text-battle backdrop-blur-sm">
                    {ovrOf(c)}
                  </span>

                  {/* scanline solo en la franja activa */}
                  {on && (
                    <span className="pointer-events-none absolute inset-0 overflow-hidden">
                      <span
                        className="absolute inset-0"
                        style={{ animation: 'var(--animate-scan)' }}
                      >
                        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-battle/60 to-transparent" />
                      </span>
                    </span>
                  )}

                  {/* nombre vertical (franjas comprimidas, escritorio) */}
                  <span
                    className={`pointer-events-none absolute inset-0 hidden items-center justify-center transition-opacity duration-500 sm:flex ${
                      on ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <span
                      className="rotate-180 whitespace-nowrap font-display text-3xl uppercase tracking-[0.15em] text-chalk/90"
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {c.name}
                    </span>
                  </span>

                  {/* nombre horizontal (franjas comprimidas, móvil) */}
                  <span
                    className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 transition-opacity duration-500 sm:hidden ${
                      on ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <span className="font-display text-2xl uppercase text-chalk/90">{c.name}</span>
                    {c.alias && (
                      <span className="font-head text-[9px] uppercase tracking-[0.2em] text-smoke">
                        “{c.alias}”
                      </span>
                    )}
                  </span>

                  {/* ficha de la franja expandida */}
                  <span
                    className={`absolute inset-x-0 bottom-0 block p-5 transition-all duration-500 sm:p-7 ${
                      on ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
                    }`}
                  >
                    {c.alias && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-battle/50 bg-ink/75 px-3 py-1 font-head text-[10px] font-bold uppercase tracking-[0.25em] text-battle backdrop-blur-sm">
                        <FaFireFlameCurved size={10} /> “{c.alias}”
                      </span>
                    )}
                    <span className="mt-2 block font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.85] text-chalk drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)]">
                      {c.name}
                    </span>
                    <span className="mt-2 inline-block bg-battle px-2.5 py-1 font-head text-[10px] font-bold uppercase tracking-[0.25em] text-ink">
                      {c.role}
                    </span>

                    {/* mini-stats de la franja, sin cajas — solo número y sigla */}
                    <span className="mt-4 hidden items-baseline gap-5 sm:flex">
                      {STAT_KEYS.map((s) => (
                        <span key={s.key} className="flex items-baseline gap-1.5">
                          <span className="font-display text-xl leading-none text-battle">
                            {clamp(c[s.key])}
                          </span>
                          <span className="font-head text-[8px] font-semibold uppercase tracking-[0.15em] text-smoke">
                            {s.abbr}
                          </span>
                        </span>
                      ))}
                    </span>

                    <span className="mt-4 flex items-center gap-2 font-head text-[10px] font-bold uppercase tracking-[0.3em] text-battle">
                      View Full Profile <FaArrowRightLong size={11} />
                    </span>
                  </span>

                  {/* cinta de peligro bajo la franja activa */}
                  <span
                    className={`bg-hazard absolute inset-x-0 bottom-0 h-1.5 transition-opacity duration-500 ${
                      on ? 'opacity-90' : 'opacity-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>

      <FighterModal items={items} index={open} onChange={setOpen} whatsapp={WHATSAPP} />
    </section>
  )
}
