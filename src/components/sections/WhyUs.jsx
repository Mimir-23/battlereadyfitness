import { motion } from 'motion/react'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { getIcon } from '../../content/icons'
import { fadeUp, stagger, Reveal, reveal } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import ParallaxImage from '../ui/ParallaxImage'
import CTAButton from '../ui/CTAButton'
import Spotlight from '../ui/Spotlight'

export default function WhyUs() {
  const why = useContent().why
  const WHY = why.items
  return (
    <section id="welcome" className="relative border-y border-iron bg-coal py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="relative">
            <div className="bg-hazard absolute -left-3 -top-3 z-10 h-16 w-16 rounded-tl-2xl opacity-90" />
            <ParallaxImage
              src={why.image}
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
            {...reveal}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {WHY.map((w) => {
              const Icon = getIcon(w.icon)
              return (
                <Spotlight
                  key={w.title}
                  variants={fadeUp}
                  strength={5}
                  className="group rounded-2xl border border-iron bg-ink p-6 transition-colors duration-300 hover:border-battle/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-battle/10 text-battle transition-colors duration-300 group-hover:bg-battle group-hover:text-ink">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-head text-lg font-semibold uppercase tracking-wide text-chalk">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{w.desc}</p>
                </Spotlight>
              )
            })}
          </motion.div>

          <Reveal className="mt-8">
            <CTAButton to="/memberships">
              Start Your Transformation <FaArrowRightLong />
            </CTAButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
