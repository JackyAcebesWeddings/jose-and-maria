# AGENTS.md — Wedding Website Client Repo

> **Operating instructions for AI coding agents working in this repository.**
> This is a one-repo-per-client wedding website (static HTML5). Your job is to
> **build the wedding site** for this client. Read this file fully before acting.
> `README.md` holds this client's specifics (names, date, venue, chosen theme,
> confirmed RSVP fields). When client data and this spec conflict, `README.md` wins.
>
> **Out of scope — do not touch:** the repo, custom domain, `CNAME`, GitHub Pages,
> and the deploy workflow are already provisioned. Do not modify CI/CD, DNS, or
> hosting config. Focus only on the site files (`index.html`, `/assets`, etc.).

**Agent quick rules**
- Do not commit secrets (Apps Script Web App URLs, tokens) to any tracked file.
- No AI attribution anywhere client-visible: never add "Co-Authored-By: Claude", "Generated with Claude", "Created by Anthropic", or similar to commit messages, code comments, README, or any file. Commit messages describe the change plainly, in a human voice, with no tooling credit.
- Confirm RSVP fields against `README.md` before building the form (see §4).
- Ask the client before adding any optional feature marked "(ask the client)".
- Build only the sections the client selected (see §1); update the nav to match.

---

# HTML5 Wedding Website — Build Instructions & Theme Guide

## 1. Base Site Structure

A standard wedding website is a single-page (or lightly multi-page) site built from these sections, in typical order:

```
index.html
├── Hero / Landing        — couple's names, wedding date, countdown
├── Our Story             — how they met, timeline, engagement photo
├── Event Details         — ceremony + reception, date/time, venue map
├── Wedding Party         — bridesmaids, groomsmen, bios/photos
├── Gallery               — photo grid or carousel
├── Travel & Accommodations — hotels, directions, parking
├── RSVP                  — form (name, attending y/n, guest count, meal choice, notes)
├── Registry              — links to gift registries
├── FAQ                   — dress code, plus-ones, kids policy, etc.
└── Footer / Contact      — couple's contact, hashtag, thank-you note
```

> **Before building:** Ask the client/user whether they want the **full site structure** (all sections above) or **only selected sections**. If selected, have them pick which sections to include from the list, since not every couple needs a Wedding Party or Registry section, for example. Build `index.html` with only the chosen `<section>` blocks and update the nav accordingly — the base CSS and theme system work the same either way.

### Recommended file layout
```
/project-root
├── index.html
├── README.md              (couple names, date, venue, RSVP fields, theme choice — source of truth for this client repo)
├── CNAME                  (custom domain for GitHub Pages, if applicable)
├── /assets
│   ├── /css
│   │   ├── base.css        (reset, typography, layout grid — theme-agnostic)
│   │   └── theme.css        (swappable per theme)
│   ├── /js
│   │   └── main.js          (countdown, nav toggle, RSVP form handling)
│   ├── /images
│   └── /fonts
└── /config
    └── site-config.json      (machine-readable mirror of README data, for templating/build scripts)
```

> Since this is a one-repo-per-client setup, `README.md` carries this client's identity and content. `CNAME` and hosting are already provisioned — leave them as-is. No separate multi-client config or theme-preview system is needed.

### Base HTML5 skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jane & John | Our Wedding</title>
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/theme.css">
</head>
<body>
  <header id="hero">...</header>
  <main>
    <section id="our-story">...</section>
    <section id="details">...</section>
    <section id="party">...</section>
    <section id="gallery">...</section>
    <section id="travel">...</section>
    <section id="rsvp">...</section>
    <section id="registry">...</section>
    <section id="faq">...</section>
  </main>
  <footer>...</footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

### Non-negotiable technical requirements
- Semantic HTML5 tags (`header`, `nav`, `main`, `section`, `footer`) for accessibility and SEO.
- Mobile-first responsive CSS (flexbox/grid), tested at 375px, 768px, 1440px.
- RSVP form needs client-side validation + a backend endpoint or form service (Formspree, Getform, or your own API).
- Lazy-load gallery images (`loading="lazy"`).
- Open Graph meta tags so shared links show a nice preview card.
- Keep `theme.css` fully separate from `base.css` — swapping themes should mean swapping one file plus a font import and a few images, nothing else.

---

## 2. Theme Variants

Each theme below defines: palette, typography, imagery, and signature decorative details. Only `theme.css` and hero/section imagery should change between themes.

### 🗞️ Newspaper / Editorial Theme
- **Palette:** Cream (#F5F1E8), black (#1A1A1A), one accent red (#B5333D)
- **Typography:** Serif headlines (Playfair Display, Old Standard TT), monospace or condensed sans for bylines/captions (Special Elias, Courier Prime)
- **Layout motifs:** Multi-column text blocks, "masthead" style header with wedding date as the issue date, section dividers as horizontal rules, photos with newspaper-style captions
- **Decorative elements:** Vintage paper texture background, "Special Edition" banner, drop caps on Our Story section

### 🏖️ Beach / Coastal Theme
- **Palette:** Sandy beige (#EDE0D0), ocean blue (#4A7C8C), white, soft coral accent (#E8A87C)
- **Typography:** Light, airy serif or script for headlines (Cormorant, Alex Brush), clean sans-serif body (Lato)
- **Layout motifs:** Full-bleed wave dividers between sections (SVG wave shapes), rounded card corners
- **Decorative elements:** Subtle shell/starfish icon accents, watercolor wave background in hero, sand-texture footer

### 🌿 Botanical / Rustic Theme
- **Palette:** Sage green (#8A9A5B), terracotta (#C97C5D), cream, walnut brown
- **Typography:** Handwritten script for names (Great Vibes), earthy serif for body (Cormorant Garamond)
- **Layout motifs:** Framed sections with leaf-border SVGs, wood-texture section backgrounds
- **Decorative elements:** Eucalyptus/greenery corner illustrations, twine-and-tag RSVP button styling

### ⚪ Minimalist Modern Theme
- **Palette:** Off-white, charcoal (#2B2B2B), single muted accent (dusty blue or blush)
- **Typography:** Sans-serif throughout (Inter, Neue Montreal), generous letter-spacing on headings
- **Layout motifs:** Lots of white space, thin 1px dividers instead of decorative borders, grid-based gallery
- **Decorative elements:** None — the restraint is the style. Motion/hover micro-interactions carry the polish instead.

### 🕰️ Vintage / Romantic Theme
- **Palette:** Dusty rose (#D8A7B1), ivory, muted gold (#C9A66B)
- **Typography:** Elegant script for names (Alex Brush, Parisienne), classic serif body (Libre Baskerville)
- **Layout motifs:** Lace-pattern SVG borders, oval photo frames, damask background textures
- **Decorative elements:** Gold foil-style dividers, monogram crest combining both initials

### 🌸 Garden / Floral Theme
- **Palette:** Blush pink, soft lavender, sage green, cream base
- **Typography:** Romantic script headlines (Playball, Pinyon Script), soft serif body
- **Layout motifs:** Floral corner illustrations on every section, curved (not straight) section transitions
- **Decorative elements:** Watercolor floral wreaths around the couple's names, pressed-flower texture in footer

### 🏔️ Winter / Elegant Theme
- **Palette:** Navy (#1C2B39), silver/white, deep burgundy accent
- **Typography:** Sharp modern serif (Cormorant SC) paired with clean sans body
- **Layout motifs:** Subtle snowflake or frost-pattern SVG overlays, dark hero with light typography
- **Decorative elements:** Fairy-light bokeh background image option, metallic (silver/gold) button styling

### 🎨 Bohemian Theme
- **Palette:** Terracotta, mustard yellow, deep teal, cream
- **Typography:** Bold display serif for headlines, relaxed sans body
- **Layout motifs:** Asymmetric section layouts, macrame/arch-shaped image frames
- **Decorative elements:** Sun/moon iconography, geometric line-art borders, arch-shaped photo crops (CSS `clip-path`)

---

## 2.5 Visual Design Patterns

Palette and fonts (§2) set the tone; these patterns set the execution. Pick a hero pattern and signature technique per theme, keep everything else quiet around it.

### Hero patterns (highest-impact decision — pick one per client)
- **Full-bleed + scrim** (Beach, Winter, Garden): background photo/video, dark gradient overlay for legibility, centered names. The reliable default.
- **Split-screen asymmetric** (Minimalist, Bohemian): photo on one half, names/date on the other. Editorial, modern.
- **Framed / arch** (Vintage, Garden): image clipped into an arch (`clip-path`) or ornamental SVG frame around the couple's names.
- **Editorial masthead** (Newspaper): the hero *is* a front page — masthead rule, wedding date as the issue date, multi-column tease below.
- **Type-forward** (Minimalist): oversized names, minimal or no imagery; the restraint is the design.

Every text-over-image hero MUST have a scrim (gradient overlay) — script fonts over busy photos fail contrast otherwise.

### Signature techniques (the bespoke details)
- SVG curve/wave dividers between sections (Beach, Garden) — one inline SVG, flipped per section, `fill: var(--color-bg)`.
- `column-count` for real newspaper multi-column body text (Newspaper).
- `clip-path` arches on gallery images (Bohemian, Garden).
- Frosted cards via `backdrop-filter: blur(8px)` over the hero image (Winter, Minimalist).
- Ken Burns slow zoom on the hero image (subtle, gate behind `prefers-reduced-motion`):
```css
@keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.08); } }
.hero__img { animation: kenburns 20s ease-out infinite alternate; }
@media (prefers-reduced-motion: reduce) { .hero__img { animation: none; } }
```

### Layout rhythm (all themes)
- Our Story as alternating left/right image-text blocks.
- Generous vertical whitespace — cramped reads as cheap; breathing room reads as premium.
- Sticky scroll-spy nav highlighting the current section.
- Fluid type with `clamp()` to skip most breakpoints, e.g. `font-size: clamp(2.5rem, 8vw, 6rem)`.
- Scroll-reveal via `IntersectionObserver`, always gated behind `prefers-reduced-motion`.

### Typography execution
One expressive display face for names/headings, one quiet legible face for body — never more than two families. Add `letter-spacing: .15em` to all-caps labels.

### Section design variants
Several sections have more than one workable layout. Pick one per client from `README.md` (see convention below); if unspecified, use the first (default).
- **Timeline:** `vertical` (icon rail, default) · `alternating` (zigzag left/right) · `horizontal` (swipeable numbered cards).
- **Entourage / wedding party:** `two-sides` (Her/His columns, default) · `circles` (unified round-photo grid) · `editorial` (large serif names in ruled rows).
- **RSVP:** `card` (centered, default) · `split` (decorative names panel beside the form) · `minimal` (flat underline fields).

Build only the chosen variant — don't ship a variant switcher to the client (that control exists only in the internal showcase demo).

### `README.md` design keys
Read these from `README.md`; fall back to the defaults above if absent:
```
theme: garden
hero: full-bleed        # full-bleed | split | arch | masthead | type
sections:
  timeline: vertical
  entourage: two-sides
  rsvp: card
effect: petals          # none | petals | snow | confetti  (see §8.5)
```

### Two hard rules for this build
- **Performance:** most guests open these on mobile, so protect LCP. Compressed hero poster image, `loading="lazy"` below the fold, hero weight budget ~400KB. Clients rarely optimize their own photos — enforce it.
- **Legibility:** contrast-check every theme to WCAG AA, especially script fonts and text-over-image.

If themes will be swapped per client (e.g. multi-tenant generator), structure CSS with variables so a theme is just a token set:

```css
/* theme.css - example: Beach theme */
:root {
  --color-bg: #EDE0D0;
  --color-primary: #4A7C8C;
  --color-accent: #E8A87C;
  --color-text: #2B2B2B;
  --font-heading: 'Cormorant', serif;
  --font-body: 'Lato', sans-serif;
  --section-divider: url('../images/wave-divider.svg');
}
```
`base.css` then references only these variables (`background: var(--color-bg)`), never hardcoded values — so a new theme file is a drop-in swap with zero markup changes.

---

## 4. RSVP Data Handling (Google Apps Script)

> **Before building the RSVP form:** check `README.md` for a confirmed list of RSVP fields. Only build inputs for the fields listed there. If `README.md` has no RSVP field list yet, ask the client directly which fields they want recorded, beyond name and attending status — common options: guest count, meal choice, dietary restrictions, song request, plus-one name, message/note. Once confirmed, add the list to `README.md` before building the form.

For a static one-repo-per-client site with no backend, a Google Sheet + Apps Script Web App is the simplest way to capture responses:

1. Create a Google Sheet (e.g. `RSVP Responses`) with two tabs:
   - **`Responses`** — a header row matching the confirmed fields.
   - **`Config`** — cell `A1` labelled `RSVP Deadline`, cell `B1` holding the deadline as a real date/datetime value. This cell is the source of truth for the auto-close guard in Section 8.1, so it must exist in every client sheet even before that feature is wired up.
2. In the Sheet, go to Extensions → Apps Script and paste:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses');
  const data = JSON.parse(e.postData.contents);

  // Adjust this array to match the fields the client confirmed
  const row = [
    new Date(),
    data.name || '',
    data.attending || '',
    data.guestCount || '',
    data.mealChoice || '',
    data.dietaryRestrictions || '',
    data.message || ''
  ];

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy → New deployment → Web app. Set "Execute as: Me" and "Who has access: Anyone," then copy the deployment URL.
4. In `main.js`, POST the form as JSON to that URL:

```javascript
document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  await fetch('YOUR_APPS_SCRIPT_WEB_APP_URL', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  // show a static thank-you message here
});
```

Apps Script Web Apps don't return readable CORS responses to `fetch`, so treat the POST as fire-and-forget — show a static "Thanks, we got your RSVP!" message rather than trying to parse the response.

---

## 5. Content & Asset Checklist

Collect before build starts (can live directly in the client's `README.md`):
- Couple's full names + preferred display names
- Wedding date, ceremony time, reception time, and venue timezone
- Venue name(s) + address(es) for ceremony and reception
- RSVP deadline date
- Confirmed RSVP fields (see section 4)
- Wedding party names, roles, and short bios (if that section is included)
- Hero photo — recommend 1920×1080 or larger, landscape
- Gallery photos — recommend min. 1200px on the long edge, compressed under ~500KB each
- Registry links
- FAQ content (dress code, kids policy, plus-ones, parking)
- Hashtag, if any
- Chosen theme

---

## 6. Pre-Launch Checklist
- Countdown timer uses the venue's timezone, not the visitor's local time (fixed UTC offset or `Intl.DateTimeFormat` with the venue's IANA timezone)
- Favicon added
- Open Graph image + title/description set for link previews
- `robots.txt` and/or a simple password gate if the couple wants the site non-public
- Tested on iOS Safari + Android Chrome at minimum, plus one desktop browser
- Test RSVP submission confirmed to land in the Google Sheet

---

## 7. Suggested Additions Beyond MVP
- Guest login (unique code) to pre-fill RSVP and show personalized meal options
- Multi-language toggle for destination weddings
- Map embed (Google Maps or Mapbox) for venue directions
- Accessibility pass: color contrast check per theme (AA minimum), alt text on all images

### Guest UX & Entrance Animation Options
> Ask the client if they want an entrance animation or any of the below — these are optional flourishes on top of the MVP, not required for launch.

- **Envelope entrance animation:** site loads behind a closed envelope graphic; guest clicks/taps to "open" it, which animates away (flap unfolds, card slides out) before revealing the hero section. Good fit for Vintage/Romantic and Garden themes.
- **Scroll-reveal animations:** sections fade/slide into view on scroll (`IntersectionObserver`-based, respects `prefers-reduced-motion`)
- **Loading screen:** brief monogram or couple's-initials loader before first paint, mainly useful if the envelope animation or hero video needs a moment to load
- **Ambient background music toggle:** optional autoplay-muted track with a visible mute/unmute control (never autoplay with sound — most browsers block it anyway)
- **Falling petals/confetti effect:** a floating ambient-effects widget with theme-matched presets (petals for Garden/Botanical, snow for Winter, confetti for festive) plus tap-to-celebrate bursts — see §8.5 for the full spec
- **Parallax hero:** background image/video moves slower than foreground text on scroll
- **Cursor micro-interactions:** custom cursor or hover states on buttons/links (best suited to Minimalist/Modern theme, skip on themes already visually busy)
- **Digital guest book:** simple form where guests leave a short message, displayed as a scrolling wall or card grid (can reuse the RSVP Apps Script pattern with a separate sheet tab)

Keep animations optional and toggle-able in `site-config.json` or noted in `README.md`, since not every couple wants a busy front page, and every animation added is one more thing to test across the browser/device checklist in Section 6.

---

## 8. Interactive Guest Features

These are functional (not just decorative) features. All work within the static GitHub Pages + Apps Script setup. Build the deadline auto-close by default; **ask the client** before adding any of the others.

### 8.1 RSVP Deadline Auto-Close (build by default)

Past the deadline, the form should disable itself and show a closed state, with a server-side backstop so late/direct POSTs are still rejected. The deadline lives in `README.md` and mirrors into `site-config.json`.

**Client-side (`main.js`)** — read the deadline, gate the form:
```javascript
// RSVP_DEADLINE comes from site-config.json; use the venue's timezone offset
// so the form closes at midnight local to the wedding, not the guest's device.
const RSVP_DEADLINE = new Date('2026-08-15T23:59:59-04:00');

function gateRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const closedMsg = document.getElementById('rsvp-closed');
  if (Date.now() > RSVP_DEADLINE.getTime()) {
    form.hidden = true;          // hide inputs
    closedMsg.hidden = false;    // show "RSVPs are closed" panel
  }
}
document.addEventListener('DOMContentLoaded', gateRsvpForm);
```

**Server-side backstop (`doPost` in Apps Script)** — reject anything arriving after the deadline, since client-side gating alone is bypassable. Read the deadline from a sheet cell rather than hardcoding it, so the couple can change it themselves without editing code (and so it stays independent of any repo rebuild):

```javascript
function getDeadline() {
  // Config tab, cell B1 holds the RSVP deadline as a real date/datetime value.
  // Label A1 as "RSVP Deadline" so the couple knows what it is.
  const cell = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Config')
    .getRange('B1')
    .getValue();
  return cell instanceof Date ? cell : null;
}

function doPost(e) {
  const deadline = getDeadline();
  if (deadline && new Date() > deadline) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'closed' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Responses');
  const data = JSON.parse(e.postData.contents);
  // ...append row as in Section 4...
}
```

The client-side `RSVP_DEADLINE` in `main.js` still comes from `site-config.json` at build time (used only to hide the form for a nicer UX). The **sheet cell is the source of truth** for actually accepting or rejecting submissions. If the couple pushes the date back, they edit the sheet cell — no repo change needed; optionally re-sync `site-config.json` on the next build so the front-end matches. If `Config!B1` is empty, the guard fails open (accepts submissions) rather than locking everyone out.

### 8.2 Confirmation Email to Guest (ask the client)

Ask whether guests should receive a confirmation email after RSVPing. If yes, requires an `email` field in the form, and add to `doPost` before returning success:
```javascript
if (data.email) {
  MailApp.sendEmail({
    to: data.email,
    subject: "We've got your RSVP — Jane & John",
    body: `Thanks ${data.name}! We've recorded your response. See you there.`
  });
}
```
Note the daily `MailApp` quota (100/day on consumer Gmail, 1,500 on Workspace) — fine for a wedding, but worth stating in `README.md`.

### 8.3 Other Apps-Script-Backed Features (ask the client)

- **Duplicate-submission guard** — before appending, scan existing rows for a matching name/email and update that row instead of adding a new one (upsert). Prevents double counts when a guest submits twice.
- **Couple's admin summary** — a read-only second page (or a `doGet` endpoint gated by a code) returning live headcount, meal breakdown, and dietary flags, so the couple isn't reading the raw sheet.
- **Digital guest book** — reuse the RSVP POST pattern against a separate sheet tab; render messages as a card grid.

### 8.4 High-Value Static Features (ask the client, no backend needed)

- **Add-to-Calendar button** — generate an `.ics` file or a Google Calendar deep link so guests save the date in one tap. Low effort, high value.
- **Interactive FAQ accordion** — collapsible items so the FAQ section stays scannable on mobile (`<details>/<summary>` is the zero-JS option).
- **Day-of timeline** — vertical schedule (ceremony → cocktails → dinner → dancing) that highlights the current/next event based on the clock.
- **"Get Directions" deep links** — device-aware buttons that open Google/Apple Maps with the venue pre-loaded, alongside any static map embed.
- **Dress code visual** — color-swatch chips or a small lookbook instead of a text description; kills the most common guest question.
- **PWA basics** — a `manifest.json` + icon so guests can add the site to their home screen. Cheap, feels premium.

For MVP, the two highest-leverage picks are the **Add-to-Calendar button** and the **RSVP confirmation email**, since both cut guest friction and reduce the couple's day-to-day "did it work?" questions.

### 8.5 Ambient Effects Widget (petals / snow / confetti + celebrate)

An optional floating widget that showers themed particles over the page. Include only if `effect:` in `README.md` is not `none`.

- **Presets:** `petals` (soft blush, Garden/Botanical), `snow` (pale, Winter), `confetti` (bright, festive). Match the preset to the theme.
- **Implementation:** one fixed `<canvas>`, `pointer-events:none`, drawn on `requestAnimationFrame`. The loop must run only while the effect is on or burst particles are alive, then stop — no idle CPU. Cap particles (~30 ambient) to protect mobile battery/LCP.
- **Tap-to-celebrate:** a control that fires a gravity-driven burst on tap; rapid taps stack (optional combo count). For production, auto-fire one celebrate burst on RSVP success when the guest accepts — do NOT fire on decline.
- **Accessibility:** honor `prefers-reduced-motion` — start off (or heavily reduced) and keep a visible on/off control. Never trap motion the guest can't stop.

The reference implementation lives in the internal showcase (`wedding-showcase.html`); the canvas + widget + script are self-contained and portable. Keep it behind the on/off control per §7's rule that not every couple wants a busy front page.
