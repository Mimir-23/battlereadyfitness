import { motion } from 'motion/react'
import {
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaWhatsapp,
  FaClock,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { whatsappUrl } from '../../content/defaults'
import { fadeUp, stagger, Reveal, reveal } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

export default function Contact() {
  const { brand, hours: HOURS } = useContent()
  const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${brand.address} ${brand.city}`,
  )}`
  const cards = [
    {
      icon: FaLocationDot,
      label: 'Visit',
      lines: [brand.address, brand.city],
      href: mapsSearch,
      external: true,
    },
    { icon: FaPhone, label: 'Call', lines: [brand.phone], href: brand.phoneHref },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      lines: [brand.whatsappNumber],
      href: whatsappUrl(brand),
      external: true,
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      lines: [brand.email],
      href: `mailto:${brand.email}`,
    },
  ]

  return (
    <section id="contact" className="bg-coal py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="04" kicker="Get In Touch" title="FIND THE" accent="GYM" />
        <motion.div
          variants={stagger}
          {...reveal}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cards.map((c) => {
            const Icon = c.icon
            const inner = (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-battle/10 text-battle transition-colors duration-300 group-hover:bg-battle group-hover:text-ink">
                    <Icon size={20} />
                  </div>
                  {c.href && (
                    <FaArrowUpRightFromSquare
                      size={12}
                      className="text-smoke transition-colors group-hover:text-battle"
                    />
                  )}
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
                    className="group block h-full cursor-pointer rounded-2xl border border-iron bg-ink p-6 transition-colors duration-300 hover:border-battle/50"
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

        {/* Opening hours strip */}
        {HOURS?.length > 0 && (
          <Reveal className="mt-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-iron bg-ink p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 sm:pr-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-battle/10 text-battle">
                  <FaClock size={20} />
                </div>
                <div className="font-head text-xs font-semibold uppercase tracking-[0.2em] text-smoke">
                  Opening
                  <br />
                  Hours
                </div>
              </div>
              <div className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 sm:border-l sm:border-iron sm:pl-8">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex items-baseline justify-between gap-4 sm:block">
                    <div className="font-head text-xs font-semibold uppercase tracking-wider text-battle">
                      {h.day}
                    </div>
                    <div className="text-sm text-chalk sm:mt-0.5">{h.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {brand.mapsEmbed && (
          <Reveal className="group mt-6 overflow-hidden rounded-2xl border border-iron transition-colors duration-300 hover:border-battle/40">
            <iframe
              title="Battle Ready Fitness location"
              src={brand.mapsEmbed}
              className="h-72 w-full grayscale transition-all duration-500 group-hover:grayscale-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
