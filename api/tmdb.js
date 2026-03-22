// ─── TMDB Proxy — Vercel API Route ─────────────────────────
// Deployed on Vercel, called from anywhere.
// Forwards requests to TMDB so ISP blocks are bypassed.
// Your TMDB key stays secret on the server — never exposed.
// ───────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Allow requests from any origin (your app, localhost, anywhere)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end()

  const TMDB_KEY = process.env.TMDB_API_KEY
  if (!TMDB_KEY) {
    return res.status(500).json({ error: 'TMDB_API_KEY environment variable not set on Vercel' })
  }

  const { path, ...params } = req.query
  if (!path) {
    return res.status(400).json({ error: 'Missing ?path= parameter. Example: /api/tmdb?path=/search/multi&query=batman' })
  }

  const qs     = new URLSearchParams({ api_key: TMDB_KEY, ...params }).toString()
  const url    = `https://api.themoviedb.org/3${path}?${qs}`

  try {
    const tmdbRes = await fetch(url)
    const data    = await tmdbRes.json()
    // Cache responses for 10 minutes to save API calls
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    res.status(tmdbRes.status).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach TMDB', details: err.message })
  }
}
