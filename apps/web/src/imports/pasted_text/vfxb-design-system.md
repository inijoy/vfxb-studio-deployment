═══════════════════════════════════════════════════════
VFXB — COMPLETE PRODUCT UI SYSTEM
Full Figma Design Prompt — All Screens
═══════════════════════════════════════════════════════

Design the complete VFXB product UI system.
Every screen. Every state. Every component.
This is a $100B AI video intelligence platform.
Not an editor. An AI Director you talk to.

═══════════════════════════════════════════════════════
GLOBAL DESIGN SYSTEM (apply to ALL screens)
═══════════════════════════════════════════════════════
Background:       #070707
Surface 1:        #0E0E0E
Surface 2:        #141414
Surface 3:        #1A1A1A
Border subtle:    #1E1E1E
Border medium:    #2A2A2A
Accent:           #0A84FF
Accent glow:      rgba(10,132,255,0.15)
Accent cyan:      #00D4FF
Success:          #30D158
Warning:          #FFD60A
Error:            #FF453A
Text primary:     #FFFFFF
Text secondary:   #666666
Text ghost:       #333333

Fonts:
  Display:   Syne 800
  UI:        DM Sans 400/500/600
  Mono:      JetBrains Mono 400

Radius:
  Cards:     12px
  Buttons:   8px
  Pills:     999px
  Inputs:    10px
  Modals:    16px

Shadows:
  Card:      0 1px 3px rgba(0,0,0,0.4)
  Elevated:  0 8px 32px rgba(0,0,0,0.6)
  Glow:      0 0 24px rgba(10,132,255,0.2)

Transitions: 200ms ease on all interactions
Icons: Phosphor icon set, 18px, 1.5px stroke

═══════════════════════════════════════════════════════
SCREEN 1 — SIGN UP PAGE (1440x900)
═══════════════════════════════════════════════════════
Layout: Two columns, 50/50 split

LEFT COLUMN (720px):
Background: #070707
Center aligned content, vertically centered

VFXB logo (hex + wordmark) top-left, 
padding 32px

Center content:
  Eyebrow: "START FOR FREE"
    9px DM Sans 600, #0A84FF, 
    letter-spacing 3px, uppercase

  H1: "Your AI Video Director"
    36px Syne 800, white, margin-top 10px

  Subtext: "Join 12,000+ creators already 
            using VFXB to go viral."
    14px DM Sans #555, margin-top 8px

  FORM (margin-top 32px, max-width 360px):
  
  Full name input:
    Label: "Full Name" 11px #444 DM Sans 500
    Input: full width, 44px height,
    background #0E0E0E, border 1px #1E1E1E,
    radius 10px, padding 0 14px,
    14px white DM Sans,
    placeholder "Your name" in #333
    focus: border #0A84FF, 
           box-shadow 0 0 0 3px rgba(10,132,255,0.1)

  Email input (same style):
    Label: "Email Address"
    Placeholder: "you@email.com"

  Password input (same style):
    Label: "Password"
    Right side: eye toggle icon #444
    Below: password strength bar
      4 segments, fills left to right:
      1 filled = red, 2 = yellow, 
      3 = blue, 4 = green
      Label: "Weak / Fair / Good / Strong"

  Creator mode selector (margin-top 16px):
    Label: "I create for:" 11px #444
    Three pills in a row:
    [🎬 Long-form]  [⚡ Short-form]  [🏢 Agency]
    Default selected: Long-form
    Active: background #0A84FF, white text
    Inactive: background #0E0E0E, 
              border #1E1E1E, text #555

  "Create Free Account" button (margin-top 20px):
    Full width, 46px height
    Background #0A84FF, white text
    15px Syne 700, radius 10px
    Hover: box-shadow 0 0 28px rgba(10,132,255,0.3)

  Divider: ── or continue with ──
    12px #333, margin 20px 0

  Social sign-up row (two buttons, gap 10px):
  [ 🔵 Continue with Google ]
  [ ◼ Continue with Apple  ]
    Each: 50% width, 40px height
    Background #0E0E0E, border #1E1E1E,
    radius 8px, 12px white DM Sans 500

  Bottom: "Already have an account? Sign in →"
    12px #444, center, margin-top 20px
    "Sign in" in #0A84FF, clickable

RIGHT COLUMN (720px):
Background: #0A0A0A
border-left: 1px #1A1A1A

Centered content:
  Floating UI preview card (400px wide):
    Shows mini version of Studio interface
    Score card: "⚡ 91/100" with green bar
    3 mini insight cards stacked
    Chat bubble: "Fixed your hook. 
                  Predicted +34% retention."
    
    Card: background #0E0E0E, 
          border #1A1A1A, radius 14px,
          padding 20px,
          box-shadow 0 20px 60px rgba(0,0,0,0.8)

  Below card, 3 social proof rows:
  ⭐ "Went from 2K to 280K views" 
     — @creator_name
  ⭐ "VFXB rewrote my entire 45-min video"
     — @youtuber_name  
  ⭐ "Saved me 6 hours of editing"
     — @creator_name
  Each: 12px DM Sans #555, 
        left quote mark in #0A84FF

═══════════════════════════════════════════════════════
SCREEN 2 — SIGN IN PAGE (1440x900)
═══════════════════════════════════════════════════════
Same two-column layout as Sign Up.

LEFT COLUMN:
  H1: "Welcome back."
  Subtext: "Your videos are waiting."

  FORM:
    Email input
    Password input (with show/hide toggle)
    
    Row: [☐ Remember me]  [Forgot password? →]
      Remember me: custom checkbox
      Checkbox: 14px square, border #333,
      checked: background #0A84FF, white tick
      Forgot: 11px #0A84FF, right aligned

    "Sign In" button (same style as sign up)

    Divider + Social buttons (same as sign up)

    Bottom: "Don't have an account? Sign up →"

FORGOT PASSWORD FLOW (modal overlay):
  Center modal (400px wide):
  Background #0E0E0E, border #1A1A1A,
  radius 16px, padding 32px

  Title: "Reset Password" 20px Syne 700
  Body: "Enter your email and we'll 
         send a reset link."  14px #555

  Email input (full width)
  "Send Reset Link" button (full width, blue)
  "← Back to sign in" ghost link below

═══════════════════════════════════════════════════════
SCREEN 3 — DASHBOARD (1440x900)
═══════════════════════════════════════════════════════
Layout: Left nav sidebar (220px) + Main content

LEFT NAV SIDEBAR:
Background: #0A0A0A
Border-right: 1px #1A1A1A
Padding: 20px 12px

Top: VFXB logo + wordmark (32px from top)

Nav section label: "WORKSPACE" 
  9px #333 uppercase tracking-widest,
  padding: 16px 8px 6px

Nav items (38px height each, radius 8px,
padding 0 10px, gap 4px):
  [🏠] Dashboard         ← active
  [🎬] My Videos
  [✦] Studio
  [📊] Analytics
  [🕐] Edit History
  [👥] Collaboration
  [🔌] API & Integrations

Nav section label: "ACCOUNT"
  [💎] Upgrade Plan
  [⚙] Settings
  [❓] Help & Docs

Active item: background rgba(10,132,255,0.1),
  text white, left 3px blue border
Inactive: text #555, hover background #111

Bottom of sidebar:
  User card (margin-top auto):
  Background #111, border #1A1A1A,
  radius 10px, padding 10px 12px

  Avatar circle (32px, background #0A84FF,
  white initial letter) + info:
  Name: "Creator Name" 12px white 600
  Plan: "Free Plan" 10px #444
  
  "⬆ Upgrade" pill button right:
    background rgba(10,132,255,0.15)
    text #0A84FF, 10px, radius 999px

MAIN CONTENT AREA:
Background: #070707
Padding: 32px 36px

TOP ROW:
Left: "Good morning, [Name] 👋"
  24px Syne 700, white

Right: "✦ New Video" button
  background #0A84FF, white,
  14px Syne 600, padding 10px 20px,
  radius 8px, left sparkle icon

STATS ROW (4 cards, margin-top 28px, gap 16px):

Stat Card style:
  Background #0E0E0E, border #1A1A1A,
  radius 12px, padding 20px 22px

Card 1: Total Videos
  Label: "TOTAL VIDEOS" 9px #444 uppercase
  Number: "24" 32px Syne 800 white
  Trend: "↑ 3 this week" 11px #30D158

Card 2: Avg Virality Score
  Number: "78" in #FFD60A
  Trend: "↑ +6 pts from last month"

Card 3: Total Views Generated
  Number: "2.4M" in white
  Trend: "↑ 340K this week" in #30D158

Card 4: Hours Saved
  Number: "142h" in #0A84FF
  Subtext: "vs manual editing" in #444

RECENT VIDEOS SECTION (margin-top 36px):
Row: "Recent Videos" 16px Syne 700 left
     "View all →" 12px #0A84FF right

Video cards grid (3 columns, gap 16px, 
margin-top 16px):

Each Video Card (background #0E0E0E, 
border #1A1A1A, radius 12px, overflow hidden):

  Thumbnail area (16:9, background #141414):
    Gradient placeholder (dark to slightly 
    lighter dark, left to right)
    Bottom-left: duration pill "03:24"
      background rgba(0,0,0,0.7), 
      white mono 10px
    Top-right: score badge "⚡ 84"
      background #0A84FF, white 10px

  Content area (padding 14px):
    Title: "Video title here" 13px white 600
    Date: "Edited 2 days ago" 11px #444
    Platform row: 
      [▶ YT] [TK] [IG] colored tiny pills
    
    Bottom row:
    Left: status pill
      "Published" = green pill
      "Draft" = #333 pill  
      "Processing" = blue animated pill
    Right: "⋯" more options button

QUICK ACTIONS ROW (margin-top 32px):
Label: "Quick Actions" 16px Syne 700

4 action cards (horizontal row, gap 12px):
  [✦ Analyze New Video]
  [🎬 Continue Last Edit]
  [📱 Make TikTok Cut]
  [📊 View Analytics]

Each: background #0E0E0E, border #1A1A1A,
  radius 10px, padding 16px 20px,
  icon top, label below 12px DM Sans #888,
  hover: border #0A84FF, label turns white

ACTIVITY FEED (right side, 300px wide,
floats right of video grid):
Label: "Recent Activity" 14px Syne 600

Feed items (gap 12px):
Each item: left colored dot + text + time
  🔵 "VFXB fixed hook on 'Video Title'"  
     "2 mins ago" in #333
  🟢 "Published to YouTube"  
     "1 hour ago"
  🟡 "Score improved 71 → 89"  
     "3 hours ago"
  ⚪ "New collab invite from @user"  
     "Yesterday"

═══════════════════════════════════════════════════════
SCREEN 4 — STUDIO (1440x900)
(existing design + 8 features now accessible)
═══════════════════════════════════════════════════════
Keep existing two-column studio layout.
Add these working feature entry points:

TOP BAR ADDITIONS:
After project title, add feature pills row:
  [🧠 NLP Edit] [🔥 Virality] [📱 Platforms] 
  [🧬 DNA] [👥 Collab] [📊 Simulate] [🤖 Auto-Publish]
  
  Pill style: background #0E0E0E, border #1E1E1E,
  10px DM Sans #555, radius 999px
  Hover: border #0A84FF, text white
  Active: background rgba(10,132,255,0.12), 
          text #0A84FF

FEATURE PANELS (slide in from right, 
320px wide, over video preview):

[🔥 Virality] panel:
  Title: "Virality Intelligence"
  Large score: 84/100 with animated bar
  5 factor rows:
    Hook Strength     ████░░  72%
    Pacing            ██████  91%
    Thumbnail CTR     ███░░░  54%
    Audio Quality     █████░  88%
    Retention Curve   ████░░  76%
  Each row: label left, bar center, 
  percentage right. Bar color matches 
  score (green/yellow/red)

[📱 Platforms] panel:
  Title: "Platform Optimizer"
  Toggle row for 6 platforms:
    ▶ YouTube   [toggle ON]  1080p 16:9
    ◐ TikTok    [toggle ON]  1080p 9:16
    □ Instagram [toggle OFF] 1080p 1:1
    □ LinkedIn  [toggle OFF] 1080p 16:9
    □ Twitter/X [toggle OFF] 720p 16:9
    □ Shorts    [toggle ON]  1080p 9:16
  
  Toggle: 32px wide pill, ON=#0A84FF, 
          OFF=#1A1A1A
  
  "Generate All Versions" button
    Full width, blue, margin-top 16px

[🧬 DNA] panel:
  Title: "Creator DNA"
  Subtitle: "VFXB has learned your style"
  
  Style metrics:
    Avg cut speed:    "2.4s between cuts"
    Tone:             "High energy, direct"
    Caption style:    "Bold, bottom-third"
    Music preference: "Trap / Electronic"
    Hook style:       "Question opener"
  
  Each: left label #444, right value white
  
  Progress bar: "Style confidence 87%"
    Blue bar, 87% fill

[📊 Simulate] panel:
  Title: "Audience Simulation"
  Subtitle: "Predicted retention before publish"
  
  Retention graph (full width, 120px tall):
    SVG line chart
    X axis: 0% to 100% of video length
    Y axis: 0% to 100% retention
    Line: starts 100%, curves down,
    sharp drops at problem timestamps
    Problem spots: red vertical dotted lines
    Color: stroke #0A84FF, 
           fill rgba(10,132,255,0.1)
  
  Below graph: 3 drop-off warnings
    "⚠ 0:45 — Pacing drop, -23% viewers"
    "⚠ 2:14 — Jump cut, -12% viewers"
    "⚠ 3:01 — Weak CTA, -18% viewers"

[🤖 Auto-Publish] panel:
  Title: "Autonomous Agent"
  Subtitle: "Set your goal. Walk away."
  
  Goal input: 
    "What's the goal for this video?"
    textarea, 3 rows, #0E0E0E bg
  
  Schedule row:
    "Publish" [Now ▾] on [Platforms ▾]
  
  Checklist (auto-ticked by AI):
    ✓ Optimize hook
    ✓ Fix pacing
    ✓ Add captions
    ✓ Generate thumbnail
    ○ Schedule post
    ○ Cross-post all platforms
  
  "Activate Agent" button
    Full width, blue, 
    left robot icon 🤖

═══════════════════════════════════════════════════════
SCREEN 5 — EDIT HISTORY (1440x900)
═══════════════════════════════════════════════════════
Same left nav sidebar (Edit History active).

Main content:
  Title: "Edit History" 24px Syne 700
  Subtitle: "Every change VFXB made to 
             your videos" 13px #444

FILTER ROW (margin-top 20px):
  [All] [This Week] [This Month] [By Video ▾]
  Pill filters, active = blue filled

HISTORY TABLE (margin-top 20px):
Background #0E0E0E, border #1A1A1A,
radius 12px, overflow hidden

Table header row (40px, background #111,
border-bottom #1A1A1A):
  Video | Change Made | Agent Used | 
  Score Impact | Date | Actions
  All 11px DM Sans 600 #444 uppercase

Table rows (52px height, 
border-bottom #111, hover: bg #111):

Each row:
  Video: thumbnail (32x18px) + title 
         "Video name..." 12px white
  Change: "Fixed hook — trimmed 0:00–0:03" 
          12px #888
  Agent: colored pill "VFXB Engine" 
         or "GPT-4o" etc.
  Score: "71 → 89" with green arrow ↑
         or red ↓ if decreased
  Date: "2 days ago" 11px #444 mono
  Actions: [Preview] [Restore] buttons
    Ghost pills, 10px, hover blue border

SAMPLE ROWS (show 8 rows):
Row 1: "YouTube Vlog #24" | 
       "Removed 12 silence gaps" | 
       VFXB Engine | 78→91 ↑ | 2h ago
Row 2: "TikTok Cut — March" | 
       "Added captions (47 lines)" | 
       VFXB Engine | 82→85 ↑ | Yesterday
Row 3: "Podcast Episode 12" | 
       "Fixed pacing 0:45–1:20" | 
       Claude 3.5 | 65→74 ↑ | 2 days ago
Row 4: "Product Review" | 
       "Generated thumbnail" | 
       Runway Gen-4 | No change | 3 days ago
Row 5: "Tutorial Series EP3" | 
       "Platform versions × 6" | 
       VFXB Engine | 88→88 | 1 week ago

Pagination (bottom): 
  ← 1 [2] 3 4 ... 12 →
  Page numbers in mono, active = blue

═══════════════════════════════════════════════════════
SCREEN 6 — UPGRADE / PRICING PAGE (1440x900)
═══════════════════════════════════════════════════════
Background: #070707
Full page scroll layout

TOP SECTION (center, padding-top 72px):
  Eyebrow: "PRICING" in #0A84FF uppercase
  H1: "Grow faster with VFXB"
    40px Syne 800, white, center
  Subtext: "Start free. Upgrade when you're ready."
    15px #555, center, margin-top 8px

  Billing toggle (margin-top 24px):
  [  Monthly  |  Yearly  ]
  Toggle pill: background #0E0E0E, 
               border #1A1A1A, radius 999px
  Active side: background #0A84FF, white text
  "Save 30%" green badge next to Yearly

PRICING CARDS (3 columns, 
max-width 960px, centered, gap 20px,
margin-top 48px):

CARD 1 — FREE:
Background: #0E0E0E
Border: 1px #1A1A1A
Radius: 16px, padding: 32px

  Plan name: "Free" 13px #555 uppercase
  Price: "$0" 42px Syne 800 white
  "/month" 14px #444

  Divider line #1A1A1A, margin 20px 0

  Features list (gap 10px):
    ✓ 3 videos per month
    ✓ Virality score
    ✓ Basic NLP editing
    ✓ 1 platform export
    ✗ Creator DNA Memory  ← gray text, ✗ red
    ✗ Audience Simulation
    ✗ Auto-Publish Agent
    ✗ API Access
  ✓ = #30D158, item text white 13px DM Sans
  ✗ = #FF453A, item text #444

  Button: "Get Started Free"
    Full width, background #111, 
    border #1E1E1E, white text, radius 8px

CARD 2 — PRO: (FEATURED — elevated)
Background: #0A0A0A
Border: 2px #0A84FF
Box-shadow: 0 0 40px rgba(10,132,255,0.15)
Radius: 16px, padding: 32px
Transform: scale(1.03) — slightly larger

  TOP BADGE: "MOST POPULAR"
    Position: absolute, top -12px, centered
    Background #0A84FF, white text,
    9px Syne 700, padding 4px 14px,
    radius 999px

  Plan name: "Pro"  
  Price: "$29" (monthly) / "$19" (yearly)
  "/month" below
  
  Features list:
    ✓ Unlimited videos
    ✓ Full NLP editing
    ✓ All 6 platforms
    ✓ Creator DNA Memory
    ✓ Audience Simulation
    ✓ Priority VFXB Engine
    ✓ All AI models access
    ✗ API Access
    ✗ White-label

  Button: "Start Pro Free — 7 days"
    Full width, background #0A84FF,
    white Syne 700, radius 8px
    Hover: glow effect

CARD 3 — ENTERPRISE:
Background: #0E0E0E
Border: 1px #1A1A1A

  Plan name: "Enterprise"
  Price: "Custom"
  Subtext: "For agencies and studios"

  Features list:
    ✓ Everything in Pro
    ✓ REST API access
    ✓ White-label option
    ✓ Dedicated AI model
    ✓ SLA guarantee
    ✓ Team seats (unlimited)
    ✓ Custom integrations
    ✓ Priority support

  Button: "Talk to Sales →"
    Full width, border #1E1E1E, 
    background #111, white text

FEATURE COMPARISON TABLE 
(below cards, margin-top 72px):
Full width, same style as competitor table
Rows: all features
Columns: Free | Pro | Enterprise

FAQ SECTION (margin-top 72px):
Title: "Common questions" 24px Syne 700
6 accordion items (click to expand):
  "Can I cancel anytime?"
  "What counts as one video?"
  "Which AI models are included?"
  "Is there a free trial for Pro?"
  "Do you offer student discounts?"
  "What platforms do you support?"
Each: border-bottom #111, 
question in white 14px DM Sans 500,
answer expands below in #555 13px

═══════════════════════════════════════════════════════
SCREEN 7 — PAYMENT UI (1440x900)
═══════════════════════════════════════════════════════
Layout: Two columns (60/40 split)

LEFT COLUMN — PAYMENT FORM (860px):
Background: #070707
Padding: 72px 80px

Back link: "← Back to Pricing" 
  12px #444, top-left, hover white

Title: "Complete your order"
  28px Syne 800, white, margin-top 24px

PLAN SUMMARY CARD (margin-top 24px):
Background #0E0E0E, border #1A1A1A,
radius 12px, padding 16px 20px

Row: "VFXB Pro · Monthly" left (13px white 600)
     "$29/month" right (16px Syne 700 #0A84FF)
Below: "7-day free trial, then $29/month. 
        Cancel anytime." 11px #444

PAYMENT FORM (margin-top 28px):

Section label: "PAYMENT DETAILS"
  9px #444 uppercase, letter-spacing 2px

Card number input (full width):
  Left: credit card icon #444
  Placeholder: "1234 5678 9012 3456"
  Right: card brand logos (Visa/MC small)

Two-column row (gap 12px):
  Expiry: "MM / YY"
  CVC: "•••" with info icon

Cardholder name (full width):
  Placeholder: "Name on card"

Section label: "BILLING ADDRESS"
  (same style)
  
Country dropdown: "United States ▾"
  Full width, same input style

ZIP code input (half width)

SECURE BADGES ROW (margin-top 16px):
  🔒 SSL Encrypted  ·  
  ✓ PCI Compliant  ·  
  🛡 Stripe Secured
  All 10px #333, icons #444

"Start 7-Day Free Trial" button:
  Full width, 50px height
  Background #0A84FF, white Syne 700 16px
  Radius 10px
  Left lock icon 🔒
  Hover: glow 0 0 32px rgba(10,132,255,0.35)

Fine print below:
  "No charge today. $29/month after trial.
   Cancel anytime from your dashboard."
  11px #333, center aligned

OR divider

[ Pay with PayPal ] button
  Full width, 44px, background #0E0E0E,
  border #1E1E1E, white text, 
  PayPal logo left

RIGHT COLUMN — ORDER SUMMARY (580px):
Background: #0A0A0A
Border-left: 1px #1A1A1A
Padding: 72px 48px
Position: sticky top

Title: "Order Summary" 16px Syne 700

Plan card (same as left summary card style)

WHAT YOU GET section (margin-top 28px):
Label: "INCLUDED IN PRO" 9px #444 uppercase

Feature list (gap 10px):
  ✓ Unlimited videos
  ✓ Full NLP editing
  ✓ All 6 platform exports
  ✓ Creator DNA Memory
  ✓ Audience Simulation
  ✓ All AI models
  ✓ Priority support
Each: green checkmark + 12px white DM Sans

PRICING BREAKDOWN (margin-top 28px,
border-top #1A1A1A, padding-top 20px):
  "Pro Monthly"     $29.00
  "7-day trial"     -$29.00
  Divider
  "Due today"       $0.00  ← Syne 700 white
  
  "Then $29/month starting [date+7]"
  11px #444

TESTIMONIAL (margin-top 32px,
background #111, border #1A1A1A,
radius 12px, padding 16px):
  ⭐⭐⭐⭐⭐
  "VFXB rewrote my 45-minute video 
   in under 3 minutes. Insane."
  — @creator_handle · 280K subscribers
  All text in #555, quote in #888 13px italic

═══════════════════════════════════════════════════════
COMPONENTS SHEET (separate Figma frame)
═══════════════════════════════════════════════════════
Build all reusable components:

BUTTONS (all states: default/hover/active/disabled):
  Primary blue | Ghost | Destructive red |
  Success green | Icon-only | Pill CTA

INPUTS (all states: default/focus/error/filled):
  Text | Password | Dropdown | Textarea |
  Search | Toggle switch | Checkbox | Radio

CARDS:
  Video card | Insight card (3 severities) |
  Feature card | Stat card | 
  Agent selector item | History row

NAVIGATION:
  Nav sidebar item (active/inactive/hover) |
  Top bar | Breadcrumb | Tab row

AI COMPONENTS:
  Chat bubble — VFXB | Chat bubble — User |
  Typing indicator | Score badge |
  Retention graph | Before/After slider |
  Quick action chip | Agent dropdown

OVERLAYS:
  Toast notification (success/warning/error) |
  Modal (small/large) | Feature panel |
  Dropdown menu | Tooltip

═══════════════════════════════════════════════════════
ALL ARTBOARDS TO CREATE
═══════════════════════════════════════════════════════
Frame 01: Sign Up (1440x900)
Frame 02: Sign In (1440x900)
Frame 03: Forgot Password modal (1440x900)
Frame 04: Dashboard — with recent videos (1440x900)
Frame 05: Dashboard — empty state (1440x900)
Frame 06: Studio — upload state (1440x900)
Frame 07: Studio — AI briefing (1440x900)
Frame 08: Studio — active conversation (1440x900)
Frame 09: Studio — before/after comparison (1440x900)
Frame 10: Studio — Virality panel open (1440x900)
Frame 11: Studio — Platform optimizer open (1440x900)
Frame 12: Studio — Audience simulation open (1440x900)
Frame 13: Studio — Auto-publish agent open (1440x900)
Frame 14: Studio — Creator DNA open (1440x900)
Frame 15: Edit History (1440x900)
Frame 16: Pricing page (1440x900)
Frame 17: Payment — checkout (1440x900)
Frame 18: Payment — success state (1440x900)
Frame 19: Mobile — Dashboard 390x844
Frame 20: Component sheet (all components)