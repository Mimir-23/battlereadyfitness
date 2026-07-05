import { motion } from 'motion/react'
import { useContent } from '../../content/ContentProvider'
import { resolveVideoEmbed } from '../../lib/videoEmbed'
import { fadeUp, stagger, reveal } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

/** Embedded videos (YouTube, Instagram, TikTok, Facebook), managed from the
    admin panel. The whole section hides itself while there are no videos. */
export default function Videos() {
  const videos = useContent().videos
  const items = (videos?.items || [])
    .map((it) => ({ ...it, embed: resolveVideoEmbed(it.url) }))
    .filter((it) => it.embed)
  if (items.length === 0) return null

  return (
    <section id="videos" className="border-t border-iron bg-coal py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          number="04"
          kicker={videos.kicker}
          title={videos.titleLine1}
          accent={videos.accent}
        />
        {videos.paragraph && (
          <p className="mx-auto mt-4 max-w-xl text-center text-fog">{videos.paragraph}</p>
        )}

        <motion.div
          variants={stagger}
          {...reveal}
          className="mt-14 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((it, i) => (
            <motion.figure
              key={`${it.url}-${i}`}
              variants={fadeUp}
              className="overflow-hidden rounded-2xl border border-iron bg-ink transition-colors duration-300 hover:border-battle/50"
            >
              <div
                className={
                  it.embed.vertical
                    ? 'mx-auto aspect-[9/16] w-full max-w-[340px]'
                    : 'aspect-video w-full'
                }
              >
                <iframe
                  title={it.label || `Video ${i + 1}`}
                  src={it.embed.src}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="font-head text-xs font-semibold uppercase tracking-wider text-chalk">
                  {it.label || 'Battle Ready Fitness'}
                </span>
                <span className="rounded-full border border-iron px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-smoke">
                  {it.embed.platform}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
