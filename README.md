# TMDB Proxy

A tiny Netlify serverless function that proxies requests to TMDB.
Bypasses ISP blocks by running on Netlify's servers.

## Setup

1. Deploy to Netlify (connect your GitHub repo)
2. Add environment variable: `TMDB_API_KEY` = your TMDB v3 API key
3. Done — your proxy URL is `https://your-site.netlify.app/api/tmdb`

## Usage

Call it exactly like TMDB but through your proxy URL:

```
https://your-site.netlify.app/api/tmdb?path=/search/multi&query=batman
https://your-site.netlify.app/api/tmdb?path=/discover/movie&sort_by=popularity.desc
https://your-site.netlify.app/api/tmdb?path=/genre/movie/list
```

## Environment Variables

| Variable | Description |
|---|---|
| `TMDB_API_KEY` | Your TMDB v3 API key from themoviedb.org |
