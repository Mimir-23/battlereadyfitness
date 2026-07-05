/* ------------------------------------------------------------------ */
/*  Video embed resolver                                               */
/*  Turns a pasted share link (YouTube, Instagram, TikTok, Facebook)    */
/*  into a safe iframe src. Only https links to known platforms are     */
/*  accepted — anything else returns null and simply isn't rendered.    */
/* ------------------------------------------------------------------ */

const YT = (id) => ({
  platform: 'YouTube',
  src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`,
  vertical: false,
})

export function resolveVideoEmbed(url) {
  let u
  try {
    u = new URL(String(url).trim())
  } catch {
    return null
  }
  if (u.protocol !== 'https:') return null
  const host = u.hostname.replace(/^(www|m)\./, '')
  const seg = u.pathname.split('/').filter(Boolean)

  /* YouTube: watch?v=ID · youtu.be/ID · /shorts/ID · /embed/ID */
  if (host === 'youtu.be' && seg[0]) return YT(seg[0])
  if (host === 'youtube.com' || host === 'music.youtube.com') {
    if (seg[0] === 'shorts' && seg[1]) return { ...YT(seg[1]), vertical: true }
    if (seg[0] === 'embed' && seg[1]) return YT(seg[1])
    if (seg[0] === 'live' && seg[1]) return YT(seg[1])
    const id = u.searchParams.get('v')
    if (id) return YT(id)
  }

  /* Instagram: /reel/CODE · /p/CODE · /tv/CODE */
  if (host === 'instagram.com') {
    const kind = ['reel', 'p', 'tv'].includes(seg[0]) ? seg[0] : null
    if (kind && seg[1]) {
      return {
        platform: 'Instagram',
        src: `https://www.instagram.com/${kind}/${encodeURIComponent(seg[1])}/embed/`,
        vertical: true,
      }
    }
  }

  /* TikTok: /@usuario/video/ID */
  if (host === 'tiktok.com') {
    const vi = seg.indexOf('video')
    if (vi !== -1 && seg[vi + 1]) {
      return {
        platform: 'TikTok',
        src: `https://www.tiktok.com/embed/v2/${encodeURIComponent(seg[vi + 1])}`,
        vertical: true,
      }
    }
  }

  /* Facebook: cualquier enlace de video/watch/reel vía el plugin oficial */
  if (host === 'facebook.com' || host === 'fb.watch') {
    return {
      platform: 'Facebook',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u.href)}&show_text=false`,
      vertical: false,
    }
  }

  return null
}
