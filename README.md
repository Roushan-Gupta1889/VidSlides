# 🎬 VidSlides

> **Turn any YouTube video into presentation slides instantly.**

VidSlides is a modern web application that automatically processes YouTube videos of any length and extracts keyframes to generate comprehensive, high-quality presentation slides in PDF or PowerPoint (PPTX) formats. 

Built with performance and user experience in mind, VidSlides utilizes a dynamic, multi-tier processing engine to ensure rapid results, whether you are converting a 2-minute tutorial or a 10-hour bootcamp.

---

## ✨ Core Features

VidSlides intelligently categorizes videos into 4 processing tiers to optimize speed and resource usage:

- **🟢 Tier 1: Short Videos (0–30 min)**
  - Lightning-fast, single-pass processing. Extracts slides from a 5-minute video in under 30 seconds.
- **🟡 Tier 2: Medium Videos (30 min – 2 hours)**
  - Parallel chunk processing. Splits the video and runs multiple extraction workers simultaneously. Real-time progress updates via Server-Sent Events (SSE).
- **🔴 Tier 3: Long Videos (2–6 hours)**
  - Background processing. Users can freely navigate the app while partial results stream in. Downloads are progressively available as chunks complete.
- **🔥 Tier 4: Ultra Long Videos (6–12+ hours)**
  - Full background mode with notification systems. Never blocks the user. Processes massive courses efficiently with chunked deduplication.

### Additional Capabilities
- **Smart De-duplication:** Automatically filters out visually identical or irrelevant frames.
- **Instant Cache:** Previously processed videos load instantly from the cache.
- **Multi-Format Export:** Download slides as high-resolution PDFs or fully editable 16:9 PPTX files.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **State Management:** Zustand
- **Routing:** React Router DOM v7
- **Animations & UI:** Framer Motion, Lenis (Smooth Scrolling), Three.js / React Three Fiber
- **Data Fetching:** Axios

### Backend (Server)
- **Environment:** Node.js + Express
- **Video Processing:** FFmpeg (`fluent-ffmpeg`, `ffmpeg-static`), `yt-dlp-exec`
- **Image Processing:** Sharp
- **Document Generation:** `pdfkit` (PDFs), `pptxgenjs` (PowerPoint)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- FFmpeg (Installed automatically via `ffmpeg-static`, but system-level FFmpeg is recommended for advanced usage).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vidslides.git
   cd vidslides
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   *(This will install dependencies for the root, client, and server).*

3. **Run the development servers:**
   ```bash
   npm run dev
   ```
   *(This uses `concurrently` to boot up both the Vite frontend and the Express backend).*

---

## 📈 Development Roadmap

### ✅ Current Phase: Core Engine & Performance
- [x] Client/Server architecture setup.
- [x] `yt-dlp` integration for video metadata and streaming.
- [x] High-performance hybrid frame extraction (Scene detection for short videos, parallelized keyframe seeking for long content to prevent timeouts).
- [x] Parallel chunking system for multi-hour videos.
- [x] SSE (Server-Sent Events) for real-time frontend progress bars.
- [x] PDF and PPTX compilation.

### 🚀 Future Phase 1: Cloud Infrastructure & Scalability
- **Cloud Workers:** Offload heavy FFmpeg processing from the main Node server to isolated cloud workers (e.g., AWS ECS or serverless GPU functions).
- **Cloud Storage:** Implement Amazon S3 to store downloaded video chunks, extracted frames, and final PDF/PPTX assets.
- **Distributed Caching:** Replace local caching with Redis to instantly serve previously processed videos across distributed instances.

### 🔐 Future Phase 2: User Accounts & Workspaces
- **Authentication:** Integrate OAuth (Google, GitHub) and secure JWT-based login.
- **Project Dashboard:** Allow users to save their processed videos, view extraction history, and manage their slide library.
- **Interactive Slide Editor:** Build a frontend interface to let users delete, reorder, or manually add notes to extracted slides before exporting.

### 🧠 Future Phase 3: AI Enhancements
- **Smart Summarization:** Use LLMs (like OpenAI GPT-4o or Claude 3.5) to transcribe the video audio and automatically generate bullet points/summaries for each slide.
- **Speaker Notes:** Automatically inject transcribed audio corresponding to the slide's timestamp into the PPTX speaker notes.
- **Semantic Frame Selection:** Use Vision AI to determine the "most important" slides rather than relying solely on visual pixel differences.

### 💳 Future Phase 4: Monetization & SaaS
- **Stripe Integration:** Implement subscription tiers (e.g., Pro users get faster processing, higher resolution, and longer video limits).
- **Credit System:** Introduce a pay-as-you-go credit system for processing Tier 3 and Tier 4 (Ultra Long) videos.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
