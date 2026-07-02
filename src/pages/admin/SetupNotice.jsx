import { FaGear, FaArrowUpRightFromSquare } from 'react-icons/fa6'

/** Friendly screen shown when the Supabase keys aren't set yet. */
export default function SetupNotice() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ink bg-grid px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-iron bg-coal p-7">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-battle/15 text-battle">
          <FaGear size={20} />
        </div>
        <h1 className="font-display text-3xl text-chalk">Casi listo</h1>
        <p className="mt-2 text-sm text-fog">
          El panel administrativo aún no está conectado a Supabase. Sigue estos
          pasos una sola vez y quedará funcionando:
        </p>

        <ol className="mt-5 space-y-3 text-sm text-fog">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-battle font-head text-xs font-bold text-ink">1</span>
            <span>
              Crea una cuenta gratuita en{' '}
              <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-battle hover:underline">
                supabase.com <FaArrowUpRightFromSquare className="inline" size={10} />
              </a>{' '}
              y un proyecto nuevo.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-battle font-head text-xs font-bold text-ink">2</span>
            <span>
              En <strong className="text-chalk">SQL Editor</strong>, pega y ejecuta el
              archivo <code className="rounded bg-ink px-1.5 py-0.5 text-battle">supabase/schema.sql</code>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-battle font-head text-xs font-bold text-ink">3</span>
            <span>
              En <strong className="text-chalk">Project Settings → API</strong>, copia la
              <em> URL</em> y la <em>anon key</em> en el archivo{' '}
              <code className="rounded bg-ink px-1.5 py-0.5 text-battle">.env.local</code>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-battle font-head text-xs font-bold text-ink">4</span>
            <span>Reinicia el sitio. Encontrarás la guía completa en <code className="rounded bg-ink px-1.5 py-0.5 text-battle">PANEL-ADMIN.md</code>.</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
