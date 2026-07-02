import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaArrowUp, FaWhatsapp } from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { whatsappUrl } from '../../content/defaults'

/** Fixed WhatsApp button + back-to-top control that appears after scrolling. */
export default function FloatingActions() {
  const WHATSAPP = whatsappUrl(useContent().brand)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {show && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center"
      >
        <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-full bg-coal px-4 py-2 font-head text-xs font-semibold uppercase tracking-wider text-chalk opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
          Chat with us
        </span>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_-6px_rgba(37,211,102,0.7)]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
          <FaWhatsapp size={28} className="relative" />
        </span>
      </a>
    </div>
  )
}
