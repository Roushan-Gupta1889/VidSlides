# VidSlides — User Flow Experience by Video Duration

## The Universal Entry Point (Same for All)

```
User lands on vidslides.app
     │
     ▼
┌─────────────────────────────────────────────┐
│  🎬 VidSlides                    [Sign In]  │
│                                             │
│     "Turn any YouTube video                 │
│      into presentation slides"              │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ 🔗 Paste YouTube URL here...    [GO] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│     ⚡ Try free — no sign-up needed         │
└─────────────────────────────────────────────┘
```

User pastes URL → hits **"Generate Slides"**

### What happens INSTANTLY (all tiers, < 2 seconds):

The system calls `yt-dlp --dump-json` (no download). User sees:

```
┌─────────────────────────────────────────────┐
│  📺 Video Found                             │
│                                             │
│  ┌──────┐  "React Full Course 2024"         │
│  │ thumb│   👤 Fireship                      │
│  │ nail │   ⏱️ 47 minutes                    │
│  └──────┘   📊 Tier 2 — Medium Video        │
│             🎯 ~8-15 slides expected         │
│                                             │
│     Estimated processing: ~3 minutes        │
│                                             │
│         [ ▶ Start Processing ]              │
└─────────────────────────────────────────────┘
```

> [!TIP]
> The user already sees the video title, thumbnail, duration, and time estimate BEFORE any heavy processing starts. They can cancel or change the URL at this point.

---

## 🟢 Tier 1: Short Video (0–30 min)

### Example: "CSS Grid in 100 Seconds" — 2 min 15 sec

#### Step 1: Processing (15–30 seconds)

```
┌─────────────────────────────────────────────┐
│                                             │
│  ⚡ Lightning Fast Processing               │
│                                             │
│  ✅ Video found (720p, 2:15)                │
│  ✅ Downloading video .............. done    │
│  🔄 Detecting scene changes...              │
│  ⏳ Removing duplicates                     │
│  ⏳ Preparing slides                        │
│                                             │
│  ████████████░░░░░░░░░░░░  45%              │
│                                             │
│  💡 Short video — processing in one pass    │
└─────────────────────────────────────────────┘
```

> No chunking. Downloads entire 2-min video (~15MB at 720p), runs ffmpeg scene detection in one pass. Done in seconds.

#### Step 2: Slides Ready (4 slides extracted)

```
┌─────────────────────────────────────────────┐
│  ✅ 4 slides extracted in 22 seconds        │
│     ⚡ Processed in a single pass           │
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ ☑ Slide │  │ ☑ Slide │  │ ☑ Slide │     │
│  │   #1    │  │   #2    │  │   #3    │     │
│  │         │  │         │  │         │     │
│  │  0:00   │  │  0:32   │  │  1:15   │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                             │
│  ┌─────────┐                                │
│  │ ☑ Slide │   4 of 4 selected              │
│  │   #4    │                                │
│  │         │  ┌──────────┐ ┌──────────┐     │
│  │  1:58   │  │ 📄 PDF  │ │ 📊 PPT  │     │
│  └─────────┘  └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
```

#### Step 3: Download

User clicks **📄 Download PDF**:

```
┌─────────────────────────────────────────────┐
│                                             │
│  📄 Generating PDF...                       │
│                                             │
│  Creating 4-page document                   │
│  ████████████████████████████  100%         │
│                                             │
│  ✅ PDF Ready!                              │
│                                             │
│  📁 CSS_Grid_in_100_Seconds_slides.pdf      │
│     4 pages · 1.2 MB                        │
│                                             │
│     [ ⬇ Download ]  [ 📊 Also get PPT ]    │
│                                             │
└─────────────────────────────────────────────┘
```

**PDF contents:**
```
┌────────────────────┐  ┌────────────────────┐
│ Page 1             │  │ Page 2             │
│                    │  │                    │
│  ┌──────────────┐  │  │  ┌──────────────┐  │
│  │              │  │  │  │              │  │
│  │  Slide #1    │  │  │  │  Slide #2    │  │
│  │  (full img)  │  │  │  │  (full img)  │  │
│  │              │  │  │  │              │  │
│  └──────────────┘  │  │  └──────────────┘  │
│                    │  │                    │
│  ⏱ 0:00           │  │  ⏱ 0:32           │
│  CSS Grid Intro    │  │  Grid Template     │
└────────────────────┘  └────────────────────┘
```

> **Total time from paste to PDF: ~30 seconds**

---

## 🟡 Tier 2: Medium Video (30 min – 2 hours)

### Example: "Node.js Full Tutorial" — 1 hour 15 min

#### Step 1: Pre-flight

```
┌─────────────────────────────────────────────┐
│  📺 Video Found                             │
│                                             │
│  ┌──────┐  "Node.js Full Tutorial"          │
│  │ thumb│   👤 Programming with Mosh        │
│  │ nail │   ⏱️ 1 hour 15 minutes            │
│  └──────┘   📊 Tier 2 — Medium Video        │
│             🧩 Will split into 3 chunks     │
│             🎯 ~15-25 slides expected       │
│                                             │
│     Estimated processing: ~5-8 minutes      │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Chunk 1: 0:00 → 0:30  (30 min)     │    │
│  │ Chunk 2: 0:30 → 1:00  (30 min)     │    │
│  │ Chunk 3: 1:00 → 1:15  (15 min)     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│         [ ▶ Start Processing ]              │
└─────────────────────────────────────────────┘
```

#### Step 2: Chunk Processing (5-8 minutes)

The user sees **live progress per chunk** via SSE:

```
┌─────────────────────────────────────────────┐
│                                             │
│  🔄 Processing 3 chunks in parallel         │
│                                             │
│  Chunk 1 (0:00–0:30)                        │
│  ✅ Downloaded ✅ Frames ✅ Deduped → 7 slides│
│  ████████████████████████████  DONE         │
│                                             │
│  Chunk 2 (0:30–1:00)                        │
│  ✅ Downloaded 🔄 Extracting frames...       │
│  █████████████████░░░░░░░░░░  62%           │
│                                             │
│  Chunk 3 (1:00–1:15)                        │
│  ✅ Downloaded ⏳ Waiting for worker...       │
│  ██████░░░░░░░░░░░░░░░░░░░░  20%           │
│                                             │
│  Overall: ██████████████░░░░░░  58%         │
│  ⏱ Elapsed: 3:24 · Remaining: ~2:30        │
│                                             │
│  💡 You can keep browsing —                 │
│     we'll notify you when done              │
└─────────────────────────────────────────────┘
```

> [!IMPORTANT]
> Chunks process **in parallel** (Tier 2 uses 2-3 workers). Chunk 1 results appear while Chunk 3 is still downloading.

#### Step 3: Aggregation (3 seconds)

```
┌─────────────────────────────────────────────┐
│                                             │
│  🔗 Merging results from 3 chunks...        │
│                                             │
│  Chunk 1: 7 slides                          │
│  Chunk 2: 9 slides                          │
│  Chunk 3: 5 slides                          │
│  Duplicates removed: 2                      │
│  ─────────────────                          │
│  Total: 19 slides                           │
│                                             │
│  ████████████████████████████  100%         │
└─────────────────────────────────────────────┘
```

#### Step 4: Slides Grid (19 slides)

```
┌───────────────────────────────────────────────────────┐
│  ✅ 19 slides extracted in 6 min 12 sec               │
│     🧩 Processed in 3 chunks · 2 duplicates removed   │
│                                                       │
│  [Select All ☑]   19 of 19 selected                   │
│                                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│  │ Slide 1│ │ Slide 2│ │ Slide 3│ │ Slide 4│         │
│  │  0:00  │ │  3:42  │ │  8:15  │ │ 12:30  │         │
│  │ ░░░░░░ │ │ ░░░░░░ │ │ ░░░░░░ │ │ ░░░░░░ │         │
│  │  ☑     │ │  ☑     │ │  ☑     │ │  ☑     │         │
│  └────────┘ └────────┘ └────────┘ └────────┘         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│  │ Slide 5│ │ Slide 6│ │ Slide 7│ │ Slide 8│         │
│  │ 15:07  │ │ 22:33  │ │ 28:19  │ │ 34:50  │         │
│  │ ░░░░░░ │ │ ░░░░░░ │ │ ░░░░░░ │ │ ░░░░░░ │         │
│  │  ☑     │ │  ☐     │ │  ☑     │ │  ☑     │         │
│  └────────┘ └────────┘ └────────┘ └────────┘         │
│                          ...more slides...            │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │  📄 Download PDF (17 selected)   📊 Download PPT │ │
│  └──────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

User deselects Slide 6 (irrelevant frame), downloads PDF with 17 slides.

**PDF: 17 pages, ~4.5 MB, landscape orientation, each slide = full page with timestamp caption.**

> **Total time from paste to PDF: ~7 minutes**

---

## 🔴 Tier 3: Long Video (2–6 hours)

### Example: "Harvard CS50 Full Course" — 3 hours 42 min

#### Step 1: Pre-flight — User Gets a Warning

```
┌─────────────────────────────────────────────┐
│  📺 Video Found                             │
│                                             │
│  ┌──────┐  "Harvard CS50 Full Course 2024"  │
│  │ thumb│   👤 freeCodeCamp.org             │
│  │ nail │   ⏱️ 3 hours 42 minutes           │
│  └──────┘   📊 Tier 3 — Long Video          │
│             🧩 Will split into 4 chunks     │
│             🎯 ~40-60 slides expected       │
│                                             │
│  ⚠️ This is a long video. Processing will   │
│     take 15-25 minutes. You can leave this  │
│     tab open — we'll notify you when done.  │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Chunk 1: 0:00 → 1:00  (60 min)     │    │
│  │ Chunk 2: 1:00 → 2:00  (60 min)     │    │
│  │ Chunk 3: 2:00 → 3:00  (60 min)     │    │
│  │ Chunk 4: 3:00 → 3:42  (42 min)     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [ ▶ Start Processing ]  [ 🔔 Notify me ]  │
└─────────────────────────────────────────────┘
```

#### Step 2: Background Processing (15-25 min)

User clicks **Start Processing**. A persistent banner stays at top:

```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Processing "Harvard CS50" — Chunk 2/4 — 38% · ~12 min   │
└─────────────────────────────────────────────────────────────┘
```

User can **navigate the workspace** while processing:
- Browse past projects
- Check analytics
- The banner updates in real-time via SSE

When clicking the banner, the full progress expands:

```
┌─────────────────────────────────────────────┐
│                                             │
│  🔄 Processing 4 chunks                     │
│                                             │
│  Chunk 1 (0:00–1:00) ✅ DONE → 14 slides   │
│  Chunk 2 (1:00–2:00) 🔄 78% Extracting...  │
│  Chunk 3 (2:00–3:00) 🔄 25% Downloading... │
│  Chunk 4 (3:00–3:42) ⏳ Queued             │
│                                             │
│  💡 Partial results available!              │
│     [ 👀 View Chunk 1 slides now ]          │
│                                             │
│  Overall: █████████░░░░░░░░░░░  38%         │
│  ⏱ Elapsed: 8:45 · Remaining: ~12 min      │
└─────────────────────────────────────────────┘
```

> [!TIP]
> **Partial results!** As soon as Chunk 1 finishes, the user can preview those 14 slides immediately — they don't have to wait for all 4 chunks.

#### Step 3: Progressive Slide Loading

As each chunk completes, slides append to the grid:

```
┌───────────────────────────────────────────────────┐
│                                                   │
│  📺 Harvard CS50 Full Course 2024                 │
│  🔄 Processing... 3/4 chunks done                 │
│                                                   │
│  ── Chunk 1 (0:00–1:00) ✅ ──────────────────     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ...14 slides   │
│  │  0:00  │ │  4:22  │ │  9:15  │                 │
│  └────────┘ └────────┘ └────────┘                 │
│                                                   │
│  ── Chunk 2 (1:00–2:00) ✅ ──────────────────     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ...12 slides   │
│  │ 1:02:10│ │ 1:15:33│ │ 1:28:07│                 │
│  └────────┘ └────────┘ └────────┘                 │
│                                                   │
│  ── Chunk 3 (2:00–3:00) ✅ ──────────────────     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ...11 slides   │
│  │ 2:03:45│ │ 2:18:20│ │ 2:31:55│                 │
│  └────────┘ └────────┘ └────────┘                 │
│                                                   │
│  ── Chunk 4 (3:00–3:42) 🔄 Processing... ──      │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  loading...      │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📄 Download PDF (37 ready, 1 chunk left)    │  │
│  │ ⚠️ Partial download — missing chunk 4       │  │
│  │                                             │  │
│  │ [ ⬇ Download Available (37) ]               │  │
│  │ [ ⏳ Wait for all 4 chunks ]                │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Partial download** — User doesn't have to wait! They can download the first 37 slides as PDF right now, and re-download the complete set when chunk 4 finishes.

#### Step 4: Final Result

```
┌───────────────────────────────────────────────────┐
│  ✅ 48 slides extracted in 18 min 34 sec          │
│     🧩 4 chunks · 5 duplicates removed            │
│                                                   │
│  [Select All ☑]   48 of 48 selected               │
│                                                   │
│  (full grid of 48 slides shown, organized         │
│   with chunk section headers)                     │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📄 Download PDF (48 slides) · ~12 MB        │  │
│  │ 📊 Download PPT (48 slides) · ~15 MB        │  │
│  │ 💾 Save as Project                          │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

**PDF: 48 pages, ~12 MB.** Each page = landscape slide image + timestamp + chunk label.

**PPT: 48 slides.** Full-bleed images, ready to present. Can be edited in PowerPoint/Google Slides.

> **Total time from paste to PDF: ~19 minutes** (but user had partial access after 5 min)

---

## 🔥 Tier 4: Ultra Long Video (6–12+ hours)

### Example: "Complete Python Bootcamp" — 9 hours 28 min

#### Step 1: Pre-flight — Strong Warning + Background Mode

```
┌─────────────────────────────────────────────┐
│  📺 Video Found                             │
│                                             │
│  ┌──────┐  "Complete Python Bootcamp"       │
│  │ thumb│   👤 Udemy (reuploaded)           │
│  │ nail │   ⏱️ 9 hours 28 minutes           │
│  └──────┘   📊 Tier 4 — Ultra Long Video    │
│             🧩 Will split into 10 chunks    │
│             🎯 ~80-120 slides expected      │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ ⚠️ ULTRA LONG VIDEO                  │   │
│  │                                      │   │
│  │ This will take 30-50 minutes.        │   │
│  │ Processing runs in the background.   │   │
│  │                                      │   │
│  │ We recommend:                        │   │
│  │ • Save as project to access later    │   │
│  │ • Enable notifications               │   │
│  │ • Partial downloads available as     │   │
│  │   each chunk completes               │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Chunks: 10 × 1 hour                       │
│                                             │
│  [ ▶ Start Background Processing ]          │
│  [ 🔔 Notify me when done ]                │
└─────────────────────────────────────────────┘
```

#### Step 2: User NEVER Waits — Background Mode

After clicking Start, user sees a **minimal banner** and can do ANYTHING else:

```
┌──────────────────────────────────────────────────────────────────┐
│ 🔄 "Python Bootcamp" — Chunk 3/10 · 22% · ~35 min remaining     │
└──────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                                                   │
│  Workspace — New Video                            │
│                                                   │
│  While your video processes, you can:             │
│                                                   │
│  🔗 Process another video                         │
│  ┌───────────────────────────────────────┐        │
│  │ Paste another YouTube URL...    [GO] │        │
│  └───────────────────────────────────────┘        │
│                                                   │
│  📂 Browse existing projects                      │
│  📊 Check your analytics                         │
│                                                   │
│  ── Active Jobs ──────────────────────────        │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📺 Complete Python Bootcamp                 │  │
│  │ ████████░░░░░░░░░░░░░░  22%                 │  │
│  │ Chunk 3/10 · 18 slides ready                │  │
│  │ [ 👀 Preview ] [ ⬇ Partial PDF (18) ]       │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
└───────────────────────────────────────────────────┘
```

#### Step 3: Progressive Chunk Completion

The **Projects** tab shows live status:

```
┌───────────────────────────────────────────────────┐
│  📂 Projects                                      │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📺 Complete Python Bootcamp     🔄 Active   │  │
│  │ 9h 28m · 10 chunks · Started 12 min ago     │  │
│  │                                             │  │
│  │ Chunk  1 ✅  12 slides                      │  │
│  │ Chunk  2 ✅  11 slides                      │  │
│  │ Chunk  3 ✅   9 slides                      │  │
│  │ Chunk  4 🔄  extracting frames... 67%       │  │
│  │ Chunk  5 ⏳  queued                         │  │
│  │ Chunk  6 ⏳  queued                         │  │
│  │ Chunk  7 ⏳  queued                         │  │
│  │ Chunk  8 ⏳  queued                         │  │
│  │ Chunk  9 ⏳  queued                         │  │
│  │ Chunk 10 ⏳  queued                         │  │
│  │                                             │  │
│  │ 📊 32 slides ready so far                   │  │
│  │                                             │  │
│  │ [ 👀 Preview slides ] [ ⬇ PDF (32) ]       │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ 📺 CSS Grid Tutorial           ✅ Complete  │  │
│  │ 2m 15s · 4 slides · Processed yesterday    │  │
│  │ [ 👀 View ] [ ⬇ PDF ] [ ⬇ PPT ]           │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

#### Step 4: Completion Notification

When all 10 chunks finish:

```
┌─────────────────────────────────────────────┐
│  🔔 NOTIFICATION                            │
│                                             │
│  ✅ "Complete Python Bootcamp" is ready!    │
│                                             │
│  98 slides extracted                        │
│  Processing time: 42 minutes                │
│                                             │
│  [ 👀 View Slides ]  [ ⬇ Download PDF ]    │
└─────────────────────────────────────────────┘
```

#### Step 5: Final Mega Slide Deck

```
┌───────────────────────────────────────────────────────┐
│  ✅ 98 slides · 9h 28m video · 42 min processing     │
│     🧩 10 chunks · 14 duplicates removed              │
│                                                       │
│  ── Filter by Chapter ──                              │
│  [All] [Ch.1 Basics] [Ch.2 Data Types] [Ch.3 OOP]   │
│  [Ch.4 Files] [Ch.5 Web] ...                         │
│                                                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│  │  0:00  │ │  5:33  │ │ 12:07  │ │ 18:45  │         │
│  │  Ch.1  │ │  Ch.1  │ │  Ch.1  │ │  Ch.1  │         │
│  └────────┘ └────────┘ └────────┘ └────────┘         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│  │ 1:02:10│ │ 1:15:33│ │ 1:28:07│ │ 1:41:22│         │
│  │  Ch.2  │ │  Ch.2  │ │  Ch.2  │ │  Ch.2  │         │
│  └────────┘ └────────┘ └────────┘ └────────┘         │
│                     ...98 slides...                   │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 📄 PDF  (98 slides · ~28 MB)                    │ │
│  │ 📊 PPT  (98 slides · ~35 MB)                    │ │
│  │ 📄 PDF  Chapter 3 only (12 slides · ~3 MB)      │ │
│  └──────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

> **Total time: ~42 min, but user had partial access after 5 min**

---

## 🔄 Returning User — Cache Hit (ANY Tier)

Someone else (or same user) pastes the SAME URL:

```
┌─────────────────────────────────────────────┐
│                                             │
│  ⚡ INSTANT LOAD                            │
│                                             │
│  This video was already processed!          │
│  Loaded from cache in 0.3 seconds           │
│                                             │
│  📺 "Node.js Full Tutorial"                 │
│  19 slides · Originally processed 2h ago    │
│                                             │
│  (slides grid appears immediately)          │
│                                             │
└─────────────────────────────────────────────┘
```

> Zero processing. Zero waiting. Cache key = videoId.

---

## 📊 PDF vs PPT — What Does the User Get?

### 📄 PDF Output

```
┌─────────────────────────────────────┐
│                                     │
│  VidSlides Export                    │
│  "Node.js Full Tutorial"            │
│  19 slides · Generated Apr 19 2026  │
│                                     │
├─────────────────────────────────────┤
│  Page 1 of 19                       │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     SLIDE IMAGE (full width)  │  │
│  │     720p resolution           │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ⏱ Timestamp: 0:00                  │
│  📍 Slide 1 of 19                   │
│                                     │
└─────────────────────────────────────┘
```

**Specs:**
- Landscape A4 orientation
- One slide per page
- Full-bleed image
- Timestamp + slide number as footer
- Video title as header on page 1
- File size: ~250KB per slide

### 📊 PPT Output

```
┌─────────────────────────────────────┐
│  PowerPoint Presentation            │
│                                     │
│  Slide 1:  Title slide              │
│    "Node.js Full Tutorial"          │
│    19 slides · VidSlides Export     │
│                                     │
│  Slide 2-20: Content slides        │
│    Full-bleed slide image           │
│    Timestamp in bottom corner       │
│    Editable in PowerPoint/Slides    │
│                                     │
│  Layout: Widescreen 16:9           │
│  Images: embedded (no links)       │
│  Editable: YES                     │
└─────────────────────────────────────┘
```

**Specs:**
- 16:9 widescreen
- Title slide + content slides
- Full-bleed images
- Editable text fields (timestamp, notes placeholder)
- Compatible: PowerPoint, Google Slides, Keynote

---

## ⏱ Quick Comparison Table

| Video | Duration | Chunks | Slides | Process Time | PDF Size | User Waits? |
|-------|----------|--------|--------|-------------|----------|-------------|
| CSS Grid 100s | 2 min | 1 | ~4 | 22 sec | 1 MB | Inline (sees progress bar) |
| React Crash Course | 25 min | 1 | ~10 | 2 min | 2.5 MB | Inline |
| Node.js Tutorial | 1h 15m | 3 | ~19 | 6 min | 5 MB | Can browse, partial at 2 min |
| CS50 Full Course | 3h 42m | 4 | ~48 | 18 min | 12 MB | Background, partial at 5 min |
| Python Bootcamp | 9h 28m | 10 | ~98 | 42 min | 28 MB | Background + notification |

---

## 🎯 Key UX Principles

1. **Never block the user** — Tier 1-2 show inline progress. Tier 3-4 run in background.
2. **Partial results always available** — As soon as 1 chunk completes, user can preview + download.
3. **Cache everything** — Same video = instant. Zero cost, zero wait.
4. **Show what's coming** — Pre-flight tells user the tier, chunk count, time estimate, and expected slide count BEFORE processing starts.
5. **Progressive enhancement** — Short videos feel instant. Long videos feel managed, not stuck.
