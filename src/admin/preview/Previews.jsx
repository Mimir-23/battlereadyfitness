import { getIcon } from '../../content/icons'
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaLocationDot,
  FaStar,
  FaFire,
  FaPlay,
  FaTriangleExclamation,
} from 'react-icons/fa6'
import { resolveVideoEmbed } from '../../lib/videoEmbed'

/* ------------------------------------------------------------------ */
/*  Live previews — compact, brand-styled mirrors of each section that  */
/*  update in real time as the admin types. Faithful to the real look   */
/*  (same colours, images, layout) without the heavy scroll animations. */
/* ------------------------------------------------------------------ */

const Frame = ({ children, dark = true }) => (
  <div className={`overflow-hidden rounded-xl border border-iron ${dark ? 'bg-ink' : 'bg-battle'}`}>
    {children}
  </div>
)

function HeroPreview({ d }) {
  return (
    <Frame>
      <div className="relative min-h-[220px] p-6">
        {d.image && (
          <img src={d.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="relative max-w-md">
          {d.badge && (
            <span className="inline-block rounded-full border border-battle/40 bg-battle/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-battle">
              {d.badge}
            </span>
          )}
          <div className="mt-3 font-display text-3xl leading-[0.9] text-chalk">
            <div>{d.titleLine1}</div>
            {d.titleLine2 && <div>{d.titleLine2}</div>}
            {d.accent && <div className="text-battle">{d.accent}</div>}
          </div>
          <p className="mt-3 text-xs text-fog">{d.paragraph}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-battle px-3 py-1.5 font-head text-[10px] font-bold uppercase tracking-wider text-ink">
              Claim Your 3-Day Free Pass
            </span>
            <span className="border border-iron bg-ink/40 px-3 py-1.5 font-head text-[10px] font-semibold uppercase tracking-wider text-chalk">
              <FaWhatsapp className="mr-1 inline" size={10} /> WhatsApp
            </span>
          </div>
          {d.ratingText && (
            <div className="mt-3 flex items-center gap-2 text-battle">
              {[0, 1, 2, 3, 4].map((i) => (
                <FaStar key={i} size={11} />
              ))}
              <span className="text-[11px] text-smoke">{d.ratingText}</span>
            </div>
          )}
        </div>
      </div>
    </Frame>
  )
}

function ProgramsPreview({ d }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {(d || []).map((p, i) => {
        const Icon = getIcon(p.icon)
        return (
          <div key={i} className="relative flex min-h-[120px] flex-col justify-end overflow-hidden rounded-xl border border-iron p-3">
            {p.img && <img src={p.img} alt="" className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
            <div className="relative">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-battle/20 text-battle">
                <Icon size={14} />
              </div>
              <div className="mt-2 font-head text-sm font-semibold uppercase text-chalk">{p.name}</div>
              <div className="text-[10px] uppercase tracking-wider text-smoke">{p.tag}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatsPreview({ d }) {
  return (
    <Frame>
      <div className="grid grid-cols-4 gap-2 p-5">
        {(d || []).map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-3xl text-battle">
              {s.value}
              {s.suffix}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-smoke">{s.label}</div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

function WhyPreview({ d }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {d.image ? (
        <img src={d.image} alt="" className="aspect-[4/5] w-full rounded-xl border border-iron object-cover" />
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl border border-iron text-xs text-smoke">
          Sin imagen
        </div>
      )}
      <div className="grid gap-2">
        {(d.items || []).map((w, i) => {
          const Icon = getIcon(w.icon)
          return (
            <div key={i} className="rounded-lg border border-iron bg-coal p-2.5">
              <Icon className="text-battle" size={15} />
              <div className="mt-1 font-head text-xs font-semibold uppercase text-chalk">{w.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GalleryPreview({ d }) {
  return (
    <div className="grid auto-rows-[70px] grid-cols-4 gap-2">
      {(d || []).map((g, i) => (
        <figure key={i} className={`relative overflow-hidden rounded-lg border border-iron ${g.span || ''}`}>
          <img src={g.src} alt="" className="h-full w-full object-cover" />
          <figcaption className="absolute bottom-0 left-0 p-1.5 text-[9px] font-semibold uppercase text-chalk">
            {g.label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function TestimonialPreview({ d }) {
  return (
    <Frame>
      <div className="relative p-5">
        {d.image && <img src={d.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />}
        <div className="relative space-y-3">
          {(d.items || []).map((it, i) => (
            <div key={i} className="rounded-lg border border-iron bg-ink/70 p-3 text-center">
              <div className="mb-1.5 flex justify-center text-battle">
                {[0, 1, 2, 3, 4].map((j) => (
                  <FaStar key={j} size={11} />
                ))}
              </div>
              <p className="font-head text-sm leading-snug text-chalk">
                “{it.quote} {it.highlight && <span className="text-battle">{it.highlight}</span>}”
              </p>
              <div className="mt-2 font-head text-xs font-semibold uppercase text-chalk">{it.author}</div>
              <div className="text-[10px] uppercase tracking-wider text-smoke">{it.role}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

function CtaPreview({ d }) {
  return (
    <Frame dark={false}>
      <div className="relative p-6 text-center">
        {d.image && <img src={d.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
        <div className="bg-hazard absolute inset-x-0 top-0 h-1.5" />
        <div className="bg-hazard absolute inset-x-0 bottom-0 h-1.5" />
        <div className="relative">
          {d.kicker && <div className="text-[10px] font-bold uppercase tracking-widest text-ink/70">{d.kicker}</div>}
          <div className="mt-1 font-display text-2xl leading-[0.9] text-ink">
            <div>{d.titleLine1}</div>
            {d.titleLine2 && <div>{d.titleLine2}</div>}
          </div>
          <p className="mx-auto mt-2 max-w-xs text-xs font-medium text-ink/80">{d.paragraph}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="bg-ink px-3 py-1.5 font-head text-[10px] font-bold uppercase tracking-wider text-battle">
              Claim Yours Now
            </span>
            <span className="border border-ink/30 px-3 py-1.5 font-head text-[10px] font-bold uppercase tracking-wider text-ink">
              <FaWhatsapp className="mr-1 inline" size={10} /> WhatsApp Us
            </span>
          </div>
        </div>
      </div>
    </Frame>
  )
}

function MarqueePreview({ d }) {
  return (
    <div className="overflow-hidden rounded-xl border border-iron bg-battle py-3">
      <div className="flex flex-wrap items-center gap-3 px-3">
        {(d || []).map((w, i) => (
          <span key={i} className="flex items-center gap-2 font-display text-lg text-ink">
            {w} <FaFire size={12} className="text-ink/70" />
          </span>
        ))}
      </div>
    </div>
  )
}

function NavPreview({ d }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-iron bg-coal px-4 py-3">
      <span className="font-display text-lg leading-none text-chalk">BATTLE READY</span>
      <div className="flex flex-wrap items-center gap-4">
        {(d || []).map((n, i) => (
          <span key={i} className="font-head text-xs font-semibold uppercase tracking-wider text-fog">
            {n.label}
            <span className="ml-1 text-[10px] normal-case text-smoke">{n.to || n.hash}</span>
          </span>
        ))}
      </div>
      <span className="ml-auto bg-battle px-2.5 py-1.5 font-head text-[9px] font-bold uppercase tracking-wider text-ink">
        Free Pass
      </span>
    </div>
  )
}

function BrandPreview({ d }) {
  const row = (Icon, text) => (
    <div className="flex items-center gap-2 text-sm text-chalk">
      <Icon className="text-battle" size={13} /> {text}
    </div>
  )
  return (
    <div className="space-y-2 rounded-xl border border-iron bg-coal p-4">
      {row(FaLocationDot, `${d.address}, ${d.city}`)}
      {row(FaPhone, d.phone)}
      {row(FaWhatsapp, d.whatsappNumber)}
      {row(FaEnvelope, d.email)}
    </div>
  )
}

function HoursPreview({ d }) {
  return (
    <div className="grid gap-2 rounded-xl border border-iron bg-coal p-4 sm:grid-cols-3">
      {(d || []).map((h, i) => (
        <div key={i} className="rounded-lg border border-iron bg-ink p-3 text-center">
          <div className="font-head text-xs font-semibold uppercase tracking-wider text-battle">{h.day}</div>
          <div className="mt-1 text-xs text-fog">{h.time}</div>
        </div>
      ))}
    </div>
  )
}

function SchedulePreview({ d }) {
  const days = d?.days || []
  const rows = d?.rows || []
  return (
    <div className="overflow-x-auto rounded-xl border border-iron">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-coal">
            <th className="border border-iron p-1.5 text-left uppercase text-smoke">Hora</th>
            {days.map((day) => (
              <th key={day} className="border border-iron p-1.5 text-left uppercase text-smoke">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border border-iron p-1.5 font-semibold text-battle">{r.time}</td>
              {days.map((day) => (
                <td key={day} className="border border-iron p-1.5 text-fog">
                  {r.classes?.[day] || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PlansPreview({ d }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {(d || []).map((p, i) => (
        <div
          key={i}
          className={`rounded-xl border p-4 ${p.featured ? 'border-battle bg-coal' : 'border-iron bg-coal'}`}
        >
          <div className="font-head text-sm font-semibold uppercase text-chalk">{p.name}</div>
          <div className="mt-1 font-display text-2xl text-battle">{p.price}</div>
          <div className="text-[10px] uppercase tracking-wider text-smoke">{p.period}</div>
          <ul className="mt-2 space-y-1">
            {(p.perks || []).map((perk, j) => (
              <li key={j} className="text-[11px] text-fog">
                • {perk}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function VideosPreview({ d }) {
  const items = d?.items || []
  return (
    <Frame>
      <div className="p-5 text-center">
        {d.kicker && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-battle">{d.kicker}</div>
        )}
        <div className="mt-1 font-display text-2xl leading-none text-chalk">
          {d.titleLine1} {d.accent && <span className="text-battle">{d.accent}</span>}
        </div>
        {d.paragraph && <p className="mx-auto mt-2 max-w-xs text-xs text-fog">{d.paragraph}</p>}

        {items.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-iron px-3 py-4 text-xs text-smoke">
            Sin videos todavía — la sección no se muestra en el sitio hasta que agregues uno.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {items.map((it, i) => {
              const embed = resolveVideoEmbed(it.url)
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 ${
                    embed ? 'border-iron bg-coal' : 'border-alert/50 bg-alert/10'
                  }`}
                >
                  {embed ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-battle text-ink">
                      <FaPlay size={10} />
                    </span>
                  ) : (
                    <FaTriangleExclamation className="text-alert" size={16} />
                  )}
                  <span className="line-clamp-1 font-head text-[10px] font-semibold uppercase text-chalk">
                    {it.label || `Video ${i + 1}`}
                  </span>
                  <span className={`text-[9px] uppercase tracking-wider ${embed ? 'text-smoke' : 'text-alert'}`}>
                    {embed ? embed.platform : 'Enlace no reconocido'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Frame>
  )
}

const MAP = {
  hero: HeroPreview,
  videos: VideosPreview,
  programs: ProgramsPreview,
  stats: StatsPreview,
  why: WhyPreview,
  gallery: GalleryPreview,
  testimonial: TestimonialPreview,
  cta: CtaPreview,
  marquee: MarqueePreview,
  nav: NavPreview,
  brand: BrandPreview,
  hours: HoursPreview,
  schedule: SchedulePreview,
  plans: PlansPreview,
}

export default function SectionPreview({ sectionKey, draft }) {
  const Cmp = MAP[sectionKey]
  if (!Cmp) {
    return <div className="text-sm text-smoke">Sin vista previa para esta sección.</div>
  }
  return <Cmp d={draft} />
}
