export type RoomLayout = 'full' | 'wide' | 'split' | 'meta'

export type Room = {
  id: string
  number: string
  title: string
  subtitle: string
  image: string
  alt: string
  /** portrait placeholder — swap the file to add a real photo of Riya */
  portrait?: string
  portraitAlt?: string
  layout: RoomLayout
  meta?: { light: string; mood: string; element: string }
  /** whether the room image should be treated as a darker / evening scene */
  dark?: boolean
}

export const rooms: Room[] = [
  {
    id: 'living',
    number: '02',
    title: 'The Heart of the House',
    subtitle: 'The place where everyone stays a little longer.',
    image: '/assets/home/living-room.png',
    alt: 'A warm, minimal living room with linen sofa, plants and a bright balcony beyond',
    portrait: '/assets/riya/riya-home.png',
    portraitAlt: 'Placeholder portrait — standing peacefully in the living room',
    layout: 'split',
    meta: { light: 'Soft daylight', mood: 'Open', element: 'Linen / Plants / Wood' },
  },
  {
    id: 'balcony',
    number: '03',
    title: 'The Place to Breathe',
    subtitle: 'Where the world feels a little quieter.',
    image: '/assets/home/balcony.png',
    alt: 'A plant-filled balcony overlooking soft green hills at dusk with a cup of tea',
    portrait: '/assets/riya/riya-tea.png',
    portraitAlt: 'Placeholder portrait — at the balcony with tea',
    layout: 'full',
    meta: { light: 'Golden dusk', mood: 'Quiet', element: 'Air / Hills / Tea' },
  },
  {
    id: 'spiritual',
    number: '04',
    title: 'A Quiet Corner',
    subtitle: 'A small place for strength, gratitude and peace.',
    image: '/assets/home/pooja-room.png',
    alt: 'A minimal private spiritual corner with soft candlelight and a brass diya',
    layout: 'meta',
    meta: { light: 'Warm candle', mood: 'Still', element: 'Brass / Marigold / Silence' },
  },
  {
    id: 'music',
    number: '05',
    title: 'The Music Corner',
    subtitle: 'Some feelings are easier to play than explain.',
    image: '/assets/home/music-corner.png',
    alt: 'A minimal music corner with an acoustic guitar and a sitar in warm afternoon light',
    portrait: '/assets/riya/riya-music.png',
    portraitAlt: 'Placeholder portrait — beside the instruments',
    layout: 'wide',
    meta: { light: 'Afternoon', mood: 'Expressive', element: 'Strings / Wood' },
  },
  {
    id: 'piano',
    number: '06',
    title: 'The Piano Corner',
    subtitle: 'For evenings when silence needs a little music.',
    image: '/assets/home/piano-corner.png',
    alt: 'An intimate piano corner at night with very low warm lighting',
    layout: 'full',
    dark: true,
    meta: { light: 'Low & warm', mood: 'Tender', element: 'Piano / Books / Glow' },
  },
  {
    id: 'library',
    number: '07',
    title: 'The Book Nook',
    subtitle: 'For all the pages that taught her to keep going.',
    image: '/assets/home/library.png',
    alt: 'A cozy home library with warm wood shelves, a reading chair and window light',
    portrait: '/assets/riya/riya-reading.png',
    portraitAlt: 'Placeholder portrait — reading in the nook',
    layout: 'split',
    meta: { light: 'Window light', mood: 'Absorbed', element: 'Paper / Wood / Lamp' },
  },
  {
    id: 'kitchen',
    number: '08',
    title: 'The Kitchen',
    subtitle: 'Where freshness enters before the day even begins.',
    image: '/assets/home/kitchen.png',
    alt: 'A fresh minimal modern Indian kitchen with warm cabinetry and morning light',
    layout: 'wide',
    meta: { light: 'Morning', mood: 'Fresh', element: 'Marble / Wood / Green' },
  },
  {
    id: 'herb',
    number: '09',
    title: 'The Herb Window',
    subtitle: 'Little things that make a house feel alive.',
    image: '/assets/home/kitchen-herb-window.png',
    alt: 'A sunlit window sill with small pots of basil, mint and coriander',
    layout: 'full',
    meta: { light: 'Sunlit sill', mood: 'Growing', element: 'Herbs / Terracotta' },
  },
  {
    id: 'dining',
    number: '10',
    title: 'The Table',
    subtitle: 'Because a home is also the people who gather around it.',
    image: '/assets/home/dining.png',
    alt: 'A warm dining area in the evening with a wood table and a low pendant light',
    layout: 'full',
    dark: true,
    meta: { light: 'Evening pendant', mood: 'Gathered', element: 'Wood / Ceramic / Warmth' },
  },
  {
    id: 'bedroom',
    number: '11',
    title: 'Her Room',
    subtitle: 'Childhood memories. Adulthood dreams. One place for both.',
    image: '/assets/home/master-bedroom.png',
    alt: 'A peaceful minimal bedroom with white and beige linen and soft morning light',
    portrait: '/assets/riya/riya-main.png',
    portraitAlt: 'Placeholder portrait — a soft, peaceful moment',
    layout: 'split',
    meta: { light: 'Soft morning', mood: 'Calm', element: 'Linen / Wood / Air' },
  },
  {
    id: 'cozy',
    number: '12',
    title: 'A Little Corner',
    subtitle: 'For tea. For books. For doing nothing. For being okay with that.',
    image: '/assets/home/cozy-corner.png',
    alt: 'An intimate cozy reading corner by a window with an armchair and a throw',
    layout: 'wide',
    meta: { light: 'Afternoon', mood: 'Restful', element: 'Wool / Tea / Plants' },
  },
  {
    id: 'wardrobe',
    number: '13',
    title: 'The Wardrobe',
    subtitle: 'Everything in its place, so the mind can be somewhere else.',
    image: '/assets/home/wardrobe.png',
    alt: 'A minimal walk-in wardrobe with warm wood shelving and soft lighting',
    layout: 'meta',
    meta: { light: 'Integrated', mood: 'Ordered', element: 'Wood / Linen / Mirror' },
  },
  {
    id: 'bathroom',
    number: '14',
    title: 'A Quiet Morning',
    subtitle: 'Light. Water. Silence.',
    image: '/assets/home/bathroom.png',
    alt: 'A calm spa-like minimal bathroom with travertine, wood and brass fixtures',
    layout: 'full',
    meta: { light: 'Soft morning', mood: 'Renewed', element: 'Stone / Brass / Steam' },
  },
  {
    id: 'terrace',
    number: '15',
    title: 'The Open Sky',
    subtitle: 'The part of the house where time stops feeling important.',
    image: '/assets/home/terrace.png',
    alt: 'A rooftop terrace garden at dusk with plants, string lights and a tea table',
    layout: 'full',
    dark: true,
    meta: { light: 'Dusk to night', mood: 'Boundless', element: 'Sky / Lights / Plants' },
  },
]

/** Explicit label overrides for rooms whose auto-derived label reads oddly. */
const labelOverrides: Record<string, string> = {
  bedroom: 'Her Room',
}

/** Index used by the floating navigation + floor plan (includes entry). */
export const roomIndex: { id: string; number: string; label: string }[] = [
  { id: 'entry', number: '01', label: 'Entry' },
  ...rooms.map((r) => ({
    id: r.id,
    number: r.number,
    label: labelOverrides[r.id] ?? r.title.replace(/^The\s|^A\s|^Her\s/i, ''),
  })),
  { id: 'her', number: '16', label: 'Her' },
]
