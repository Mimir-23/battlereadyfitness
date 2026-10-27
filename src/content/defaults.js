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
    whatsappText: 'Hi! I want to claim my 2-Day Free Pass 💪',
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
      name: '2-Day Free Pass',
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
    'These terms and policies apply to every program, class and service of Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp, and to the use of this website. They include our Release and Waiver of Liability, our class policies and how we handle your information and cookies.',
  consentText:
    'We use cookies to run this site and, with your permission, to measure visits and improve it. By continuing you accept our',
  sections: [
    {
      title: 'Release and Waiver of Liability',
      body: 'I desire to engage voluntarily in any, and all, of Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp programs in order to improve my physical fitness. I understand and am aware that the program may consist of strenuous physical activity including, but not limited to, plyometrics, isometrics, interval training, aerobic dance, weight training, stationary bicycling, suspension training, boxing, kickboxing, strenuous cardiovascular activity, running, exercise machines, Pilates, yoga, and various aerobic conditioning machinery offered by Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp. I fully understand that injury may occur as a result of my participation, and hereby release Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp from any liability in the future including, but not limited to; heart attacks, muscle strains, pulls or tears, broken bones, shin splints, heat strokes, knee/foot/lower back injuries, rhabdomyolysis and other illness, soreness, or death; accidental or otherwise, during or arising in any way, from my participation in the program.\n\nI affirm that I am in good physical condition and do not suffer from any disability that could prevent or limit my participation in the program. In addition, I understand that I am responsible for monitoring my own condition throughout the exercise program; should any unusual symptoms occur, I will cease my participation and inform my fitness professional. If modifications are needed, I will be responsible for seeking specialized instruction. In the event that a medical clearance must be obtained prior to my participation in the program, I agree to consult my physician and obtain written permission from my physician to participate in this exercise program.',
    },
    {
      title: 'Limitation of Liability & Full Release',
      body: 'Client, his or her heirs, assigns and next of kin, agree to fully release Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp, its owners, employees, any related entities or other authorized agents, including independent contractors from any and all liability, claims and/or litigation or other actions that client may have for injuries, disability or death or other damages of any kind, including but not limited to, direct, special, incidental, indirect, punitive or consequential damages, whether arising in tort, contract, breach of warranty or arising out of participation in the Services, including, but not limited to the physical activities, even if caused by the negligence of fault of Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp, its owners, employees, any related entities or other authorized agents, including independent contractors.',
    },
    {
      title: 'Health Questionnaire Not Medical Advice',
      body: 'Client acknowledges that Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp does not diagnose health problems, does not provide medical advice nor a substitute for medical attention and Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp has advised client to discuss the appropriateness of the services with the client’s doctor. Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp health questionnaire and par-q (given to client) is nothing more than guidance for deciding client’s goals. The fact that Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp agrees to provide services to client based on the questionnaire and clients representations is not a medical judgement that client is medically, physically or mentally able to receive the services. The services should not replace any dietary restrictions or medical recommendations from client’s doctor. If client has a history of heart disease, he/she should consult a physician before joining the program.',
    },
    {
      title: 'Media Policy',
      body: 'Classes are regularly recorded by employees as well as members for use in social media. Due to the wide use of video cell phones and video recording devices, it’s impossible for Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp to guarantee the Client will not be recorded at some point by staff or members. This release also allows the studio, Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp, to use my likeness for various reasons including for use in marketing/advertising, and Internet website as well as social media forums such as, but not limited to: Facebook, Twitter, Instagram, Tumblr. This release and assumption of risk run to my successors, assigns, heirs, administrators, executors, and any and all members of my family.',
    },
    {
      title: 'No Show/Late Cancellation Policy',
      body: 'Cancelling a Class. You must cancel a reserved class at least 4 hours prior to the start of the class. This is so members on a waitlist can get ample notification of available spots. If you cancel within the four hour window, you will be marked as a “Late Cancel”. If you Fail to inform us entirely, you will be marked as a “No Show”. Class Package members, trial memberships and limited memberships will have a class deducted per occurrence.',
    },
    {
      title: 'Acceptance',
      body: 'By booking a class, purchasing a membership or package, or participating in any of our programs, you confirm that you have read and agree to this Release and Waiver of Liability and to these policies.',
    },
    {
      title: 'Memberships & Payments',
      body: 'Memberships, class packages and class bookings are sold and processed through our member portal, Recess. The price, billing period and terms of each plan are shown at checkout before you pay, and Recess handles your payment details: we never see or store card numbers.',
    },
    {
      title: 'Privacy Policy',
      body: 'Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp collects only the information needed to serve you:\n\n- Contact details you share with us, for example by WhatsApp, phone or email.\n- Your membership, bookings and payments, managed through Recess under its own privacy policy.\n- The health questionnaire (PAR-Q) you complete, used only to plan your training.\n- If you choose "Accept all" in the cookie notice, statistics about how this website is used (Google Analytics).\n\nThis website has no accounts or forms and does not collect your name or contact details. We use your information to manage your membership and bookings, answer your questions and, if you agree, send you news and promotions. We do not sell your personal information. It is shared only with the providers that run our services (Recess for bookings and payments, Google for website statistics, Vercel for hosting), and when the law requires it. You can ask us at any time to access, correct or delete your information.',
    },
    {
      title: 'Cookie Policy',
      body: 'Cookies and similar browser storage are small pieces of information a website keeps on your device. This is what this site uses:\n\n- Essential (always on): your cookie choice ("br-consent") and your accessibility options ("br-a11y"). They stay in your browser and are never sent to us.\n- Statistics (only with "Accept all"): Google Analytics cookies ("_ga" and "_ga_*") count visits and show which pages are used, so we can improve the site. They last up to 2 years.\n- Third-party content: the Recess booking and checkout on the Schedule and Memberships pages, videos from YouTube (in privacy-enhanced mode), Instagram, TikTok or Facebook, and Google Maps (only after you tap it) may set their own cookies under their own policies.\n\nTo change your choice at any time, use "Cookie Settings" at the bottom of every page; choosing "Essential only" also deletes the statistics cookies. You can also block or delete cookies in your browser settings.',
    },
    {
      title: 'Changes to These Terms',
      body: 'We may update these terms and policies from time to time. The latest version is always published on this page with its update date.',
    },
    {
      title: 'Contact',
      body: 'Questions about these terms or your information? Contact Evision Fitness LLC, DBA Battle Ready Fitness Bootcamp at contact@battlereadyfitness.com or visit us at 18600 NW 87th Avenue, Suite 116, Hialeah, Florida 33015.',
    },
  ],
}

/* ---------- Declaración de accesibilidad (página /accessibility) ----------
   Mismo formato que los términos: una línea en blanco separa párrafos y las
   líneas que empiezan con "- " forman una lista. */
DEFAULT_CONTENT.accessibility = {
  kicker: 'Accessibility · Battle Ready Fitness',
  title: 'ACCESS FOR',
  accent: 'EVERY WARRIOR',
  updated: 'October 2026',
  intro:
    'Everyone deserves a place on the battleground. We want this website to work for you whether you use a screen reader, navigate with a keyboard, see colors differently, or are Deaf or hard of hearing.',
  sections: [
    {
      title: 'Our Commitment',
      body: 'We design and test this site against the Web Content Accessibility Guidelines (WCAG) 2.2, level AA. Accessibility is ongoing work: we check new content and features as we add them, and we fix the problems you tell us about.',
    },
    {
      title: 'Accessibility Options',
      body: 'Open the accessibility button (the person icon at the bottom left of every page) to adjust the site. Your choices are saved on your device and apply to every page.\n\n- Screen reader: the site reads itself aloud with your device\'s voice. It speaks whatever you reach with the Tab key or tap, and "Read page" reads everything from where you are, highlighting each part. Press Ctrl to silence it.\n- Text size: up to 150%, without breaking the layout.\n- High contrast: brighter text and stronger borders. It also turns on by itself if your device asks for more contrast.\n- Underline links: find links without relying on color.\n- Readable font: plain letters and normal spacing instead of the condensed display type.\n- Stop animations: no motion, sliding carousels, parallax or moving video previews. It also turns on by itself if your device is set to reduce motion.\n- Video captions: subtitles on whenever the video has them.\n- Color vision: correction filters for protanopia, deuteranopia and tritanopia, and a grayscale mode.',
    },
    {
      title: 'Blind & Low-Vision Visitors',
      body: 'The site works with screen readers such as VoiceOver, NVDA, JAWS and TalkBack, and entirely with a keyboard. No screen reader on this device? Turn on "Screen reader" in the accessibility options and the site reads itself aloud.\n\n- "Skip to content" is the first link on every page, and "Accessibility options" the second.\n- Pages are organized with landmarks and headings, and the menu tells you which page you are on.\n- Every button and link has a clear name, and meaningful images have text descriptions.\n- The class schedule is a real table: you hear the day and time of each class.\n- Changes on the page (filters, carousels, the class you picked) are announced.\n- Photo and video viewers keep focus inside while open, close with Escape and move with the arrow keys.\n- The focus outline is always visible and never hidden behind the top menu.',
    },
    {
      title: 'Color-Blind Visitors',
      body: 'Information on this site never depends on color alone: links, selected days, plans and states also change in text, shape or position. Text meets WCAG contrast ratios on our dark background, and the color vision filters in the accessibility options can make the yellow and red accents easier to tell apart.',
    },
    {
      title: 'Deaf & Hard-of-Hearing Visitors',
      body: 'Nothing on the website relies on sound, and every way to reach us works in writing.\n\n- Turn on "Video captions" to show subtitles in our YouTube videos whenever they are available.\n- Videos can include a written transcript, shown under the player. If one is missing, ask us for it.\n- Message us on WhatsApp or by email to ask questions, book or get help — no phone call needed.\n- Planning your first class? Write to us beforehand and tell us what works best for you.',
    },
    {
      title: 'Third-Party Content',
      body: 'Class booking and checkout are provided by our member portal, Recess, and some videos are hosted on YouTube, Instagram, TikTok or Facebook. We choose accessible options where we can, but we do not control those services. If any of them gets in your way, message us and we will book you or answer your question directly.',
    },
    {
      title: 'Feedback & Contact',
      body: 'Found a barrier, or need information in another format? Tell us what page you were on and what happened, and we will get back to you as soon as possible. Reach us on WhatsApp, at contact@battlereadyfitness.com, or visit us at 18600 NW 87th Avenue, Suite 116, Hialeah, Florida 33015.',
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
