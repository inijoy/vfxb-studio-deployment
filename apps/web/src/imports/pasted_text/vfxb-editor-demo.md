You are working on an already-built VFXB video editor UI. 
Your job is to make EVERY button, tab, panel, and interaction 
100% functional as a working demo. Do not redesign anything — 
only add functionality. Use mock/demo data and responses 
everywhere (no real API keys needed).

═══════════════════════════════════
1. NAVIGATION TABS (bottom status bar)
═══════════════════════════════════
- "Timeline" tab → switches to Timeline view
  Shows: video preview player, timeline tracks, 
  left assets panel, right AI chat panel
- "Storyboard" tab → switches to Storyboard view
  Shows: scene cards grid canvas, floating AI chat bar
- Active tab: white text, underline indicator
- Inactive tab: gray text
- Transition: smooth 200ms fade between views
- Currently active tab state persists on refresh (localStorage)

═══════════════════════════════════
2. LEFT ICON SIDEBAR — ALL ICONS WORKING
═══════════════════════════════════
Each icon click opens its panel in the assets area:

- Media (film icon) → shows media grid with 
  6 mock video/image/audio thumbnails
  Each thumbnail: colored gradient placeholder, 
  filename, duration badge, hover play overlay
  
- Text (T icon) → shows text tools panel:
  - Font selector dropdown (mock fonts: Syne, DM Sans, 
    Playfair, Oswald, Bebas Neue)
  - Font size slider (8px–120px)
  - Bold / Italic / Underline toggle buttons
  - Color picker (8 preset swatches + custom)
  - Alignment buttons: left / center / right
  - "Add Text to Timeline" button → adds text 
    clip to timeline track 3

- Shapes (rectangle icon) → shows shapes panel:
  - Shape buttons: Rectangle, Circle, Triangle, 
    Line, Arrow, Star (6 buttons in 2x3 grid)
  - Each click highlights active shape
  - Fill color picker + Stroke color picker
  - Opacity slider (0–100%)
  - "Add to Canvas" button

- Transitions (layers icon) → shows transitions panel:
  - Grid of 8 transition cards with names:
    Fade, Wipe, Zoom, Slide, Dissolve, 
    Blur, Spin, Glitch
  - Each card: animated CSS preview on hover 
    (small 40x40px preview box)
  - Click to select → shows blue border
  - "Apply to Selection" button

- Music (waveform icon) → shows music panel:
  - Search bar: "Search sounds..."
  - Mock results list (5 tracks):
    🎵 "Epic Intro" · 0:32 · Cinematic
    🎵 "Chill Beats" · 1:04 · Lo-fi  
    🎵 "Hype Drop" · 0:18 · Trap
    🎵 "Emotional Rise" · 0:45 · Ambient
    🎵 "Fast Energy" · 0:22 · Electronic
  - Each row: play/pause button (toggles), 
    title, duration, genre tag, "+" add button
  - "+ Add" → adds audio clip to Timeline track 2

- Effects (sparkle icon) → shows effects panel:
  - Section "Color Effects":
    Brightness slider, Contrast slider, 
    Saturation slider, Temperature slider
    All range inputs (0–200, default 100)
  - Section "Filters":
    6 filter buttons: None, Cinematic, 
    Vintage, Cold, Warm, B&W
    Active filter: blue border
  - "Apply Effects" button → shows toast 
    "Effects applied ✓"

- Color (palette icon) → shows color grading panel:
  - RGB curve placeholder (visual only, 3 colored lines)
  - Shadows / Midtones / Highlights sliders
  - Vignette slider (0–100%)
  - "Reset" button + "Apply" button

- Settings (gear icon, bottom) → opens Settings modal:
  - Project Name input (editable)
  - Resolution dropdown: 1080p / 4K / 720p / 9:16 / 1:1
  - Frame rate: 24fps / 30fps / 60fps
  - Auto-save toggle (on/off)
  - "Save Settings" button → toast "Saved ✓"

═══════════════════════════════════
3. RIGHT AI CHAT PANEL — FULLY WORKING
═══════════════════════════════════

TABS ROW (Info / Align / AI Chat / Preview / Audio):

- "Info" tab → shows mock video info:
  - Filename: "my-video.mp4"
  - Duration: 00:03:24
  - Resolution: 1920x1080
  - File size: 248 MB
  - Format: MP4 H.264
  - Frame rate: 30fps
  - Performance Score: animated donut chart 
    showing 84/100 in blue

- "Align" tab → shows alignment tools:
  - 6 alignment buttons in 2x3 grid:
    Align Left, Align Center, Align Right,
    Align Top, Align Middle, Align Bottom
  - Distribute Horizontal + Distribute Vertical buttons
  - All buttons show active state on click

- "AI Chat" tab (DEFAULT active) → full working chatbot:
  See section 4 below for full chatbot spec

- "Preview" tab → shows export preview:
  - Mock video thumbnail (dark gradient placeholder)
  - Resolution selector: 1080p / 720p / 4K
  - Format: MP4 / MOV / GIF / WebM
  - Quality: Low / Medium / High / Ultra
  - Estimated size: updates dynamically based on selections
  - "Export Now" button → shows progress bar 
    animation (0→100% over 3 seconds) then 
    "Export Complete ✓" toast

- "Audio" tab → shows audio mixer:
  - 3 channel strips:
    "Video Audio" — volume slider + mute button
    "Music Track" — volume slider + mute button  
    "Voice Track" — volume slider + mute button
  - Master volume slider at bottom
  - Mute buttons toggle opacity to 0.4

═══════════════════════════════════
4. AI CHATBOT — FULL DEMO FUNCTIONALITY
═══════════════════════════════════

AGENT SELECTOR (top of chat panel):
- Dropdown button showing current agent: "VFXB Engine ▾"
- Click opens agent selection dropdown menu with sections:

  ── VFXB ──
  ✦ VFXB Engine (DEFAULT, blue checkmark)
    "Optimized for viral video analysis"

  ── Google ──  
  ◆ Gemini 2.0 Flash
  ◆ Gemini 1.5 Pro
  ◆ Gemini 1.5 Flash

  ── OpenAI ──
  ● GPT-4o
  ● GPT-4 Turbo
  ● GPT-3.5 Turbo

  ── Anthropic ──
  ◎ Claude 3.5 Sonnet
  ◎ Claude 3 Opus
  ◎ Claude 3 Haiku

  ── Audio / Music ──
  ♪ Suno v4 · Music Generation
  ♪ Udio · Music Generation
  ♪ ElevenLabs · Voice Synthesis

  ── Video ──
  ▶ Runway Gen-3 · Video Generation
  ▶ Pika 2.0 · Video Generation
  ▶ Kling AI · Video Generation

- Click any model → closes dropdown, updates 
  agent button label to selected model name
- Each model has a colored dot indicator:
  VFXB=blue, Google=teal, OpenAI=green, 
  Anthropic=orange, Audio=purple, Video=pink

CHAT MESSAGES — MOCK RESPONSES:
All responses are pre-written mock data.
Each agent has unique response style.

When user sends ANY message → 
show typing indicator (3 animated dots, 800ms) 
then show response based on active agent:

VFXB Engine responses (rotate through these):
[1] Shows insight card:
    🔴 Hook Strength · Critical
    "Your first 3 seconds show static framing. 
    Viewers drop off 73% faster without motion 
    in the opening frame."
    [⚡ One-Click Fix] button

[2] Shows insight card:
    🟡 Pacing · Needs Work  
    "Average cut every 8.2 seconds. Top-performing 
    videos in your niche cut every 2.4 seconds."
    [⚡ One-Click Fix] button

[3] Shows insight card:
    🟢 Audio Sync · Good
    "Music BPM matches your edit rhythm well. 
    This improves retention by ~18%."
    [✓ Looks Good] button

[4] Text response:
    "Based on 100M+ video analysis, your thumbnail 
    has strong contrast but lacks a human face. 
    Videos with faces in thumbnails get 34% more clicks."

Gemini responses: 
    "I've analyzed your video structure. The narrative 
    arc peaks too early at 0:45. Consider moving your 
    strongest moment to the 60% mark for maximum impact."

GPT-4o responses:
    "Your caption timing is off by ~0.3s on 3 clips. 
    I can auto-sync them. Also detected background 
    noise at 1:23 — want me to remove it?"

Claude responses:
    "The color grading shifts noticeably at 2:14 — 
    likely a different recording session. A LUT 
    correction would unify the look."

Suno responses:
    "Generated 3 music options for your video mood:
    🎵 Track A — Cinematic Build · 3:24
    🎵 Track B — Energetic Pop · 2:58  
    🎵 Track C — Emotional Ambient · 4:01
    [Preview] buttons for each"

Kling AI / Runway responses:
    "Ready to generate a video clip. Describe the 
    scene you want, I'll create a 4-second preview."

ONE-CLICK FIX button behavior:
- Click → button shows spinner for 1.5s
- Then changes to "✓ Fixed" in green
- Shows toast notification: "Fix applied to timeline"
- Adds a visual marker to the timeline at relevant position

QUICK ACTION CHIPS (above input bar):
- "⚡ Analyze Video" → sends "Analyze my video for viral potential"
- "✂ Fix Pacing" → sends "Fix the pacing of my video"
- "🎵 Add Music" → switches agent to Suno, sends "Suggest music"
- "🔥 Boost Hook" → sends "How do I improve my hook?"
- Chips hide after use, reappear on next session

UPLOAD DROP ZONE (inside chat):
- Dashed border card "Drop your video here"
- Click → file input opens (accept video/*)
- After "upload" (fake, 2s delay): 
  shows thumbnail placeholder + filename
  then auto-triggers analysis message from VFXB Engine

═══════════════════════════════════
5. VIDEO TIMELINE — FULLY INTERACTIVE
═══════════════════════════════════

PLAYBACK CONTROLS:
- ⏮ Skip to start → moves playhead to 0:00
- ⏭ Skip to end → moves playhead to end
- ▶/⏸ Play/Pause → toggles play state
  When playing: playhead moves across timeline 
  in real-time (CSS animation, 30s duration)
  timecode display updates every second: 
  00:00:01, 00:00:02 etc.
- When playing: ▶ icon changes to ⏸

PLAYHEAD:
- Draggable yellow/white vertical line
- Click anywhere on timeline ruler → playhead jumps there
- Timecode display (bottom-left) updates on drag
  Format: 00:00:00.000

ZOOM CONTROLS (bottom right of timeline):
- "-" button → zooms out (fewer seconds visible, max zoom out = 2x)
- "+" button → zooms in (more detail, max zoom in = 8x)
- Slider between them → drag to set zoom level

TRACK ROWS (3 tracks):
Each track has:
- Left label column (140px): track name + 3 icons
  🔊 mute toggle (click → icon grays out, track opacity 0.5)
  👁 visibility toggle (click → track clips hide/show)
  🔒 lock toggle (click → prevents editing)

Track 1 "Media 1 (Video)":
- 2 mock video clip blocks (teal colored)
- Clips are draggable left/right within track
- Click clip → shows selected state (brighter border)
- Selected clip shows handles on left/right edges for trim
- Right-click clip → context menu: 
  Cut | Copy | Delete | Speed | Properties

Track 2 "Media 2 (Audio)":  
- 2 purple waveform audio blocks
- Same interactions as video clips
- Shows "sound1" and "sound2" labels

Track 3 "Media 3 (Text)":
- 2 beige text clip blocks
- "Text 1" and "Text 2" labels

ADD TRACK button (+):
- Click → adds new empty track row below existing tracks
- New track labeled "Track 4", "Track 5" etc.

═══════════════════════════════════
6. STORYBOARD VIEW — FULLY WORKING
═══════════════════════════════════

SCENE CARDS (6 mock scenes in 3x2 grid):
Each card clickable → shows selected state (blue border glow)
Clicking selected card → opens side panel (slides in from right)

Side panel shows:
- Large scene thumbnail
- "Scene 01" title (editable, click to rename)
- Duration input: "0:03" (editable)
- Notes textarea: "Add scene notes..."
- AI Feedback section:
  colored insight card (same style as chat)
- "Apply Fix" button
- "Delete Scene" button (red, with confirm)

ADD SCENE button (+ card in grid):
- Click → adds new empty scene card
- New card shows "Scene 07" with gray placeholder
- Animate in with scale 0.8 → 1.0

DRAG TO REORDER scenes:
- Scenes are draggable within the grid
- Drop zone highlight (dashed blue border) 
  appears when dragging over valid position

AI GENERATOR MODAL:
- "✦ Generate Storyboard" button (top bar) → opens modal
- Modal fields:
  Script textarea: "Describe your video idea..."
  Scene count: number input (default 6, min 1 max 12)
  Style: dropdown (Cinematic / Vlog / Documentary / 
         Short-form / Tutorial)
  Format: 16:9 / 9:16 / 1:1
- "Generate Scenes" button → 
  shows loading spinner 2s, 
  then populates grid with 6 new mock scene cards
  with AI-generated scene descriptions

BOTTOM FLOATING CHAT BAR:
- Typing in input + Enter → shows AI response 
  as floating toast above the bar
- "Add Models" chip → opens same agent 
  dropdown as the main chat panel
- All bottom toolbar icons are clickable 
  with visual active state

═══════════════════════════════════
7. GLOBAL BEHAVIORS
═══════════════════════════════════

TOAST NOTIFICATIONS:
- All action confirmations show a toast 
  (bottom-right, dark pill, 2.5s auto-dismiss)
  Examples: "Fix applied ✓", "Track muted", 
  "Scene added", "Settings saved ✓"

KEYBOARD SHORTCUTS:
- Space → Play/Pause timeline
- Cmd/Ctrl+Z → Undo (show "Undo" toast)
- Cmd/Ctrl+S → Save (show "Saved ✓" toast)
- Escape → Close any open modal/dropdown

PERFORMANCE SCORE BADGE (top of video preview):
- Shows "⚡ 84 / 100" 
- Click → opens AI Chat tab and shows 
  full breakdown message with 5 insight cards

EMPTY STATE (no video uploaded):
- Video preview area shows drop zone:
  "Drop your video here to get started"
  with Upload button below
- After mock upload: shows black preview 
  with play controls enabled