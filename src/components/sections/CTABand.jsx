import { Link } from 'react-router-dom'
import { FaArrowRightLong, FaWhatsapp } from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { whatsappUrl } from '../../content/defaults'
import { Reveal, isTouch } from '../../lib/motion'

/** Full-bleed yellow "claim your free pass" call-to-action band. */
export default function CTABand() {
  const { cta, brand } = useContent()
  const WHATSAPP = whatsappUrl(brand)
  return (
    <section className="relative overflow-hidden py-28">
      <img
        src={cta.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ animation: 'var(--animate-kenburns)' }}
        loading={isTouch ? 'eager' : 'lazy'}
        decoding="async"
      />
      <div className="absolute inset-0 bg-battle/85" />
      <div className="bg-hazard absolute inset-x-0 top-0 h-2.5" />
      <div className="bg-hazard absolute inset-x-0 bottom-0 h-2.5" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <span className="font-head text-sm font-bold uppercase tracking-[0.3em] text-ink/70">
            {cta.kicker}
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.75rem,10vw,6rem)] leading-[0.9] text-ink">
            {cta.titleLine1}
            {cta.titleLine2 && (
              <>
                <br />
                {cta.titleLine2}
              </>
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-medium text-ink/80">
            {cta.paragraph}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/memberships"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 bg-ink px-8 py-4 font-head text-sm font-bold uppercase tracking-widest text-battle transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              style={{ animation: 'var(--animate-pulse-ring)' }}
            >
              Claim Yours Now
              <FaArrowRightLong className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ink/30 bg-ink/10 px-8 py-4 font-head text-sm font-bold uppercase tracking-widest text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-battle"
            >
              <FaWhatsapp size={16} /> WhatsApp Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
