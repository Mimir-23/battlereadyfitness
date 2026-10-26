/**
 * Auditoría automática de accesibilidad (axe-core, WCAG 2.2 A/AA) de las
 * páginas públicas y del login del panel, en escritorio y en móvil.
 *
 * Uso: con el sitio corriendo (por ejemplo `npm run preview`):
 *   npm run a11y                     → http://localhost:4321
 *   npm run a11y -- https://otra-url  → cualquier despliegue
 *
 * Además repite las páginas con las opciones del panel de accesibilidad
 * activadas (lector de pantalla, texto al 150 %, alto contraste, enlaces
 * subrayados, fuente legible, sin animaciones), que no deben introducir
 * problemas nuevos.
 *
 * Usa el Google Chrome instalado en el equipo (o CHROME_PATH). Los iframes
 * de terceros (Recess, Google Maps, YouTube) quedan fuera: no son código
 * del sitio. Sale con código 1 si encuentra violaciones.
 */
import { chromium } from 'playwright-core'
import { AxeBuilder } from '@axe-core/playwright'

const base = (process.argv[2] || 'http://localhost:4321').replace(/\/+$/, '')
const PAGES = ['/', '/schedule', '/memberships', '/terms', '/accessibility', '/nope', '/admin/login']
const DESKTOP = { viewport: { width: 1440, height: 900 } }
const MOBILE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
const PREFS = { reader: true, text: '1.5', contrast: true, links: true, font: true, still: true }
const VIEWPORTS = {
  desktop: { options: DESKTOP },
  mobile: { options: MOBILE },
  'desktop+a11y': { options: DESKTOP, prefs: PREFS },
  'mobile+a11y': { options: MOBILE, prefs: PREFS },
}
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
)

let total = 0
for (const [device, { options, prefs }] of Object.entries(VIEWPORTS)) {
  const context = await browser.newContext(options)
  if (prefs) await context.addInitScript((p) => localStorage.setItem('br-a11y', JSON.stringify(p)), prefs)
  for (const path of PAGES) {
    const page = await context.newPage()
    const response = await page.goto(base + path, { waitUntil: 'networkidle' }).catch(() => null)
    if (!response) {
      console.log(`✘ ${device} ${path}: no responde`)
      total++
      continue
    }
    // Recorre la página para que se muestre todo (revelados, lazy-load).
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(1200)

    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).exclude('iframe').analyze()
    total += violations.length
    console.log(`${violations.length ? '✘' : '✔'} ${device.padEnd(12)} ${path.padEnd(14)} ${violations.length} problemas`)
    for (const v of violations) {
      console.log(`    [${v.impact}] ${v.id}: ${v.help}`)
      for (const node of v.nodes.slice(0, 4)) console.log(`        ${node.target.join(' ')}`)
      if (v.nodes.length > 4) console.log(`        … y ${v.nodes.length - 4} más`)
    }
    await page.close()
  }
  await context.close()
}
await browser.close()
console.log(total ? `\n${total} problemas de accesibilidad.` : '\nSin problemas de accesibilidad detectados.')
process.exit(total ? 1 : 0)
