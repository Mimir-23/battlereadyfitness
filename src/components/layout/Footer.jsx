import { Link } from 'react-router-dom'
import {
  FaClock,
  FaPhone,
  FaMobileScreenButton,
  FaEnvelope,
  FaLocationDot,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from 'react-icons/fa6'
import {
  NAV,
  PROGRAMS,
  HOURS,
  WHATSAPP,
  PHONE,
  PHONE_HREF,
  WHATSAPP_NUMBER,
  EMAIL,
  ADDRESS,
  CITY,
} from '../../data/site'
import CTAButton from '../ui/CTAButton'
import logo from '/logo-removebg-preview.png'

const SOCIALS = [
  { icon: FaFacebookF, href: 'https://facebook.com/battlereadyfit', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com/battle_readyfit', label: 'Instagram' },
  { icon: FaXTwitter, href: 'https://twitter.com/Battle_ReadyFit', label: 'Twitter' },
  { icon: FaWhatsapp, href: WHATSAPP, label: 'WhatsApp' },
]

/** Renders a footer nav entry as a route link or home-anchored hash link. */
function FootLink({ item }) {
  const cls = 'text-sm text-fog transition-colors hover:text-battle'
  if (item.to) {
    return (
      <Link to={item.to} className={cls}>
        {item.label}
      </Link>
    )
  }
  return (
    <Link to={{ pathname: '/', hash: item.hash }} className={cls}>
      {item.label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-iron bg-ink">
      {/* top CTA strip */}
      <div className="border-b border-iron">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center lg:flex-row lg:px-8 lg:text-left">
          <h3 className="font-display text-3xl text-chalk sm:text-4xl">
            READY TO <span className="text-battle">FIGHT FOR IT?</span>
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CTAButton to="/memberships">Claim 3-Day Free Pass</CTAButton>
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
            {SOCIALS.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-iron text-fog transition-colors duration-300 hover:border-battle hover:bg-battle hover:text-ink"
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
                <Link
                  to={{ pathname: '/', hash: '#programs' }}
                  className="text-sm text-fog transition-colors hover:text-battle"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-head text-sm font-semibold uppercase tracking-[0.2em] text-chalk">
            Explore
          </h4>
          <ul className="mt-4 space-y-2.5">
            {NAV.filter((n) => n.label !== 'Home').map((n) => (
              <li key={n.label}>
                <FootLink item={n} />
              </li>
            ))}
          </ul>
          <h4 className="mt-7 flex items-center gap-2 font-head text-sm font-semibold uppercase tracking-[0.2em] text-chalk">
            <FaClock size={13} className="text-battle" /> Hours
          </h4>
          <ul className="mt-3 space-y-1.5">
            {HOURS.map(([d, t]) => (
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
              <span>
                {ADDRESS}, {CITY}
              </span>
            </li>
            <li>
              <a
                href={PHONE_HREF}
                className="flex items-center gap-3 text-fog transition-colors hover:text-battle"
              >
                <FaPhone className="shrink-0 text-battle" size={15} /> {PHONE}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-fog transition-colors hover:text-battle"
              >
                <FaMobileScreenButton className="shrink-0 text-battle" size={15} /> {WHATSAPP_NUMBER}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 break-all text-fog transition-colors hover:text-battle"
              >
                <FaEnvelope className="shrink-0 text-battle" size={15} />
                {EMAIL}
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
