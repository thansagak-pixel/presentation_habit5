# Habit 5 — Seek First to Understand, Then to Be Understood

A presentation on **Habit 5** of *The 7 Habits of Highly Effective Teens* (Sean Covey),
building on the empathic-communication habit in Stephen R. Covey's *The 7 Habits of
Highly Effective People*.

17 slides, dark theme, no build step, no dependencies, no network. Open it and present.

```
open habit5-deck/index.html          # macOS
xdg-open habit5-deck/index.html      # Linux
```

It works straight off the disk — everything is plain HTML/CSS/JS loaded as classic
scripts, so `file://` is fine.

## Running it locally (optional)

A tiny no-cache server is included for development:

```sh
python3 habit5-deck/tools/serve.py 8137 habit5-deck
# → http://localhost:8137
```

## Controls

| Key | Action |
| --- | --- |
| `→` `↓` `Space` `PageDown` | Next slide |
| `←` `↑` `PageUp` | Previous slide |
| `Home` / `End` | First / last slide |
| `O` | Overview of all slides (live thumbnails) |
| `S` | Speaker notes panel |
| `F` | Fullscreen |
| `?` | Keyboard help |
| `Esc` | Close any overlay |
| `Ctrl`/`Cmd` + `P` | Print / export to PDF (one slide per landscape page) |

Also: click the left edge of the slide to go back, click the right to go forward,
swipe on touch devices.

## The slides

1. **Title** — the habit, the book, the epigraph
2. **The map** — where Habit 5 sits between the private victories (1–3) and the
   public victories (6–7)
3. **Intent to reply vs. intent to understand** — the core shift, side by side
4. **Words / tone / body — 7 / 38 / 55** — what people actually receive
5. **Two ears, one mouth** — the ratio that runs the whole habit
6. **Others' Perception** — the same moment, two different movies (drag the slider)
7. **Five ways we fake listening** — spacing out, pretend, selective, word, self-centred
8. **The five-step practice loop** — pause, reflect, ask, hold, add
9. **Mirroring** — the five phrases that prove you were listening
10. **Autobiographical vs. empathic listening** — and the strawberry argument
11. **Three traps** — understanding ≠ excusing, and empathic listening is risky
12. **Then, to be understood** — ask, listen, adjust
13. **The Listening Lab** — six scenarios, scored, with feedback
14. **The silence challenge** — a 60-second / 3-minute / 5-minute timer
15. **Your commitment** — three written commitments, saved in the browser, printable
16. **Recap**
17. **Sources & keyboard**

## Interactive bits

- **Slide 6** — drag the slider to blend the two points of view.
- **Slide 9** — click a mirroring phrase to see the full sentence.
- **Slide 13** — pick a response; you get instant feedback, a score and a streak.
- **Slide 14** — start the timer and do the minute in silence.
- **Slide 15** — fill in the three fields; the plan is saved to `localStorage` and
  survives a reload. "Print this card" prints just the plan.

## Files

```
habit5-deck/
├── index.html          # shell: stage, chrome, overlays, notes panel
├── css/
│   ├── base.css        # tokens, stage scaling, deck chrome, animation system
│   └── slides.css      # per-slide layout + print stylesheet
├── js/
│   ├── content.js      # ALL the words, quotes, quiz questions, speaker notes
│   ├── slides-def.js   # slide manifest + shared helpers and icons
│   ├── render-1.js     # renderers: title, map, intent, signals, ears, perception
│   ├── render-2.js     # renderers: styles, loop, mirror, auto, trap, understood
│   ├── render-3.js     # renderers: lab, timer, plan, recap, credits
│   └── deck.js         # engine: navigation, overview, notes, quiz, timer, plan
└── tools/serve.py      # optional no-cache dev server
```

### Editing the content

`js/content.js` holds every word in the deck — the quotes, the five poor listening
styles, the mirroring phrases, the lab questions and the speaker notes. Change text
there and it changes everywhere; no slide HTML to hunt down.

To add or reorder a slide, edit the `SLIDES` array in `js/slides-def.js` and add a
renderer named `RENDERERS.<kind>` in one of the `render-*.js` files.

### Design notes

- Fixed **1280×720** logical canvas, scaled to fit any screen, so the layout is
  identical on a laptop, a projector and a phone.
- Palette inherited from the workspace design tokens (`assets/css/tokens.css`):
  ink surfaces, `--accent` orange, `--olive` secondary.
- System fonts only — nothing to download, nothing to fail offline.
- Respects `prefers-reduced-motion`: all animation collapses to instant.

## Accuracy

Quotes are attributed to their authors and the sources are listed on the final slide.
Two things are **original teaching aids built on the book's principles**, and are
labelled as such on the slides themselves:

- the five-step practice loop (slide 8)
- the Listening Lab scenarios and feedback (slide 13)

The 7 / 38 / 55 figures are Mehrabian's research on communicating feelings, as cited
by Covey; slide 4 notes that the exact numbers are debated and that the teaching
point is that words are the smallest slice of the message.

## Known limits

- Phone screens in portrait show a small letterboxed slide — rotate the device, or
  present from a laptop.
- PDF export keeps the dark theme only if "background graphics" is enabled in the
  browser's print dialog.
