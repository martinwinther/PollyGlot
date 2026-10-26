# PollyGlot

Perfect Translation Every Time — a React + Vite front end with an Express back end
that calls an AI provider to translate text into French, Spanish or Japanese.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the three values
```

| Variable   | What it is                                            |
| ---------- | ----------------------------------------------------- |
| `AI_URL`   | Base URL of your AI provider (e.g. an OpenAI-compatible `/v1` endpoint) |
| `AI_MODEL` | Model name to use for the completion                  |
| `AI_KEY`   | Your API key                                          |

## Running

```bash
npm start
```

This runs both processes with `concurrently`:

- Vite dev server on <http://localhost:5173> (the UI)
- Express API on <http://localhost:3001>

Vite proxies `/api/*` through to Express, so the browser only ever talks to one origin.

## How it works

- `server.js` — holds the system prompt and the `POST /api/translate` route. The
  completion is sent with `temperature: 0.3` (accuracy over creativity) and
  `max_tokens: 1000`.
- `utils.js` — fails fast at startup if an env var is missing.
- `src/App.jsx` — owns the state and the fetch call, and swaps between the two views.
- `src/components/` — `Header`, `TranslationForm` (text + language + Translate) and
  `TranslationResult` (original + translation + Start Over).
