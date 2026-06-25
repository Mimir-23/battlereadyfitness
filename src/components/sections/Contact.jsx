import { motion } from 'motion/react'
import {
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaWhatsapp,
} from 'react-icons/fa6'
import {
  WHATSAPP,
  PHONE,
  PHONE_HREF,
  WHATSAPP_NUMBER,
  EMAIL,
  ADDRESS,
  CITY,
  MAPS_EMBED,
} from '../../data/site'
import { fadeUp, stagger, Reveal } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

export default function Contact() {
  const cards = [
    { icon: FaLocationDot, label: 'Visit', lines: [ADDRESS, CITY] },
    { icon: FaPhone, label: 'Call', lines: [PHONE], href: PHONE_HREF },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      lines: [WHATSAPP_NUMBER],
      href: WHATSAPP,
      external: true,
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      lines: [EMAIL],
      href: `mailto:${EMAIL}`,
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

        <Reveal className="mt-6 overflow-hidden rounded-2xl border border-iron">
          <iframe
            title="Battle Ready Fitness location"
            src={MAPS_EMBED}
            className="h-72 w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  )
}
