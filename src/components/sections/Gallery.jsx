import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { fadeUp, stagger, reveal, prefersReducedMotion } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

export default function Gallery() {
  const GALLERY = useContent().gallery
  // -1 = lightbox closed; otherwise the index of the open photo.
  const [open, setOpen] = useState(-1)

  // The wall wakes up: photos start in grayscale and light up in color one by
  // one every 2s while the section is on screen, then reset and loop.
  const gridRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [lit, setLit] = useState(0) // how many photos are in color

  useEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    )
    io.observe(gridRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || prefersReducedMotion) return
    const t = setInterval(() => {
      setLit((v) => (v >= GALLERY.length ? 0 : v + 1))
    }, 2000)
    return () => clearInterval(t)
  }, [inView, GALLERY.length])

  return (
    <section id="gallery" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="03" kicker="Step Inside" title="THE" accent="BATTLEGROUND" />
        <p className="mx-auto mt-4 max-w-xl text-center text-fog">
          Real sweat, real iron, real results. This is where warriors are forged.
        </p>

        <motion.div
          ref={gridRef}
          variants={stagger}
          {...reveal}
          className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {GALLERY.map((g, i) => (
            <motion.figure
              key={g.src}
              data-cursor
              variants={fadeUp}
              className={`group relative overflow-hidden rounded-2xl border border-iron ${
                g.span || ''
              }`}
            >
              <img
                src={g.src}
                alt={g.label}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 ${
                  prefersReducedMotion || i < lit ? 'grayscale-0' : 'grayscale'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 flex items-center gap-2 p-5 transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                <span className="h-px w-6 bg-battle" />
                <span className="font-head text-sm font-semibold uppercase tracking-widest text-chalk">
                  {g.label}
                </span>
              </figcaption>
              {/* Full-card hit area that opens the lightbox. */}
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View photo: ${g.label}`}
                className="absolute inset-0 z-10 cursor-zoom-in"
              />
            </motion.figure>
          ))}
        </motion.div>
      </div>

      <Lightbox items={GALLERY} index={open} onChange={setOpen} />
    </section>
  )
}

/** Full-screen photo viewer: backdrop/Esc close, arrows + swipe to navigate. */
function Lightbox({ items, index, onChange }) {
  const isOpen = index >= 0
  const touchX = useRef(null)
  const many = items.length > 1

  const close = () => onChange(-1)
  const step = (dir) => onChange((index + dir + items.length) % items.length)

  // Keyboard controls + scroll lock while open.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft' && many) step(-1)
      else if (e.key === 'ArrowRight' && many) step(1)
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  })

  const current = isOpen ? items[index] : null

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          onClick={close}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null || !many) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1)
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/80 text-chalk transition-colors hover:border-battle hover:text-battle"
          >
            <FaXmark size={18} />
          </button>

          {many && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label="Previous photo"
                className="absolute left-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/80 text-chalk transition-colors hover:border-battle hover:text-battle sm:left-5"
              >
                <FaChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label="Next photo"
                className="absolute right-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/80 text-chalk transition-colors hover:border-battle hover:text-battle sm:right-5"
              >
                <FaChevronRight size={16} />
              </button>
            </>
          )}

          <motion.figure
            key={index}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-svh flex-col items-center gap-4 px-14 py-6 sm:px-20"
          >
            <img
              src={current.src}
              alt={current.label}
              className="max-h-[78svh] max-w-full rounded-xl border border-iron object-contain"
            />
            <figcaption className="flex items-center gap-3">
              <span className="h-px w-6 bg-battle" />
              <span className="font-head text-sm font-semibold uppercase tracking-widest text-chalk">
                {current.label}
              </span>
              {many && (
                <span className="font-head text-xs text-smoke">
                  {index + 1} / {items.length}
                </span>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
