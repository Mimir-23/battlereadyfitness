import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FaPlay,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaVolumeXmark,
} from 'react-icons/fa6'
import { useContent } from '../../content/ContentProvider'
import { resolveVideoEmbed, buildPreviewSrc } from '../../lib/videoEmbed'
import { fadeUp, stagger, reveal, prefersReducedMotion } from '../../lib/motion'
import SectionHeading from '../ui/SectionHeading'
import Parallax from '../ui/Parallax'

/* ------------------------------------------------------------------ */
/*  Videos — "FIGHT TAPES": every video is a poster taped to the gym    */
/*  wall, slightly tilted, crossed by a hazard-tape band. Tapping one   */
/*  opens a full-screen player that adapts to the video's format        */
/*  (16:9 widescreen or 9:16 vertical), so YouTube, reels, TikToks and  */
/*  Shorts all look right on any device. No iframe loads until then.    */
/* ------------------------------------------------------------------ */

const PLATFORM = {
  YouTube: { icon: FaYoutube, tint: 'text-[#FF4444]', stamp: 'border-[#FF4444]/70 text-[#FF6666]' },
  Instagram: { icon: FaInstagram, tint: 'text-[#DD2A7B]', stamp: 'border-[#DD2A7B]/70 text-[#F06AA7]' },
  TikTok: { icon: FaTiktok, tint: 'text-[#25F4EE]', stamp: 'border-[#25F4EE]/60 text-[#25F4EE]' },
  Facebook: { icon: FaFacebookF, tint: 'text-[#4B94F8]', stamp: 'border-[#4B94F8]/70 text-[#6FA9F9]' },
}

/** One taped-up poster on the wall. YouTube posters come alive with a muted,
    looping preview while they're on screen; the rest show their thumbnail. */
function TapeCard({ item, index, onOpen }) {
  const { embed } = item
  const p = PLATFORM[embed.platform]
  const Icon = p?.icon || FaPlay
  const tilted = index % 2 === 0 ? '-rotate-[1.75deg]' : 'rotate-[1.75deg]'
  const offset = index % 3 === 1 ? 'sm:translate-y-5' : ''

  // Admin-uploaded cover first; YouTube auto-thumbnail as fallback.
  const poster = item.thumb || embed.thumb
  const previewSrc = prefersReducedMotion ? null : buildPreviewSrc(embed)
  const artRef = useRef(null)
  const [live, setLive] = useState(false)

  // Only run the muted preview while the poster is near the viewport, so a
  // long wall never keeps a dozen players running off screen.
  useEffect(() => {
    if (!previewSrc || !artRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: '80px' },
    )
    io.observe(artRef.current)
    return () => io.disconnect()
  }, [previewSrc])

  return (
    <motion.button
      variants={fadeUp}
      type="button"
      onClick={onOpen}
      aria-label={`Play video: ${item.label || embed.platform}`}
      className={`group relative w-[calc(50%-0.5rem)] cursor-pointer sm:w-auto sm:max-w-80 sm:grow sm:basis-52 ${tilted} ${offset} transition-transform duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.05] focus-visible:rotate-0`}
    >
      {/* pieces of tape holding the poster to the wall */}
      <span className="pointer-events-none absolute -left-3 -top-2 z-10 h-4 w-12 -rotate-[38deg] bg-chalk/20 shadow-sm backdrop-blur-[1px]" />
      <span className="pointer-events-none absolute -right-3 -top-2 z-10 h-4 w-12 rotate-[38deg] bg-chalk/20 shadow-sm backdrop-blur-[1px]" />

      <div className="overflow-hidden rounded-sm border-2 border-iron bg-ink text-left shadow-[0_22px_45px_-18px_rgba(0,0,0,0.9)] transition-colors duration-300 group-hover:border-battle/60">
        <div className="bg-hazard h-1.5 opacity-80" />

        {/* poster art */}
        <div ref={artRef} className="relative aspect-[4/5] overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover grayscale-[45%] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-coal via-ink to-coal bg-[repeating-linear-gradient(-45deg,transparent,transparent_12px,rgba(255,210,0,0.05)_12px,rgba(255,210,0,0.05)_24px)]">
              <Icon
                size={44}
                className={`absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 ${p?.tint || 'text-battle'} opacity-70 transition-transform duration-500 group-hover:scale-110`}
              />
            </div>
          )}

          {/* live muted preview, center-cropped to fill the poster. The
              poster image stays underneath while the player warms up. */}
          {live && previewSrc && (
            <iframe
              title=""
              aria-hidden="true"
              tabIndex={-1}
              src={previewSrc}
              className="pointer-events-none absolute left-1/2 top-1/2 h-full w-[222%] -translate-x-1/2 -translate-y-1/2"
              allow="autoplay; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />

          {/* stencil tape number */}
          <span className="pointer-events-none absolute -right-1 top-1 font-display text-6xl leading-none text-stroke-chalk opacity-25">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* platform "rubber stamp" */}
          <span
            className={`absolute left-2.5 top-2.5 inline-flex -rotate-6 items-center gap-1 border-2 px-1.5 py-0.5 font-head text-[9px] font-bold uppercase tracking-[0.15em] opacity-90 ${p?.stamp || 'border-battle/70 text-battle'}`}
          >
            <Icon size={9} /> {embed.platform}
          </span>

          {/* play control */}
          <span className="absolute inset-x-0 bottom-3 flex justify-center">
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-battle text-ink shadow-[0_8px_24px_-6px_rgba(255,210,0,0.7)] transition-transform duration-300 group-hover:scale-110">
              <span className="absolute inset-0 hidden animate-ping rounded-full bg-battle opacity-30 group-hover:block" />
              <FaPlay size={15} className="relative translate-x-px" />
            </span>
          </span>

          {/* the preview runs muted — sound comes with the big player */}
          {live && previewSrc && (
            <span className="absolute bottom-3.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-chalk backdrop-blur-sm">
              <FaVolumeXmark size={10} />
            </span>
          )}
        </div>

        {/* poster footer */}
        <div className="border-t border-iron bg-coal px-3 py-2.5">
          <div className="line-clamp-1 font-head text-xs font-semibold uppercase tracking-wide text-chalk">
            {item.label || `Round ${index + 1}`}
          </div>
          <div className="mt-0.5 flex items-center justify-between font-head text-[9px] uppercase tracking-[0.25em] text-smoke">
            <span>Tape {String(index + 1).padStart(2, '0')}</span>
            <span className="flex gap-px" aria-hidden="true">
              {/* barcode detail */}
              {[2, 1, 3, 1, 2, 1, 1, 3, 1, 2].map((w, i) => (
                <span key={i} className="h-3 bg-smoke/60" style={{ width: w }} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

/** Full-screen player: adapts to widescreen or vertical video, arrows/Esc/swipe. */
function Player({ items, index, onChange }) {
  const isOpen = index >= 0
  const touchX = useRef(null)
  const many = items.length > 1

  const close = () => onChange(-1)
  const step = (dir) => onChange((index + dir + items.length) % items.length)

  // Deps explícitas: sin ellas el efecto corría en CADA render, re-atando el
  // listener y reescribiendo el overflow del documento una y otra vez.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onChange(-1)
      else if (e.key === 'ArrowLeft' && many) onChange((index - 1 + items.length) % items.length)
      else if (e.key === 'ArrowRight' && many) onChange((index + 1) % items.length)
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [isOpen, index, many, items.length, onChange])

  const current = isOpen ? items[index] : null
  const embed = current?.embed
  // The tap on the poster is the user gesture — autoplay is expected here.
  const src =
    embed?.platform === 'YouTube' ? `${embed.src}?autoplay=1&rel=0` : embed?.src

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.label || 'Video'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
          onClick={close}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null || !many) return
            const dx = e.changedTouches[0].clientX - touchX.current
            touchX.current = null
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1)
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/80 text-chalk transition-colors hover:border-battle hover:text-battle"
          >
            <FaXmark size={18} />
          </button>

          {many && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                aria-label="Previous video"
                className="absolute left-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/80 text-chalk transition-colors hover:border-battle hover:text-battle sm:left-5"
              >
                <FaChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                aria-label="Next video"
                className="absolute right-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-iron bg-coal/80 text-chalk transition-colors hover:border-battle hover:text-battle sm:right-5"
              >
                <FaChevronRight size={16} />
              </button>
            </>
          )}

          <motion.figure
            key={index}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-svh flex-col items-center gap-4 px-14 py-6 sm:px-20"
          >
            {/* Sized by format: vertical fills the height (phone-native feel),
                widescreen fills the width — both capped so nothing overflows. */}
            <div
              className={
                embed.vertical
                  ? 'aspect-[9/16] h-[min(78svh,150vw)]'
                  : 'aspect-video w-[min(92vw,138svh)]'
              }
            >
              <iframe
                key={src}
                title={current.label || `Video ${index + 1}`}
                src={src}
                className="h-full w-full rounded-xl border border-iron bg-black"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <figcaption className="flex max-w-full items-center gap-3">
              <span className="h-px w-6 shrink-0 bg-battle" />
              <span className="truncate font-head text-sm font-semibold uppercase tracking-widest text-chalk">
                {current.label || `Round ${index + 1}`}
              </span>
              {many && (
                <span className="shrink-0 font-head text-xs text-smoke">
                  {index + 1} / {items.length}
                </span>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Videos() {
  const videos = useContent().videos
  const [open, setOpen] = useState(-1)

  const items = (videos?.items || [])
    .map((it) => ({ ...it, embed: resolveVideoEmbed(it.url) }))
    .filter((it) => it.embed)
  if (items.length === 0) return null

  return (
    <section id="videos" className="relative overflow-hidden border-t border-iron bg-coal py-24">
      {/* ambient glow — drifts slower than the page (deeper plane) */}
      <Parallax speed={70} className="pointer-events-none absolute -right-40 top-1/3">
        <div className="h-[440px] w-[440px] rounded-full bg-battle/10 blur-[140px]" />
      </Parallax>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          kicker={videos.kicker}
          title={videos.titleLine1}
          accent={videos.accent}
        />
        {videos.paragraph && (
          <p className="mx-auto mt-4 max-w-xl text-center text-fog">{videos.paragraph}</p>
        )}

        {/* the wall */}
        <div className="relative mx-auto mt-12 max-w-6xl pb-4">
          {/* hazard-tape band running behind the posters */}
          <div
            aria-hidden="true"
            className="bg-hazard pointer-events-none absolute left-1/2 top-1/2 h-9 w-[130vw] -translate-x-1/2 -translate-y-1/2 -rotate-2 opacity-60"
          />
          <motion.div
            variants={stagger}
            {...reveal}
            className="relative flex flex-wrap items-start justify-center gap-4 sm:gap-6"
          >
            {items.map((it, i) => (
              <TapeCard key={`${it.url}-${i}`} item={it} index={i} onOpen={() => setOpen(i)} />
            ))}
          </motion.div>
        </div>

        <p className="mt-6 text-center font-head text-[10px] font-semibold uppercase tracking-[0.35em] text-smoke">
          — Press play. Feel the battle. —
        </p>
      </div>

      <Player items={items} index={open} onChange={setOpen} />
    </section>
  )
}
