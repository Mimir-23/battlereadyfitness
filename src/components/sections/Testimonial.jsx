import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa6'
import { Reveal, EASE, prefersReducedMotion } from '../../lib/motion'
import { useContent } from '../../content/ContentProvider'

const AUTOPLAY_MS = 7000

/* Directional slide between quotes. Reduced motion collapses to an instant swap. */
const slide = prefersReducedMotion
  ? {
      enter: { opacity: 1 },
      center: { opacity: 1 },
      exit: { opacity: 1, transition: { duration: 0 } },
    }
  : {
      enter: (d) => ({ opacity: 0, x: 48 * d }),
      center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
      exit: (d) => ({ opacity: 0, x: -48 * d, transition: { duration: 0.3, ease: EASE } }),
    }

export default function Testimonial() {
  const t = useContent().testimonial
  const items = Array.isArray(t.items) && t.items.length ? t.items : []
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const touchX = useRef(null)

  // Content can shrink from the admin panel while we're pointing past the end.
  const safeIndex = index < items.length ? index : 0
  const current = items[safeIndex]
  const many = items.length > 1

  const goTo = (next, direction) => {
    setDir(direction)
    setIndex((next + items.length) % items.length)
  }
  const prev = () => goTo(safeIndex - 1, -1)
  const next = () => goTo(safeIndex + 1, 1)

  // Auto-rotate; any manual navigation restarts the timer (index dep).
  useEffect(() => {
    if (!many || prefersReducedMotion) return undefined
    const id = setInterval(() => {
      setDir(1)
      setIndex((i) => (i + 1) % items.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [index, many, items.length])

  if (!current) return null

  return (
    <section className="relative overflow-hidden border-y border-iron py-24 sm:py-28">
      {t.image && (
        <img
          src={t.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="absolute inset-0 bg-ink/85" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-battle/10 blur-[140px]" />

      {/* giant watermark quote glyph */}
      <FaQuoteLeft
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-14 -translate-x-1/2 text-battle/[0.07]"
        size={180}
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-iron bg-ink/60 px-4 py-1.5 font-head text-[11px] font-semibold uppercase tracking-[0.25em] text-smoke backdrop-blur-sm">
            <span className="flex text-battle">
              {[0, 1, 2, 3, 4].map((i) => (
                <FaStar key={i} size={11} />
              ))}
            </span>
            Warrior Reviews
          </span>

          {/* Fixed-height stage so quotes of different lengths don't jump the page */}
          <div
            className="mt-8 flex min-h-[300px] flex-col items-center justify-center sm:min-h-[260px]"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null || !many) return
              const dx = e.changedTouches[0].clientX - touchX.current
              touchX.current = null
              if (dx <= -48) next()
              else if (dx >= 48) prev()
            }}
          >
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={safeIndex}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <blockquote className="font-head text-2xl font-medium leading-snug text-chalk sm:text-3xl lg:text-4xl">
                  &ldquo;{current.quote}{' '}
                  {current.highlight && (
                    <span className="text-battle">{current.highlight}</span>
                  )}
                  &rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-battle font-head text-lg font-bold text-ink">
                    {initials(current.author)}
                  </div>
                  <div className="text-left">
                    <div className="font-head font-semibold uppercase tracking-wide text-chalk">
                      {current.author}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-smoke">
                      {current.role}
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* controls */}
          {many && (
            <div className="mt-8 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous review"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron text-fog transition-colors hover:border-battle/60 hover:text-battle"
              >
                <FaChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i, i > safeIndex ? 1 : -1)}
                    aria-label={`Go to review ${i + 1}`}
                    aria-current={i === safeIndex}
                    className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                      i === safeIndex ? 'w-7 bg-battle' : 'w-1.5 bg-iron hover:bg-smoke'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                aria-label="Next review"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron text-fog transition-colors hover:border-battle/60 hover:text-battle"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/** First letters of the author's name for the avatar badge. */
function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}
