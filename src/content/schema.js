/* ------------------------------------------------------------------ */
/*  ADMIN SCHEMA                                                        */
/*  Declarative description of every editable section. Drives the       */
/*  generic form builder, validation and the dashboard cards. Pure data */
/*  (no JSX) so it can be imported anywhere. Field types understood by   */
/*  the editor: text, textarea, number, image, icon, select, boolean,   */
/*  string-list, list. A few sections use a custom editor (`custom`).    */
/* ------------------------------------------------------------------ */

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const SPAN_OPTIONS = [
  { value: '', label: 'Normal' },
  { value: 'sm:col-span-2 sm:row-span-2', label: 'Grande (2×2)' },
  { value: 'sm:col-span-2', label: 'Ancho (2×1)' },
  { value: 'sm:row-span-2', label: 'Alto (1×2)' },
]

export const SECTIONS = [
  /* ---------- Marca / contacto ---------- */
  {
    key: 'brand',
    label: 'Datos de contacto',
    icon: 'FaAddressCard',
    description: 'Teléfono, WhatsApp, correo, dirección y enlaces.',
    shape: 'object',
    fields: [
      { name: 'phone', label: 'Teléfono (visible)', type: 'text', required: true },
      { name: 'phoneHref', label: 'Teléfono (enlace tel:)', type: 'text', required: true, help: 'Ej: tel:3059742079' },
      { name: 'whatsappNumber', label: 'WhatsApp (visible)', type: 'text', required: true },
      { name: 'whatsappHref', label: 'WhatsApp (enlace wa.me)', type: 'text', required: true, help: 'Ej: https://wa.me/17862345399' },
      { name: 'whatsappText', label: 'Mensaje pre-escrito de WhatsApp', type: 'textarea' },
      { name: 'email', label: 'Correo electrónico', type: 'text', required: true },
      { name: 'address', label: 'Dirección', type: 'text', required: true },
      { name: 'city', label: 'Ciudad / Estado / Código', type: 'text', required: true },
      { name: 'mapsEmbed', label: 'Enlace del mapa (Google Maps embed)', type: 'textarea' },
      { name: 'recessUrl', label: 'Enlace de membresías (Recess)', type: 'textarea', help: 'El checkout que se muestra en la página de Membresías.' },
      { name: 'recessBookingUrl', label: 'Enlace de reserva de clases (Recess)', type: 'textarea', help: 'El calendario de reservas que se muestra en la página de Horario.' },
      { name: 'instagram', label: 'Instagram (enlace del perfil)', type: 'text', help: 'Ej: https://instagram.com/battle_readyfit' },
      { name: 'facebook', label: 'Facebook (enlace de la página)', type: 'text', help: 'Ej: https://facebook.com/battlereadyfit' },
    ],
  },

  /* ---------- Hero / portada ---------- */
  {
    key: 'hero',
    label: 'Portada (Hero)',
    icon: 'FaImage',
    description: 'Título principal, texto e imagen de fondo de la portada.',
    shape: 'object',
    fields: [
      { name: 'image', label: 'Imagen de fondo', type: 'image', required: true },
      { name: 'badge', label: 'Etiqueta superior', type: 'text' },
      { name: 'titleLine1', label: 'Título — línea 1', type: 'text', required: true },
      { name: 'titleLine2', label: 'Título — línea 2', type: 'text' },
      { name: 'accent', label: 'Título — línea destacada (amarilla)', type: 'text' },
      { name: 'paragraph', label: 'Párrafo de introducción', type: 'textarea', required: true },
      { name: 'ratingText', label: 'Texto de valoración', type: 'text' },
    ],
  },

  /* ---------- Navegación ---------- */
  {
    key: 'nav',
    label: 'Menú de navegación',
    icon: 'FaBars',
    description: 'Los enlaces del menú superior.',
    shape: 'list',
    itemLabel: (it) => it.label || 'Enlace',
    newItem: () => ({ label: '', to: '', hash: '' }),
    item: [
      { name: 'label', label: 'Texto del enlace', type: 'text', required: true },
      { name: 'to', label: 'Ruta (página)', type: 'text', help: 'Ej: /schedule  · Déjalo vacío si usas Ancla.' },
      { name: 'hash', label: 'Ancla (sección del inicio)', type: 'text', help: 'Ej: #programs · Déjalo vacío si usas Ruta.' },
    ],
  },

  /* ---------- Marquesina ---------- */
  {
    key: 'marquee',
    label: 'Cinta de palabras',
    icon: 'FaFont',
    description: 'Las palabras que se desplazan en la cinta amarilla.',
    shape: 'string-list',
    itemLabel: 'Palabra',
  },

  /* ---------- Estadísticas ---------- */
  {
    key: 'stats',
    label: 'Estadísticas',
    icon: 'FaChartSimple',
    description: 'Los números destacados (programas, días, valoración…).',
    shape: 'list',
    itemLabel: (it) => it.label || 'Estadística',
    newItem: () => ({ value: 0, suffix: '', label: '' }),
    item: [
      { name: 'value', label: 'Número', type: 'number', required: true },
      { name: 'suffix', label: 'Sufijo', type: 'text', help: 'Ej: ★ , días , -day' },
      { name: 'label', label: 'Etiqueta', type: 'text', required: true },
    ],
  },

  /* ---------- Programas ---------- */
  {
    key: 'programs',
    label: 'Programas',
    icon: 'FaDumbbell',
    description: 'Las tarjetas de clases/programas que se ofrecen.',
    shape: 'list',
    itemLabel: (it) => it.name || 'Programa',
    newItem: () => ({ icon: 'FaDumbbell', name: '', tag: '', desc: '', img: '/images/hero.webp' }),
    item: [
      { name: 'img', label: 'Imagen', type: 'image', required: true },
      { name: 'icon', label: 'Icono', type: 'icon', required: true },
      { name: 'name', label: 'Nombre del programa', type: 'text', required: true },
      { name: 'tag', label: 'Etiqueta', type: 'text', help: 'Ej: Combat, Cardio, Signature' },
      { name: 'desc', label: 'Descripción', type: 'textarea', required: true },
    ],
  },

  /* ---------- Por qué nosotros ---------- */
  {
    key: 'why',
    label: '¿Por qué nosotros?',
    icon: 'FaStar',
    description: 'Imagen y los puntos fuertes del gimnasio.',
    shape: 'object',
    fields: [
      { name: 'image', label: 'Imagen', type: 'image', required: true },
      {
        name: 'items',
        label: 'Puntos fuertes',
        type: 'list',
        itemLabel: (it) => it.title || 'Punto',
        newItem: () => ({ icon: 'FaFire', title: '', desc: '' }),
        item: [
          { name: 'icon', label: 'Icono', type: 'icon', required: true },
          { name: 'title', label: 'Título', type: 'text', required: true },
          { name: 'desc', label: 'Descripción', type: 'textarea', required: true },
        ],
      },
    ],
  },

  /* ---------- Entrenadores ---------- */
  {
    key: 'coaches',
    label: 'Entrenadores',
    icon: 'FaUserNinja',
    description: 'La pantalla “elige tu entrenador”: fotos, apodos y estadísticas de combate.',
    shape: 'object',
    fields: [
      { name: 'kicker', label: 'Texto pequeño superior', type: 'text' },
      { name: 'titleLine1', label: 'Título', type: 'text', required: true },
      { name: 'accent', label: 'Título — parte destacada (amarilla)', type: 'text' },
      { name: 'paragraph', label: 'Párrafo', type: 'textarea' },
      {
        name: 'items',
        label: 'Entrenadores',
        type: 'list',
        itemLabel: (it) => it.name || 'Entrenador',
        newItem: () => ({
          image: '/images/coach.webp',
          name: '',
          alias: '',
          role: '',
          quote: '',
          instagram: '',
          strength: 80,
          cardio: 80,
          technique: 80,
          discipline: 80,
          energy: 80,
        }),
        item: [
          { name: 'image', label: 'Foto', type: 'image', required: true },
          { name: 'name', label: 'Nombre', type: 'text', required: true },
          { name: 'alias', label: 'Apodo de guerra', type: 'text', help: 'Ej: The Sergeant, The Machine' },
          { name: 'role', label: 'Especialidad / cargo', type: 'text', required: true, help: 'Ej: Head Coach · Bootcamp' },
          { name: 'quote', label: 'Frase de batalla', type: 'textarea' },
          { name: 'instagram', label: 'Instagram (enlace del perfil)', type: 'text' },
          { name: 'strength', label: 'Fuerza (0-100)', type: 'number', required: true },
          { name: 'cardio', label: 'Cardio (0-100)', type: 'number', required: true },
          { name: 'technique', label: 'Técnica (0-100)', type: 'number', required: true },
          { name: 'discipline', label: 'Disciplina (0-100)', type: 'number', required: true },
          { name: 'energy', label: 'Energía (0-100)', type: 'number', required: true },
        ],
      },
    ],
  },

  /* ---------- Galería ---------- */
  {
    key: 'gallery',
    label: 'Galería de fotos',
    icon: 'FaImages',
    description: 'El mosaico de imágenes de las instalaciones.',
    shape: 'list',
    itemLabel: (it) => it.label || 'Foto',
    newItem: () => ({ src: '/images/hero.webp', label: '', span: '' }),
    item: [
      { name: 'src', label: 'Imagen', type: 'image', required: true },
      { name: 'label', label: 'Título', type: 'text', required: true },
      { name: 'span', label: 'Tamaño en el mosaico', type: 'select', options: SPAN_OPTIONS },
    ],
  },

  /* ---------- Videos ---------- */
  {
    key: 'videos',
    label: 'Videos',
    icon: 'FaVideo',
    description: 'Videos de YouTube, Instagram, TikTok o Facebook en el inicio.',
    shape: 'object',
    fields: [
      { name: 'kicker', label: 'Texto pequeño superior', type: 'text' },
      { name: 'titleLine1', label: 'Título', type: 'text', required: true },
      { name: 'accent', label: 'Título — parte destacada (amarilla)', type: 'text' },
      { name: 'paragraph', label: 'Párrafo', type: 'textarea' },
      {
        name: 'items',
        label: 'Videos',
        type: 'list',
        itemLabel: (it) => it.label || it.url || 'Video',
        newItem: () => ({ url: '', label: '', thumb: '' }),
        item: [
          {
            name: 'url',
            label: 'Enlace del video',
            type: 'text',
            required: true,
            help: 'Pega el enlace tal como lo copias de YouTube, Instagram, TikTok o Facebook.',
          },
          { name: 'label', label: 'Título del video', type: 'text' },
          {
            name: 'thumb',
            label: 'Miniatura (imagen de portada)',
            type: 'image',
            help: 'Para Instagram, TikTok y Facebook sube una captura del video. YouTube la obtiene solo.',
          },
        ],
      },
    ],
  },

  /* ---------- Testimonios ---------- */
  {
    key: 'testimonial',
    label: 'Testimonios',
    icon: 'FaQuoteLeft',
    description: 'Las reseñas de clientes. Rotan automáticamente en el inicio.',
    shape: 'object',
    fields: [
      { name: 'image', label: 'Imagen de fondo', type: 'image' },
      {
        name: 'items',
        label: 'Reseñas',
        type: 'list',
        itemLabel: (it) => it.author || 'Reseña',
        newItem: () => ({ quote: '', highlight: '', author: '', role: 'Verified via Google' }),
        item: [
          { name: 'quote', label: 'Reseña', type: 'textarea', required: true },
          { name: 'highlight', label: 'Frase destacada (amarilla)', type: 'text' },
          { name: 'author', label: 'Nombre del cliente', type: 'text', required: true },
          { name: 'role', label: 'Detalle / fuente', type: 'text' },
        ],
      },
    ],
  },

  /* ---------- Banda CTA ---------- */
  {
    key: 'cta',
    label: 'Llamado a la acción',
    icon: 'FaBullhorn',
    description: 'La franja amarilla del “3-Day Free Pass”.',
    shape: 'object',
    fields: [
      { name: 'image', label: 'Imagen de fondo', type: 'image' },
      { name: 'kicker', label: 'Texto pequeño superior', type: 'text' },
      { name: 'titleLine1', label: 'Título — línea 1', type: 'text', required: true },
      { name: 'titleLine2', label: 'Título — línea 2', type: 'text' },
      { name: 'paragraph', label: 'Párrafo', type: 'textarea', required: true },
    ],
  },

  /* ---------- Horario de apertura ---------- */
  {
    key: 'hours',
    label: 'Horario de apertura',
    icon: 'FaClock',
    description: 'Los horarios en que abre el gimnasio.',
    shape: 'list',
    itemLabel: (it) => it.day || 'Día',
    newItem: () => ({ day: '', time: '' }),
    item: [
      { name: 'day', label: 'Día(s)', type: 'text', required: true, help: 'Ej: Mon – Fri' },
      { name: 'time', label: 'Horario', type: 'text', required: true, help: 'Ej: 5:00 AM – 9:00 PM' },
    ],
  },

  /* ---------- Horario de clases (editor a medida) ---------- */
  {
    key: 'schedule',
    label: 'Horario de clases',
    icon: 'FaCalendarDays',
    description:
      'La tabla semanal de clases por día y hora. Se sincroniza cada día desde el calendario de Recess — crea o mueve clases allá y aquí se reflejan solas.',
    shape: 'custom',
    custom: 'schedule',
    dayOptions: DAY_OPTIONS,
  },

  /* ---------- Planes / Membresías ---------- */
  {
    key: 'plans',
    label: 'Planes de membresía',
    icon: 'FaTags',
    description:
      'Las tarjetas de planes sobre el checkout de membresías. Nombre, precio, periodo, descripción y los beneficios de Recess (p. ej. «3 Guest Passes») se sincronizan cada día desde Recess — edítalos allá. Aquí puedes añadir beneficios extra, destacar un plan y cambiar el texto del botón.',
    shape: 'list',
    itemLabel: (it) => it.name || 'Plan',
    newItem: () => ({ name: '', price: '', period: '', desc: '', perks: [], featured: false, cta: '' }),
    item: [
      { name: 'name', label: 'Nombre del plan', type: 'text', required: true },
      { name: 'price', label: 'Precio', type: 'text', required: true, help: 'Ej: Free, $, $$' },
      { name: 'period', label: 'Periodo', type: 'text', help: 'Ej: per month' },
      { name: 'desc', label: 'Descripción', type: 'textarea', required: true },
      { name: 'perks', label: 'Beneficios', type: 'string-list', itemLabel: 'Beneficio' },
      { name: 'featured', label: 'Destacar este plan', type: 'boolean' },
      { name: 'cta', label: 'Texto del botón', type: 'text', required: true },
    ],
  },
]

/** Quick lookup by key. */
export const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s]))

/** Validate a section's value against its schema. Returns an array of
    human-readable error strings (empty = valid). */
export function validateSection(section, value) {
  const errors = []
  const checkFields = (fields, obj, prefix = '') => {
    for (const f of fields) {
      const v = obj?.[f.name]
      if (f.required) {
        const empty =
          v === undefined ||
          v === null ||
          (typeof v === 'string' && v.trim() === '') ||
          (f.type === 'number' && (v === '' || Number.isNaN(Number(v))))
        if (empty) errors.push(`${prefix}"${f.label}" es obligatorio.`)
      }
      if (f.type === 'list' && Array.isArray(v)) {
        v.forEach((it, i) => checkFields(f.item, it, `${prefix}${f.label} #${i + 1}: `))
      }
    }
  }

  if (section.shape === 'object') {
    checkFields(section.fields, value)
  } else if (section.shape === 'list') {
    if (!Array.isArray(value) || value.length === 0) {
      errors.push('Agrega al menos un elemento.')
    } else if (section.item) {
      value.forEach((it, i) => checkFields(section.item, it, `Elemento #${i + 1}: `))
    }
  }
  return errors
}
