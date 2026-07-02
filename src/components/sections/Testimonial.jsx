import { FaStar } from 'react-icons/fa6'
import { Reveal, isTouch } from '../../lib/motion'
import { useContent } from '../../content/ContentProvider'

export default function Testimonial() {
  const t = useContent().testimonial
  return (
    <section className="relative overflow-hidden border-y border-iron py-28">
      <img
        src={t.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loading={isTouch ? 'eager' : 'lazy'}
        decoding="async"
      />
      <div className="absolute inset-0 bg-ink/85" />
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-battle/10 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <div className="mx-auto mb-6 flex justify-center text-battle">
            {[0, 1, 2, 3, 4].map((i) => (
              <FaStar key={i} size={22} />
            ))}
          </div>
          <blockquote className="font-head text-3xl font-medium leading-snug text-chalk sm:text-4xl">
            &ldquo;{t.quote}{' '}
            {t.highlight && <span className="text-battle">{t.highlight}</span>}&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-battle font-head text-lg font-bold text-ink">
              {initials(t.author)}
            </div>
            <div className="text-left">
              <div className="font-head font-semibold uppercase tracking-wide text-chalk">
                {t.author}
              </div>
              <div className="text-xs uppercase tracking-widest text-smoke">
                {t.role}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** First letters of the author's name for the avatar badge. */
function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}
