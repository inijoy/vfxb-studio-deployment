Design a dark-theme professional video editing software UI called 
"VFXB" inspired by Diffusion Studio Pro. The interface is a 
desktop application (1440x900px) with a deep dark aesthetic, 
clean panels, and an AI chatbot as the primary intelligence layer.

═══════════════════════════════════
VISUAL STYLE & THEME
═══════════════════════════════════
- Background: #0D0D0D (main), #161616 (panels), #1E1E1E (sidebars)
- Accent: Electric blue #0A84FF with subtle cyan glow #00C2FF
- Text: #FFFFFF (primary), #8A8A8A (secondary), #3A3A3A (borders)
- Font: "Inter" for UI labels, "DM Mono" for timecodes
- Border radius: 8px cards, 6px buttons, 12px panels
- Shadows: Soft inner glow on active panels
- Icons: Phosphor icon set, 18px, 1.5px stroke, #8A8A8A default, 
  #FFFFFF on hover/active
- No heavy gradients — use subtle 4% white overlays for depth

═══════════════════════════════════
OVERALL LAYOUT (4-zone grid)
═══════════════════════════════════

[LEFT SIDEBAR 64px] | [ASSETS PANEL 220px] | [CENTER STAGE] | [AI PANEL 300px]
                              [BOTTOM TIMELINE full width]

═══════════════════════════════════
ZONE 1 — FAR LEFT ICON SIDEBAR (64px wide, full height)
═══════════════════════════════════
- VFXB logo mark at top (glowing blue hexagon icon)
- Vertical icon stack with tooltip labels on hover:
  • Media (film strip icon)
  • Text (T icon)
  • Shapes (rectangle icon)
  • Transitions (layers icon)
  • Music (waveform icon)
  • Effects (sparkle icon)
  • Color (palette icon)
  • Settings (gear icon) — pinned to bottom
- Active icon: white + left blue 3px border indicator
- Background: #111111

═══════════════════════════════════
ZONE 2 — ASSETS PANEL (220px wide)
═══════════════════════════════════
- Header: "Project Assets" bold white + "⋯" menu icon
- Search bar: "Search media & file" with magnifier icon
- Category pills: Videos | Files | All media | Voices
  (pill style, active = blue fill, inactive = dark outline)
- Media grid: 2-column thumbnail grid
  Each thumbnail: rounded 8px corners, filename below in 
  #8A8A8A small text, duration badge top-right
- Bottom: trash / folder / list icons row
- Background: #141414

═══════════════════════════════════
ZONE 3 — CENTER STAGE (flexible width)
═══════════════════════════════════
TOP BAR (40px):
- Left: "New upload" ghost button + breadcrumb 
  "Projects → instagram.post ▾"
- Right: collaborator avatars, rendering progress bar 
  "Rendering 50%" in blue, Export button (blue filled pill)

VIDEO PREVIEW PLAYER:
- 16:9 black canvas with rounded 10px corners
- Subtle vignette overlay on edges
- Bottom controls bar (dark #1A1A1A):
  ⏮ ◀◀ ⏸ ▶▶ ⏭  |  timecode "01:24 / 03:45"  |  
  volume | zoom 25% dropdown | aspect ratio "16:9 ▾"
- NO content in the preview (empty black state)

PERFORMANCE SCORE BADGE (floating top-right of preview):
- Pill badge: "⚡ Score 84 / 100" 
- Color: #0A84FF background, white text, subtle glow

═══════════════════════════════════
ZONE 4 — AI CHAT PANEL (300px, right side, full height)
═══════════════════════════════════
PANEL HEADER:
- "VFXB AI" title left + small green pulsing dot "Online"
- Tabs row: Info | Align | AI Chat (active, blue underline) 
  | Preview | Audio

AI CHAT BODY (scrollable):
- Welcome state: VFXB logo centered, 
  "Upload a video to get your performance score" subtitle
- AI Message card (white on dark):
  ┌─────────────────────────────┐
  │ 🔴 Hook Strength · Weak     │
  │ Your first 3 seconds lack   │
  │ motion or contrast. Viewers │
  │ drop off within 2s.         │
  │ [⚡ One-Click Fix]          │
  └─────────────────────────────┘
  Tags: red = critical, yellow = warning, green = good
- User message: right-aligned, blue bubble, avatar

CHAT INPUT BAR (pinned bottom):
- Dark input field "Ask VFXB anything..."
- Left: mic icon, Right: send arrow button (blue)
- Above input: quick action chips:
  "Analyze video" | "Fix pacing" | "Boost hook"

DROP ZONE (inside chat, above input):
- Dashed border rounded card:
  "+ Drag and drop your video here"
  small subtext "or click to upload"

═══════════════════════════════════
ZONE 5 — BOTTOM TIMELINE (full width, 200px height)
═══════════════════════════════════
TOP TOOLBAR (36px):
- Speed control slider | undo | redo | scissors | snap | 
  magnet | split icons — all subtle icon buttons

TIMELINE RULER:
- Dark #111111 bar with timecodes: 
  00:00 ··· 00:10 ··· 00:20 ··· 00:30 ··· 01:00 ···
- Blue playhead line (vertical) with triangle handle at top

TRACK ROWS (3 tracks visible):
Track 1 "Media 1 (Video)": 
  - Colorful thumbnail strip (teal/red tones), 
    lock icon, eye icon, audio icon
Track 2 "Media 2 (Voices)": 
  - Purple waveform audio clip blocks, 
    "sound1-anime" label on clip
Track 3 "Media 3 (Text)": 
  - Muted tan/beige text clip blocks, 
    "Text 1", "Text 2" labels
- Left labels column (140px): track name + icons
- Zoom slider bottom-right: — ●——— +

═══════════════════════════════════
BOTTOM STATUS BAR (28px, full width)
═══════════════════════════════════
- Left: VFXB logo small + "VFXB Studio" text
- Center tabs: ≡ Timeline | 🔗 Storyboard
- Right: version "v1.0.0" + red dot "0 errors" 
  + blue dot "BETA"

═══════════════════════════════════
COMPONENTS TO DESIGN AS SEPARATE FRAMES
═══════════════════════════════════
1. AI insight card (3 states: critical/warning/good)
2. One-Click Fix button (default + loading + done states)
3. Media thumbnail card (hover state with play overlay)
4. Timeline clip block (video / audio / text variants)
5. Performance score badge (animated glow variant)
6. Quick action chip (default + hover)
7. Icon sidebar item (default / hover / active)
8. Upload drop zone (empty + drag-over state)

═══════════════════════════════════
SPACING & GRID
═══════════════════════════════════
- Base unit: 8px
- Panel padding: 16px
- Card internal padding: 12px
- Gap between elements: 8px or 16px
- Use 8pt grid throughout