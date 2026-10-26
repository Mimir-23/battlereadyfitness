/* ------------------------------------------------------------------ */
/*  English voices for the screen reader mode, best-sounding first.     */
/*  Systems ship novelty voices (macOS: Albert, Bubbles, Zarvox… and    */
/*  the robotic Eddy/Flo/Grandpa set) that come first alphabetically;   */
/*  those are left out. Natural/neural/premium voices go to the top.    */
/* ------------------------------------------------------------------ */

const NOVELTY =
  /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|buenas noticias|jester|organ|pipe organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph|deranged|hysterical|princess|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i
const NATURAL = /natural|neural|premium|enhanced|siri/i
const GOOD =
  /^(samantha|ava|allison|susan|zoe|evan|nathan|joelle|noelle|tom|alex|aaron|nicky|serena|kate|oliver|daniel|karen|moira|tessa|rishi|google (us|uk) english|microsoft (aria|jenny|guy|zira|david|mark|libby|ryan|sonia|natasha|william))/i

const score = (v) =>
  (NATURAL.test(v.name) ? 100 : 0) + (GOOD.test(v.name) ? 60 : 0) + (/^en[-_]US/i.test(v.lang) ? 10 : 5) + (v.localService ? 2 : 0)

export function englishVoices() {
  const seen = new Set()
  return speechSynthesis
    .getVoices()
    .filter((v) => /^en([-_]|$)/i.test(v.lang) && !NOVELTY.test(v.name) && !seen.has(v.name) && seen.add(v.name))
    .sort((a, b) => score(b) - score(a))
}

/** "Microsoft Aria Online (Natural) - English (United States)" →
    "Microsoft Aria Online (Natural) · en-US", for the picker. */
export const voiceLabel = (v) =>
  `${v.name.replace(/\s*[-–]\s*English.*$/i, '').replace(/\s*\((inglés|english)[^)]*\)+\s*$/i, '')} · ${v.lang}`
