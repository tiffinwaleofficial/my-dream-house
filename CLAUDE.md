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
- **lenis** (`lenis/react`) for smooth scroll, auto-disabled under `prefers-reduced-motion`
- **sharp** for Next.js image optimization (added Session 1 — see below)
- **@vercel/analytics** (loads only in production builds)
- Package manager: **pnpm** (there's a `pnpm-lock.yaml` and `pnpm-workspace.yaml`).
  `npm` also works for running scripts against the already-installed
  `node_modules`, but use `pnpm` (via `corepack pnpm ...`) for install/add/remove
  so the lockfile stays correct. Plain `pnpm` may not be on PATH in a fresh
  shell — use `corepack pnpm <command>` if `pnpm` alone 404s.
- No test suite exists. No `lint` script exists in `package.json` (only
  `dev`/`build`/`start`).

## Repo layout

```
app/
  layout.tsx        — root layout, Google Fonts (Cormorant Garamond, Inter, Noto Serif Devanagari), metadata
  page.tsx           — the entire single-page experience, composed from components below
  globals.css        — design tokens (colors, fonts) + Tailwind v4 theme wiring
components/
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
  rooms.ts    — ⭐ single source of truth for the house tour: `Room[]` array + `roomIndex`.
                Add/reorder/edit rooms here; app/page.tsx just maps over `rooms`.
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

## Pending / not yet done

Nothing here is broken — these are the honest gaps left after Session 1, roughly in priority order:

1. **No human-eye visual QA yet.** This session's browser tool could not render
   a visible/compositing pane (screenshots timed out with "Browser pane is not
   displayed" every time, in both the sandboxed Claude Browser and after
   confirming no real Chrome was connected via Claude-in-Chrome). All
   verification was DOM/network/console-level (page text extraction,
   accessibility tree, network request log, console log) — **not** a real
   visual check. Whoever picks this up next should actually look at the
   rendered site, ideally at desktop + tablet + mobile widths, and check:
   - Does the longer title **"The House of Riya"** (18 chars) wrap/scale
     acceptably everywhere "Radha's House" (13 chars) used to fit — especially
     `hero-house.tsx` and `intro-experience.tsx` at `text-7xl`/`text-8xl`?
   - Does the new bottom-right sound toggle visually collide with anything
     (it sits at the same corner-inset rhythm as `secret-feather.tsx`
     bottom-left and `room-navigation.tsx` top-right, but hasn't been eyeballed)?
   - General cinematic feel — scroll pacing, image reveal timing, parallax —
     matches the "premium architecture editorial" bar from the brief.
2. **`roomIndex` label for room 11** ("Her Room" → auto-derived label "Room")
   reads oddly terse in the house map / nav menu. Either give it an explicit
   `label` override in `lib/rooms.ts`'s `roomIndex` mapping, or rename the room
   title itself.
3. **Mobile responsiveness** — not visually verified this session (see #1).
   The code already has the right instincts (custom cursor disabled on
   touch/coarse pointers, Lenis disabled under `prefers-reduced-motion`,
   responsive `sizes` props on all `next/image` usages) but hasn't been looked
   at on an actual small viewport.
4. **No deploy target connected yet.** The repo is on GitHub
   (`tiffinwaleofficial/my-dream-house`, `main` branch) but not yet imported
   into Vercel or any host. `@vercel/analytics` is already a dependency,
   suggesting Vercel was the intended target — importing the repo there would
   also solve the "does image optimization actually work in production"
   question for free (Vercel bundles `sharp`-equivalent infra automatically).
5. **Raw/duplicate source images** sit in the parent folder
   (`D:\Personal Projects\My Dream Home\*.png` — e.g. "Warm Modern Kitchen with
   Marble Island.png", "Cozy Kitchen Herb Garden Window.png") one level above
   this repo. These were compared against `public/assets/home/*` and found to
   be **earlier/raw generation outputs with debug labels baked into the image**
   (e.g. a "COZY CORNER" text stamp in the top-left corner) — already
   superseded by the clean versions actually in use. Left untouched (not
   deleted — they're the user's files, not build artifacts), but they're not
   wired into the site and don't need to be.
6. **No lint script / ESLint config** exists. Not blocking anything today
   (`tsc --noEmit` and `next build` both pass clean), but worth adding if the
   project keeps growing.
7. The brief's item #31 mentions Three.js as an optional stretch for the house
   map "only if it genuinely adds value" — current `house-map.tsx` is a clean
   CSS-grid architectural plan, which is the right call per the brief's own
   "don't build unnecessarily heavy 3D" guidance. Not a gap, just confirming
   the decision was deliberate, not skipped.

## How to run it

```bash
cd radha-s-house
corepack pnpm install       # first time / after pulling dependency changes
npm run dev                 # http://localhost:3000
npm run build && npm start  # production build/serve
npx tsc --noEmit            # typecheck
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
