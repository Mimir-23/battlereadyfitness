import { useState } from 'react'
import { motion } from 'motion/react'
import { FaPlay, FaYoutube, FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { resolveVideoEmbed } from '../../lib/videoEmbed'
import { fadeUp, stagger, Reveal, reveal } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'

/* ------------------------------------------------------------------ */
/*  Videos — a "battle screen": one big tactical-framed player and a    */
/*  playlist of cards (real thumbnails for YouTube, branded tiles for   */
/*  the rest). Only the active video loads its iframe, so the section   */
/*  stays light no matter how many videos the admin adds.               */
/* ------------------------------------------------------------------ */

const PLATFORM = {
  YouTube: { icon: FaYoutube, tint: 'text-[#FF4444]' },
  Instagram: { icon: FaInstagram, tint: 'text-[#DD2A7B]' },
  TikTok: { icon: FaTiktok, tint: 'text-[#25F4EE]' },
  Facebook: { icon: FaFacebookF, tint: 'text-[#4B94F8]' },
}

function PlatformChip({ platform }) {
  const p = PLATFORM[platform]
  if (!p) return null
  const Icon = p.icon
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-iron bg-ink/80 px-2.5 py-1 font-head text-[10px] font-semibold uppercase tracking-wider text-fog">
      <Icon size={11} className={p.tint} /> {platform}
    </span>
  )
}

/** Playlist entry: real thumbnail when available, branded tile otherwise. */
function PlaylistCard({ item, index, isActive, onSelect }) {
  const { embed } = item
  const p = PLATFORM[embed.platform]
  const Icon = p?.icon || FaPlay
  return (
    <motion.button
      variants={fadeUp}
      type="button"
      onClick={onSelect}
      aria-label={`Reproducir: ${item.label || embed.platform}`}
      aria-pressed={isActive}
      className={`group w-56 shrink-0 cursor-pointer snap-start overflow-hidden rounded-xl border text-left transition-colors duration-300 sm:w-64 lg:w-full ${
        isActive ? 'border-battle bg-battle/5' : 'border-iron bg-ink hover:border-battle/50'
      }`}
    >
      <div className="relative aspect-video overflow-hidden">
        {embed.thumb ? (
          <img
            src={embed.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              isActive ? '' : 'grayscale-[35%] group-hover:grayscale-0'
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-coal via-ink to-coal">
            <Icon size={34} className={`${p?.tint || 'text-battle'} opacity-80`} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/30" />

        {/* oversized index watermark, like the program cards */}
        <span className="pointer-events-none absolute right-2 top-0 font-display text-4xl leading-none text-stroke-chalk opacity-25">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* state: playing marker vs. play-on-hover */}
        {isActive ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-battle px-2.5 py-1 font-head text-[9px] font-bold uppercase tracking-[0.15em] text-ink">
            <span
              className="h-1.5 w-1.5 rounded-full bg-ink"
              style={{ animation: 'var(--animate-blink)' }}
            />
            En pantalla
          </span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/70 text-battle backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-battle group-hover:text-ink">
              <FaPlay size={13} className="translate-x-px" />
            </span>
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <span className="line-clamp-1 font-head text-xs font-semibold uppercase tracking-wide text-chalk">
          {item.label || `Video ${index + 1}`}
        </span>
        <Icon size={13} className={`${p?.tint || 'text-battle'} shrink-0`} />
      </div>
    </motion.button>
  )
}

export default function Videos() {
  const videos = useContent().videos
  const [selected, setSelected] = useState(0)
  // Autoplay only after a deliberate tap on a card — never on page load.
  const [manual, setManual] = useState(false)

  const items = (videos?.items || [])
    .map((it) => ({ ...it, embed: resolveVideoEmbed(it.url) }))
    .filter((it) => it.embed)
  if (items.length === 0) return null

  const idx = Math.min(selected, items.length - 1)
  const current = items[idx]
  const playerSrc =
    manual && current.embed.platform === 'YouTube'
      ? `${current.embed.src}?autoplay=1&rel=0`
      : current.embed.platform === 'YouTube'
        ? `${current.embed.src}?rel=0`
        : current.embed.src

  const pick = (i) => {
    setSelected(i)
    setManual(true)
  }

  return (
    <section id="videos" className="relative overflow-hidden border-t border-iron bg-coal py-24">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[440px] w-[440px] rounded-full bg-battle/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          number="04"
          kicker={videos.kicker}
          title={videos.titleLine1}
          accent={videos.accent}
        />
        {videos.paragraph && (
          <p className="mx-auto mt-4 max-w-xl text-center text-fog">{videos.paragraph}</p>
        )}

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ---------- Main screen ---------- */}
          <Reveal className="overflow-hidden rounded-2xl border border-iron bg-ink">
            <div className="bg-hazard h-1.5" />
            <div className="relative p-3 sm:p-5">
              {/* HUD corner brackets */}
              <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-battle/50" />
              <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-battle/50" />
              <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-battle/50" />
              <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-battle/50" />

              <div
                className={
                  current.embed.vertical
                    ? 'mx-auto aspect-[9/16] w-full max-w-[calc(72svh*9/16)]'
                    : 'aspect-video w-full'
                }
              >
                {/* Remount on change so the previous video actually stops. */}
                <iframe
                  key={playerSrc}
                  title={current.label || `Video ${idx + 1}`}
                  src={playerSrc}
                  className="h-full w-full rounded-lg border border-iron bg-black"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>

            {/* info bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-iron px-4 py-3 sm:px-5">
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-battle"
                  style={{ animation: 'var(--animate-blink)' }}
                />
                <span className="truncate font-head text-sm font-semibold uppercase tracking-wide text-chalk">
                  {current.label || `Video ${idx + 1}`}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2.5">
                <PlatformChip platform={current.embed.platform} />
                <span className="font-head text-[10px] uppercase tracking-[0.25em] text-smoke">
                  {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
              </span>
            </div>
          </Reveal>

          {/* ---------- Playlist ---------- */}
          <div>
            <div className="mb-3 flex items-center justify-between font-head text-[10px] font-semibold uppercase tracking-[0.25em] text-smoke">
              <span className="flex items-center gap-2">
                <span className="h-px w-5 bg-battle" /> Playlist
              </span>
              <span>{items.length} videos</span>
            </div>
            <motion.div
              variants={stagger}
              {...reveal}
              className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:max-h-[540px] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:px-0 lg:pb-0 lg:pr-1.5"
            >
              {items.map((it, i) => (
                <PlaylistCard
                  key={`${it.url}-${i}`}
                  item={it}
                  index={i}
                  isActive={i === idx}
                  onSelect={() => pick(i)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
