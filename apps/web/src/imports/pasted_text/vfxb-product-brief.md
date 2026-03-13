Build VFXB — an AI-first video intelligence platform. 
The core experience is a CONVERSATION, not an editing suite.
The user talks to VFXB like a director talks to an editor.
Editing tools exist but are HIDDEN until the AI decides 
they're needed or the user asks for them.

This is NOT Adobe Premiere. This is NOT CapCut.
The closest analogy: "ChatGPT that understands your video 
and edits it for you through natural language."

The unique value: NLP layer for longform video.
No competitor offers this. You talk. It edits.

═══════════════════════════════════
CORE PHILOSOPHY — EMBED IN EVERY DESIGN DECISION
═══════════════════════════════════
- The chat IS the editor
- Every edit happens through conversation first
- Manual tools are the fallback, not the default
- The AI speaks first, the user reacts
- Complexity is hidden. Intelligence is visible.
- Tone: calm, confident, like a world-class editor
  sitting next to you

═══════════════════════════════════
SCREEN 1 — UPLOAD / ONBOARDING STATE
(First thing user sees)
═══════════════════════════════════
Full dark canvas #080808.
Center of screen, vertically and horizontally:

Large VFXB hexagon logo (glowing blue, 48px)
Headline (32px, bold): "Drop your video. Tell me what you want."
Subtext (14px, #666): 
  "VFXB analyzes your footage and edits it 
   through conversation. No timelines. No menus."

Below: Two upload options side by side:
┌─────────────────────┐  ┌─────────────────────┐
│  📁 Upload Video    │  │  🔗 Paste URL        │
│  mp4, mov, webm     │  │  YouTube, Drive,     │
│  up to 10GB         │  │  Dropbox             │
└─────────────────────┘  └─────────────────────┘
Dashed borders, rounded 12px, hover = blue glow

Below that, three mode chips:
  [🎬 Long-form]  [⚡ Short-form]  [🏢 Agency]
  User selects their mode — this changes how 
  VFXB communicates and what it prioritizes

Bottom ghost text: 
  "Trusted by 12,000+ creators · 
   Analyzed 2.1M videos · 
   Average virality score lift: +34%"

═══════════════════════════════════
SCREEN 2 — MAIN INTERFACE (after upload)
═══════════════════════════════════
Layout: Two columns only.

LEFT COLUMN (420px, fixed):
  The entire AI experience lives here.
  This is the "brain" of VFXB.

RIGHT COLUMN (remaining width):
  Video preview only.
  Clean. Minimal. No clutter.

No sidebar. No asset panel. No timeline visible.
Those appear only when the AI calls them.

═══════════════════════════════════
LEFT COLUMN — AI DIRECTOR PANEL
═══════════════════════════════════

TOP SECTION — VIDEO INTELLIGENCE CARD:
┌────────────────────────────────────┐
│  [thumbnail]  my-video.mp4         │
│               03:24 · 1080p · 30fps│
│                                    │
│  VIRALITY SCORE                    │
│  ████████░░  84/100                │
│  Top 12% of videos in your niche   │
│                                    │
│  [▶ Watch Analysis]                │
└────────────────────────────────────┘
Score bar animates on load (0 → 84, 1.2s ease-out)
Color: green if >75, yellow if 50-74, red if <50

BELOW CARD — AI BRIEFING (auto-generated, appears first):
VFXB speaks first, before the user types anything.
Shows 3 insight cards stacked:

Card 1 (most critical issue):
┌────────────────────────────────────┐
│ 🔴  Hook · 0:00–0:03               │
│  Static opening. No motion,        │
│  no face, no text. 71% of viewers  │
│  leave in the first 3 seconds.     │
│                                    │
│  [⚡ Fix This Now]  [Tell me more] │
└────────────────────────────────────┘

Card 2:
┌────────────────────────────────────┐
│ 🟡  Pacing · 0:45–1:20            │
│  35-second segment with no cuts.   │
│  Retention drops 40% here.         │
│                                    │
│  [⚡ Fix This Now]  [Tell me more] │
└────────────────────────────────────┘

Card 3:
┌────────────────────────────────────┐
│ 🟢  Audio Sync · Good              │
│  Music matches edit rhythm.        │
│  Retention boost: ~18%             │
│                                    │
│  [✓ Nice]                          │
└────────────────────────────────────┘

CHAT THREAD (below cards, scrollable):
When user types or clicks Fix/Tell me more:
- VFXB responds in conversational bubbles
- VFXB messages: left-aligned, dark card #161616
- User messages: right-aligned, blue #0A84FF bubble
- No avatars. Clean and minimal.

VFXB message style example:
┌────────────────────────────────────┐
│ I trimmed 4 seconds from your      │
│ intro and added a zoom-in on       │
│ frame 1. Want to see the before    │
│ and after?                         │
│                                    │
│ [▶ Preview Change]  [Undo]         │
└────────────────────────────────────┘

VFXB can say things like:
- "I found 3 dead spots in your video. 
   Fix all of them?" [Yes, fix all] [Show me first]
- "Your thumbnail has no face. 
   I can auto-generate one from your footage."
- "This video is optimized for YouTube. 
   Want a 60-second version for TikTok too?"
- "I noticed a jump cut at 2:14 that feels rough. 
   I added a 0.3s transition. Better?"

AGENT SELECTOR (above input bar):
Compact row showing current agent:
  [✦ VFXB Engine ▾]
Click → dropdown with all models grouped:

  ── VFXB ──────────────────
  ✦ VFXB Engine · DEFAULT
    Best for virality analysis
    + longform NLP editing

  ── Language Models ────────
  ● GPT-4o · OpenAI
  ◆ Gemini 2.0 Flash · Google
  ◎ Claude 3.5 Sonnet · Anthropic

  ── Music Generation ───────
  ♪ Suno v4 · AI Music
  ♪ Udio · AI Music
  🎤 ElevenLabs · Voice

  ── Video Generation ───────
  ▶ Kling AI · Video
  ▶ Runway Gen-3 · Video
  ▶ Pika 2.0 · Video

Active model shown with blue dot + checkmark.
Switching model → chat shows:
  "Switched to GPT-4o. Ask me anything."

CHAT INPUT BAR (pinned to bottom of left column):
Dark pill input, 56px height:
  Placeholder rotates every 4s between:
  · "Tell me what you want to change..."
  · "Cut everything after the 2 minute mark"
  · "Make a 60-second TikTok version"
  · "Remove all silences automatically"  
  · "Add captions in my brand font"
  · "Find the best 30 seconds for a trailer"

Right side of input: 
  🎤 mic button (voice input)
  ↑ send button (blue circle)

ABOVE INPUT — contextual quick chips
(change based on what AI just said):
  After analysis: 
    [Fix all issues] [Prioritize hook] [Export as-is]
  After a fix:
    [Preview] [Undo] [Fix next issue]
  After export suggestion:
    [Export 16:9] [Make TikTok cut] [Make Trailer]

═══════════════════════════════════
RIGHT COLUMN — VIDEO PREVIEW
═══════════════════════════════════
Clean 16:9 video player.
Black background. Rounded 12px corners.
Subtle vignette on edges.

Minimal playback bar at bottom:
  ▶  0:00 ──────────────── 3:24  🔊

TOP RIGHT of preview:
  Score badge: "⚡ 84" (blue pill, click = opens analysis)
  
  Mode switcher (top right corner):
  [🎬 Long-form]  [⚡ Short-form]
  Switching shows toast:
  "Switched to short-form mode. 
   VFXB will now optimize for 60s max."

WHEN AI MAKES AN EDIT:
  Split preview appears automatically:
  Left half: "Before" label + original
  Right half: "After" label + edited
  Draggable divider between them
  Below: [✓ Keep This]  [✗ Revert]

TOOLS DRAWER (hidden by default):
  When AI says "I'm opening the trim tool..." OR
  user types "show me the timeline" OR
  user types "I want to edit manually":
  
  A drawer slides up from bottom (300px height):
  Contains: minimal timeline with 3 tracks
  Trim handles on selected clip
  Close button [×] to hide again

  This is the ONLY way manual tools appear.
  They are never shown by default.

═══════════════════════════════════
SCREEN 3 — EXPORT FLOW
(triggered by chat or Export button)
═══════════════════════════════════
VFXB asks in chat:
  "Where is this going?"
  [YouTube]  [TikTok]  [Instagram]  
  [Twitter/X]  [LinkedIn]  [Custom]

User clicks → VFXB responds:
  "Optimizing for YouTube. Rendering 
   at 1080p 30fps. This takes ~2 minutes."
  
  Progress bar inside chat message:
  ████████░░ 78% · Rendering...
  
  On complete:
  "Done! Your video is ready. 
   Score improved from 84 → 91 after fixes."
  [⬇ Download]  [Share Link]  [Export Another]

═══════════════════════════════════
DEMO INTERACTIONS (all must work)
═══════════════════════════════════
1. Type "fix my hook" → 
   AI responds with specific fix, 
   before/after preview appears in right panel

2. Type "make a tiktok version" → 
   AI responds "Creating 60s cut...", 
   mode switches to short-form,
   new score appears

3. Type "remove all silences" →
   AI: "Found 12 silence gaps totaling 
   47 seconds. Remove all?" 
   [Yes, remove all] [Show me first]

4. Type "add captions" →
   AI: "Generating captions... done. 
   47 lines added. Want to change the font?"
   Caption clips appear in timeline drawer

5. Click "Fix This Now" on any card →
   Spinner 1.5s → Before/After preview 
   slides in on right → Keep/Revert

6. Switch to Suno agent, type "add music" →
   "Here are 3 tracks that match your video mood:"
   3 playable track cards appear in chat

7. Type "show timeline" →
   Tools drawer slides up from bottom

8. Type "best 30 seconds" →
   "Analyzing engagement data... 
   The strongest 30 seconds are 1:14–1:44.
   Want me to extract that as a clip?"

═══════════════════════════════════
VISUAL STYLE
═══════════════════════════════════
- Background: #080808
- Left panel: #0e0e0e with right border #1e1e1e
- Cards: #141414, border #222
- Accent: #0A84FF, glow rgba(10,132,255,0.2)
- Font: Syne (headings) + DM Sans (body/chat)
- Mono: JetBrains Mono (timecodes, scores)
- Animations: 200ms ease for all transitions
- No purple. No gradients. No noise textures.
  Clean intelligence. Not flashy.

Score colors:
  >75 = #30D158 green
  50-74 = #FFD60A yellow  
  <50 = #FF453A red

═══════════════════════════════════
WHAT MAKES THIS DIFFERENT
(copy this into the hero/empty state)
═══════════════════════════════════
"Other tools make you edit. 
 VFXB edits for you.
 Just describe what you want."

Comparison shown as simple 2-column table:
                VFXB    Adobe   CapCut
NLP Editing      ✓        ✗       ✗
Longform AI      ✓        ✗       ✗  
Virality Score   ✓        ✗       ✗
Talk to Edit     ✓        ✗       ✗
Manual Tools     ✓        ✓       ✓