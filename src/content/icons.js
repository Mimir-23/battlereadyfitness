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
  FaStar,
  FaTrophy,
  FaStopwatch,
  FaWeightHanging,
} from 'react-icons/fa6'

/* ------------------------------------------------------------------ */
/*  Icon registry                                                      */
/*  Content stores icons as plain strings (e.g. "FaDumbbell") so they  */
/*  can live in the database / JSON. Components resolve them here, and  */
/*  the admin shows this list in a visual picker.                      */
/* ------------------------------------------------------------------ */

export const ICONS = {
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
  FaStar,
  FaTrophy,
  FaStopwatch,
  FaWeightHanging,
}

/** Friendly Spanish labels for the icon picker. */
export const ICON_LABELS = {
  FaDumbbell: 'Mancuerna',
  FaPersonRunning: 'Corredor',
  FaStairs: 'Escalones',
  FaHandFist: 'Puño',
  FaHeartPulse: 'Pulso',
  FaMusic: 'Música',
  FaBoltLightning: 'Rayo',
  FaFire: 'Fuego',
  FaUsers: 'Comunidad',
  FaCheck: 'Check',
  FaStar: 'Estrella',
  FaTrophy: 'Trofeo',
  FaStopwatch: 'Cronómetro',
  FaWeightHanging: 'Peso',
}

export const ICON_NAMES = Object.keys(ICONS)

/** Resolve an icon name to its component, with a safe fallback. */
export function getIcon(name) {
  return ICONS[name] || FaDumbbell
}
