import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  FaCheck,
  FaWhatsapp,
  FaArrowRightLong,
  FaArrowLeftLong,
  FaLock,
  FaShieldHalved,
  FaBoltLightning,
  FaCircleXmark,
} from 'react-icons/fa6'
import { useContent } from '../content/ContentProvider'
import { whatsappUrl } from '../content/defaults'
import { fadeUp, stagger, Reveal, reveal, isTouch } from '../lib/motion'
import { usePageTitle } from '../lib/usePageTitle'
import PageBanner from '../components/ui/PageBanner'
import SectionHeading from '../components/ui/SectionHeading'
import CTAButton from '../components/ui/CTAButton'
import RecessEmbed from '../components/ui/RecessEmbed'
import Spotlight from '../components/ui/Spotlight'
import Parallax from '../components/ui/Parallax'

export default function Memberships() {
  usePageTitle('Memberships')
  const { plans: PLANS, brand } = useContent()
  const RECESS_MEMBERSHIPS = brand.recessUrl
  const WHATSAPP = whatsappUrl(brand)

  // Plan elegido en las tarjetas: el checkout de abajo carga ese paquete
  // exacto de Recess (…/embed/checkout/package/<id>) en vez de la lista.
  const [selected, setSelected] = useState(null) // { id, name } | null
  const embedSrc = useMemo(() => {
    if (!selected) return RECESS_MEMBERSHIPS
    try {
      const origin = new URL(RECESS_MEMBERSHIPS).origin
      return `${origin}/embed/checkout/package/${encodeURIComponent(selected.id)}?hideMenu=true`
    } catch {
      return RECESS_MEMBERSHIPS
    }
  }, [selected, RECESS_MEMBERSHIPS])

  return (
    <>
      <PageBanner
        kicker="No Contracts · Cancel Anytime"
        title="MEMBER"
        accent="SHIPS"
        subtitle="One pass, every battle program. Start with 3 free days, then pick the plan that matches your fight."
        image="/images/cta.webp"
      />

      {/* Plan cards */}
      <section className="bg-ink bg-grid py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading number="01" kicker="Choose Your Plan" title="JOIN THE" accent="RANKS" />

          <motion.div
            variants={stagger}
            {...reveal}
            className="mt-14 grid gap-5 lg:grid-cols-3"
          >
            {PLANS.map((plan, i) => (
              <Spotlight
                key={`${plan.name}-${i}`}
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
                      initial={isTouch ? false : { opacity: 0, x: -8 }}
                      whileInView={isTouch ? undefined : { opacity: 1, x: 0 }}
                      viewport={isTouch ? undefined : { once: true }}
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
                    onClick={
                      plan.recessId
                        ? () => setSelected({ id: plan.recessId, name: plan.name })
                        : () => setSelected(null)
                    }
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
      <section id="join" className="relative overflow-hidden border-y border-iron bg-coal py-24">
        <Parallax speed={70} className="pointer-events-none absolute -right-40 top-1/4">
          <div className="h-[440px] w-[440px] rounded-full bg-battle/10 blur-[140px]" />
        </Parallax>

        <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
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

          {/* Secure checkout terminal */}
          <Reveal className="mt-12 overflow-hidden rounded-2xl border border-iron bg-ink shadow-2xl">
            <div className="bg-hazard h-1.5" />

            {/* terminal top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-iron bg-coal/60 px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-battle/10 text-battle">
                  <FaLock size={15} />
                </span>
                <div className="leading-tight">
                  <div className="font-head text-xs font-bold uppercase tracking-[0.2em] text-chalk">
                    Secure Checkout
                  </div>
                  <div className="mt-0.5 font-head text-[10px] uppercase tracking-wider text-smoke">
                    256-bit SSL · Powered by Recess
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-battle/40 bg-battle/10 px-3 py-1.5 font-head text-[10px] font-semibold uppercase tracking-wider text-battle">
                <FaShieldHalved size={11} /> <span className="hidden sm:inline">Encrypted</span>
              </span>
            </div>

            {/* deep-link bar: which package the terminal is showing */}
            {selected && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-iron bg-battle/5 px-4 py-3 sm:px-5">
                <span className="min-w-0 truncate font-head text-xs font-semibold uppercase tracking-wider text-chalk">
                  Checkout: <span className="text-battle">{selected.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 font-head text-[11px] font-semibold uppercase tracking-wider text-smoke transition-colors hover:text-battle"
                >
                  <FaArrowLeftLong size={11} /> View all packages
                </button>
              </div>
            )}

            {/* key remonta el iframe al cambiar de paquete (resetea el loader) */}
            <RecessEmbed
              key={embedSrc}
              src={embedSrc}
              title={
                selected
                  ? `Battle Ready — ${selected.name} checkout`
                  : 'Battle Ready — Explore Packages'
              }
              minHeight={760}
            />
          </Reveal>

          {/* trust badges */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: FaLock, label: 'SSL Secure' },
              { icon: FaShieldHalved, label: 'Secure Payment' },
              { icon: FaBoltLightning, label: 'Instant Access' },
              { icon: FaCircleXmark, label: 'Cancel Anytime' },
            ].map((b) => {
              const Icon = b.icon
              return (
                <div
                  key={b.label}
                  className="flex items-center gap-2.5 rounded-xl border border-iron bg-ink px-4 py-3"
                >
                  <Icon size={15} className="shrink-0 text-battle" />
                  <span className="font-head text-[11px] font-semibold uppercase tracking-wider text-fog">
                    {b.label}
                  </span>
                </div>
              )
            })}
          </div>

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
