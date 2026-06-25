import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { FaLocationDot } from 'react-icons/fa6'
import { EASE } from '../../lib/motion'

/**
 * Reusable hero banner for interior pages (Schedule, Memberships). Mirrors the
 * home hero's tactical treatment — image, gradients, grid, scanline — but at
 * banner height.
 */
export default function PageBanner({ kicker, title, accent, subtitle, image = '/images/hero.jpg' }) {
  return (
    <section className="relative flex min-h-[60svh] items-center overflow-hidden bg-ink pt-24">
      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute inset-0"
      >
        <img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-battle/70 to-transparent"
          style={{ animation: 'var(--animate-scan)' }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-battle/40 bg-battle/10 px-4 py-1.5 font-head text-xs font-medium uppercase tracking-[0.2em] text-battle backdrop-blur-sm">
              <FaLocationDot size={12} /> {kicker}
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
            className="mt-6 font-display text-[clamp(2.75rem,10vw,6rem)] leading-[0.88] text-chalk"
          >
            {title} {accent && <span className="text-battle">{accent}</span>}
          </motion.h1>

          {subtitle && (
            <motion.p
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-fog"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.nav
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
            className="mt-7 flex items-center gap-2 font-head text-xs uppercase tracking-[0.2em] text-smoke"
          >
            <Link to="/" className="transition-colors hover:text-battle">
              Home
            </Link>
            <span className="text-iron">/</span>
            <span className="text-chalk">{accent ? `${title} ${accent}` : title}</span>
          </motion.nav>
        </motion.div>
      </div>

      <div className="bg-hazard absolute inset-x-0 bottom-0 h-2 opacity-80" />
    </section>
  )
}
