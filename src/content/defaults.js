/* ------------------------------------------------------------------ */
/*  DEFAULT SITE CONTENT                                                */
/*  The single source of truth for everything editable on the site.    */
/*  The public site renders these values unless an admin has saved      */
/*  overrides in Supabase (merged in by ContentProvider). Icons are     */
/*  stored as strings and resolved through content/icons.js.            */
/* ------------------------------------------------------------------ */

export const DEFAULT_CONTENT = {
  /* ---------- Marca / contacto ---------- */
  brand: {
    phone: '305-974-2079',
    phoneHref: 'tel:3059742079',
    whatsappNumber: '786-234-5399',
    whatsappHref: 'https://wa.me/17862345399',
    whatsappText: 'Hi! I want to claim my 3-Day Free Pass 💪',
    email: 'contact@battlereadyfitness.com',
    address: '18600 NW 87th Avenue, Suite 116',
    city: 'Hialeah, Florida 33015',
    mapsEmbed:
      'https://www.google.com/maps?q=18600+NW+87th+Avenue+Suite+116+Hialeah+FL+33015&output=embed',
    recessUrl:
      'https://battle-ready.recess.tv/embed/checkout/explore/packages?hideMenu=true',
    recessBookingUrl:
      'https://battle-ready.recess.tv/embed/checkout/explore?displayClassIrl=list&hideMenu=true&class_type=IRL&displayDays=3',
    instagram: 'https://instagram.com/battle_readyfit',
    facebook: 'https://facebook.com/battlereadyfit',
  },

  /* ---------- Navegación ---------- */
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Programs', hash: '#programs' },
    { label: 'Coaches', hash: '#coaches' },
    { label: 'Gallery', hash: '#gallery' },
    { label: 'Schedule', to: '/schedule' },
    { label: 'Memberships', to: '/memberships' },
    { label: 'Contact', hash: '#contact' },
  ],

  /* ---------- Hero (portada) ---------- */
  hero: {
    badge: 'Hialeah, Florida · Boot-Camp Gym',
    titleLine1: "WE'RE NOT JUST",
    titleLine2: 'THE BEST.',
    accent: "WE'RE SIMPLY UNIQUE.",
    paragraph:
      'A high-intensity boot-camp gym where coaches push you, the community lifts you, and results are guaranteed. No excuses. Just the work.',
    ratingText: 'Rated 5★ by warriors on Google',
    image: '/images/hero.webp',
  },

  /* ---------- Marquesina ---------- */
  marquee: [
    'BOOTCAMP',
    'HIIT',
    'KICKBOXING',
    'STEP CIRCUIT',
    'FULL BODY',
    'ZUMBA',
    'PERSONAL TRAINING',
  ],

  /* ---------- Estadísticas ---------- */
  stats: [
    { value: 7, suffix: '', label: 'Battle Programs' },
    { value: 6, suffix: ' days', label: 'Training Weekly' },
    { value: 3, suffix: '-day', label: 'Free Pass' },
    { value: 5, suffix: '★', label: 'Google Rated' },
  ],

  /* ---------- Programas ---------- */
  programs: [
    {
      icon: 'FaDumbbell',
      name: 'Personal Training',
      desc: 'Unlock your full potential with personalized one-on-one training sessions.',
      tag: '1-on-1',
      img: '/images/g1.webp',
    },
    {
      icon: 'FaPersonRunning',
      name: 'Bootcamp',
      desc: 'The quickest way to get fit. High-energy circuits that push every limit.',
      tag: 'Signature',
      img: '/images/bootcamp.webp',
    },
    {
      icon: 'FaStairs',
      name: 'Step Circuit',
      desc: 'Explosive step intervals that torch calories fast. Get started now.',
      tag: 'Cardio',
      img: '/images/g4.webp',
    },
    {
      icon: 'FaHandFist',
      name: 'Kickboxing',
      desc: 'Strike, sweat and build real combat conditioning. Get started now.',
      tag: 'Combat',
      img: '/images/kickboxing.webp',
    },
    {
      icon: 'FaHeartPulse',
      name: 'Full Body',
      desc: 'Total-body strength and endurance in one brutal session. Get started now.',
      tag: 'Strength',
      img: '/images/g2.webp',
    },
    {
      icon: 'FaMusic',
      name: 'Zumba',
      desc: 'Dance your way fit with high-energy rhythm workouts. Get started now.',
      tag: 'Dance',
      img: '/images/coach.webp',
    },
    {
      icon: 'FaBoltLightning',
      name: 'HIIT by Javi',
      desc: 'Maximum intensity intervals for maximum results. Get started now.',
      tag: 'Intense',
      img: '/images/hero.webp',
    },
  ],

  /* ---------- Por qué nosotros ---------- */
  why: {
    image: '/images/coach.webp',
    items: [
      {
        icon: 'FaFire',
        title: 'Relentless Intensity',
        desc: 'Every session pushes you past comfort into results — no filler, no wasted reps.',
      },
      {
        icon: 'FaUsers',
        title: 'Coaches Who Care',
        desc: 'Motivating trainers who know your name and drive you forward, rep after rep.',
      },
      {
        icon: 'FaHeartPulse',
        title: 'Spotless Facility',
        desc: 'A super clean, fully-equipped boot-camp gym built for performance and recovery.',
      },
      {
        icon: 'FaCheck',
        title: 'Results Guaranteed',
        desc: 'Show up, do the work, transform. Our community is proof the system delivers.',
      },
    ],
  },

  /* ---------- Entrenadores (pantalla "elige tu luchador") ---------- */
  coaches: {
    kicker: 'Your Corner Crew',
    titleLine1: 'CHOOSE YOUR',
    accent: 'FIGHTER',
    paragraph:
      'Every warrior needs a corner. Meet the coaches who will push you past every limit — pick yours.',
    items: [
      {
        image: '/images/coach.webp',
        name: 'Evelyn',
        alias: 'The Sergeant',
        role: 'Head Coach · Bootcamp',
        quote: 'You always have one more rep in you. I can see it.',
        instagram: '',
        strength: 88,
        cardio: 92,
        technique: 90,
        discipline: 100,
        energy: 96,
      },
      {
        image: '/images/bootcamp.webp',
        name: 'Javi',
        alias: 'The Machine',
        role: 'HIIT Specialist',
        quote: 'Intensity is a choice. Choose it every single day.',
        instagram: '',
        strength: 95,
        cardio: 98,
        technique: 85,
        discipline: 92,
        energy: 100,
      },
      {
        image: '/images/kickboxing.webp',
        name: 'Alex',
        alias: 'The Striker',
        role: 'Kickboxing Coach',
        quote: 'Technique first. Power follows.',
        instagram: '',
        strength: 90,
        cardio: 88,
        technique: 100,
        discipline: 90,
        energy: 94,
      },
    ],
  },

  /* ---------- Galería ---------- */
  gallery: [
    { src: '/images/g3.webp', label: 'The Floor', span: 'sm:col-span-2 sm:row-span-2' },
    { src: '/images/kickboxing.webp', label: 'Combat', span: '' },
    { src: '/images/g2.webp', label: 'Strength', span: '' },
    { src: '/images/bootcamp.webp', label: 'Bootcamp', span: '' },
    { src: '/images/g4.webp', label: 'Power', span: '' },
  ],

  /* ---------- Videos ---------- */
  videos: {
    kicker: 'On Camera',
    titleLine1: 'WATCH THE',
    accent: 'BATTLE',
    paragraph:
      'Real sessions, real sweat. See what training at Battle Ready looks like before you walk in.',
    /* Pega enlaces de YouTube, Instagram, TikTok o Facebook desde el panel.
       Mientras la lista esté vacía, la sección no se muestra en el sitio. */
    items: [],
  },

  /* ---------- Testimonios ---------- */
  testimonial: {
    image: '/images/g1.webp',
    items: [
      {
        quote:
          'Professional, motivating, super clean boot-camp gym! Evelyn will kick your behind to get the workout in.',
        highlight: 'Results guaranteed!',
        author: 'Ana Machado',
        role: 'Verified via Google',
      },
      {
        quote:
          'Best decision I made this year. The coaches push you past your limits and the community keeps you coming back every single day.',
        highlight: "We're simply unique!",
        author: 'Carlos R.',
        role: 'Verified via Google',
      },
      {
        quote:
          'Every class is different so you never plateau. High energy, spotless facility and trainers who actually know your name.',
        highlight: 'Best gym in Hialeah!',
        author: 'Melissa T.',
        role: 'Verified via Google',
      },
    ],
  },

  /* ---------- Banda CTA ---------- */
  cta: {
    kicker: 'Are You Ready?',
    titleLine1: 'CLAIM YOUR 3-DAY',
    titleLine2: 'FREE PASS',
    paragraph:
      "No excuses. No waiting. Step into the boot camp that guarantees results and find out why we're simply unique.",
    image: '/images/cta.webp',
  },

  /* ---------- Horario de apertura ---------- */
  hours: [
    { day: 'Mon – Fri', time: '5:00 AM – 9:00 PM' },
    { day: 'Saturday', time: '8:00 AM – 2:00 PM' },
    { day: 'Sunday', time: 'Rest & Recover' },
  ],

  /* ---------- Horario de clases ---------- */
  schedule: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rows: [
      {
        time: '5:30 AM',
        classes: { Mon: 'Bootcamp', Tue: 'HIIT by Javi', Wed: 'Bootcamp', Thu: 'HIIT by Javi', Fri: 'Bootcamp', Sat: '', Sun: '' },
      },
      {
        time: '6:30 AM',
        classes: { Mon: 'Step Circuit', Tue: 'Full Body', Wed: 'Kickboxing', Thu: 'Full Body', Fri: 'Step Circuit', Sat: '', Sun: '' },
      },
      {
        time: '9:00 AM',
        classes: { Mon: 'Full Body', Tue: 'Bootcamp', Wed: 'Full Body', Thu: 'Bootcamp', Fri: 'Full Body', Sat: 'Bootcamp', Sun: '' },
      },
      {
        time: '10:30 AM',
        classes: { Mon: '', Tue: '', Wed: '', Thu: '', Fri: '', Sat: 'Kickboxing', Sun: '' },
      },
      {
        time: '6:00 PM',
        classes: { Mon: 'Kickboxing', Tue: 'Zumba', Wed: 'HIIT by Javi', Thu: 'Zumba', Fri: 'Kickboxing', Sat: '', Sun: '' },
      },
      {
        time: '7:00 PM',
        classes: { Mon: 'HIIT by Javi', Tue: 'Step Circuit', Wed: 'Zumba', Thu: 'Step Circuit', Fri: 'HIIT by Javi', Sat: '', Sun: '' },
      },
    ],
  },

  /* ---------- Planes / Membresías ---------- */
  plans: [
    {
      name: '3-Day Free Pass',
      price: 'Free',
      period: 'no card needed',
      desc: 'Walk in, train hard, feel the difference. Your first three days are on us.',
      perks: ['Full class access', 'Meet the coaches', 'Zero commitment'],
      featured: false,
      cta: 'Claim Free Pass',
    },
    {
      name: 'Unlimited Warrior',
      price: '$',
      period: 'per month',
      desc: 'All-access pass to every bootcamp, HIIT, kickboxing & circuit on the board.',
      perks: ['Unlimited classes', 'All 7 battle programs', 'Priority booking', 'Community events'],
      featured: true,
      cta: 'Join Now',
    },
    {
      name: 'Personal Training',
      price: '$$',
      period: 'per session',
      desc: '1-on-1 coaching engineered around your goals, schedule and limits.',
      perks: ['Custom programming', 'Nutrition guidance', 'Flexible scheduling'],
      featured: false,
      cta: 'Book a Coach',
    },
  ],
}

/* ---------- Términos, condiciones y políticas (página /terms) ----------
   Cada sección tiene título y texto. En el texto, una línea en blanco
   separa párrafos y las líneas que empiezan con "- " forman una lista. */
DEFAULT_CONTENT.legal = {
  kicker: 'Legal · Battle Ready Fitness',
  title: 'TERMS &',
  accent: 'CONDITIONS',
  updated: 'October 2026',
  intro:
    'These terms and policies explain how memberships, classes and our facility work, and how we handle your information. By visiting this site, booking a class or training with us, you agree to them.',
  consentText:
    'We use cookies to run this site and, with your permission, to measure visits and improve it. By continuing you accept our',
  sections: [
    {
      title: 'Acceptance of Terms',
      body: 'By accessing battlereadyfitness.com, claiming a free pass, booking a class or purchasing a membership, you agree to these Terms & Conditions and to our Privacy Policy. If you do not agree, please do not use our services.',
    },
    {
      title: 'Memberships & Payments',
      body: 'Memberships, packages and class bookings are sold and processed through our member portal, Recess. Prices, billing periods, commitments and renewal terms are shown at checkout for each plan.\n\n- Recurring memberships renew automatically until cancelled.\n- Cancellations and freezes follow the terms of the plan you purchased.\n- Payments already processed are non-refundable unless the plan terms or applicable law state otherwise.',
    },
    {
      title: 'Free Pass',
      body: 'The 3-Day Free Pass is available to new members only, one per person. It gives access to regular group classes during three days and has no cash value. We may ask for a valid ID before your first session.',
    },
    {
      title: 'Class Bookings & Attendance',
      body: 'Class spots are limited and reserved through Recess. Please arrive on time; late arrivals may not be admitted for safety reasons. If you cannot attend, cancel your booking as early as possible so another member can take your spot. Schedules may change on holidays or for special events.',
    },
    {
      title: 'Health, Safety & Assumption of Risk',
      body: 'Physical exercise involves inherent risks. Consult your physician before starting any fitness program, especially if you have a medical condition, injury or are pregnant. You agree to inform your coach of any condition that may affect your training and to follow their instructions.\n\nYou participate voluntarily and assume the risks of training. Battle Ready Fitness is not liable for injuries, except where caused by our gross negligence as defined by law.',
    },
    {
      title: 'Code of Conduct',
      body: 'We are a community. Treat coaches and members with respect, use equipment properly and return it after use, and keep the facility clean.\n\n- Appropriate athletic clothing and closed training shoes are required.\n- Aggressive, discriminatory or unsafe behavior may result in suspension of your membership.\n- We are not responsible for lost or stolen personal belongings.',
    },
    {
      title: 'Photos & Media',
      body: 'We occasionally take photos and videos during classes for our website and social media. If you prefer not to appear, just tell a coach or write to us and we will respect it.',
    },
    {
      title: 'Privacy Policy',
      body: 'We only collect the information needed to serve you:\n\n- Contact details you share with us (for example by WhatsApp, phone or email).\n- Booking and payment information, processed securely by Recess under its own privacy policy. We never store card numbers.\n- Anonymous usage statistics of this website (Google Analytics / Firebase) to improve it.\n\nWe do not sell your personal information. We use it to manage your membership, answer your questions and, with your consent, share news and promotions. You can ask us at any time to access, correct or delete your information.',
    },
    {
      title: 'Cookies',
      body: 'This website uses essential cookies and analytics cookies that help us understand how visitors use it. Embedded services such as Recess, Google Maps, YouTube or Instagram may set their own cookies when you use them. You can block or delete cookies in your browser settings.',
    },
    {
      title: 'Changes to These Terms',
      body: 'We may update these terms and policies from time to time. The latest version is always published on this page with its update date.',
    },
    {
      title: 'Contact',
      body: 'Questions about these terms or your information? Reach us at contact@battlereadyfitness.com or visit us at 18600 NW 87th Avenue, Suite 116, Hialeah, Florida 33015.',
    },
  ],
}

/** URL-friendly anchor for a heading ("Privacy Policy" → "privacy-policy"). */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Helper: build the full WhatsApp URL from brand fields. */
export function whatsappUrl(brand) {
  const base = brand?.whatsappHref || 'https://wa.me/17862345399'
  const text = brand?.whatsappText || ''
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
