import { useEffect, useRef, useState } from 'react'
import { FaMobileScreenButton, FaDesktop } from 'react-icons/fa6'

/* ------------------------------------------------------------------ */
/*  Browser-style frame around the live preview. Sells the idea that    */
/*  "this is how the site will look": fake chrome, a device toggle and  */
/*  a glow pulse every time the draft changes while typing.             */
/* ------------------------------------------------------------------ */

export default function PreviewShell({ draft, children }) {
  const [device, setDevice] = useState('desktop')
  const [pulse, setPulse] = useState(false)
  const first = useRef(true)
  const json = JSON.stringify(draft)

  useEffect(() => {
    // Skip the initial mount — only flash on real edits.
    if (first.current) {
      first.current = false
      return
    }
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 700)
    return () => clearTimeout(t)
  }, [json])

  const deviceBtn = (id, Icon, label) => (
    <button
      type="button"
      onClick={() => setDevice(id)}
      aria-label={label}
      title={label}
      aria-pressed={device === id}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors ${
        device === id ? 'bg-battle text-ink' : 'text-smoke hover:text-chalk'
      }`}
    >
      <Icon size={13} />
    </button>
  )

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
        pulse
          ? 'border-battle/70 shadow-[0_0_0_4px_rgba(250,204,21,0.15)]'
          : 'border-iron shadow-none'
      }`}
    >
      {/* Fake browser chrome */}
      <div className="flex items-center gap-3 border-b border-iron bg-coal px-3.5 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-alert/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-battle/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="hidden flex-1 truncate rounded-full bg-ink px-3 py-1 text-center text-[11px] text-smoke sm:block">
          battlereadyfitness.com
        </div>
        <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-iron bg-ink p-0.5 sm:ml-0">
          {deviceBtn('desktop', FaDesktop, 'Ver como computadora')}
          {deviceBtn('mobile', FaMobileScreenButton, 'Ver como teléfono')}
        </div>
      </div>

      {/* Stage */}
      <div className="bg-ink p-4">
        {device === 'mobile' ? (
          <div className="mx-auto w-full max-w-[375px] rounded-[1.25rem] border-4 border-coal bg-ink p-2 shadow-xl">
            {children}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
