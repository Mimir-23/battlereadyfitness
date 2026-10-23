/**
 * Vista previa local del build de producción (equivalente al antiguo
 * `vite preview`). En Vercel el sitio usa su adaptador; aquí se compila con
 * el de Node para poder servirlo sin desplegar.
 * Uso:  npm run preview
 */
import { spawnSync } from 'node:child_process'

const env = { ...process.env, ASTRO_ADAPTER: 'node' }
const run = (args) => spawnSync('npx', ['astro', ...args], { stdio: 'inherit', env, shell: process.platform === 'win32' })

const build = run(['build'])
if (build.status !== 0) process.exit(build.status ?? 1)
run(['preview', ...process.argv.slice(2)])
