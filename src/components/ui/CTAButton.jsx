import { Link } from 'react-router-dom'
import Magnetic from '../Magnetic'

/**
 * Branded call-to-action. Renders a router <Link> when `to` is given, otherwise
 * a plain <a> (for hash anchors, tel:, mailto:, external/WhatsApp links).
 * Magnetic by default unless full-width.
 */
export default function CTAButton({
  children,
  href,
  to,
  small,
  full,
  onClick,
  variant = 'primary',
  target,
  magnetic = true,
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden font-head font-semibold uppercase tracking-widest transition-transform duration-200 will-change-transform active:scale-[0.97] cursor-pointer'
  const size = small ? 'px-5 py-2.5 text-xs' : 'px-7 py-3.5 text-sm'
  const width = full ? 'w-full' : ''
  const skin =
    variant === 'primary'
      ? 'bg-battle text-ink shadow-[0_8px_30px_-8px_rgba(255,210,0,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(255,210,0,0.85)]'
      : 'border border-iron bg-ink/30 text-chalk backdrop-blur-sm hover:border-battle hover:text-battle'

  const className = `${base} ${size} ${width} ${skin}`

  const inner = (
    <>
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      )}
      {/* tactical corner ticks (reveal on hover) */}
      <span className="pointer-events-none absolute left-1 top-1 h-2 w-2 border-l border-t border-current opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
      <span className="pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r border-current opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
      <span className="relative flex items-center gap-2">{children}</span>
    </>
  )

  const link = to ? (
    <Link to={to} onClick={onClick} className={className}>
      {inner}
    </Link>
  ) : (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={target ? 'noreferrer' : undefined}
      className={className}
    >
      {inner}
    </a>
  )

  if (magnetic && !full) {
    return <Magnetic className={full ? 'w-full' : ''}>{link}</Magnetic>
  }
  return link
}
