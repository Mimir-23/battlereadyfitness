import { useEffect, useRef, useState } from 'react'

/**
 * Embeds a Recess (battle-ready.recess.tv) iframe and auto-resizes it to its
 * content. Recess posts `["setHeight", <px>]` messages on its window; we listen
 * and apply the height so there's no inner scrollbar. React equivalent of the
 * inline <script> + <iframe> snippet Recess hands out, plus a branded skeleton
 * so the section doesn't jump while the portal loads.
 */
export default function RecessEmbed({ src, title = 'Recess Embed', minHeight = 720 }) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const onMessage = (e) => {
      // Recess sends an array: [command, value]
      if (!Array.isArray(e.data)) return
      const [command, value] = e.data
      if (command === 'setHeight' && ref.current && value) {
        ref.current.style.height = `${value}px`
        setLoaded(true)
      }
    }
    window.addEventListener('message', onMessage, false)
    return () => window.removeEventListener('message', onMessage, false)
  }, [])

  return (
    <div className="relative" style={{ minHeight }}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink">
          <div className="relative h-12 w-12">
            <span className="absolute inset-0 rounded-full border-2 border-iron" />
            <span
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-battle"
              style={{ animation: 'var(--animate-spin-slow)' }}
            />
          </div>
          <span className="font-head text-xs uppercase tracking-[0.3em] text-smoke">
            Loading secure checkout…
          </span>
          {/* shimmer rows */}
          <div className="mt-2 w-full max-w-sm space-y-3 px-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative h-10 overflow-hidden rounded-lg bg-coal">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  style={{ animation: 'var(--animate-shimmer)' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <iframe
        ref={ref}
        id="embedIframe"
        title={title}
        src={src}
        width="100%"
        onLoad={() => setLoaded(true)}
        style={{ border: 'none', width: '100%', height: minHeight }}
        allowFullScreen
      />
    </div>
  )
}
