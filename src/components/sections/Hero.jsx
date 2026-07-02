import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { FaStar, FaLocationDot, FaArrowRightLong, FaWhatsapp } from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { whatsappUrl } from '../../content/defaults'
import { fadeUp, stagger, isDesktopPointer } from '../../lib/motion'
import CTAButton from '../ui/CTAButton'
import RopeLoader from '../ui/RopeLoader'
import EmberField from '../ui/EmberField'

export default function Hero() {
  const { hero, brand } = useContent()
  const WHATSAPP = whatsappUrl(brand)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 160])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh items-center overflow-hidden bg-ink"
    >
      {/* Parallax intro: on desktop the hero image opens with a slow zoom-out +
          settle and then tracks scroll. On touch, animating a full-screen image
          transform janks/freezes mobile Safari, so we only do a light fade. */}
      <motion.div style={isDesktopPointer ? { scale: imgScale } : undefined} className="absolute inset-0">
        <motion.img
          src={hero.image}
          alt="Athletes training inside Battle Ready Fitness"
          className="h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
          initial={isDesktopPointer ? { scale: 1.3, opacity: 0 } : false}
          animate={isDesktopPointer ? { scale: 1.05, opacity: 1 } : undefined}
          transition={
            isDesktopPointer
              ? { scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 1 } }
              : undefined
          }
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* ambient yellow glow orb */}
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[520px] w-[520px] rounded-full bg-battle/15 blur-[160px]" />

      {/* rising embers */}
      <EmberField count={20} />

      {/* scanline */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-battle/70 to-transparent"
          style={{ animation: 'var(--animate-scan)' }}
        />
      </div>

      {/* HUD corner brackets */}
      <div className="pointer-events-none absolute inset-5 hidden lg:block">
        <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-battle/50" />
        <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-battle/50" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-battle/50" />
        <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-battle/50" />
      </div>

      {/* tactical readout (top-right) */}
      <div className="pointer-events-none absolute right-8 top-28 hidden flex-col items-end gap-1 font-head text-[10px] uppercase tracking-[0.25em] text-smoke xl:flex">
        <span className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full bg-battle"
            style={{ animation: 'var(--animate-blink)' }}
          />
          System: Ready
        </span>
        <span>Lat 25.86° · Lon -80.31°</span>
        <span>Hialeah · FL · USA</span>
      </div>

      <motion.div
        style={isDesktopPointer ? { y, opacity } : undefined}
        className="relative mx-auto w-full max-w-7xl px-5 pt-24 lg:px-8"
      >
        <motion.div
          variants={stagger}
          initial={isDesktopPointer ? 'hidden' : false}
          animate="show"
          className="max-w-3xl"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-battle/40 bg-battle/10 px-4 py-1.5 font-head text-xs font-medium uppercase tracking-[0.2em] text-battle backdrop-blur-sm">
              <FaLocationDot size={12} /> {hero.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-[clamp(2.5rem,11vw,7.5rem)] leading-[0.88] text-chalk"
          >
            {hero.titleLine1}
            {hero.titleLine2 && (
              <>
                <br />
                {hero.titleLine2}
              </>
            )}
            {hero.accent && (
              <>
                <br />
                <motion.span
                  className="inline-block text-gradient-battle"
                  initial={isDesktopPointer ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                >
                  {hero.accent}
                </motion.span>
              </>
            )}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-fog">
            {hero.paragraph}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <CTAButton to="/memberships">
              Claim Your 3-Day Free Pass <FaArrowRightLong />
            </CTAButton>
            <CTAButton href={WHATSAPP} target="_blank" variant="ghost">
              <FaWhatsapp size={16} /> Reserva por WhatsApp
            </CTAButton>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4 text-sm text-smoke"
          >
            <div className="flex text-battle">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  initial={isDesktopPointer ? { opacity: 0, scale: 0.5 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.08, type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <FaStar size={16} />
                </motion.span>
              ))}
            </div>
            <span className="font-head uppercase tracking-wider">
              {hero.ratingText}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <RopeLoader />
        <span className="font-head text-[10px] uppercase tracking-[0.3em] text-smoke">
          Scroll
        </span>
      </div>
    </section>
  )
}
