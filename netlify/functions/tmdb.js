// ─── TMDB Proxy — Netlify Function ─────────────────────────
// Netlify serverless function that forwards requests to TMDB.
// Free, no sleep, no phone number required.
// ───────────────────────────────────────────────────────────

export default async (request, context) => {
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    })
  }

  const KEY = Netlify.env.get('TMDB_API_KEY')
  if (!KEY) {
    return Response.json(
      { error: 'TMDB_API_KEY not set in Netlify environment variables' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }

  const url    = new URL(request.url)
  const path   = url.searchParams.get('path')
  if (!path) {
    return Response.json(
      { error: 'Missing ?path= parameter' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }

  // Remove 'path' from params, forward the rest to TMDB
  url.searchParams.delete('path')
  const qs      = new URLSearchParams({ api_key: KEY })
  url.searchParams.forEach((val, key) => qs.set(key, val))

  const tmdbUrl = `https://api.themoviedb.org/3${path}?${qs.toString()}`

  try {
    const tmdbRes = await fetch(tmdbUrl)
    const data    = await tmdbRes.json()
    return Response.json(data, {
      status: tmdbRes.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=600',
      }
    })
  } catch (err) {
    return Response.json(
      { error: 'Failed to reach TMDB', details: err.message },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }
}

export const config = {
  path: '/api/tmdb'
}
