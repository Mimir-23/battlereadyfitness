import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FaArrowUp,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaCommentDots,
  FaXmark,
} from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { whatsappUrl } from '../../content/defaults'
import { getLenis } from '../../lib/useSmoothScroll'

/** Floating contact hub: one button that fans out into WhatsApp / Instagram /
    Facebook, plus the back-to-top control that appears after scrolling. */
export default function FloatingActions() {
  const brand = useContent().brand
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close with Escape so keyboard users aren't stuck in the open state.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    {
      icon: FaWhatsapp,
      href: whatsappUrl(brand),
      label: 'WhatsApp',
      cls: 'bg-[#25D366] shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)]',
    },
    {
      icon: FaInstagram,
      href: brand.instagram,
      label: 'Instagram',
      cls: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-[0_8px_24px_-6px_rgba(221,42,123,0.6)]',
    },
    {
      icon: FaFacebookF,
      href: brand.facebook,
      label: 'Facebook',
      cls: 'bg-[#1877F2] shadow-[0_8px_24px_-6px_rgba(24,119,242,0.6)]',
    },
  ].filter((l) => l.href)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {show && !open && (
          <motion.button
            type="button"
            onClick={() => {
              // Con Lenis activo, el scrollTo nativo pelea con su rAF — usamos
              // el suyo; en táctil (sin Lenis) el nativo es el correcto.
              const lenis = getLenis()
              if (lenis) lenis.scrollTo(0, { duration: 1.2 })
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal text-chalk shadow-lg transition-colors hover:border-battle hover:text-battle"
          >
            <FaArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Invisible backdrop: tapping anywhere outside closes the fan. */}
      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 cursor-default"
        />
      )}

      {/* Contact hub: the options fan out in a quarter-circle arc that opens
          toward the free space (up and to the left of the corner button). */}
      <div className="relative">
        <AnimatePresence>
          {open &&
            links.map((l, i) => {
              const Icon = l.icon
              // First link points straight up (90°), last straight left (180°).
              const angle =
                links.length === 1 ? 135 : 90 + (90 * i) / (links.length - 1)
              const rad = (angle * Math.PI) / 180
              const radius = 92
              const x = Math.round(Math.cos(rad) * radius)
              const y = -Math.round(Math.sin(rad) * radius)
              return (
                <motion.a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={l.label}
                  onClick={() => setOpen(false)}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  animate={{
                    x,
                    y,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      delay: i * 0.05,
                      type: 'spring',
                      stiffness: 320,
                      damping: 20,
                    },
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.3,
                    transition: { delay: (links.length - 1 - i) * 0.03, duration: 0.18 },
                  }}
                  className="group absolute left-1/2 top-1/2 -ml-6 -mt-6 flex items-center"
                >
                  <span className="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-full bg-coal px-3 py-1.5 font-head text-[11px] font-semibold uppercase tracking-wider text-chalk opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    {l.label}
                  </span>
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-110 ${l.cls}`}
                  >
                    <Icon size={22} />
                  </span>
                </motion.a>
              )
            })}
        </AnimatePresence>

        {/* Main contact toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close contact' : 'Contact us'}
          aria-expanded={open}
          className="group relative flex cursor-pointer items-center"
        >
          {!open && (
            <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-full bg-coal px-4 py-2 font-head text-xs font-semibold uppercase tracking-wider text-chalk opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
              Contact us
            </span>
          )}
          <span
            className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_30px_-6px_rgba(255,210,0,0.7)] transition-colors duration-300 ${
              open ? 'bg-coal text-chalk' : 'bg-battle text-ink'
            }`}
          >
            {!open && (
              <span className="absolute inset-0 animate-ping rounded-full bg-battle opacity-40" />
            )}
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {open ? <FaXmark size={24} /> : <FaCommentDots size={24} />}
            </motion.span>
          </span>
        </button>
      </div>
    </div>
  )
}
