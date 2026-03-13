Add a FEATURES PANEL to the existing VFXB Studio UI.
Do not redesign anything. Only add this panel.
Same dark theme: #070707 background, #0A84FF accent, 
Syne + DM Sans fonts.

═══════════════════════════════════
HOW IT OPENS
═══════════════════════════════════
Add a "✦ What can VFXB do?" button to the 
existing top bar — right side, before Export.
Style: ghost pill, border #1E1E1E, text #666,
hover: border #0A84FF, text white.

Click → full screen overlay slides in 
from bottom (translateY 100% → 0, 
300ms ease-out animation).

Close button [×] top-right corner.

═══════════════════════════════════
FEATURES PANEL LAYOUT
═══════════════════════════════════
Full screen overlay: #070707 background.
Subtle grain texture overlay 2% opacity.

TOP SECTION (center aligned, padding-top 60px):
Eyebrow text: "WHY VFXB" — 
  10px DM Sans 600, #0A84FF, 
  letter-spacing 3px, uppercase

H1: "Nobody does what we do."
  40px Syne 800, white, 
  margin-top 10px

Subtext: "8 features. Zero competitors."
  15px DM Sans, #555, margin-top 8px

FEATURES GRID (margin-top 48px):
4 columns × 2 rows = 8 cards
Max-width 1100px, centered, gap 16px

═══════════════════════════════════
THE 8 FEATURE CARDS
═══════════════════════════════════
Each card:
  Background: #0C0C0C
  Border: 1px solid #1A1A1A
  Border-radius: 14px
  Padding: 24px
  Hover: border #0A84FF, 
         box-shadow 0 0 28px rgba(10,132,255,0.12),
         transform translateY(-2px)
  Transition: all 200ms ease

CARD 1 — NLP LONGFORM DIRECTOR
  Top-left tag pill: "CORE FEATURE"
    background rgba(10,132,255,0.12)
    text #0A84FF, 9px, radius 999px, 
    padding 3px 8px
  
  Icon (32px circle, margin-top 20px):
    background rgba(10,132,255,0.1)
    border 1px rgba(10,132,255,0.2)
    center: 🧠 emoji 16px
  
  Title (margin-top 14px):
    "NLP Longform Director"
    16px Syne 700, white
  
  Body (margin-top 8px):
    "Zero competitors. You talk, 
     it edits a 2hr video — 
     understanding full context, 
     not just single clips."
    12px DM Sans, #555, line-height 1.6
  
  Bottom (margin-top 16px):
    Metric pill: "0 competitors"
    background #111, border #1E1E1E,
    text #30D158, 10px mono

CARD 2 — VIRALITY INTELLIGENCE ENGINE
  Tag: "PROPRIETARY"
    background rgba(255,214,10,0.1)
    text #FFD60A
  
  Icon: 🔥 on rgba(255,214,10,0.08) bg
  
  Title: "Virality Intelligence Engine"
  
  Body: "Proprietary score from 100M+ 
         video dataset. A defensible moat 
         no competitor can replicate fast."
  
  Metric pill: "100M+ videos analyzed"
    text #FFD60A

CARD 3 — AUTONOMOUS PUBLISHING AGENT
  Tag: "COMING SOON"
    background rgba(255,255,255,0.05)
    text #666
  
  Icon: 🤖 on rgba(255,255,255,0.04) bg
  
  Title: "Autonomous Publishing Agent"
  
  Body: "Upload → Edit → Publish to all 
         platforms. Zero clicks after 
         you set your goal."
  
  Metric pill: "6 platforms · 0 clicks"
    text #888

CARD 4 — CREATOR DNA MEMORY
  Tag: "BETA"
    background rgba(0,210,255,0.08)
    text #00D4FF
  
  Icon: 🧬 on rgba(0,210,255,0.06) bg
  
  Title: "Creator DNA Memory"
  
  Body: "AI learns your style, voice, 
         and pacing over time. Every 
         edit feels authentically you."
  
  Metric pill: "Learns after 3 videos"
    text #00D4FF

CARD 5 — REAL-TIME COLLAB
  Tag: "COMING SOON"
  
  Icon: 👥
  
  Title: "Real-Time Collaboration"
  
  Body: "Teams edit the same video via 
         chat simultaneously. AI resolves 
         conflicts automatically."
  
  Metric pill: "Unlimited collaborators"
    text #888

CARD 6 — PLATFORM-SPECIFIC AI
  Tag: "CORE FEATURE" (blue)
  
  Icon: 📱
  
  Title: "Platform-Specific AI"
  
  Body: "One video → auto-optimized for 
         YouTube, TikTok, Instagram, 
         LinkedIn, X, and Shorts."
  
  Metric pill: "6 platforms, 1 click"
    text #0A84FF

CARD 7 — AUDIENCE SIMULATION
  Tag: "PROPRIETARY"
  
  Icon: 📊
  
  Title: "Audience Simulation"
  
  Body: "See your predicted retention 
         curve BEFORE publishing. Know 
         exactly when you'll lose viewers."
  
  Bottom: mini sparkline graph placeholder
    (simple SVG line, peaks and dips, 
     stroke #0A84FF, no fill, 60px wide)
  
  Metric pill: "Predict before publish"
    text #FFD60A

CARD 8 — ENTERPRISE API
  Tag: "ENTERPRISE"
    background rgba(48,209,88,0.08)
    text #30D158
  
  Icon: 🔌
  
  Title: "Enterprise API"
  
  Body: "Studios and agencies plug VFXB 
         directly into their workflow. 
         White-label available."
  
  Metric pill: "REST API · White-label"
    text #30D158

═══════════════════════════════════
BOTTOM OF FEATURES PANEL
═══════════════════════════════════
Center aligned, margin-top 48px, 
padding-bottom 60px:

CTA button (large):
  "Start for Free →"
  Background #0A84FF, white text,
  16px Syne 700, padding 14px 36px,
  radius 10px, 
  hover: box-shadow 0 0 32px 
         rgba(10,132,255,0.35)

Below button (margin-top 14px):
  "No credit card · Free 3 videos/month"
  11px #333 DM Sans

═══════════════════════════════════
COMPARISON TABLE (below CTA)
═══════════════════════════════════
Width 860px, centered, margin-top 60px

Title: "How we compare"
  18px Syne 700, white, centered,
  margin-bottom 24px

Table background: #0A0A0A
Border: 1px #1A1A1A, radius 14px
Overflow hidden

Header row (48px, background #0E0E0E):
  Columns: Feature | VFXB | Adobe | 
           Descript | CapCut | Runway
  VFXB column header: 
    background #0A84FF, white Syne 700

Data rows (40px each, 
border-bottom 1px #111):
  Col 1 (feature name): 12px DM Sans #888
  Other cols: centered icons
    ✓ = filled green circle 14px #30D158
    ✗ = filled #1A1A1A circle, #2A2A2A border
  
  Rows:
  "Talk to Edit"        ✓  ✗  ✗  ✗  ✗
  "Longform NLP"        ✓  ✗  ✗  ✗  ✗
  "Virality Score"      ✓  ✗  ✗  ✗  ✗
  "Auto-Publish"        ✓  ✗  ✗  ✓  ✗
  "Creator Memory"      ✓  ✗  ✗  ✗  ✗
  "Audience Simulation" ✓  ✗  ✗  ✗  ✗
  "Multi-platform"      ✓  ✗  ✗  ✓  ✗
  "Enterprise API"      ✓  ✓  ✗  ✗  ✓
  
  VFXB column: every row 
    background rgba(10,132,255,0.05)
  Alternate rows: #0C0C0C / #0A0A0A

Below table (margin-top 12px):
  "VFXB is the only platform where a 
   creator says 'edit and post this' 
   — and walks away."
  13px DM Sans #444 italic, centered