import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { FaArrowRightLong } from 'react-icons/fa6'
import { PROGRAMS } from '../../data/site'
import { fadeUp, stagger } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import Spotlight from '../ui/Spotlight'

export default function Programs() {
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
              <Spotlight
                key={p.name}
                data-cursor
                variants={fadeUp}
                whileHover={{ y: -6 }}
                strength={6}
                className={`group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl border border-iron transition-colors duration-300 hover:border-battle/50 ${
                  featured ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 lg:grayscale lg:group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20 transition-colors duration-500 group-hover:from-ink group-hover:via-ink/60" />

                {/* oversized index watermark */}
                <span className="pointer-events-none absolute right-4 top-2 font-display text-7xl leading-none text-stroke-chalk opacity-20 transition-opacity duration-500 group-hover:opacity-40">
                  {String(i + 1).padStart(2, '0')}
                </span>

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
                  <p className="mt-2 overflow-hidden text-sm leading-relaxed text-fog transition-all duration-500 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-32 lg:group-hover:opacity-100">
                    {p.desc}
                  </p>
                  <Link
                    to="/memberships"
                    className="mt-4 inline-flex items-center gap-2 font-head text-xs font-semibold uppercase tracking-widest text-battle transition-all group-hover:gap-3"
                  >
                    Get Started Now <FaArrowRightLong size={12} />
                  </Link>
                </div>
              </Spotlight>
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
              <Link
                to="/memberships"
                className="inline-flex items-center gap-2 font-head text-sm font-bold uppercase tracking-widest text-ink"
              >
                Claim Yours Now <FaArrowRightLong />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
