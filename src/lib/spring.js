/* ------------------------------------------------------------------ */
/*  Resortes en CSS                                                    */
/*  Motion animaba varias piezas con física de resorte (stiffness /    */
/*  damping). Aquí se simula ese mismo resorte de 0 a 1 y se convierte */
/*  en una curva `linear()` de CSS + su duración, para obtener el mismo */
/*  rebote con transiciones nativas, sin librería en el navegador.     */
/* ------------------------------------------------------------------ */

/** Simula un resorte amortiguado (masa-resorte) y devuelve la curva CSS. */
export function springEasing({ stiffness = 100, damping = 10, mass = 1 } = {}) {
  const dt = 1 / 1000 // paso de integración: 1 ms
  const sampleEvery = 1 / 60 // un punto de la curva por frame
  let x = 0
  let v = 0
  let t = 0
  let next = sampleEvery
  const points = [0]

  while (t < 4) {
    const a = (-stiffness * (x - 1) - damping * v) / mass
    v += a * dt
    x += v * dt
    t += dt
    if (t >= next) {
      points.push(x)
      next += sampleEvery
    }
    // En reposo (mismo criterio que Motion: restDelta / restSpeed).
    if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.05) break
  }
  points.push(1)

  return {
    easing: `linear(${points.map((p) => Number(p.toFixed(3))).join(', ')})`,
    duration: Math.round(t * 1000),
  }
}

/* Los resortes concretos del diseño original (mismos parámetros). */
export const SPRINGS = {
  // Estrellas del hero: { type: 'spring', stiffness: 400, damping: 15 }
  stars: springEasing({ stiffness: 400, damping: 15 }),
  // Abanico del botón de contacto: { stiffness: 320, damping: 20 }
  fan: springEasing({ stiffness: 320, damping: 20 }),
  // Elevación en hover (resorte por defecto de Motion para x/y).
  lift: springEasing({ stiffness: 500, damping: 25 }),
  // Escalado de aparición (resorte crítico por defecto de Motion).
  pop: springEasing({ stiffness: 550, damping: 30 }),
}

/** Declaraciones CSS (`--spring-*` y `--spring-*-dur`) para :root. */
export function springCssVars() {
  return Object.entries(SPRINGS)
    .map(([name, s]) => `--spring-${name}:${s.easing};--spring-${name}-dur:${s.duration}ms`)
    .join(';')
}
