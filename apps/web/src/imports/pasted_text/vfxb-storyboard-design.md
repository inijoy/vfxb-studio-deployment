Design the STORYBOARD VIEW for "VFXB" — an AI-powered video 
editing software. This is the creative planning canvas where 
creators lay out their video scenes before editing. Inspired 
by Diffusion Studio Pro's storyboard mode but elevated with 
AI-first interactions.

═══════════════════════════════════
VISUAL STYLE (same as editor)
═══════════════════════════════════
- Background: #0A0A0A (near black, full canvas)
- Panel surfaces: #141414
- Borders: 1px #222222
- Accent: #0A84FF (blue), #00C2FF (cyan glow)
- Text: #FFFFFF primary, #5A5A5A secondary/ghost
- Font: "Inter" UI, "DM Mono" timecodes
- Subtle grain texture overlay on background (3% opacity noise)

═══════════════════════════════════
TOP BAR (40px, full width, #0D0D0D)
═══════════════════════════════════
- Far left: hamburger menu ☰ | undo ↩ | redo ↪
- Center: project title "Dark Dream · 12 Mar" 
  in white medium weight, editable on click
- Far right: zoom percentage "100%" ghost text

═══════════════════════════════════
LEFT MINI SIDEBAR (40px wide, icon only)
═══════════════════════════════════
- 3 icon tools stacked vertically, centered:
  • Select/cursor tool (arrow icon) — active state: 
    white icon inside subtle #1E1E1E rounded square
  • Text tool (T icon) — inactive: #4A4A4A
  • Frame/scene tool (rectangle-dashed icon) — inactive
- No labels, no background panel, blends into canvas

═══════════════════════════════════
MAIN CANVAS AREA (full remaining space)
═══════════════════════════════════
EMPTY STATE (default, as shown in reference):
- Pure #0A0A0A canvas, no grid lines
- Very subtle radial gradient: slightly lighter at center 
  (#0F0F0F) fading to pure black at edges
- Center of canvas — floating empty state message:
  ┌────────────────────────────────────────┐
  │  📄 Drop files  anywhere on the page   │
  │         or start with...               │
  │                                        │
  │  🖼 Generate images  📹 Generate video  │
  │  🎤 Synthesize speech  🎵 Generate music│
  └────────────────────────────────────────┘
  Style: "Drop files" is a clickable pill/chip 
  (white bg, dark text, file icon left), 
  rest is ghost #4A4A4A text
  Quick action chips below in a row: 
  each has icon + label, very subtle dark 
  outline pill, hover = slight white border glow

POPULATED STATE (show as second artboard/frame):
- 3×2 grid of scene cards floating on canvas
  (shown slightly off-center, natural arrangement)
  
  Each Scene Card:
  ┌─────────────────────┐
  │                     │  ← 16:9 preview thumbnail
  │   [scene preview]   │     (dark image/video frame)
  │                     │
  ├─────────────────────┤
  │ Scene 01  · 0:03    │  ← scene number + duration
  │ Hook — Open on face │  ← AI label in blue
  └─────────────────────┘
  
  Card specs:
  - Width: ~280px, rounded 10px
  - Background: #161616
  - Border: 1px #2A2A2A
  - Hover state: border becomes #0A84FF, 
    subtle blue glow shadow
  - Top-right corner: "⚡ Fix" chip (appears on hover)
    blue filled pill button
  - Bottom AI label: small blue dot + italic text 
    showing AI insight for that scene
  
  Scene cards arranged in loose grid with 
  24px gaps, slight drop shadow beneath each

AI SCENE SUGGESTION CARD (floats between scenes):
  ┌──────────────────┐
  │  ✦  Add Scene    │
  │  "Consider a     │
  │   B-roll cut     │
  │   here for       │
  │   retention"     │
  └──────────────────┘
  - Dashed border #333333, rounded 10px
  - Subtle blue ✦ sparkle icon top-left
  - Ghost text in #5A5A5A
  - Hover: dashed border turns blue

═══════════════════════════════════
BOTTOM AI CHAT BAR (floating, centered)
═══════════════════════════════════
OUTER CONTAINER:
- Centered horizontally, 580px wide
- Floats 24px above bottom status bar
- Background: #181818
- Border: 1px #2C2C2C
- Border-radius: 16px
- Subtle box-shadow: 0 8px 32px rgba(0,0,0,0.6)

TOP TAGS ROW (inside bar, top section):
- "nano-banana ×" — model tag chip 
  (white bg, dark text, small × close icon)
- "Add Models ⇅" — ghost outlined pill chip
- Tags sit in a flex row with 6px gap

INPUT AREA (middle):
- Placeholder: "Generate or edit assets. 
  Navigate prompt history with [ALT + Arrow Keys]"
  in #4A4A4A italic, Inter 13px
- Full-width, no visible input border inside bar

BOTTOM TOOLBAR ROW (inside bar, bottom):
Left icon group (8px gaps):
  🖼 image gen | 🎬 video gen | 🎵 audio 
  | □ 16:9 aspect | ☰ layers "1"
Right icon group:
  ↗ expand | ✦ magic | → send button
  
  Send button: #FFFFFF filled circle 28px, 
  with dark arrow icon — glows blue on hover

═══════════════════════════════════
BOTTOM STATUS BAR (28px, full width, #0D0D0D)
═══════════════════════════════════
- Left: VFXB small logo + "VFXB Studio" text
- Center tabs: 
  "≡ Timeline" (inactive) | "✦ Storyboard" (active, white)
- Right: "v1.0.0 BETA" + 
  red dot "0" errors indicator + blue dot

═══════════════════════════════════
IMPROVED FEATURES OVER REFERENCE
(include these as upgraded variants)
═══════════════════════════════════
1. SCENE FLOW VIEW (alternate layout):
   - Horizontal scrolling strip of scene cards 
     connected by animated arrow connectors →
   - Each card shows: thumbnail + duration + 
     AI score badge (colored dot 0-100)

2. AI STORYBOARD GENERATOR MODAL:
   - Center overlay modal (600px wide)
   - Dark #161616 background, 16px radius
   - Title: "✦ Generate Storyboard from Script"
   - Large textarea: "Paste your script or describe 
     your video idea..."
   - Settings row: Scene count "6" | Style "Cinematic ▾" 
     | Format "16:9 ▾"
   - Big blue "Generate Scenes" button full width

3. SCENE CARD EXPANDED STATE:
   - Selected card lifts (scale 1.02) with blue glow border
   - Right side panel slides in (240px) showing:
     • Thumbnail large preview
     • "Scene Notes" editable text
     • AI feedback: "⚡ Hook Risk · Add motion in 
       first 0.5s"
     • "Apply Fix" button

═══════════════════════════════════
COMPONENTS TO DESIGN AS FRAMES
═══════════════════════════════════
1. Scene card — empty / filled / hover / selected states
2. AI suggestion card (dashed, floating)
3. Bottom chat bar — empty state / with input
4. Model tag chip (active + removable)
5. Quick action chip (icon + label, 4 variants)
6. AI storyboard generator modal
7. Scene card expanded side panel
8. Empty canvas drop zone

═══════════════════════════════════
ARTBOARDS TO CREATE
═══════════════════════════════════
Frame 1: Storyboard — Empty State (1440x900)
Frame 2: Storyboard — Populated with 6 scenes (1440x900)  
Frame 3: Storyboard — Scene selected + side panel (1440x900)
Frame 4: Storyboard — Generator modal open (1440x900)
Frame 5: Component sheet — all UI components