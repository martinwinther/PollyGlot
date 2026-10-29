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

All eight are built. Goals 1–7 come from the third mockup in the design file,
which replaces the two-screen flow with a chat interface; 8 is independent of
it.

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
   bottom; the selected one carries a navy border. The radio list and both
   field labels are gone, as the mockup shows. The Start Over button went too,
   then came back as a restart icon at the right of the same row.
8. ~~**Stream the translation in**~~ — **done.** The server sends
   `stream: true` and relays each chunk as a line of newline-delimited JSON;
   the browser reads the body with a stream reader and grows one bubble as the
   chunks land. How much of this you actually see depends on the model: a slow
   one types itself out, a fast one can deliver the whole translation inside a
   single frame.

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
- A restart icon sits at the right of the flag row, which the chat mockup does
  not have. Goal 7 removed the Start Over button, leaving no way to clear the
  conversation short of reloading, so the control was added back in the
  lightest form that fits the row. It is disabled until there is something to
  clear, and it keeps the chosen language, which is a preference rather than
  part of the conversation.
- The message field is a textarea styled to look like the mockup's single-line
  input, so multi-line text still works where a plain input would have lost it.
- `/api/translate` answers with newline-delimited JSON rather than one JSON
  object, since it streams. A failure before the stream opens is still a status
  code and a JSON body; once chunks are flowing, an error travels as an
  `{"error"}` line instead, because the status has already been sent.
