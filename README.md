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

Goals 1–7 come from the third mockup in the design file, which replaces the
two-screen flow with a chat interface; 8 is independent of it.

1. ~~**Conversation layout**~~ — **done.** One scrolling column of message
   bubbles replaces the form/result split. The column caps at 260px and scrolls,
   pinned to the newest bubble. Building it necessarily covered 3 and 4 below,
   since a column of bubbles cannot exist without the bubbles.
2. ~~**Opening instruction bubble**~~ — **done.** Blue, sits above the exchange
   and survives Start Over, as `INTRO_MESSAGE` in `src/constants.js`. Its
   wording says "hit Translate" rather than the mockup's "hit send", because
   there is no send button until goal 6.
3. ~~**User message bubble**~~ — **done.** Green, holding the original text.
4. ~~**Translation bubble**~~ — **done.** Dark navy, holding the reply.
5. ~~**Persistent history**~~ — **done.** Exchanges append and the column
   scrolls through them. The sent text appears immediately as its own bubble;
   if the request fails that bubble is removed again and the text is handed
   back to the field, so a retry is one keystroke.
6. ~~**Inline send field**~~ — **done.** A green send arrow sits inside the
   field, which grows with its content. Enter sends, Shift+Enter makes a new
   line. While waiting, a bubble of animated dots stands in for the old
   "Translating..." button label.
7. ~~**Flag-only language buttons**~~ — **done.** Three flag buttons along the
   bottom; the selected one carries a navy border. The radio list, both field
   labels and the Start Over button are gone, as the mockup shows.
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
- Screen 2 of the main-requirement design (the separate "Original text / Your
  translation" view) no longer exists — stretch goal 1 replaced it by design.
  It is recoverable from commit `6fe2573` if the two-screen flow is ever needed.
- There is no longer any way to clear the conversation: goal 7 removed the
  Start Over button because the chat mockup has no such control. Reloading the
  page is the only reset. Worth revisiting if the history grows awkward.
- The message field is a textarea styled to look like the mockup's single-line
  input, so multi-line text still works where a plain input would have lost it.
