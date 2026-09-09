# BharatKatha — Step Inside History

> **Don't just learn India's history. Step inside it.**

BharatKatha is an immersive, AI-powered platform that lets you **discover, experience, create and preserve** India's rich history and cultural heritage through interactive storytelling — built as a premium web experience with 3D first-person worlds, AI character conversations, story generation, and oral-history preservation.

**Live app:** https://bharat-katha.base44.app

---

## The Journey

The platform is organised around four pillars:

| Pillar | What it means |
|---|---|
| **Discover** | Browse curated heritage, states, categories, eras and an interactive 2,500-year timeline. |
| **Experience** | Walk inside a living 3D reconstruction of Nalanda University (5th century CE) — with AI scholars and debates. |
| **Create** | Generate your own AI-powered historical stories ("Kathas") and live them in 3D first-person. |
| **Preserve** | Save your hometown's heritage and your family's oral histories — voice, video, photo or written story. |

---

## Features

### 1. Home (`/`)
- Cinematic hero with AI-generated Nalanda imagery.
- Featured heritage collection, category grid (Architecture, Art & Crafts, Music, Dance, Food, Festivals, Literature, Traditional Knowledge), era timeline cards (Ancient → Freedom Movement).
- Journey CTA: *Discover → Experience → Create → Preserve*.

### 2. Explore India (`/explore`)
- **State → City → Heritage** drill-down (Uttar Pradesh, Rajasthan, Tamil Nadu, Bihar).
- **Interactive timeline scrubber (500 BCE → 1947 CE)** — drag through four colour-coded eras (Ancient, Medieval, Colonial, Freedom Movement) with clickable key events and an era dashboard.
- Filter by category or era via URL params; curated heritage cards with full detail pages (short history, cultural significance, why it matters today, related traditions, sources).
- Each heritage item links directly into its immersive experience.

### 3. Experience — Nalanda University in 3D (`/experience`)
A walkable, first-person Three.js reconstruction of Nalanda University, 5th century CE:
- **"Time Travel" transition** — animated cloud overlay that flies you back in time before you enter the world.
- **Four interactive modes** via a floating mode dock:
  - **Explore** — free walk through the campus: the Great Stupa, Viharas (monastery blocks), banners, walking monks, golden dust.
  - **Library** — teleport into the Dharmaganja, the nine-storey library with palm-leaf manuscript shelves.
  - **Scholar** — chat with **Śīlabhadra**, the historical abbot of Nalanda, via an AI persona grounded in historical context.
  - **Debate** — the debate courtyard, where an AI-generated scholarly debate unfolds line-by-line, with a regenerate option.
- **Proximity zones** — walk near the Stupa, a Vihara, the Bodhi tree or the library and contextual captions appear.
- **Social sharing** — the Share button captures your live 3D view (`preserveDrawingBuffer`) and composes a branded **1080×1920 Instagram Story** image with the BharatKatha mark, caption and simulation disclaimer — then opens the native share sheet (download fallback on desktop).

### 4. Create Katha (`/create`)
A 4-step AI story studio:
1. Pick a **theme** (Ancient India, Indian Science, Folk Culture, Traditional Arts, Freedom Movement).
2. Pick a **setting** (Nalanda, Varanasi, Rajasthan, Tamil Nadu, Pataliputra).
3. Pick a **story type** (Short, Cinematic, Interactive, Educational) + optional custom details.
4. Generate — the LLM writes a first-person historical narrative, which you can **download**, **save**, or **"Live It in 3D"**.

### 5. Live Katha — your story in 3D first-person (`/live`)
Your generated Katha becomes a **walkable 3D world**:
- Story is split into glowing parchment **story panels** placed along a torch-lit path of pillars and torana arches, ending at a setting-themed monument (stupa, temple, fort, palace or ghat).
- Theme palettes per setting (Nalanda, Pataliputra, Rajasthan, Tamil Nadu, Varanasi).
- **WebXR / VR support** — on a VR-capable browser (e.g. Meta Quest), an "Enter VR" button starts a full immersive-vr session with controller thumbstick movement.
- Mobile: on-screen **touch joystick** for walking + drag-to-look.

### 6. Meet History — Character Studio (`/characters`)
- AI role-play conversations with historical figures: **Aryabhata**, **Chanakya**, **Chandragupta Maurya**, **Kabir**.
- Each persona has a portrait, era, historical context, greeting and suggested questions; the LLM responds in first person, stays within historical plausibility, and never claims to be a literal historical record.

### 7. My Roots (`/roots`)
- Search your hometown (Prayagraj, Varanasi, Jaipur, Madurai seeded) to uncover its historical places, traditions, food, folk culture, festivals, local stories and languages.
- **Preserve a story from your family** — upload audio / video / photo (stored via Base44 file storage) or write a story; entries are kept in your personal archive.

### 8. Community (`/community`)
- A feed of shared heritage stories with categories, likes, saves and sharing.
- Publish your own story to the feed.

### 9. Profile (`/profile`)
- Gamification dashboard: points, rank ladder, badges and an activity log.

---

## Gamification

Engagement is rewarded through a points + ranks + badges system (`src/lib/gamification.js`):

- **Ranks:** Heritage Explorer (0) → Heritage Enthusiast (100) → Cultural Ambassador (300) → Heritage Guardian (600).
- **Badges:** First Explorer, Story Weaver, Time Traveler, Conversationalist, Root Keeper, Community Voice.
- **Point rewards:** explore a site +15 · enter an experience +25 · create a Katha +40 · chat with a character +20 · preserve a story +30 · share to community +10.
- Points appear live in the header; progress is tracked on the Profile page.

---

## AI & Historical Integrity

- All AI content (character chats, Katha stories, scholar chat, debates, 3D worlds) is generated via the **Base44 `InvokeLLM`** integration.
- Every AI experience carries a visible **"Historical Simulation"** disclaimer — clarifying it is an educational reconstruction, **not** a primary historical record.
- Character personas are prompted to stay historically plausible and to never present their words as literal quotes.
- Curated heritage content cites its sources (UNESCO listings, ASI, travel chronicles, GI Registry, etc.) and the architecture is designed to support future **RAG-based verified cultural knowledge**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, shadcn/ui, Framer Motion, lucide-react |
| 3D / XR | Three.js (WebGL renderer with WebXR `immersive-vr` session support) |
| AI | Base44 SDK — `InvokeLLM` integration (personas, story generation, debates) |
| Storage | Base44 file storage (`UploadFile`) for media; `localStorage` for kathas, roots, points and badges (prototype persistence) |
| Backend / Hosting / Auth | Base44 platform (email + Google OAuth, hosting, publishing) |

### Design System
- Dark charcoal aesthetic with warm **saffron/gold** accents (premium cinematic feel — deliberately *not* a government-portal look).
- Headings: **Cormorant Garamond / Playfair Display** (serif) · UI: **Inter** (sans-serif).
- Design tokens in `src/index.css` (`:root` HSL variables) mapped through `tailwind.config.js`; reusable component classes: `.glass`, `.glass-strong`, `.text-gradient-gold`, `.card-hover`, `.btn-glow`, `.grain`, `.gold-divider`.

---

## Project Structure

```
src/
├── App.jsx                    # Router — all pages under shared Layout
├── pages/
│   ├── Home.jsx                # Landing page
│   ├── ExploreIndia.jsx        # State → City → Heritage + timeline + filters
│   ├── Experience.jsx          # Nalanda 3D experience (4 modes)
│   ├── LiveExperience.jsx      # Generated Katha in 3D first-person + VR
│   ├── CharacterStudio.jsx     # AI historical-figure conversations
│   ├── CreateKatha.jsx         # 4-step AI story studio
│   ├── MyRoots.jsx             # Hometown heritage + oral-history preservation
│   ├── Community.jsx           # Shared stories feed
│   └── Profile.jsx             # Gamification dashboard
├── components/
│   ├── Layout.jsx              # Header (nav, points), footer
│   ├── HeritageCard.jsx, SectionHeading.jsx, AIDisclaimer.jsx, ScrollToTop.jsx
│   ├── live/
│   │   ├── ImmersiveCanvas.jsx # Three.js engine: WASD/joystick movement, drag/pointer-lock look,
│   │   │                       #   WebXR VR session, gamepad support, zones, teleport, snapshot API
│   │   └── TouchJoystick.jsx   # Mobile movement joystick
│   ├── explore/
│   │   └── TimelineExplorer.jsx # Draggable 500 BCE – 1947 CE timeline scrubber
│   └── experience/
│       ├── ModeDock.jsx        # Explore / Library / Scholar / Debate switcher
│       ├── ScholarChat.jsx     # Śīlabhadra AI persona chat
│       ├── DebatePanel.jsx     # AI-generated scholarly debate
│       ├── TimeTravelOverlay.jsx # Animated time-travel transition
│       └── ShareSnapshot.jsx   # Branded 1080×1920 story image + native share
├── lib/
│   ├── nalandaWorld.js         # Nalanda 3D world (stupa, viharas, library, courtyard, monks, zones)
│   ├── liveScene.js            # Themed katha worlds + story panels (canvas textures)
│   ├── gamification.js         # Points, ranks, badges
│   └── AuthContext.jsx, query-client.js, utils.js, …
└── data/
    ├── heritage.js             # Curated heritage, states, characters, roots data, katha options
    └── timeline.js             # Eras + key events for the timeline scrubber
```

### 3D Engine API (`ImmersiveCanvas`)
The canvas exposes an imperative API used by both 3D pages:
- `setMove(x, y)` — joystick / external movement input
- `teleport(x, z, yaw)` — jump to a location (mode switching)
- `requestLock()` — pointer-lock mouse look (with browser re-lock throttling handled)
- `enterVR()` — start a WebXR `immersive-vr` session
- `snapshot()` — capture the current frame as a PNG data URL (for social sharing)

Controls: **WASD / arrow keys** to walk · **drag or click to lock** to look · **ESC** to release · VR controller thumbsticks supported in-headset · touch joystick on mobile.

## Future Roadmap

- Wire generated Katha output directly into the Community feed.
- RAG-based integration for verified cultural knowledge grounding all AI content.
- More 3D worlds beyond Nalanda (per-heritage reconstructions).
- Grown "roots" database covering more regions of India.
- Server-side persistence for kathas, roots and gamification.

*BharatKatha is an educational prototype. AI-generated experiences are educational reconstructions, not primary historical sources.*
