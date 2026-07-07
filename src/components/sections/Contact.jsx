import { motion } from 'motion/react'
import {
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaWhatsapp,
  FaClock,
  FaArrowUpRightFromSquare,
  FaArrowRightLong,
  FaInstagram,
  FaFacebookF,
} from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { whatsappUrl } from '../../content/defaults'
import { fadeUp, stagger, Reveal, reveal } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import Parallax from '../ui/Parallax'

/* ------------------------------------------------------------------ */
/*  Contact — "the HQ": a command-center panel with every way to reach  */
/*  the gym (tap-to-act rows + WhatsApp CTA + socials) next to a big    */
/*  map with a floating address card and directions button.             */
/* ------------------------------------------------------------------ */

/* El enlace del mapa se edita como texto libre en el admin: solo incrustamos
   el iframe si de verdad apunta a Google Maps por https. */
function trustedMapSrc(url) {
  try {
    const u = new URL(url)
    const host = u.hostname
    const ok =
      u.protocol === 'https:' &&
      (host === 'google.com' || host.endsWith('.google.com') || host === 'maps.app.goo.gl')
    return ok ? url : null
  } catch {
    return null
  }
}

export default function Contact() {
  const { brand, hours: HOURS } = useContent()
  const WHATSAPP = whatsappUrl(brand)
  const mapSrc = trustedMapSrc(brand.mapsEmbed)
  const fullAddress = `${brand.address} ${brand.city}`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`

  const rows = [
    {
      icon: FaLocationDot,
      label: 'Visit HQ',
      value: `${brand.address}, ${brand.city}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
      external: true,
    },
    { icon: FaPhone, label: 'Call us', value: brand.phone, href: brand.phoneHref },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      value: brand.whatsappNumber,
      href: WHATSAPP,
      external: true,
    },
    { icon: FaEnvelope, label: 'Email', value: brand.email, href: `mailto:${brand.email}` },
  ]

  const socials = [
    { icon: FaInstagram, href: brand.instagram, label: 'Instagram' },
    { icon: FaFacebookF, href: brand.facebook, label: 'Facebook' },
  ].filter((s) => s.href)

  return (
    <section id="contact" className="relative overflow-hidden bg-coal py-24">
      {/* ambient glow — drifts slower than the page (deeper plane) */}
      <Parallax speed={70} className="pointer-events-none absolute -left-40 bottom-0">
        <div className="h-[420px] w-[420px] rounded-full bg-battle/10 blur-[140px]" />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="04" kicker="Get In Touch" title="FIND THE" accent="GYM" />

        <motion.div
          variants={stagger}
          {...reveal}
          className={`mt-14 grid gap-6 ${mapSrc ? 'lg:grid-cols-[minmax(0,26rem)_1fr]' : 'mx-auto max-w-xl'}`}
        >
          {/* ---------- Command panel ---------- */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col overflow-hidden rounded-2xl border border-iron bg-ink"
          >
            <div className="bg-hazard h-1.5" />

            <div className="flex items-center justify-between gap-3 border-b border-iron px-6 py-5">
              <div>
                <div className="font-display text-3xl leading-none text-chalk">
                  BATTLE <span className="text-battle">HQ</span>
                </div>
                <div className="mt-1.5 font-head text-[10px] font-semibold uppercase tracking-[0.25em] text-smoke">
                  {brand.city}
                </div>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-iron bg-coal px-3 py-1.5 font-head text-[10px] font-semibold uppercase tracking-[0.2em] text-fog">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-battle"
                  style={{ animation: 'var(--animate-blink)' }}
                />
                Ready
              </span>
            </div>

            {/* tap-to-act rows */}
            <div className="flex-1 divide-y divide-iron">
              {rows.map((r) => {
                const Icon = r.icon
                return (
                  <a
                    key={r.label}
                    href={r.href}
                    target={r.external ? '_blank' : undefined}
                    rel={r.external ? 'noreferrer' : undefined}
                    className="group/row flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-battle/5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-battle/10 text-battle transition-colors duration-300 group-hover/row:bg-battle group-hover/row:text-ink">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-head text-[10px] font-semibold uppercase tracking-[0.2em] text-smoke">
                        {r.label}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-chalk">{r.value}</span>
                    </span>
                    <FaArrowRightLong
                      size={13}
                      className="shrink-0 text-smoke transition-all duration-300 group-hover/row:translate-x-1 group-hover/row:text-battle"
                    />
                  </a>
                )
              })}
            </div>

            {/* primary action + socials */}
            <div className="flex items-center gap-3 border-t border-iron p-5">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="group/cta inline-flex flex-1 cursor-pointer items-center justify-center gap-2 bg-battle px-5 py-3.5 font-head text-xs font-bold uppercase tracking-widest text-ink shadow-[0_8px_30px_-8px_rgba(255,210,0,0.6)] transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                <FaWhatsapp size={16} /> Chat on WhatsApp
                <FaArrowRightLong className="transition-transform group-hover/cta:translate-x-1" size={12} />
              </a>
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-iron text-fog transition-colors duration-300 hover:border-battle hover:bg-battle hover:text-ink"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </motion.div>

          {/* ---------- Map ---------- */}
          {mapSrc && (
            <motion.div
              variants={fadeUp}
              className="group relative min-h-[380px] overflow-hidden rounded-2xl border border-iron transition-colors duration-300 hover:border-battle/40 lg:min-h-0"
            >
              <iframe
                title="Battle Ready Fitness location"
                src={mapSrc}
                className="absolute inset-0 h-full w-full grayscale transition-all duration-500 group-hover:grayscale-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* HUD corner brackets */}
              <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-battle/60" />
              <span className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r-2 border-t-2 border-battle/60" />

              {/* floating address card + directions */}
              <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-iron bg-ink/90 p-4 backdrop-blur-sm sm:inset-x-4 sm:bottom-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-battle text-ink">
                    <FaLocationDot size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-chalk">{brand.address}</div>
                    <div className="truncate text-xs text-smoke">{brand.city}</div>
                  </div>
                </div>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 cursor-pointer items-center gap-2 border border-battle/60 bg-battle/10 px-4 py-2.5 font-head text-[11px] font-bold uppercase tracking-widest text-battle transition-colors duration-200 hover:bg-battle hover:text-ink"
                >
                  Get Directions <FaArrowUpRightFromSquare size={10} />
                </a>
              </div>
            </motion.div>
          )}
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
              <div className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2 sm:border-l sm:border-iron sm:pl-8 lg:grid-cols-3">
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
      </div>
    </section>
  )
}
