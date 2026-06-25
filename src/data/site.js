/* ------------------------------------------------------------------ */
/*  Battle Ready Fitness — Single source of truth for site content     */
/*  Centralised so pages/sections/footer stay in sync.                 */
/* ------------------------------------------------------------------ */

import {
  FaDumbbell,
  FaPersonRunning,
  FaStairs,
  FaHandFist,
  FaHeartPulse,
  FaMusic,
  FaBoltLightning,
  FaFire,
  FaUsers,
  FaCheck,
} from 'react-icons/fa6'

/* ---------- Contact / brand ---------- */

export const PHONE = '305-974-2079'
export const PHONE_HREF = 'tel:3059742079'
export const WHATSAPP_NUMBER = '786-234-5399'
export const EMAIL = 'contact@battlereadyfitness.com'
export const ADDRESS = '18600 NW 87th Avenue, Suite 116'
export const CITY = 'Hialeah, Florida 33015'
export const MAPS_EMBED =
  'https://www.google.com/maps?q=18600+NW+87th+Avenue+Suite+116+Hialeah+FL+33015&output=embed'

export const WHATSAPP =
  'https://wa.me/17862345399?text=' +
  encodeURIComponent('¡Hola! Quiero reclamar mi 3-Day Free Pass 💪')

/* Recess scheduling / checkout platform embeds */
export const RECESS_MEMBERSHIPS =
  'https://battle-ready.recess.tv/embed/checkout/explore/packages?hideMenu=true'

export const SOCIALS_NUM = WHATSAPP_NUMBER

/* ---------- Navigation ----------
   `hash` links live on the home page; `to` links are dedicated routes. */

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Programs', hash: '#programs' },
  { label: 'Gallery', hash: '#gallery' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'Memberships', to: '/memberships' },
  { label: 'Contact', hash: '#contact' },
]

/* ---------- Programs ---------- */

export const PROGRAMS = [
  {
    icon: FaDumbbell,
    name: 'Personal Training',
    desc: 'Libera tu máximo potencial con sesiones de entrenamiento personalizadas.',
    tag: '1-on-1',
    img: '/images/g1.jpg',
  },
  {
    icon: FaPersonRunning,
    name: 'Bootcamp',
    desc: 'The quickest way to get fit. High-energy circuits that push every limit.',
    tag: 'Signature',
    img: '/images/bootcamp.jpg',
  },
  {
    icon: FaStairs,
    name: 'Step Circuit',
    desc: 'Explosive step intervals that torch calories fast. Get started now.',
    tag: 'Cardio',
    img: '/images/g4.jpg',
  },
  {
    icon: FaHandFist,
    name: 'Kickboxing',
    desc: 'Strike, sweat and build real combat conditioning. Get started now.',
    tag: 'Combat',
    img: '/images/kickboxing.jpg',
  },
  {
    icon: FaHeartPulse,
    name: 'Full Body',
    desc: 'Total-body strength and endurance in one brutal session. Get started now.',
    tag: 'Strength',
    img: '/images/g2.jpg',
  },
  {
    icon: FaMusic,
    name: 'Zumba',
    desc: 'Dance your way fit with high-energy rhythm workouts. Get started now.',
    tag: 'Dance',
    img: '/images/coach.jpg',
  },
  {
    icon: FaBoltLightning,
    name: 'HIIT by Javi',
    desc: 'Maximum intensity intervals for maximum results. Get started now.',
    tag: 'Intense',
    img: '/images/hero.jpg',
  },
]

/* ---------- Stats ---------- */

export const STATS = [
  { value: 7, suffix: '', label: 'Battle Programs' },
  { value: 6, suffix: ' days', label: 'Training Weekly' },
  { value: 3, suffix: '-day', label: 'Free Pass' },
  { value: 5, suffix: '★', label: 'Google Rated' },
]

/* ---------- Why us ---------- */

export const WHY = [
  {
    icon: FaFire,
    title: 'Relentless Intensity',
    desc: 'Every session pushes you past comfort into results — no filler, no wasted reps.',
  },
  {
    icon: FaUsers,
    title: 'Coaches Who Care',
    desc: 'Motivating trainers who know your name and drive you forward, rep after rep.',
  },
  {
    icon: FaHeartPulse,
    title: 'Spotless Facility',
    desc: 'A super clean, fully-equipped boot-camp gym built for performance and recovery.',
  },
  {
    icon: FaCheck,
    title: 'Results Guaranteed',
    desc: 'Show up, do the work, transform. Our community is proof the system delivers.',
  },
]

/* ---------- Gallery ---------- */

export const GALLERY = [
  { src: '/images/g3.jpg', label: 'The Floor', span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/kickboxing.jpg', label: 'Combat' },
  { src: '/images/g2.jpg', label: 'Strength' },
  { src: '/images/bootcamp.jpg', label: 'Bootcamp' },
  { src: '/images/g4.jpg', label: 'Power' },
]

/* ---------- Marquee ---------- */

export const MARQUEE = [
  'BOOTCAMP',
  'HIIT',
  'KICKBOXING',
  'STEP CIRCUIT',
  'FULL BODY',
  'ZUMBA',
  'PERSONAL TRAINING',
]

/* ---------- Opening hours ---------- */

export const HOURS = [
  ['Mon – Fri', '5:00 AM – 9:00 PM'],
  ['Saturday', '8:00 AM – 2:00 PM'],
  ['Sunday', 'Rest & Recover'],
]

/* ---------- Weekly class schedule ----------
   Class slots for the /schedule timetable. `prog` matches a PROGRAMS name
   so the page can reuse program icons/colours. */

export const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const SCHEDULE = [
  {
    time: '5:30 AM',
    classes: {
      Mon: 'Bootcamp',
      Tue: 'HIIT by Javi',
      Wed: 'Bootcamp',
      Thu: 'HIIT by Javi',
      Fri: 'Bootcamp',
    },
  },
  {
    time: '6:30 AM',
    classes: {
      Mon: 'Step Circuit',
      Tue: 'Full Body',
      Wed: 'Kickboxing',
      Thu: 'Full Body',
      Fri: 'Step Circuit',
    },
  },
  {
    time: '9:00 AM',
    classes: {
      Mon: 'Full Body',
      Tue: 'Bootcamp',
      Wed: 'Full Body',
      Thu: 'Bootcamp',
      Fri: 'Full Body',
      Sat: 'Bootcamp',
    },
  },
  {
    time: '10:30 AM',
    classes: {
      Sat: 'Kickboxing',
    },
  },
  {
    time: '6:00 PM',
    classes: {
      Mon: 'Kickboxing',
      Tue: 'Zumba',
      Wed: 'HIIT by Javi',
      Thu: 'Zumba',
      Fri: 'Kickboxing',
    },
  },
  {
    time: '7:00 PM',
    classes: {
      Mon: 'HIIT by Javi',
      Tue: 'Step Circuit',
      Wed: 'Zumba',
      Thu: 'Step Circuit',
      Fri: 'HIIT by Javi',
    },
  },
]

/* ---------- Membership tiers (marketing cards above the Recess embed) ---------- */

export const PLANS = [
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
    perks: [
      'Unlimited classes',
      'All 7 battle programs',
      'Priority booking',
      'Community events',
    ],
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
]
