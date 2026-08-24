# The House of Riya — full project context

This file exists so any Claude session (local or cloud) can pick this project up
cold with zero prior context. Read this first, before touching code.

## What this project is

A personal, non-commercial gift website: an interactive, cinematic scroll-driven
walk through a dream home imagined by **Riya**. Not a real-estate site, not a
portfolio, not religious, not e-commerce. The emotional arc: *she imagined this
home; now she gets to walk through it; by the end it should feel real, and the
closing line is "Yes. Finally. I'm home."*

The site was originally scaffolded by an AI website builder called **Imagenative**
(a v0.app-style generator — see `generator: 'v0.app'` in `app/layout.tsx`) and
downloaded as this repo. That baseline was already very good — close to
production quality — and the job across sessions has been **refinement and
integration**, not a rebuild. Do not throw away existing structure without a
strong reason.

**Site title: "The House of Riya"** (renamed from the original scaffold's
"Radha's House" per explicit user instruction — see Session 1 log below). If you
ever see "Radha's House" anywhere in code, comments, or copy, that is stale and
should be updated to "The House of Riya".

The devotional/spiritual thread (peacock feather motif, "श्री राधे" — "Shri
Radhe", a Krishna-devotional phrase) is intentionally kept as *subtle personal
spiritual texture*, not a religious site. Keep it minimal and tasteful — one
strong motif, not decoration spam.

## Tech stack

- **Next.js 16.3.0**, App Router, Turbopack, React 19, TypeScript 5.7
- **Tailwind CSS v4** (`@import 'tailwindcss'` + `@theme inline` token mapping in `app/globals.css`, no `tailwind.config`)
- **motion** (the current package name for Framer Motion) for all animation
- **three** / **@react-three/fiber** / **@react-three/drei** (added Session 4) for
  the 3D house tour at `/home` — see below. No HDRI/`<Environment>` or other
  externally-fetched assets are used (this environment blocks egress to
  general hosts) — lighting is all manual `ambientLight`/`directionalLight`/
  `pointLight`, and textures are the same local room photos via `useTexture`.
- **lenis** (`lenis/react`) for smooth scroll, auto-disabled under `prefers-reduced-motion`
- **sharp** for Next.js image optimization (added Session 1 — see below)
- **@vercel/analytics** (loads only in production builds)
- Package manager: **pnpm** (there's a `pnpm-lock.yaml` and `pnpm-workspace.yaml`).
  `npm` also works for running scripts against the already-installed
  `node_modules`, but use `pnpm` (via `corepack pnpm ...`) for install/add/remove
  so the lockfile stays correct. Plain `pnpm` may not be on PATH in a fresh
  shell — use `corepack pnpm <command>` if `pnpm` alone 404s.
- No test suite exists. **ESLint** (flat config, `eslint.config.mjs`, added
  Session 3) via `npm run lint` — `eslint-config-next`, not `next lint` (Next
  16 removed that CLI command).

## Repo layout

```
app/
  layout.tsx        — root layout, Google Fonts (Cormorant Garamond, Inter, Noto Serif Devanagari), metadata
  page.tsx           — the entire single-page experience, composed from components below
  globals.css        — design tokens (colors, fonts) + Tailwind v4 theme wiring
  icon.svg           — favicon (Next App Router auto-detects this filename): the peacock-feather
                        eye motif (added Session 4, replacing the unused v0.app generator logo
                        that was sitting in public/). Regenerate app/apple-icon.png from it via
                        sharp at 180×180 if it ever changes.
  apple-icon.png     — rasterized iOS touch icon (Apple doesn't reliably accept SVG here)
  home/              — `/home`: the 3D scroll-driven house tour (added Session 4).
                        `page.tsx` is a server component (metadata) that renders the
                        `house-tour-client.tsx` boundary, which `next/dynamic`-imports
                        `components/house-tour/tour-experience.tsx` with `ssr: false`
                        (WebGL needs a browser).
components/
  house-tour/        — the `/home` 3D tour, built on lib/house-tour-layout.ts (added Session 4):
                        tour-experience.tsx (scroll spacer + Canvas + text panel + progress
                        rail + prefers-reduced-motion fallback), scene.tsx (lights/fog/floor),
                        camera-rig.tsx (damped scroll-driven camera along a Catmull-Rom path),
                        room-bay.tsx (one room's walls + photo panel + furniture),
                        photo-panel.tsx (aspect-fit framed photo), furniture-mesh.tsx (generic
                        primitive renderer for the declarative furniture data).
  intro-experience.tsx  — first-load overlay: peacock feather → श्री राधे → title → "Come inside"
  hero-house.tsx         — "01 — Arrival" parallax hero (exterior shot)
  story-section.tsx      — philosophy/mission statement block
  house-map.tsx          — clickable architectural floor-plan-style grid nav
  room-section.tsx        — renders one room from lib/rooms.ts (image + copy + optional Riya portrait)
  sanskrit-transition.tsx — "श्री राधे" interstitial (used before the spiritual room)
  her-collage.tsx         — "16 — HER" section introducing Riya near the end
  final-experience.tsx    — closing scene: exterior at golden hour → "Yes. Finally. I'm home." → श्री राधे fade to white
  room-navigation.tsx     — fixed top-right "House index" overlay/menu
  secret-feather.tsx      — fixed bottom-left easter-egg feather → modal
  ambient-sound.tsx        — fixed bottom-right music toggle (added Session 1, see below)
  custom-cursor.tsx        — desktop-only custom cursor (respects hover:hover + prefers-reduced-motion)
  smooth-scroll.tsx        — Lenis wrapper, auto-disables under prefers-reduced-motion
  image-reveal.tsx         — reusable clip-path scroll-reveal image wrapper
  riya-portrait.tsx        — reusable portrait figure component
  peacock-feather.tsx      — the one SVG peacock-feather motif, reused everywhere
  ui/button.tsx             — shadcn-style base button (barely used; most UI is bespoke)
lib/
  rooms.ts              — ⭐ single source of truth for the house tour: `Room[]` array + `roomIndex`.
                          Add/reorder/edit rooms here; app/page.tsx just maps over `rooms`.
  house-tour-layout.ts  — derives the `/home` 3D tour entirely from `rooms` (added Session 4):
                          per-room bay geometry/position, hand-authored furniture primitives
                          keyed by room id, and the camera's Catmull-Rom waypoint path. Editing
                          a room in `rooms.ts` (title/subtitle/image/meta) automatically flows
                          through to the 3D tour's text panel — only furniture/geometry needs
                          separate edits here.
  utils.ts    — `cn()` classname helper
public/
  assets/home/    — 16 room photographs (PNG), see room order below
  assets/riya/    — Riya portrait images used inside room-section.tsx (riya-home, riya-tea, riya-music, riya-reading, riya-main)
  assets/audio/    — vrindavan-prayer.mp3 + CREDITS.md (added Session 1)
  assets/peacock-feather.png — unused-in-code reference asset (the SVG motif is what's actually used)
```

## The room journey (in order, from `lib/rooms.ts`)

01 Entry (hero) → 02 Living (Heart of the House) → 03 Balcony (Place to Breathe)
→ 04 Spiritual (Quiet Corner, preceded by a Sanskrit transition) → 05 Music
Corner → 06 Piano Corner → 07 Library (Book Nook) → 08 Kitchen → 09 Herb Window
→ 10 Dining (The Table) → 11 Master Bedroom (Her Room) → 12 Cozy Corner (A
Little Corner) → 13 Wardrobe → 14 Bathroom (A Quiet Morning) → 15 Terrace (The
Open Sky) → 16 Her (her-collage.tsx) → Final Experience (closing scene).

Each `Room` has: `id`, `number`, `title`, `subtitle`, `image`, `alt`, optional
`portrait`/`portraitAlt` (Riya photo), `layout` (`full | wide | split | meta` —
controls how `room-section.tsx` composes the image/text/portrait), optional
`meta` (`{ light, mood, element }` shown as small metadata labels), optional
`dark` (evening/night scenes get a darker treatment).

`roomIndex` (also in `lib/rooms.ts`) is a flattened `{id, number, label}[]` used
by `room-navigation.tsx` and `house-map.tsx` — it auto-derives short labels from
room titles by stripping leading "The/A/Her". **Known rough edge:** room 11
"Her Room" → label "Room" (a bit terse in the nav/map). Not fixed yet — see
Pending below.

## Design tokens (`app/globals.css`)

```
--background: #ffffff   --foreground: #171717   --muted-foreground: #77716a
--sand: #ede7de   --cream: #f6f2ec   --wood: #8a6a4a   --green: #7f947a
--peacock: #176b74   --border/--line: #e7e2d9 / #ded7cb
```
Fonts: `--font-serif` = Cormorant Garamond (headings), `--font-sans` = Inter
(body/labels), `--font-deva` = Noto Serif Devanagari (Sanskrit text only).
`.label-caps` = the small uppercase tracked-out label style used everywhere for
metadata/numbers. Palette and type scale already match the brief (ivory/cream/
wood/muted-green/peacock-blue, editorial serif + clean sans) — don't introduce
new colors or fonts without a strong reason.

## Session log

### Session 1 (2026-08-22) — git recovery, rename, music, image perf

Starting state: the Imagenative-generated codebase existed on disk but had
**no git repo** (`git init` had been run but nothing was committed), and a
`git push` to `https://github.com/tiffinwaleofficial/my-dream-house.git` was
failing because there was no commit yet.

What was done, in order:

1. **Audited the existing codebase** before changing anything (per instructions
   — never rebuild blind). Found it already matched the brief closely: correct
   palette, correct room order, Sanskrit intro, Riya portraits already wired,
   custom cursor, house map, editorial typography, no forbidden features (no
   nav clutter, no login, no forms, no ecommerce). This was a refinement pass,
   not a rebuild.
2. **Fixed git**: `git add -A`, committed all 58 files, fixed a push hang by
   running `gh auth setup-git` (GitHub CLI was already authenticated as
   `tiffinwaleofficial` but git's credential helper wasn't wired to it — the
   push was silently waiting on a credential prompt with no TTY). Pushed
   successfully to `origin/main`.
3. **Renamed the site**: "Radha's House" → **"The House of Riya"** everywhere
   (explicit user instruction). Changed: `app/layout.tsx` metadata title,
   `components/intro-experience.tsx` (2 occurrences), `components/hero-house.tsx`,
   `components/final-experience.tsx`. Verified with a repo-wide case-insensitive
   grep that no "Radha" references remain.
4. **Removed a visible placeholder caption**: `room-section.tsx` was rendering
   a literal `<figcaption>` reading "Portrait — placeholder" under every Riya
   photo — visible to real site visitors, not just a code comment. Removed the
   `caption` prop from both call sites; the portrait images themselves stay
   (they're real placeholder images already, just no longer *labeled*
   "placeholder" on-screen).
5. **Added the background music system** (this was the one clearly-missing
   piece from the original 44-point brief):
   - Sourced **"Vrindavan Prayer"** by LunarBoomMusic from Pixabay
     (thematically fitting: Vrindavan is Radha & Krishna's town). User was
     shown 3 shortlisted options and picked this one explicitly.
     Licensed under the **Pixabay Content License** — free for this use, no
     attribution required (verified via the license page directly). Disclosed
     as AI-assisted composition by the artist; noted transparently in
     `public/assets/audio/CREDITS.md` (not shown in the UI since attribution
     isn't required).
   - Downloading it required extracting the direct `cdn.pixabay.com/download/...`
     URL from the page's raw HTML via `curl` — the sandboxed browser tool
     available in this environment could not perform a "trusted" click needed
     for the site's download button (no compositor/visible pane in this
     session type), so don't rely on browser-automation clicks for downloads
     here; grep the page source for `cdn.pixabay.com` links instead.
   - File lives at `public/assets/audio/vrindavan-prayer.mp3` (256kbps MP3,
     ~6.3MB, 3:19).
   - New component: **`components/ambient-sound.tsx`**. Behavior: starts muted
     by default only if the visitor previously muted it (persisted in
     `localStorage` under key `house-sound-muted`); otherwise attempts to start
     playback as soon as the intro is dismissed, respecting browser autoplay
     policy (tries immediately, and if blocked, arms a one-time listener on the
     next `pointerdown`/`keydown`/`wheel` to retry — this is the standard
     "requires a real gesture" pattern). Fades volume in/out over 1.8s
     (never hard-cuts). Target volume is deliberately low (`0.14`). UI is a
     small fixed pill, bottom-right, showing an animated 3-bar equalizer glyph
     (bars go static when muted) — intentionally not a "media player", per the
     brief's "avoid a large media player" instruction. Wired into
     `app/page.tsx` alongside `RoomNavigation`/`SecretFeather`, gated on the
     same `entered` state so it only appears after the intro.
6. **Re-enabled Next.js image optimization** (this was the other real gap):
   `next.config.mjs` previously had `images: { unoptimized: true }` **and**
   `typescript: { ignoreBuildErrors: true }`, both very likely leftovers from
   the v0/Imagenative scaffold. Ran `tsc --noEmit` — came back clean — so
   removed both flags entirely. Added `images.formats:
   ['image/avif', 'image/webp']`. Added `sharp` as a dependency (needed for
   Next's built-in optimizer to run locally/self-hosted; Vercel has it built
   into their infra automatically if this ends up deployed there). Verified
   end-to-end: the 2MB+ `exterior.png` now serves through `/_next/image` as a
   56KB AVIF — roughly a 97% size reduction, satisfying the brief's
   "optimized images / WebP/AVIF / responsive sizes" performance requirement
   without needing to hand-convert all 16 source PNGs.
7. **Dependency/build hygiene**: `pnpm install` initially failed with
   `ERR_PNPM_IGNORED_BUILDS` (pnpm's newer supply-chain policy blocks
   postinstall scripts by default) for `sharp` and `msw`. Fixed with
   `corepack pnpm approve-builds --all`, which records the approval in
   **`pnpm-workspace.yaml`** under `allowBuilds` (not in `package.json` — pnpm
   moved that setting). Also moved the pre-existing `pnpm.overrides.hono`
   pin from `package.json` (a location pnpm no longer reads, was silently
   ignored) to `pnpm-workspace.yaml`'s `overrides` key, where it actually
   takes effect.
8. **Verified**: `tsc --noEmit` clean, `next build` succeeds (static export,
   `○ /` and `○ /_not-found`), dev server (`npm run dev`) serves the full page
   with **zero console errors** and **zero broken asset requests** (checked via
   the browser tool's network/console inspection — see Pending below for what
   *wasn't* checked).
9. Added `.claude/launch.json` at the **workspace root**
   (`D:\Personal Projects\My Dream Home\.claude\launch.json`, one level above
   this repo) so `preview_start` can launch the dev server — it shells out to
   `npm run dev --prefix radha-s-house` since the Next.js app lives in this
   subfolder, not the workspace root.
10. Committed and pushed all of the above to `origin/main` in small, described
    commits.

### Session 2 (2026-08-22) — critical image-reveal fix, real visual QA, sound crash fix

This session finally did the human-eye visual QA that Session 1 flagged as
unverified (previous cloud browser tooling couldn't render a compositing
pane). This time, Playwright with the pre-installed Chromium worked, and
screenshotting the site at desktop/tablet/mobile widths surfaced a
**severe, sitewide, previously-invisible bug**:

1. **Every room photo on the entire site was permanently invisible.**
   `components/image-reveal.tsx` reveals each room's photo via Framer Motion's
   `whileInView` animating `clipPath` from `inset(100%...)` to `inset(0%...)`,
   gated by `viewport={{ once: true, amount: 0.3 }}`. Confirmed via direct DOM
   inspection (inline `style` never changed from the `initial` clip, in both
   `next dev` and a real `next build && next start` production server — not a
   dev-only artifact) that **a numeric `viewport.amount` value silently
   prevents `whileInView` from ever firing** in the installed `motion@13.1.1`
   (latest available on npm at the time — not something to "just upgrade
   away"). A hand-rolled `IntersectionObserver` on the very same DOM node
   confirmed real intersection reaching 100% visible, proving this is a
   library/config bug, not a scroll or timing issue. Text elements using the
   same numeric `amount` pattern (room titles, story section, etc.) were
   unaffected — only this specific `absolute inset-0` + `clipPath` structure
   triggered it. **Fix**: swapped `amount: 0.3` for an equivalent
   `margin: '0px 0px -30% 0px'` (same "reveal ~30% into view" intent, avoids
   the broken code path entirely). Verified fixed across all 15 rooms in both
   dev and a production build. This was almost certainly why Session 1's
   "zero console errors" check looked clean — the bug throws nothing, it just
   silently never reveals a single photo, meaning every visitor before this
   fix would have scrolled through an entirely photo-less house.
2. **Ambient sound volume crash.** `components/ambient-sound.tsx`'s `fade()`
   helper threw `IndexSizeError: Failed to set the 'volume' property... is
   outside the range [0, 1]` in the console on load and on toggling — caused
   by overlapping/uncancelled fade `requestAnimationFrame` loops racing on
   `audio.volume`. Fixed by clamping the computed value to `[0, 1]` and adding
   a generation token so a new `fade()` call supersedes any in-flight one
   instead of fighting it. Verified with 6x rapid toggle-clicking — no more
   thrown errors.
3. **`roomIndex` label for room 11** ("Her Room" → auto-derived label "Room",
   flagged as pending in Session 1) — fixed with an explicit `labelOverrides`
   map in `lib/rooms.ts` rather than touching the regex used by every other
   room.
4. **Visual QA actually done this time**, desktop (1440px) / tablet (768px) /
   iPhone 13 mobile, via Playwright screenshots: intro overlay, hero
   (`"The House of Riya"` wraps to two graceful lines on mobile, stays on one
   line at `md:`+ — no overflow anywhere), the house-index menu, and a full
   scroll-through of every room. The bottom-right sound toggle and
   bottom-left secret feather don't visually collide with anything at any
   width. Room order was **not** touched, per instruction.

Room order, palette, copy, and every other file were left untouched — this
was a targeted bug-fix + verification pass, not a redesign.

### Session 3 (2026-08-22) — ESLint setup, exhaustive mobile/tablet QA

Two items from the Pending list below, done in order.

1. **ESLint config + lint script.** Next.js 16.3.0 has **removed the `next
   lint` command entirely** (confirmed: no `next-lint.js` in
   `node_modules/next/dist/cli/`, unlike `next-build.js`/`next-dev.js`/etc.) —
   so the old "`next lint` scaffolds it for you" flow no longer exists as of
   this Next version. Set up ESLint directly instead: added `eslint@^9` and
   `eslint-config-next@16.3.0` (matched to the installed Next version) as
   devDependencies via `corepack pnpm add -D`, approved their postinstall
   scripts (`corepack pnpm approve-builds --all` — added `unrs-resolver: true`
   to `pnpm-workspace.yaml`'s `allowBuilds`, next to the existing `msw`/`sharp`
   entries), and added a flat-config `eslint.config.mjs` at the repo root that
   composes `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
   (ESLint 9's flat-config format — no `.eslintrc`, no `FlatCompat` shim
   needed since eslint-config-next 16.x ships flat-config-native exports
   directly). Added `"lint": "eslint ."` to `package.json`.
   Running it surfaced exactly two errors, both from
   `eslint-plugin-react-hooks`'s newer `set-state-in-effect` rule (bundled in
   the v7 `recommended` config eslint-config-next 16.x pulls in): a `setState`
   call inside a bare `useEffect` in both `ambient-sound.tsx` (reading the
   mute preference from `localStorage` after mount) and `custom-cursor.tsx`
   (deciding cursor-enabled from `matchMedia` after mount, right where it also
   subscribes to pointer listeners). Both are genuine, necessary client-only
   SSR-safe bootstrap patterns — not the derived-state anti-pattern the rule
   exists to catch — and rewriting them risked touching logic Session 2 had
   just fixed a real crash in. Left them working exactly as-is and added a
   narrow `eslint-disable-next-line react-hooks/set-state-in-effect` with a
   one-line explanatory comment at each site, rather than weakening the rule
   project-wide or refactoring verified behavior. `npm run lint` is clean.
2. **Exhaustive mobile + tablet responsiveness QA.** Used Playwright
   (pre-installed Chromium, real `devices['iPhone 13']` emulation for genuine
   touch/viewport behavior, plus a 768px touch-emulated tablet context) to
   screenshot and DOM-inspect at least one room of each of the four
   `RoomLayout` variants (`split` → living, `full` → balcony, `meta` →
   spiritual, `wide` → music), the hero/intro, the house-index nav menu open,
   and the closing scene, at both widths. Checked for text/heading overflow,
   image/wrapper overflow past the viewport, horizontal page scroll, and
   fixed-UI (nav pill / sound toggle / secret feather) collisions
   programmatically as well as visually. **Result: no real bugs found** — every
   layout variant renders and reveals correctly at both widths, the hero title
   wraps cleanly, no horizontal scroll anywhere, and the fixed UI never
   collides with itself or content.
   Two false alarms surfaced and were run to ground rather than "fixed" blind,
   worth recording so a future session doesn't rediscover the same
   red herrings:
   - Instantly jumping to a room via Playwright's `scrollIntoViewIfNeeded()`
     (a single-frame position change) intermittently left that room's
     `ImageReveal` clip-path stuck at `inset(100%)` — i.e. never revealed —
     specifically for the `split` layout. This does **not** reproduce with
     realistic incremental scrolling (mouse-wheel steps, matching real
     touch/trackpad behavior): confirmed clean across every layout at both
     widths once the test scrolled gradually instead of teleporting. Root
     cause is an interaction between Lenis's RAF-driven smooth-scroll and an
     instantaneous native scroll jump, not application code — real users never
     produce that input pattern. **Do not "fix" this by touching
     `image-reveal.tsx` or the grid/order classes in `room-section.tsx`'s
     `split` branch** — several structural variations (removing CSS `order`,
     swapping DOM order, grid→flex, dropping `items-center`) were tried live
     against the dev server and *none* of them mattered; only the scroll
     method did.
   - A small dark circular **"N" badge bottom-left** visible in every dev-mode
     screenshot is Next.js 16's built-in dev-server DevTools indicator (no
     `devIndicators` config exists in this repo to have added it deliberately)
     — it only renders under `next dev`, not in a production build, and isn't
     part of this site. It happens to sit near the secret-feather icon's own
     bottom-left corner in dev screenshots; this is not a real collision.

No component, layout, room content, or copy changed as a result of the QA
pass — everything checked out.

### Session 4 (2026-08-24) — video/autoplay fixes, feather redraw, loading polish, easter egg, mobile nudge, 3D tour

A long session, mostly driven by live device testing (the user checking the
site on a real phone via WhatsApp's in-app browser) plus two large feature
requests at the end.

1. **`her-mountains.tsx` video** (Nepal zipline footage): fixed twice.
   First pass added an `IntersectionObserver`-driven `video.play()` call,
   `controls={false}`, `disablePictureInPicture`, an `onEnded` manual-restart
   loop fallback, and a VP9/WebM `<source>` before the MP4 (re-encoded the MP4
   itself at higher quality via `ffmpeg`: `libx264 high profile, crf 17,
   +faststart`, plus a VP9 `crf 24` webm and a new poster frame). Real-device
   testing over WhatsApp's in-app browser then showed the play button *still*
   appearing — root cause: WhatsApp's WKWebView requires `video.play()` to be
   called synchronously inside a genuine user-gesture handler; an
   `IntersectionObserver` callback doesn't qualify even though it fires from
   scrolling. Fixed by catching the `play()` rejection and retrying via a
   one-time `pointerdown`/`touchstart`/`wheel`/`keydown` listener — the same
   gesture-retry pattern `ambient-sound.tsx` already used for autoplay.
2. **`public/assets/riya/parents.jpg`** swapped for a new user-provided photo
   (same filename, so `her-parents.tsx` needed no code changes).
3. **`peacock-feather.tsx` redrawn** with anatomically closer nested
   teardrop-band ocelli (bronze rim → iridescent band → green-gold band →
   glossy core, via `color-mix()` off the existing 3 design tokens) and a
   denser two-layer barb fan. The user explicitly asked for a real SVG to be
   found and downloaded online instead — confirmed **not possible in this
   environment**: outbound fetches to pixabay.com, commons.wikimedia.org,
   freesvg.org, openclipart.org, upload.wikimedia.org, and a
   user-provided magnific.com URL all returned `EGRESS_BLOCKED` (this sandbox
   only allowlists package registries and Anthropic's own infra). Redrawing
   by hand was the fallback, communicated honestly rather than silently
   substituted.
4. **Loading polish** — `lib/blur-placeholders.ts` (auto-generated, do not
   hand-edit) holds tiny base64 blurred JPEG previews for all 37 real images
   on the site, generated via `sharp(file).resize(16,16,{fit:'inside'}).blur().jpeg({quality:40})`.
   Wired into every `<Image>` call across `image-reveal.tsx`,
   `riya-portrait.tsx`, `her-collage.tsx`, `her-parents.tsx`, and
   `her-mountains.tsx`'s `HerMountainMoments` via
   `placeholder={blurPlaceholders[src] ? 'blur' : 'empty'}`. Regenerate by
   re-running that resize/blur pass over the same 37 paths if images change.
5. **Time-of-day easter egg** — `secret-feather.tsx`'s modal now picks one of
   five closing-line variants based on `new Date().getHours()` at the moment
   the feather is clicked (not on mount, so it can't go stale on a long visit).
6. **Mobile audio nudge** — `ambient-sound.tsx` shows a small "tap for sound"
   pill near the sound toggle, once, ~1.4s after entry, for first-time
   visitors only (`localStorage['house-sound-nudge-seen']`), auto-hiding
   after 5s or on any interaction with the toggle. Exists because several
   mobile browsers (WhatsApp's included) block audio autoplay outright until
   a real tap, and the toggle was otherwise easy to miss.
7. **The `/home` 3D tour** (see Repo layout above for the file list) — the
   big addition. A few things worth knowing before touching it:
   - It is **not** a literal reconstruction — there's no CAD model or 3D scan
     of the real house, only the 16 flat photographs already in
     `public/assets/home/`. The user was offered three honest options
     (stylized architectural flythrough / 2.5D parallax / abstract
     particle journey) and chose the stylized flythrough — real photos
     mounted as framed panels inside a simple low-poly corridor, not an
     attempt at photorealism.
   - **Camera tuning is the fragile part.** The first version used a
     lateral "weave" factor of `0.38× offsetX` to swing the camera toward
     each room; this caused the Catmull-Rom curve's natural overshoot on
     the alternating left/right zig-zag to occasionally swing the camera
     *through* a bay's side wall, producing a blank/close-up-clipped canvas
     deep into the scroll (only surfaced by actually scrolling all the way
     through in Playwright, not from a single entry screenshot). Fixed by
     dropping the weave factor to `0.12×` — comfortably inside the corridor
     half-width so the camera can never reach a wall — and dialing the
     look-at swing back from `0.9×` to `0.75×`. If the camera ever looks
     "stuck" or the canvas goes blank partway through the tour, check these
     two constants in `buildCameraPath()` (`lib/house-tour-layout.ts`)
     first, and verify by scrolling incrementally through the *entire*
     tour, not just the first couple of rooms.
   - **The text panel needs `AnimatePresence` without `mode="wait"`.** With
     `mode="wait"`, rapid scroll-driven key changes (each room = a new
     `key={stop.id}`) can starve the queue — the visible pill counter keeps
     updating (it's not inside `AnimatePresence`) while the animated title/
     subtitle card gets stuck showing a stale room. Default (overlapping)
     mode fixed it.
   - `useTexture`'s returned texture can't be mutated directly in the
     component body (`texture.colorSpace = ...`) — the newer
     `react-hooks/immutability` lint rule (bundled in `eslint-config-next`
     16.x's `react-hooks` recommended config) flags it. Set it inside
     `useTexture`'s own `onLoad` callback instead (see `photo-panel.tsx`).
   - No `<Environment>`/HDRI or other drei loaders that fetch external
     assets — this environment blocks that egress, and there's no
     guarantee the deployed site would want an external CDN dependency
     either. Lighting is entirely local (`ambientLight` + `directionalLight`
     + per-bay `pointLight`).
   - Respects `prefers-reduced-motion` with a full static fallback (no
     Canvas mounted at all) linking back to the classic tour — a first-
     person scroll flythrough is exactly the kind of motion a visitor who's
     opted out of motion shouldn't be forced through.
   - Verified via Playwright at desktop (1440px) and `devices['iPhone 13']`:
     a full incremental scroll through all 16 stops with no console errors,
     no horizontal overflow, the reduced-motion fallback, and — after the
     camera-weave fix — no blank/clipped frames anywhere in the tour. One
     mobile-only bug found and fixed in the same pass: the back-link pill
     and the progress-number pill collided on narrow viewports because the
     room-name label made the right pill too wide; fixed by hiding the
     descriptive label (keeping just "05 / 16") below the `md:` breakpoint.

8. **The `/home` tour's first version looked like an art exhibition, not a
   house** — floating walls with no ceiling, no sky, no sense of being
   inside or outside anything. User feedback, same session. Fixed with a
   real enclosure pass (still in `lib/house-tour-layout.ts` /
   `components/house-tour/`):
   - Every room bay now has a proper doorway (two jambs + a header, not an
     open stage) and a ceiling. The entry got a real house facade — a
     doorway, a pitched roof, a yard with a few low-poly neighbor houses
     and trees, approached from a pulled-back establishing shot.
   - **A ceiling alone did not fully enclose the corridor.** A per-bay
     ceiling only covers that bay's own footprint — the walkway *between*
     bays, and the wide-FOV periphery even inside a bay, could still see
     past its edges to open sky. Two more pieces were needed: one
     continuous corridor ceiling (`floorWidth * 3` wide, so no camera
     angle from inside a room clears its edge) spanning the whole tour
     except a gap left open on purpose right before the closing "her"
     stop, *and* a plain outer perimeter wall well past every room's own
     outer wall (`floorWidth / 2 + 3`) — a **level** sightline out of a
     room past its wall's finite edge doesn't hit an overhead ceiling at
     all, only a side wall stops it. If sky ever leaks back in, it's one
     of these two.
   - **`<Sky>` from `@react-three/drei`** (wraps `three-stdlib`'s Sky
     shader) is fully procedural / real-time atmospheric scattering — no
     texture, no network fetch (checked its source before using it,
     since this environment blocks egress to asset hosts like
     Sketchfab/Poly Pizza, which is where an actual downloadable 3D house
     model would have had to come from — not available here). Tuned for
     a clear daytime blue (`turbidity={2}`, `rayleigh={1.4}`), not the
     default hazy/white-near-horizon look. `distance` must stay under the
     Canvas camera's `far` (bumped to 700 here) or the sky sphere gets
     near-clipped away.
   - **Gable roof geometry is easy to get backwards.** A pitched panel's
     *ridge axis* has to run parallel to the wall it's over (here, along
     X, matching `BAY_WIDTH`) for the sloped surface to actually face an
     approaching camera. Rotating around the wrong axis (Z, so the ridge
     ran *into* the building instead) rendered the roof edge-on — a
     paper-thin line instead of a visible pitched surface. If a roof ever
     looks like a stick instead of a slab, this is why.
   - Verified the same way as the camera-weave fix: incremental scroll
     through the *entire* tour (not just the first couple of rooms) at
     desktop and `devices['iPhone 13']`, screenshotting suspect rooms
     specifically until the sky-leak was gone everywhere, not just at the
     one spot it was first noticed.
9. **Replaced the favicon.** `public/apple-icon.png`,
   `icon-dark-32x32.png`, `icon-light-32x32.png`, and `icon.svg` were the
   original Imagenative/v0.app generator's own "v0" logo, sitting unused
   in `public/` (nothing referenced them, so Next's file-based icon
   convention never picked them up either). Replaced with a real one at
   `app/icon.svg` (Next's App Router auto-detects this) — a small SVG of
   the peacock feather's eye motif on a teal-to-bronze gradient — plus a
   rasterized `app/apple-icon.png` (180×180, via `sharp`) for iOS, since
   Apple doesn't reliably accept SVG touch icons. Regenerate the PNG from
   the SVG with `sharp` at 180×180 if `icon.svg` ever changes.

## Pending / not yet done

Nothing here is broken — these are the honest gaps left after Session 3, roughly in priority order:

1. **No deploy target connected yet.** The repo is on GitHub
   (`tiffinwaleofficial/my-dream-house`, `main` branch) but not yet imported
   into Vercel or any host. `@vercel/analytics` is already a dependency,
   suggesting Vercel was the intended target — importing the repo there would
   also solve the "does image optimization actually work in production"
   question for free (Vercel bundles `sharp`-equivalent infra automatically).
2. **Raw/duplicate source images** sit in the parent folder
   (`D:\Personal Projects\My Dream Home\*.png` — e.g. "Warm Modern Kitchen with
   Marble Island.png", "Cozy Kitchen Herb Garden Window.png") one level above
   this repo. These were compared against `public/assets/home/*` and found to
   be **earlier/raw generation outputs with debug labels baked into the image**
   (e.g. a "COZY CORNER" text stamp in the top-left corner) — already
   superseded by the clean versions actually in use. Left untouched (not
   deleted — they're the user's files, not build artifacts), but they're not
   wired into the site and don't need to be.
3. ~~The brief's item #31 mentions Three.js as an optional stretch for the
   house map~~ — **done in Session 4**: `house-map.tsx` itself stayed the clean
   CSS-grid plan it was (still the right call for that specific component),
   but a full Three.js scroll-driven 3D walkthrough now lives at `/home`,
   linked from the house-map section. See the Session 4 log below and
   `lib/house-tour-layout.ts`.
4. Mobile/tablet QA (Session 3) was thorough but still browser-emulated, not a
   real device. Nothing found suggests a real-device check would turn up
   anything, but it's the last rung of the "verified" ladder that hasn't been
   climbed.

## How to run it

```bash
cd radha-s-house
corepack pnpm install       # first time / after pulling dependency changes
npm run dev                 # http://localhost:3000
npm run build && npm start  # production build/serve
npx tsc --noEmit            # typecheck
npm run lint                # ESLint
```

## Where things live (quick reference)

- GitHub: `https://github.com/tiffinwaleofficial/my-dream-house` (branch `main`)
- gh CLI is authenticated as `tiffinwaleofficial`; `gh auth setup-git` has
  already been run once in this environment so `git push`/`git pull` work
  without credential prompts. If push hangs again elsewhere, that's the first
  thing to check.
- Music credits: `public/assets/audio/CREDITS.md`
- Room content/order: `lib/rooms.ts` (edit this, not individual components, to
  change room text/order/images)
