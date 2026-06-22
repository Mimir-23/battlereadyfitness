import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useVelocity,
  useSpring,
  animate,
} from 'motion/react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Magnetic from './components/Magnetic'
import RevealText from './components/RevealText'
import {
  FaDumbbell,
  FaPersonRunning,
  FaStairs,
  FaHandFist,
  FaHeartPulse,
  FaMusic,
  FaBoltLightning,
  FaFire,
  FaUsers,
  FaStar,
  FaClock,
  FaPhone,
  FaMobileScreenButton,
  FaEnvelope,
  FaLocationDot,
  FaArrowRightLong,
  FaArrowUp,
  FaCheck,
  FaBars,
  FaXmark,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from 'react-icons/fa6'

import logo from '/logo-removebg-preview.png'

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const WHATSAPP =
  'https://wa.me/17862345399?text=' +
  encodeURIComponent('¡Hola! Quiero reclamar mi 3-Day Free Pass 💪')

const NAV = [
  { label: 'Warriors', href: '#welcome' },
  { label: 'Programs', href: '#programs' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Contact', href: '#contact' },
]

const PROGRAMS = [
  {
    icon: FaDumbbell,
    name: 'Personal Training',
    desc: 'Libera tu máximo potencial con sesiones de entrenamiento personalizadas.',
    tag: '1-on-1',
    img: '/images/g1.jpg',
  },
  {
    icon: FaPersonRunning,
    name: 'Bootcamp',
    desc: 'The quickest way to get fit. High-energy circuits that push every limit.',
    tag: 'Signature',
    img: '/images/bootcamp.jpg',
  },
  {
    icon: FaStairs,
    name: 'Step Circuit',
    desc: 'Explosive step intervals that torch calories fast. Get started now.',
    tag: 'Cardio',
    img: '/images/g4.jpg',
  },
  {
    icon: FaHandFist,
    name: 'Kickboxing',
    desc: 'Strike, sweat and build real combat conditioning. Get started now.',
    tag: 'Combat',
    img: '/images/kickboxing.jpg',
  },
  {
    icon: FaHeartPulse,
    name: 'Full Body',
    desc: 'Total-body strength and endurance in one brutal session. Get started now.',
    tag: 'Strength',
    img: '/images/g2.jpg',
  },
  {
    icon: FaMusic,
    name: 'Zumba',
    desc: 'Dance your way fit with high-energy rhythm workouts. Get started now.',
    tag: 'Dance',
    img: '/images/coach.jpg',
  },
  {
    icon: FaBoltLightning,
    name: 'HIIT by Javi',
    desc: 'Maximum intensity intervals for maximum results. Get started now.',
    tag: 'Intense',
    img: '/images/hero.jpg',
  },
]

const STATS = [
  { value: 7, suffix: '', label: 'Battle Programs' },
  { value: 6, suffix: ' days', label: 'Training Weekly' },
  { value: 3, suffix: '-day', label: 'Free Pass' },
  { value: 5, suffix: '★', label: 'Google Rated' },
]

const WHY = [
  {
    icon: FaFire,
    title: 'Relentless Intensity',
    desc: 'Every session pushes you past comfort into results — no filler, no wasted reps.',
  },
  {
    icon: FaUsers,
    title: 'Coaches Who Care',
    desc: 'Motivating trainers who know your name and drive you forward, rep after rep.',
  },
  {
    icon: FaHeartPulse,
    title: 'Spotless Facility',
    desc: 'A super clean, fully-equipped boot-camp gym built for performance and recovery.',
  },
  {
    icon: FaCheck,
    title: 'Results Guaranteed',
    desc: 'Show up, do the work, transform. Our community is proof the system delivers.',
  },
]

const GALLERY = [
  { src: '/images/g3.jpg', label: 'The Floor', span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/kickboxing.jpg', label: 'Combat' },
  { src: '/images/g2.jpg', label: 'Strength' },
  { src: '/images/bootcamp.jpg', label: 'Bootcamp' },
  { src: '/images/g4.jpg', label: 'Power' },
]

const MARQUEE = [
  'BOOTCAMP',
  'HIIT',
  'KICKBOXING',
  'STEP CIRCUIT',
  'FULL BODY',
  'ZUMBA',
  'PERSONAL TRAINING',
]

/* ------------------------------------------------------------------ */
/*  Motion helpers                                                    */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

function Reveal({ children, className, variants = fadeUp }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, mv])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

function RopeLoader() {
  return (
    <div className="flex items-end gap-1.5" aria-label="Loading">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="block w-1.5 rounded-full bg-battle"
          style={{
            height: 28,
            animation: 'var(--animate-rope)',
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}

/* Scroll-linked parallax image inside a relatively-positioned, clipped parent */
function ParallaxImage({ src, alt, className = '', strength = 80 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="h-[120%] w-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Chrome                                                            */
/* ------------------------------------------------------------------ */

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-battle"
    />
  )
}

function CTAButton({
  children,
  href,
  small,
  full,
  onClick,
  variant = 'primary',
  target,
  magnetic = true,
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden font-head font-semibold uppercase tracking-widest transition-transform duration-200 will-change-transform active:scale-[0.97] cursor-pointer'
  const size = small ? 'px-5 py-2.5 text-xs' : 'px-7 py-3.5 text-sm'
  const width = full ? 'w-full' : ''
  const skin =
    variant === 'primary'
      ? 'bg-battle text-ink shadow-[0_8px_30px_-8px_rgba(255,210,0,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(255,210,0,0.85)]'
      : 'border border-iron bg-ink/30 text-chalk backdrop-blur-sm hover:border-battle hover:text-battle'

  const link = (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={target ? 'noreferrer' : undefined}
      className={`${base} ${size} ${width} ${skin}`}
    >
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      )}
      <span className="relative flex items-center gap-2">{children}</span>
    </a>
  )

  if (magnetic && !full) {
    return <Magnetic className={full ? 'w-full' : ''}>{link}</Magnetic>
  }
  return link
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-iron bg-ink/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="Battle Ready Fitness" className="h-9 w-auto sm:h-10" />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative font-head text-sm font-medium uppercase tracking-widest text-fog transition-colors hover:text-chalk"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-battle transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-iron text-fog transition-colors hover:border-[#25D366] hover:text-[#25D366]"
          >
            <FaWhatsapp size={18} />
          </a>
          <CTAButton href="#memberships" small>
            3-Day Free Pass
          </CTAButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="cursor-pointer p-2 text-chalk lg:hidden"
        >
          {open ? <FaXmark size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-iron bg-coal lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 font-head text-base font-medium uppercase tracking-wider text-fog transition-colors hover:bg-steel hover:text-chalk"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <CTAButton href="#memberships" full onClick={() => setOpen(false)}>
                  Claim 3-Day Free Pass
                </CTAButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/* ------------------------------------------------------------------ */
/*  Sections                                                          */
/* ------------------------------------------------------------------ */

function Hero({ loaded }) {
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
      className="relative flex min-h-screen items-center overflow-hidden bg-ink"
    >
      {/* background image with ken-burns + scroll zoom */}
      <motion.div style={{ scale: imgScale }} className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Athletes training inside Battle Ready Fitness"
          className="h-full w-full object-cover"
          style={{ animation: 'var(--animate-kenburns)' }}
        />
      </motion.div>
      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-battle/70 to-transparent"
          style={{ animation: 'var(--animate-scan)' }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto w-full max-w-7xl px-5 pt-24 lg:px-8"
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={loaded ? 'show' : 'hidden'}
          className="max-w-3xl"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-battle/40 bg-battle/10 px-4 py-1.5 font-head text-xs font-medium uppercase tracking-[0.2em] text-battle backdrop-blur-sm">
              <FaLocationDot size={12} /> Hialeah, Florida · Boot-Camp Gym
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-6xl leading-[0.88] text-chalk sm:text-7xl lg:text-[7.5rem]"
          >
            WE&apos;RE NOT JUST
            <br />
            THE BEST.
            <br />
            <motion.span
              className="inline-block text-battle"
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              WE&apos;RE SIMPLY UNIQUE.
            </motion.span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-relaxed text-fog">
            A high-intensity boot-camp gym where coaches push you, the community
            lifts you, and results are guaranteed. No excuses. Just the work.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <CTAButton href="#memberships">
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
                <FaStar key={i} size={16} />
              ))}
            </div>
            <span className="font-head uppercase tracking-wider">
              Rated 5★ by warriors on Google
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

function Marquee({ reverse }) {
  const items = [...MARQUEE, ...MARQUEE]
  // Marquee leans/skews with how fast you scroll — reacts to scroll velocity.
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 200, damping: 40 })
  const skewX = useTransform(smooth, [-2000, 0, 2000], [-8, 0, 8], {
    clamp: true,
  })

  return (
    <div
      className={`relative overflow-hidden border-y border-iron py-4 ${
        reverse ? 'bg-ink' : 'bg-battle'
      }`}
    >
      <motion.div style={{ skewX }} className="w-max">
        <div
          className="flex w-max items-center gap-8 whitespace-nowrap"
          style={{
            animation: reverse
              ? 'var(--animate-marquee-rev)'
              : 'var(--animate-marquee)',
          }}
        >
          {items.map((word, i) => (
            <span key={i} className="flex items-center gap-8">
              <span
                className={`font-display text-2xl tracking-wide ${
                  reverse ? 'text-stroke-chalk' : 'text-ink'
                }`}
              >
                {word}
              </span>
              <FaFire className={reverse ? 'text-battle' : 'text-ink/70'} size={18} />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function Stats() {
  return (
    <section className="border-b border-iron bg-coal py-14">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 lg:grid-cols-4 lg:px-8"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="text-center">
            <div className="font-display text-5xl text-battle lg:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 font-head text-xs font-medium uppercase tracking-[0.2em] text-smoke">
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function SectionHeading({ number, kicker, title, accent, align = 'center' }) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <Reveal>
        <div
          className={`flex items-center gap-3 ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          {number && (
            <span className="font-display text-2xl text-stroke leading-none">
              {number}
            </span>
          )}
          <span className="font-head text-xs font-semibold uppercase tracking-[0.3em] text-battle">
            {kicker}
          </span>
        </div>
      </Reveal>
      <RevealText
        as="h2"
        className="mt-3 font-display text-5xl leading-[0.95] text-chalk lg:text-6xl"
      >
        {title} {accent && <span className="text-battle">{accent}</span>}
      </RevealText>
    </div>
  )
}

function Programs() {
  return (
    <section id="programs" className="bg-ink bg-grid py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="01" kicker="Train Your Way" title="CHOOSE YOUR" accent="BATTLE" />
        <p className="mx-auto mt-4 max-w-xl text-center text-fog">
          Seven battle-tested programs engineered to build strength, torch fat,
          and forge discipline. Pick your fight.
        </p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROGRAMS.map((p, i) => {
            const Icon = p.icon
            const featured = i === 1
            return (
              <motion.article
                key={p.name}
                data-cursor
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={`group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl border border-iron ${
                  featured ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* image */}
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 transition-colors duration-500 group-hover:from-ink group-hover:via-ink/60" />
                {featured && (
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-battle px-3 py-1 font-head text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                    Signature
                  </span>
                )}

                <div className="relative z-10 p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-battle/15 text-battle backdrop-blur-sm transition-colors duration-300 group-hover:bg-battle group-hover:text-ink">
                      <Icon size={22} />
                    </div>
                    <span className="font-head text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-head text-2xl font-semibold uppercase tracking-wide text-chalk">
                    {p.name}
                  </h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-fog opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
                    {p.desc}
                  </p>
                  <a
                    href="#memberships"
                    className="mt-4 inline-flex items-center gap-2 font-head text-xs font-semibold uppercase tracking-widest text-battle transition-all group-hover:gap-3"
                  >
                    Get Started Now <FaArrowRightLong size={12} />
                  </a>
                </div>
              </motion.article>
            )
          })}

          {/* CTA tile */}
          <motion.div
            variants={fadeUp}
            className="relative flex min-h-[340px] flex-col justify-center overflow-hidden rounded-2xl bg-battle p-8"
          >
            <div className="bg-hazard absolute inset-x-0 top-0 h-2.5 opacity-80" />
            <h3 className="font-display text-5xl leading-none text-ink">NO ESPERES MÁS</h3>
            <p className="mt-4 text-sm font-medium text-ink/80">
              Your first 3 days are on us. Walk in. Get to work. Transform.
            </p>
            <div className="mt-6">
              <a
                href="#memberships"
                className="inline-flex items-center gap-2 font-head text-sm font-bold uppercase tracking-widest text-ink"
              >
                Claim Yours Now <FaArrowRightLong />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section id="welcome" className="relative border-y border-iron bg-coal py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        {/* image with parallax + frame */}
        <Reveal>
          <div className="relative">
            <div className="bg-hazard absolute -left-3 -top-3 z-10 h-16 w-16 rounded-tl-2xl opacity-90" />
            <ParallaxImage
              src="/images/coach.jpg"
              alt="Coach motivating an athlete through a workout"
              className="aspect-[4/5] w-full rounded-2xl border border-iron"
              strength={50}
            />
            <div className="absolute -bottom-6 -right-4 z-10 flex items-center gap-3 rounded-xl border border-iron bg-ink/95 px-5 py-4 shadow-2xl backdrop-blur">
              <div className="font-display text-4xl text-battle">100%</div>
              <div className="font-head text-[11px] uppercase leading-tight tracking-wider text-fog">
                Results
                <br />
                Guaranteed
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            number="02"
            kicker="Welcome, Warrior"
            title="WHY BATTLE"
            accent="READY"
            align="left"
          />
          <Reveal className="mt-5">
            <p className="max-w-md text-fog">
              This isn&apos;t a gym you blend into — it&apos;s a boot camp that
              transforms you. Clean, intense, and relentlessly motivating, every
              detail is built to make you stronger than yesterday.
            </p>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {WHY.map((w) => {
              const Icon = w.icon
              return (
                <motion.div
                  key={w.title}
                  variants={fadeUp}
                  className="rounded-2xl border border-iron bg-ink p-6 transition-colors duration-300 hover:border-battle/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-battle/10 text-battle">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-head text-lg font-semibold uppercase tracking-wide text-chalk">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{w.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>

          <Reveal className="mt-8">
            <CTAButton href="#memberships">
              Start Your Transformation <FaArrowRightLong />
            </CTAButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section id="gallery" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="03" kicker="Step Inside" title="THE" accent="BATTLEGROUND" />
        <p className="mx-auto mt-4 max-w-xl text-center text-fog">
          Real sweat, real iron, real results. This is where warriors are forged.
        </p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {GALLERY.map((g) => (
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
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 flex translate-y-2 items-center gap-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="h-px w-6 bg-battle" />
                <span className="font-head text-sm font-semibold uppercase tracking-widest text-chalk">
                  {g.label}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Testimonial() {
  return (
    <section
      id="schedule"
      className="relative overflow-hidden border-y border-iron py-28"
    >
      <img
        src="/images/g1.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-ink/85" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-battle/10 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <div className="mx-auto mb-6 flex justify-center text-battle">
            {[0, 1, 2, 3, 4].map((i) => (
              <FaStar key={i} size={22} />
            ))}
          </div>
          <blockquote className="font-head text-3xl font-medium leading-snug text-chalk sm:text-4xl">
            &ldquo;Professional, motivating, super clean boot-camp gym! Evelyn
            will kick your behind to get the workout in.{' '}
            <span className="text-battle">Results guaranteed!</span>&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-battle font-head text-lg font-bold text-ink">
              AM
            </div>
            <div className="text-left">
              <div className="font-head font-semibold uppercase tracking-wide text-chalk">
                Ana Machado
              </div>
              <div className="text-xs uppercase tracking-widest text-smoke">
                Verified via Google
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function CTABand() {
  return (
    <section id="memberships" className="relative overflow-hidden py-28">
      <img
        src="/images/cta.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ animation: 'var(--animate-kenburns)' }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-battle/85" />
      <div className="bg-hazard absolute inset-x-0 top-0 h-2.5" />
      <div className="bg-hazard absolute inset-x-0 bottom-0 h-2.5" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <span className="font-head text-sm font-bold uppercase tracking-[0.3em] text-ink/70">
            Are You Ready?
          </span>
          <h2 className="mt-4 font-display text-6xl leading-[0.9] text-ink sm:text-7xl lg:text-8xl">
            CLAIM YOUR 3-DAY
            <br />
            FREE PASS
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-medium text-ink/80">
            No excuses. No waiting. Step into the boot camp that guarantees
            results and find out why we&apos;re simply unique.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 bg-ink px-8 py-4 font-head text-sm font-bold uppercase tracking-widest text-battle transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              style={{ animation: 'var(--animate-pulse-ring)' }}
            >
              Claim Yours Now
              <FaArrowRightLong className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ink/30 bg-ink/10 px-8 py-4 font-head text-sm font-bold uppercase tracking-widest text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-battle"
            >
              <FaWhatsapp size={16} /> WhatsApp Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Contact() {
  const cards = [
    {
      icon: FaLocationDot,
      label: 'Visit',
      lines: ['18600 NW 87th Avenue, Suite 116', 'Hialeah, Florida 33015'],
    },
    { icon: FaPhone, label: 'Call', lines: ['305-974-2079'], href: 'tel:3059742079' },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      lines: ['786-234-5399'],
      href: WHATSAPP,
      external: true,
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      lines: ['contact@battlereadyfitness.com'],
      href: 'mailto:contact@battlereadyfitness.com',
    },
  ]

  return (
    <section id="contact" className="bg-coal py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="04" kicker="Get In Touch" title="FIND THE" accent="GYM" />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map((c) => {
            const Icon = c.icon
            const inner = (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-battle/10 text-battle">
                  <Icon size={20} />
                </div>
                <div className="mt-4 font-head text-xs font-semibold uppercase tracking-[0.2em] text-smoke">
                  {c.label}
                </div>
                {c.lines.map((l) => (
                  <div key={l} className="mt-1 text-chalk">
                    {l}
                  </div>
                ))}
              </>
            )
            return (
              <motion.div key={c.label} variants={fadeUp}>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noreferrer' : undefined}
                    className="block h-full rounded-2xl border border-iron bg-ink p-6 transition-colors duration-300 hover:border-battle/50"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="h-full rounded-2xl border border-iron bg-ink p-6">{inner}</div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* map embed */}
        <Reveal className="mt-6 overflow-hidden rounded-2xl border border-iron">
          <iframe
            title="Battle Ready Fitness location"
            src="https://www.google.com/maps?q=18600+NW+87th+Avenue+Suite+116+Hialeah+FL+33015&output=embed"
            className="h-72 w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const socials = [
    { icon: FaFacebookF, href: 'https://facebook.com/battlereadyfit', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com/battle_readyfit', label: 'Instagram' },
    { icon: FaXTwitter, href: 'https://twitter.com/Battle_ReadyFit', label: 'Twitter' },
    { icon: FaWhatsapp, href: WHATSAPP, label: 'WhatsApp' },
  ]
  const hours = [
    ['Mon – Fri', '5:00 AM – 9:00 PM'],
    ['Saturday', '8:00 AM – 2:00 PM'],
    ['Sunday', 'Rest & Recover'],
  ]

  return (
    <footer className="border-t border-iron bg-ink">
      {/* top CTA strip */}
      <div className="border-b border-iron">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center lg:flex-row lg:px-8 lg:text-left">
          <h3 className="font-display text-3xl text-chalk sm:text-4xl">
            READY TO <span className="text-battle">FIGHT FOR IT?</span>
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CTAButton href="#memberships">Claim 3-Day Free Pass</CTAButton>
            <CTAButton href={WHATSAPP} target="_blank" variant="ghost">
              <FaWhatsapp size={16} /> Chat Now
            </CTAButton>
          </div>
        </div>
      </div>

      {/* main grid */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <img src={logo} alt="Battle Ready Fitness" className="h-11 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
            Battle Ready Fitness Bootcamp — Hialeah&apos;s premier boot-camp gym.
            We&apos;re not just the best, we&apos;re simply unique.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-iron text-fog transition-colors duration-300 hover:border-battle hover:bg-battle hover:text-ink"
                >
                  <Icon size={15} />
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <h4 className="font-head text-sm font-semibold uppercase tracking-[0.2em] text-chalk">
            Programs
          </h4>
          <ul className="mt-4 space-y-2.5">
            {PROGRAMS.map((p) => (
              <li key={p.name}>
                <a
                  href="#programs"
                  className="text-sm text-fog transition-colors hover:text-battle"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-head text-sm font-semibold uppercase tracking-[0.2em] text-chalk">
            Explore
          </h4>
          <ul className="mt-4 space-y-2.5">
            {[...NAV, { label: 'Memberships', href: '#memberships' }].map((n) => (
              <li key={n.label}>
                <a
                  href={n.href}
                  className="text-sm text-fog transition-colors hover:text-battle"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <h4 className="mt-7 flex items-center gap-2 font-head text-sm font-semibold uppercase tracking-[0.2em] text-chalk">
            <FaClock size={13} className="text-battle" /> Hours
          </h4>
          <ul className="mt-3 space-y-1.5">
            {hours.map(([d, t]) => (
              <li key={d} className="flex justify-between gap-4 text-sm text-fog">
                <span>{d}</span>
                <span className="text-smoke">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-head text-sm font-semibold uppercase tracking-[0.2em] text-chalk">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3 text-fog">
              <FaLocationDot className="mt-0.5 shrink-0 text-battle" size={15} />
              <span>18600 NW 87th Avenue, Suite 116, Hialeah, FL 33015</span>
            </li>
            <li>
              <a
                href="tel:3059742079"
                className="flex items-center gap-3 text-fog transition-colors hover:text-battle"
              >
                <FaPhone className="shrink-0 text-battle" size={15} /> 305-974-2079
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-fog transition-colors hover:text-battle"
              >
                <FaMobileScreenButton className="shrink-0 text-battle" size={15} /> 786-234-5399
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@battlereadyfitness.com"
                className="flex items-center gap-3 break-all text-fog transition-colors hover:text-battle"
              >
                <FaEnvelope className="shrink-0 text-battle" size={15} />
                contact@battlereadyfitness.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* legal bar */}
      <div className="border-t border-iron">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-xs uppercase tracking-widest text-smoke">
            © Copyright 2018 — Battle Ready Fitness Bootcamp — All Rights Reserved
          </p>
          <p className="text-xs uppercase tracking-widest text-smoke">
            Forged in Hialeah, Florida 🔥
          </p>
        </div>
      </div>
    </footer>
  )
}

function FloatingActions() {
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

export default function App() {
  const lenisRef = useSmoothScroll()
  const [loading, setLoading] = useState(true)

  // Lock scrolling while the preloader is on screen.
  useEffect(() => {
    const lenis = lenisRef.current
    if (loading) {
      lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
    } else {
      lenis?.start()
      document.documentElement.style.overflow = ''
      window.scrollTo(0, 0)
    }
  }, [loading, lenisRef])

  return (
    <>
      <Cursor />
      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <ScrollProgress />
      <Navbar />
      <main>
        <Hero loaded={!loading} />
        <Marquee />
        <Stats />
        <Programs />
        <WhyUs />
        <Gallery />
        <Marquee reverse />
        <Testimonial />
        <CTABand />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
