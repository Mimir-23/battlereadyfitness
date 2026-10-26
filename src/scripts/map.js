/* Google Maps facade (contact section): the real map — ~4 MB over ~80
   requests — only loads when the visitor asks for it. */
export function initMap() {
  for (const btn of document.querySelectorAll('[data-map-load]')) {
    btn.addEventListener('click', () => {
      const frame = document.createElement('iframe')
      frame.title = 'Battle Ready Fitness location'
      frame.src = btn.dataset.mapLoad
      frame.className = 'absolute inset-0 h-full w-full grayscale transition-all duration-500 group-hover:grayscale-0'
      frame.referrerPolicy = 'no-referrer-when-downgrade'
      btn.replaceWith(frame)
      // Keyboard and screen-reader users continue inside the map they asked
      // for (the button they pressed no longer exists).
      frame.focus({ preventScroll: true })
    })
  }
}
