import { motion } from 'motion/react'
import { FaCheck, FaWhatsapp, FaArrowRightLong } from 'react-icons/fa6'
import { PLANS, RECESS_MEMBERSHIPS, WHATSAPP } from '../data/site'
import { fadeUp, stagger, Reveal, VIEWPORT } from '../lib/motion'
import { usePageTitle } from '../lib/usePageTitle'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import CTAButton from '../components/ui/CTAButton'
import RecessEmbed from '../components/ui/RecessEmbed'
import Spotlight from '../components/ui/Spotlight'

export default function Memberships() {
  usePageTitle('Memberships')
  return (
    <>
      <PageBanner
        kicker="No Contracts · Cancel Anytime"
        title="MEMBER"
        accent="SHIPS"
        subtitle="One pass, every battle program. Start with 3 free days, then pick the plan that matches your fight."
        image="/images/cta.jpg"
      />

      {/* Plan cards */}
      <section className="bg-ink bg-grid py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading number="01" kicker="Choose Your Plan" title="JOIN THE" accent="RANKS" />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-14 grid gap-5 lg:grid-cols-3"
          >
            {PLANS.map((plan) => (
              <Spotlight
                key={plan.name}
                variants={fadeUp}
                tilt={false}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col overflow-hidden rounded-2xl border p-8 ${
                  plan.featured
                    ? 'border-battle bg-coal lg:scale-[1.03]'
                    : 'border-iron bg-coal hover:border-battle/40'
                }`}
                style={
                  plan.featured ? { animation: 'var(--animate-glow)' } : undefined
                }
              >
                {plan.featured && (
                  <>
                    <div className="bg-hazard absolute inset-x-0 top-0 h-2 opacity-80" />
                    <span className="absolute right-5 top-5 rounded-full bg-battle px-3 py-1 font-head text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                      Most Popular
                    </span>
                  </>
                )}

                <h3 className="font-head text-xl font-semibold uppercase tracking-wide text-chalk">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-5xl text-battle">{plan.price}</span>
                  <span className="mb-1.5 text-sm text-smoke">{plan.period}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fog">{plan.desc}</p>

                <ul className="mt-6 space-y-3">
                  {plan.perks.map((perk, pi) => (
                    <motion.li
                      key={perk}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + pi * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3 text-sm text-fog"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-battle/15 text-battle">
                        <FaCheck size={10} />
                      </span>
                      {perk}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 pt-2">
                  <CTAButton
                    href="#join"
                    full
                    variant={plan.featured ? 'primary' : 'ghost'}
                    magnetic={false}
                  >
                    {plan.cta}
                  </CTAButton>
                </div>
              </Spotlight>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recess checkout embed */}
      <section id="join" className="border-y border-iron bg-coal py-24">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <SectionHeading
            number="02"
            kicker="Secure Checkout"
            title="EXPLORE"
            accent="PACKAGES"
          />
          <p className="mx-auto mt-4 max-w-xl text-center text-fog">
            Pick your package and complete sign-up right here — securely powered by
            our Recess member portal.
          </p>

          <Reveal className="mt-12 overflow-hidden rounded-2xl border border-iron bg-ink">
            <RecessEmbed
              src={RECESS_MEMBERSHIPS}
              title="Battle Ready — Explore Packages"
              minHeight={760}
            />
          </Reveal>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <p className="text-sm text-smoke">Prefer to talk it through first?</p>
            <CTAButton href={WHATSAPP} target="_blank" variant="ghost">
              <FaWhatsapp size={16} /> Message a Coach <FaArrowRightLong size={14} />
            </CTAButton>
          </div>
        </div>
      </section>
    </>
  )
}
