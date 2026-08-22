# Riya portrait prompts

Five spots in the house currently show a stand-in portrait of Riya. This file
has a ready-to-use prompt for each one. Use your own reference photos of
Riya with whatever third-party image tool you choose (img2img / face-consistent
generation), then send me the finished files and I'll drop them straight in —
same filenames, same folder, nothing else to change.

**Technical spec (same for all five):**
- Aspect ratio **3:4** (portrait) — crop or generate to this ratio so nothing
  gets stretched or awkwardly cropped by the site.
- Minimum ~1200×1600px, PNG.
- Keep the same filename listed under each room so it drops in with zero code
  changes.
- Style to match the rest of the site: warm, editorial, natural light,
  slightly muted/soft tones (cream / wood / soft green palette), candid
  rather than posed-for-camera — like a moment caught mid-thought, not a
  studio headshot.

---

## 1. Living room — "The Heart of the House"

**File:** `public/assets/riya/riya-home.png`
**Room mood:** Soft daylight · Open · Linen / Plants / Wood

**Prompt:**
> Riya standing barefoot in a warm, minimal living room with a linen sofa,
> potted plants, and a bright balcony visible in the soft background. Soft
> midday daylight from the side. She's relaxed, mid-movement or looking
> gently toward the window/plants — not posed at the camera. Loose,
> comfortable homewear in a neutral/cream tone. Candid editorial lifestyle
> photography, shallow depth of field, warm and open feeling. Portrait
> orientation, 3:4.

---

## 2. Balcony — "The Place to Breathe"

**File:** `public/assets/riya/riya-tea.png`
**Room mood:** Golden dusk · Quiet · Air / Hills / Tea

**Prompt:**
> Riya sitting at a small balcony table at golden-hour dusk, holding a warm
> cup of tea in both hands, looking out toward soft green hills in the
> distance. String lights and potted plants around her. Warm gold/amber
> dusk light, gentle and quiet mood. Cozy oversized sweater or wrap. Candid,
> contemplative, not looking at camera. Editorial lifestyle photography,
> soft warm tones, shallow depth of field. Portrait orientation, 3:4.

---

## 3. Music corner — "The Music Corner"

**File:** `public/assets/riya/riya-music.png`
**Room mood:** Afternoon · Expressive · Strings / Wood

**Prompt:**
> Riya sitting cross-legged or on a low stool beside an acoustic guitar and
> sitar in a minimal music corner, warm afternoon light streaming in. She's
> gently touching the guitar strings or resting a hand on it, caught in a
> quiet expressive moment — not performing for the camera. Warm wood tones
> in the background. Soft, natural, unposed. Editorial lifestyle
> photography, warm afternoon light, shallow depth of field. Portrait
> orientation, 3:4.

---

## 4. Library — "The Book Nook"

**File:** `public/assets/riya/riya-reading.png`
**Room mood:** Window light · Absorbed · Paper / Wood / Lamp

**Prompt:**
> Riya curled up in a reading chair in a cozy home library with warm wood
> shelves, fully absorbed in a book, soft window light falling across her.
> Knees pulled up or feet tucked under her, completely unaware of the
> camera — a private, quiet moment of focus. Soft cardigan or knit layer.
> Warm, book-lined background softly out of focus. Editorial lifestyle
> photography, natural window light, shallow depth of field. Portrait
> orientation, 3:4.

---

## 5. Bedroom — "Her Room"

**File:** `public/assets/riya/riya-main.png`
**Room mood:** Soft morning · Calm · Linen / Wood / Air

**Prompt:**
> Riya in a peaceful, minimal bedroom with white and beige linen, soft
> morning light coming through a window. A calm, unguarded moment — sitting
> on the edge of the bed, or standing by the window with morning light on
> her face. Soft loungewear in neutral tones. Gentle, calm, intimate but not
> posed. Editorial lifestyle photography, soft morning light, shallow depth
> of field, muted warm palette. Portrait orientation, 3:4.

---

## Notes

- These prompts describe **scene, pose, lighting and mood only** — no
  identity details — since you'll be pairing them with your own reference
  photos of Riya in whichever tool you use (that's the part that keeps it
  actually her).
- All five images render inside `components/riya-portrait.tsx`, a shared
  `aspect-[3/4] overflow-hidden` frame — so a slightly imperfect crop from
  your generator is fine, it'll be center-cropped to fit automatically.
- When you have the files, just send them over with a note on which room
  each one is for (or keep the filenames above) and I'll place them and
  verify the site renders correctly, no other code changes needed.
