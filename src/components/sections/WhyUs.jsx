import { motion } from 'motion/react'
import { FaArrowRightLong, FaWhatsapp, FaCheck } from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { getIcon } from '../../content/icons'
import { whatsappUrl } from '../../content/defaults'
import { fadeUp, stagger, Reveal, reveal } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import ParallaxImage from '../ui/ParallaxImage'
import CTAButton from '../ui/CTAButton'

/* ------------------------------------------------------------------ */
/*  Why us — "the battle plan": numbered reason rows with a filling     */
/*  yellow rail, next to a tactical-framed photo with proof badges.     */
/* ------------------------------------------------------------------ */

export default function WhyUs() {
  const { why, brand } = useContent()
  const WHY = why.items
  const WHATSAPP = whatsappUrl(brand)

  return (
    <section id="welcome" className="relative overflow-hidden border-y border-iron bg-coal py-24">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-battle/10 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative">
            <div className="bg-hazard absolute -left-3 -top-3 z-10 h-16 w-16 rounded-tl-2xl opacity-90" />

            <ParallaxImage
              src={why.image}
              alt="Coach motivating an athlete through a workout"
              className="aspect-[4/5] w-full rounded-2xl border border-iron"
              strength={50}
            />

            {/* tactical status chip */}
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-iron bg-ink/85 px-3.5 py-1.5 font-head text-[10px] font-semibold uppercase tracking-[0.2em] text-fog backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full bg-battle"
                style={{ animation: 'var(--animate-blink)' }}
              />
              Hialeah · FL
            </div>

            {/* HUD corner */}
            <span className="pointer-events-none absolute bottom-4 left-4 z-10 h-7 w-7 border-b-2 border-l-2 border-battle/60" />

            {/* proof badge */}
            <div className="absolute -bottom-6 -right-4 z-10 overflow-hidden rounded-xl border border-iron bg-ink/95 shadow-2xl backdrop-blur">
              <div className="bg-hazard h-1 opacity-80" />
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="font-display text-4xl text-battle">100%</div>
                <div className="font-head text-[11px] uppercase leading-tight tracking-wider text-fog">
                  Results
                  <br />
                  Guaranteed
                </div>
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

          {/* the battle plan: numbered reason rows */}
          <motion.div variants={stagger} {...reveal} className="mt-9 space-y-3">
            {WHY.map((w, i) => {
              const Icon = getIcon(w.icon)
              return (
                <motion.div
                  key={w.title}
                  variants={fadeUp}
                  className="group relative flex items-start gap-4 overflow-hidden rounded-xl border border-iron bg-ink p-5 pr-6 transition-colors duration-300 hover:border-battle/50"
                >
                  {/* yellow rail that fills in on hover */}
                  <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-battle transition-transform duration-300 group-hover:scale-y-100" />

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-battle/10 text-battle transition-colors duration-300 group-hover:bg-battle group-hover:text-ink">
                    <Icon size={19} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <h3 className="font-head text-base font-semibold uppercase tracking-wide text-chalk">
                      {w.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-fog">{w.desc}</p>
                  </span>

                  {/* stencil index */}
                  <span className="pointer-events-none absolute -right-1 -top-2 font-display text-5xl leading-none text-stroke-chalk opacity-15 transition-opacity duration-300 group-hover:opacity-40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>

          <Reveal className="mt-9">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTAButton to="/memberships">
                Start Your Transformation <FaArrowRightLong />
              </CTAButton>
              <CTAButton href={WHATSAPP} target="_blank" variant="ghost">
                <FaWhatsapp size={16} /> Ask Us Anything
              </CTAButton>
            </div>
            {/* friction killers right where the decision happens */}
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {['3-day free pass', 'No contracts', 'All levels welcome'].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 font-head text-[11px] font-semibold uppercase tracking-wider text-smoke"
                >
                  <FaCheck size={11} className="text-battle" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
