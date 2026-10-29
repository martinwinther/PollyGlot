# SubText

**Subtitles for anything you say.** Type a line, pick a language, and it comes
back translated, in a conversation you can scroll.

React + Vite on the front, Express on the back, with an OpenAI-compatible
provider doing the translating into French, Spanish or Japanese.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the three values
```

| Variable   | What it is                                                             |
| ---------- | ---------------------------------------------------------------------- |
| `AI_URL`   | Base URL of your AI provider (e.g. an OpenAI-compatible `/v1` endpoint) |
| `AI_MODEL` | Model name to use for the completion                                   |
| `AI_KEY`   | Your API key                                                           |

`API_PORT` is optional and defaults to `3001`. The API deliberately does not
read `PORT`, because tooling tends to set that for the front end and the two
servers must not land on the same port.

## Running

```bash
npm start
```

`concurrently` runs both halves:

- Vite dev server on <http://localhost:5173> — the UI
- Express API on <http://localhost:3001>

Vite proxies `/api/*` through to Express, so the browser only ever talks to one
origin and the API key never leaves the server.

## How it works

- `server.js` — the system prompt and `POST /api/translate`. The completion is
  requested with `temperature: 0.3` (accuracy over invention), `max_tokens: 1000`
  and `stream: true`.
- `utils.js` — fails fast at startup if an env var is missing.
- `src/App.jsx` — owns all the state and the fetch. It appends your line
  immediately, streams the translation into a single cue as the chunks land,
  and on failure removes both and hands your text back to the field so a retry
  is one keystroke.
- `src/components/Header.jsx` — wordmark, mark and tagline.
- `src/components/Conversation.jsx` — the scrolling cue list, pinned to the
  newest cue.
- `src/components/Composer.jsx` — the growing text field, send button, language
  tracks and start-over control.
- `src/constants.js` — the three languages and the opening line.

### The API answers in newline-delimited JSON

`POST /api/translate` takes `{ text, language }` and responds
`application/x-ndjson`: one `{"delta": "…"}` per chunk as the model writes.

A failure *before* the stream opens is an ordinary status code with a JSON
body. Once chunks are flowing the status has already been sent, so a failure
travels down the open stream as an `{"error": "…"}` line instead. A model that
answers with nothing at all gets the same treatment rather than leaving an
empty cue behind.

## Design system

The app is a dark room with a lit screen in it. Everything below lives as
custom properties in `src/index.css`.

**Colour.** Exactly one saturated colour: projector amber `#f0b429`. It marks
action and result — the send button, the selected language, the label on a
translation, the frame around it — and nothing else, because if everything
glows, nothing reads. Surfaces run `--ink #0a0b0d` (the room) through
`--surface #13151a` (the card) to `--surface-raised #1b1f27` (controls), with
borders as near-invisible white hairlines. Text is warm white `#f2efe8`, the
colour of light through film, never LED white.

**Type.** Bebas Neue, condensed caps, for the wordmark and the small metadata
labels — poster type, the `DIRECTED BY` of film listings. Inter for everything
else, with Hiragino Sans and Noto Sans JP behind it so Japanese does not fall
back to a mismatched system face. Scale: 10px labels at `0.17em` tracking,
13px intro, 14px your line, 15px the translation, 31px wordmark.

**Space and shape.** A 4px spacing scale. Radii: 14px for fields and cues,
20px for the card, full round for chips and buttons. Each cue drops the corner
on its own side to 4px, the way a speech bubble points at its speaker.

**Depth.** The card carries a deep shadow plus a faint amber backlight, so it
reads as the lit thing in the room. Film grain sits fixed over the whole page
at 4.5% opacity, and the beam falls from above as a radial gradient.

**Motion.** One curve, `cubic-bezier(.2, .8, .2, 1)`. Cues fade up 8px over
220ms; the send button presses to 0.94; the start-over icon rotates on hover;
three amber dots pulse while the translation is on its way. All of it is
dropped under `prefers-reduced-motion`.

**Contrast**, measured in the browser against the surface behind each: the
translation 15.2:1, your own line 6.5:1, amber labels 9.8:1, the tagline,
placeholder and unselected chips 5.2:1 and up. Every control takes the same
amber `:focus-visible` ring.

### Components

- **Cue** — one line of the track. Your line sits right, quiet, on a raised
  grey. The translation sits left on a sunken plate, amber-framed, a point
  larger and a weight heavier, with the soft shadow burned-in subtitles always
  have, under a wide-tracked label naming the language. The opening line is a
  title card instead: centred, unboxed, under a small amber cue mark.
- **Track chip** — flag plus code (`FR` `ES` `JA`), like a subtitle track in a
  player. Unselected chips hold their flag at 45% so the chosen one carries the
  only full-colour flag on the screen.
- **Composer** — the field lights amber on focus; the send button is the one
  solid amber element, sized and shaped like a play button.

## Keyboard

- `Enter` sends, `Shift` + `Enter` makes a new line.
- The start-over control clears the conversation but keeps the chosen
  language, which is a preference rather than part of the conversation.
