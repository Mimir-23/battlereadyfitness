import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import { FaBars, FaXmark, FaWhatsapp } from 'react-icons/fa6'
import { NAV, WHATSAPP } from '../../data/site'
import { EASE } from '../../lib/motion'
import CTAButton from '../ui/CTAButton'
import logo from '/logo-removebg-preview.png'

/** Renders a nav item as a route <Link> (`to`) or a home-anchored hash link. */
function NavItem({ item, onClick, mobile }) {
  const base = mobile
    ? 'block rounded-lg px-3 py-3 font-head text-base font-medium uppercase tracking-wider text-fog transition-colors hover:bg-steel hover:text-chalk'
    : 'group relative font-head text-sm font-medium uppercase tracking-widest text-fog transition-colors hover:text-chalk'

  const underline = !mobile && (
    <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-battle transition-all duration-300 group-hover:w-full" />
  )

  if (item.to) {
    return (
      <Link to={item.to} onClick={onClick} className={base}>
        {item.label}
        {underline}
      </Link>
    )
  }
  // Hash links always resolve against the home route.
  return (
    <Link to={{ pathname: '/', hash: item.hash }} onClick={onClick} className={base}>
      {item.label}
      {underline}
    </Link>
  )
}

export default function Navbar() {
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
          ? 'border-b border-iron bg-ink/95 lg:bg-ink/90 lg:backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 py-1" aria-label="Battle Ready Fitness — home">
          <img src={logo} alt="Battle Ready Fitness" className="h-9 w-auto sm:h-10" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <li key={item.label}>
              <NavItem item={item} />
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-iron text-fog transition-colors hover:border-[#25D366] hover:text-[#25D366]"
          >
            <FaWhatsapp size={18} />
          </a>
          <CTAButton to="/memberships" small>
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
                <li key={item.label}>
                  <NavItem item={item} mobile onClick={() => setOpen(false)} />
                </li>
              ))}
              <li className="mt-2">
                <CTAButton to="/memberships" full onClick={() => setOpen(false)}>
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
