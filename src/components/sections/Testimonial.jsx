import { FaStar } from 'react-icons/fa6'
import { Reveal, isTouch } from '../../lib/motion'

export default function Testimonial() {
  return (
    <section className="relative overflow-hidden border-y border-iron py-28">
      <img
        src="/images/g1.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        loading={isTouch ? 'eager' : 'lazy'}
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
            &ldquo;Professional, motivating, super clean boot-camp gym! Evelyn
            will kick your behind to get the workout in.{' '}
            <span className="text-battle">Results guaranteed!</span>&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-battle font-head text-lg font-bold text-ink">
              AM
            </div>
            <div className="text-left">
              <div className="font-head font-semibold uppercase tracking-wide text-chalk">
                Ana Machado
              </div>
              <div className="text-xs uppercase tracking-widest text-smoke">
                Verified via Google
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
