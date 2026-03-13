Design the VFXB Studio interface — a $100B AI video 
intelligence platform. This is NOT a video editor.
This is an AI Director with a conversation interface.
The editing tools are secondary. The intelligence is primary.

Desktop app, 1440x900px. Dark theme. 
Inspired by: Linear + Vercel + Diffusion Studio.
Not inspired by: Adobe, CapCut, iMovie.

═══════════════════════════════════════
VISUAL IDENTITY
═══════════════════════════════════════
Background:      #070707
Surface 1:       #0E0E0E
Surface 2:       #141414
Surface 3:       #1A1A1A
Border subtle:   #1E1E1E
Border medium:   #2A2A2A
Accent blue:     #0A84FF
Accent glow:     rgba(10,132,255,0.15)
Accent cyan:     #00D4FF
Success green:   #30D158
Warning yellow:  #FFD60A
Alert red:       #FF453A
Text primary:    #FFFFFF
Text secondary:  #666666
Text ghost:      #333333

Fonts:
  Display/Logo:  "Syne" — 800 weight
  UI Labels:     "DM Sans" — 400/500/600
  Timecodes:     "JetBrains Mono" — 400
  
Border radius:
  Cards:         12px
  Buttons:       8px
  Pills/chips:   999px
  Input bars:    14px

Shadows:
  Card:     0 1px 3px rgba(0,0,0,0.4)
  Elevated: 0 8px 32px rgba(0,0,0,0.6)
  Glow:     0 0 24px rgba(10,132,255,0.2)

═══════════════════════════════════════
SCREEN 1 — HOME / UPLOAD STATE (1440x900)
═══════════════════════════════════════
Full #070707 canvas.

TOP BAR (40px):
Left:  VFXB hexagon logo (24px, blue glow) + 
       "VFXB" wordmark in Syne 800
Right: "Dashboard" ghost link | "Docs" ghost link |
       Avatar chip: [👤 Creator] with green online dot |
       "Upgrade ✦" pill button (border: #0A84FF, 
       text: #0A84FF, hover: fills blue)

CENTER HERO (vertically centered):
Large VFXB hex logo (64px, strong blue glow pulse animation)
H1 (40px Syne 800): "Your AI Video Director"
Subtext (15px DM Sans #666): 
  "Upload your video. Tell VFXB what you want. 
   Watch it happen."

Upload zone (600px wide, centered):
┌──────────────────────────────────────────────┐
│                                              │
│         ↑  Drop your video here              │
│                                              │
│   mp4  ·  mov  ·  webm  ·  up to 10GB       │
│                                              │
│         [ Browse Files ]                     │
│                                              │
└──────────────────────────────────────────────┘
Border: 1px dashed #2A2A2A, radius 16px
Hover state: border color #0A84FF, 
             background rgba(10,132,255,0.03)
"Browse Files" = white filled pill button

OR divider line with "or paste a link" text

URL input bar (500px wide, centered):
[ 🔗  Paste YouTube, Drive, or Dropbox link...  →]
Dark background #0E0E0E, border #1E1E1E, radius 12px
Arrow send button right side (blue circle)

CREATOR MODE SELECTOR (below upload, 32px gap):
Label: "I'm creating for:" in #444 12px
Three mode cards in a row (160px each):
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  🎬          │  │  ⚡          │  │  🏢          │
│  Long-form   │  │  Short-form  │  │  Agency      │
│  YouTube     │  │  TikTok /    │  │  Client      │
│  Podcasts    │  │  Reels       │  │  Work        │
└──────────────┘  └──────────────┘  └──────────────┘
Default selected: Long-form (blue border)
Inactive: #0E0E0E border #1E1E1E
Hover: border #444

SOCIAL PROOF BAR (very bottom, 24px from bottom):
"12,000+ creators  ·  2.1M videos analyzed  ·  
 Avg. virality lift +34%  ·  ⭐ 4.9/5 on Product Hunt"
All in #333 11px DM Sans, centered

═══════════════════════════════════════
SCREEN 2 — MAIN STUDIO (1440x900)
═══════════════════════════════════════
Two-column layout only.
No timeline visible. No asset panel. 
Clean intelligence, hidden complexity.

LEFT PANEL (400px fixed, full height):
  Background: #0A0A0A
  Right border: 1px #1A1A1A

RIGHT PANEL (remaining ~1040px):
  Background: #070707
  Video preview only.

──────────────────────────────
LEFT PANEL — TOP SECTION
──────────────────────────────
PANEL HEADER (52px, border-bottom #1A1A1A):
Left: "AI Director" in 11px DM Sans 600 
      uppercase tracking-widest #444
Right: Two icon buttons (minimize, settings)

VIDEO INTELLIGENCE CARD (margin 12px):
Background: #0E0E0E, border #1E1E1E, radius 12px
Padding: 14px

Row 1: Video thumbnail (48x27px rounded 6px 
        dark placeholder) + info:
  Filename: "my-video.mp4" 14px white 500
  Meta: "03:24  ·  1080p  ·  30fps" 
        11px #444 mono

Row 2 (12px gap below):
VIRALITY SCORE section:
Label: "VIRALITY SCORE" 9px #444 uppercase tracking

Score display:
Large number "84" in 36px Syne 800 
color: #30D158 (green, >75)
"/100" in 20px #444

Horizontal score bar (full width, 6px height):
Background: #1A1A1A, radius 3px
Fill: gradient left #30D158 to #00D4FF, 84% width
Animated on load: 0% → 84% over 1.2s ease-out

Below bar: "Top 12% in your niche · Long-form" 
           in 11px #555

Row 3:
[▶ Watch Full Analysis] button
Full width, border #1E1E1E, background #141414, 
12px radius, 11px white text, left play icon

──────────────────────────────
LEFT PANEL — AI BRIEFING CARDS
(auto-generated, appear before user types)
──────────────────────────────
Section label: "VFXB FOUND 3 ISSUES" 
9px #444 uppercase, padding 12px 12px 8px

Card 1 — Critical:
Background: rgba(255,69,58,0.06)
Border: 1px rgba(255,69,58,0.2), radius 10px
Margin: 0 10px 6px

Left accent bar: 3px #FF453A, full height, radius 2px

Content (padding 10px 10px 10px 14px):
Top row: "🔴 Hook  ·  0:00–0:03" 
         left in 11px white 600
         "Critical" pill right 
         (background rgba(255,69,58,0.15), 
          text #FF453A, 9px, radius 999px)

Body (10px #888 DM Sans, 12px line-height):
"Static opening. No motion or face detected. 
 71% of viewers leave in the first 3 seconds."

Bottom row (8px gap top):
[⚡ Fix This Now] — 
  background #0A84FF, text white, 
  10px DM Sans 600, padding 5px 12px, radius 6px
[Tell me more] — 
  ghost text #555, 10px, no border

Card 2 — Warning:
Background: rgba(255,214,10,0.04)
Border: 1px rgba(255,214,10,0.15)
Left accent: 3px #FFD60A
Badge: "Warning" yellow
Content: "🟡 Pacing  ·  0:45–1:20"
"35-second segment with no cuts. 
 Retention drops 40% in this window."
Buttons: [⚡ Fix This Now] [Tell me more]

Card 3 — Good:
Background: rgba(48,209,88,0.04)
Border: 1px rgba(48,209,88,0.12)
Left accent: 3px #30D158
Badge: "Good" green
Content: "🟢 Audio Sync"
"Music BPM matches edit rhythm. 
 Retention boost: ~18%."
Button: [✓ Looking Good] 
  (background rgba(48,209,88,0.1), text #30D158)

──────────────────────────────
LEFT PANEL — CHAT THREAD
(below cards, scrollable, flex-grow)
──────────────────────────────
VFXB message (left aligned):
Background: #111111, border #1A1A1A, radius 10px
Padding: 10px 12px
Text: 13px DM Sans #CCCCCC, line-height 1.5

Action buttons inside message:
[▶ Preview Change]  [↩ Undo]
Side by side, ghost outlined pills 10px

User message (right aligned):
Background: #0A84FF, radius 10px
Text: white 13px, padding 8px 12px
Max-width: 80% of panel width

TYPING INDICATOR (VFXB is thinking):
3 animated dots in a row, #444
Pulse animation staggered 200ms each

──────────────────────────────
LEFT PANEL — BOTTOM (pinned)
──────────────────────────────
AGENT SELECTOR BAR (32px, border-top #1A1A1A,
border-bottom #1A1A1A, padding 0 12px):
Left: Active agent pill:
  [✦ VFXB Engine ▾]
  Background #141414, border #222,
  blue ✦ icon, "VFXB Engine" in 11px white,
  "▾" dropdown arrow in #444
  Click → full dropdown (see component below)

Right: Model status dot:
  Green dot + "Online" in 10px #555

CHAT INPUT BAR (padding 10px 12px 12px):
Main input container:
Background #0E0E0E, border #1E1E1E, 
radius 12px, padding 10px 12px

Placeholder text (13px #333 italic):
"Cut everything after the 2 minute mark..."
(rotates every 4s through 6 example prompts)

Bottom of input container:
Left icons row (gap 2px):
  🎤 voice | 📎 attach | 🌐 web search
  All 16px #333, hover #888

Right: Send button:
  28px circle, background #0A84FF,
  white arrow icon ↑, hover glow

QUICK CHIPS (above input, 8px gap, 
scrollable horizontal if overflow):
[Fix all issues] [Make TikTok cut] 
[Add captions] [Remove silences] [Boost hook]
Each: background #111, border #1E1E1E, 
      10px DM Sans #666, radius 999px, 
      padding 4px 10px
Hover: border #0A84FF, text white

──────────────────────────────
RIGHT PANEL — VIDEO PREVIEW
──────────────────────────────
Centered video player (16:9, max-width 720px,
vertically centered in panel):

Video frame: background #000, radius 12px,
subtle box-shadow 0 20px 60px rgba(0,0,0,0.8)

Minimal control bar (below video, 44px):
Background #0E0E0E, radius 0 0 12px 12px,
border-top #1A1A1A

[  ▶  ]  0:00  [────────────────]  3:24  [🔊]
Play btn 32px circle #141414 border #2A2A2A
Progress bar: #1A1A1A track, #0A84FF fill
Time in JetBrains Mono 11px #555
Volume icon right

TOP-RIGHT of video (absolute positioned):
Score badge pill:
"⚡ 84" background #0A84FF, white 11px Syne 700
Subtle glow: 0 0 12px rgba(10,132,255,0.4)

TOP-LEFT of video (absolute positioned):
Mode switcher:
[🎬 Long-form ▾]
Background rgba(0,0,0,0.7), backdrop-blur,
border rgba(255,255,255,0.1), radius 8px,
white 11px, click opens dropdown

BEFORE/AFTER COMPARISON VIEW
(appears when AI makes an edit):
Video splits into two halves
Left: "Before" label (white pill, top-left)
Right: "After" label (blue pill, top-right)
Center: vertical drag handle (white line + 
        drag icon, moves left/right)
Bottom: [✓ Keep This] [✗ Revert]
  Keep: green background
  Revert: #141414 border #333

TOOLS DRAWER (hidden, slides up from bottom):
Triggered ONLY when AI opens it or 
user types "show timeline":
Height: 260px, background #0A0A0A, 
border-top #1A1A1A
Contains minimal timeline (3 tracks)
[× Close Editor] button top-right

═══════════════════════════════════════
COMPONENT: AGENT SELECTOR DROPDOWN
═══════════════════════════════════════
Width: 280px
Background: #0F0F0F
Border: 1px #222
Radius: 12px
Shadow: 0 16px 48px rgba(0,0,0,0.8)
Padding: 6px 0

Search bar inside top:
[🔍 Search models...]
Background #161616, border #1E1E1E, 
radius 8px, margin 6px 8px, 
11px placeholder #444

Sections (label + items):

── VFXB ────────────────────
[✦ VFXB Engine]          DEFAULT
  Blue hex icon, "VFXB Engine" white 12px,
  "Best for virality + NLP editing" #555 10px
  Right: blue checkmark (if active)

── Language Models ──────────
[●] GPT-4o · OpenAI         green dot
[●] GPT-4 Turbo · OpenAI    green dot  
[◆] Gemini 2.0 Flash · Google  teal dot
[◆] Gemini 1.5 Pro · Google    teal dot
[◎] Claude 3.5 Sonnet · Anthropic  orange dot
[◎] Claude 3 Opus · Anthropic    orange dot

── Music Generation ─────────
[♪] Suno v4 · AI Music       purple dot
[♪] Udio · AI Music           purple dot
[🎤] ElevenLabs · Voice Synthesis  violet dot

── Video Generation ─────────
[▶] Kling AI · Video         pink dot
[▶] Runway Gen-4 · Video      pink dot
[▶] Pika 2.0 · Video         pink dot

Each row: 34px height, padding 0 10px,
hover: background #161616
Active: background rgba(10,132,255,0.08), 
        left 2px blue border

Section labels: 9px #333 uppercase, 
padding 8px 10px 4px, not clickable

═══════════════════════════════════════
SCREEN 3 — THE 8 POWER FEATURES PANEL
(accessed via "✦ Features" tab or 
"What else can you do?" in chat)
═══════════════════════════════════════
Full-screen overlay, dark background
Close button top-right [×]

Title: "VFXB can do all of this" 
       24px Syne 800, center aligned

8 feature cards in 4x2 grid (280px each):

Card 1: NLP LONGFORM DIRECTOR
Icon: large 🧠 in blue circle
Title: "Talk to Edit"
Body: "Describe any change in plain English. 
      VFXB understands context across 
      your entire video, not just one clip."
Tag: "CORE FEATURE" blue pill

Card 2: VIRALITY ENGINE
Icon: 🔥
Title: "Virality Score"
Body: "Analyzed against 100M+ videos. 
      Know exactly what will and won't 
      perform before you publish."
Tag: "PROPRIETARY"

Card 3: AUTONOMOUS AGENT
Icon: 🤖
Title: "Set It, Walk Away"
Body: "Tell VFXB your goal. It uploads, 
      edits, captions, and publishes 
      across all platforms automatically."
Tag: "COMING SOON" yellow

Card 4: CREATOR DNA
Icon: 🧬
Title: "It Learns Your Style"
Body: "After 3 videos, VFXB knows your 
      pacing, tone, and editing style. 
      Every edit feels like you."
Tag: "BETA"

Card 5: PLATFORM OPTIMIZER
Icon: 📱
Title: "One Video, Six Formats"
Body: "Auto-reformats for YouTube, TikTok, 
      Instagram, LinkedIn, Twitter/X, and 
      Shorts — perfectly sized and paced."
Tag: "CORE FEATURE"

Card 6: AUDIENCE SIMULATION
Icon: 📊
Title: "See Future Retention"
Body: "Predicts your viewer drop-off curve 
      before publishing. Know exactly when 
      you'll lose your audience."
Tag: "PROPRIETARY"

Card 7: REAL-TIME COLLAB
Icon: 👥
Title: "Edit Together"  
Body: "Invite your team. Everyone chats 
      with VFXB simultaneously. Conflicts 
      resolved by AI automatically."
Tag: "COMING SOON"

Card 8: ENTERPRISE API
Icon: 🔌
Title: "Plug In Anywhere"
Body: "REST API for studios and agencies. 
      Automate 1000s of videos. 
      White-label available."
Tag: "ENTERPRISE"

Card style:
Background #0E0E0E, border #1A1A1A,
radius 14px, padding 20px
Hover: border #0A84FF, 
       shadow 0 0 24px rgba(10,132,255,0.1)
Tag pills: tiny 9px colored pills top-right

═══════════════════════════════════════
SCREEN 4 — COMPETITOR COMPARISON PAGE
(shown in investor/pitch mode or 
"Why VFXB?" button on homepage)
═══════════════════════════════════════
Center of screen:
Title: "Nobody does what we do." 
       32px Syne 800

Comparison table (800px wide, centered):

              VFXB   Adobe  Descript  CapCut  Runway
NLP Editing    ✓       ✗       ✗        ✗       ✗
Longform AI    ✓       ✗       ✗        ✗       ✗
Virality Score ✓       ✗       ✗        ✗       ✗
Auto-Publish   ✓       ✗       ✗        ✓       ✗
Creator DNA    ✓       ✗       ✗        ✗       ✗
Talk to Edit   ✓       ✗       ✓*       ✗       ✗
Multi-platform ✓       ✗       ✗        ✓       ✗
Collab         ✓       ✓       ✓        ✗       ✗

✓ = #30D158 filled circle icon
✗ = #1E1E1E filled circle, #333 color
*partial = yellow circle

VFXB column header: blue background, white text, 
"VFXB" in Syne 800, slight elevation

Below table: 
"*Descript offers text-based editing for 
 talking-head videos only. Not longform NLP."
10px #444 italic

═══════════════════════════════════════
ARTBOARDS TO CREATE
═══════════════════════════════════════
Frame 1:  Home / Upload — Empty state (1440x900)
Frame 2:  Studio — Video loaded, AI briefing (1440x900)
Frame 3:  Studio — Active conversation (1440x900)
Frame 4:  Studio — Before/After comparison (1440x900)
Frame 5:  Studio — Tools drawer open (1440x900)
Frame 6:  Features overview panel (1440x900)
Frame 7:  Competitor comparison (1440x900)
Frame 8:  Component sheet (all UI components)

═══════════════════════════════════════
COMPONENTS TO BUILD IN FRAMES
═══════════════════════════════════════
1. Score bar (3 states: good/warning/critical)
2. AI insight card (3 severity states)
3. One-Click Fix button (default/loading/done)
4. Agent selector dropdown (full)
5. Quick action chip (default/hover/used)
6. Before/After comparison slider
7. Video intelligence card
8. Feature card (8 variants)
9. Chat bubble — VFXB style
10. Chat bubble — User style
11. Typing indicator
12. Mode selector card (3 variants)
13. Upload drop zone (empty/hover/uploading)
14. Tools drawer (collapsed/open)