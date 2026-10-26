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

## Stretch goals

Not built yet. Goals 1–7 come from the third mockup in the design file, which
replaces the two-screen flow with a chat interface; 8 is independent of it.

1. **Conversation layout** — one scrolling column of message bubbles instead of
   the form/result split.
2. **Opening instruction bubble** (blue) explaining how to use it.
3. **User message bubble** (green) holding the original text.
4. **Translation bubble** (dark navy) holding the reply.
5. **Persistent history** — exchanges stack up instead of one at a time. This is
   the bulk of the work: `translation` becomes a `messages` array, with keys and
   auto-scroll to the newest.
6. **Inline send field** with the send arrow inside the input, replacing the
   full-width Translate button.
7. **Flag-only language buttons** along the bottom, replacing the labelled radio
   list and the Start Over button.
8. **Stream the translation in** as it is generated, rather than waiting for the
   whole completion. Needs `stream: true` on the request, the chunks relayed to
   the browser (server-sent events or a streaming response body), and the text
   appended to the translation box as it arrives. Worth doing after the chat
   bubbles exist, since that is where the streaming text would land.

## Known deviations from the design

- The "PollyGlot" wordmark is text styled in Poppins, not the logo graphic from
  the design — only `parrot.png` was available in the assets.
- The textarea has a drag-to-resize handle; the mockup's does not.
- The font is Poppins by assumption; the Figma file may specify another.
- The result boxes grow with their content rather than staying a fixed height,
  so a long translation cannot overflow.
