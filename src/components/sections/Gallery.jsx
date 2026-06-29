import { motion } from 'motion/react'
import { GALLERY } from '../../data/site'
import { fadeUp, stagger, reveal, isTouch } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

export default function Gallery() {
  return (
    <section id="gallery" className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="03" kicker="Step Inside" title="THE" accent="BATTLEGROUND" />
        <p className="mx-auto mt-4 max-w-xl text-center text-fog">
          Real sweat, real iron, real results. This is where warriors are forged.
        </p>

        <motion.div
          variants={stagger}
          {...reveal}
          className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {GALLERY.map((g) => (
            <motion.figure
              key={g.src}
              data-cursor
              variants={fadeUp}
              className={`group relative overflow-hidden rounded-2xl border border-iron ${
                g.span || ''
              }`}
            >
              <img
                src={g.src}
                alt={g.label}
                loading={isTouch ? 'eager' : 'lazy'}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 lg:grayscale lg:group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <figcaption className="absolute bottom-0 left-0 flex items-center gap-2 p-5 transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                <span className="h-px w-6 bg-battle" />
                <span className="font-head text-sm font-semibold uppercase tracking-widest text-chalk">
                  {g.label}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
