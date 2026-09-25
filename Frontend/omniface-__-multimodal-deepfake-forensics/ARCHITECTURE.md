# 🛡️ OmniFace — Multimodal Deepfake Forensics
## 🌐 Complete System Architecture & Engineering Documentation (Hinglish Guide)

---

## 1. 📌 Executive Architecture Overview (Poora System Ka Bird's Eye View)

**OmniFace** ek advanced, research-grade synthetic media (Deepfake) forensics aur verification platform hai. Is project ka primary aim video, image, aur audio media me generative AI manipulations, face-swapping, lip-sync drifts, aur biometric anomalies ko detect karna hai.

Frontend ko **Next.js 15 (App Router)** aur **TypeScript** me design kiya gaya hai jisme **Cyberpunk Dark Glassmorphic HUD Theme**, **GSAP ScrollTrigger cinematic sequencing**, **GPU-accelerated HTML5 Canvas (240-frame 3D robotic face scrubbing)**, aur **Full-featured Enterprise Forensic Dashboard** integrated hai.

```
OmniFace Full System Architecture
│
├── 🚀 [Core Frontend Shell] Next.js 15 App Router + React 19 + TypeScript
│   ├── app/layout.tsx (Global Fonts, Metadata & Root Theme Wrapper)
│   └── app/globals.css (Cyber CSS Tokens, Glassmorphism, Animations & HUD Grids)
│
├── 🎬 [Cinematic Landing Experience] app/page.tsx
│   ├── components/ScrollEngine.tsx (Global Synchronous Scroll Telemetry Engine)
│   ├── components/GlobalRoboticFace.tsx (240-Frame Canvas Scrubbing + Mouse Parallax)
│   ├── components/HeroProblemSequence.tsx (250vh Pinned Stage: Hero ➔ Problem Transition)
│   └── components/VerticalSectionsFlow.tsx (Sections 3 to 8 Seamless Flow)
│       ├── Section 3: HowItWorksSection.tsx (6-Stage Forensic Pipeline)
│       ├── Section 4: FeaturesSection.tsx (Biological & Spatial Detection Engine)
│       ├── Section 5: LiveDemoSection.tsx (Real-time Live Camera/Audio Forensic Radar)
│       ├── Section 6: TrustTechSection.tsx (Research Benchmarks & Multi-Model Weights)
│       ├── Section 7: UseCasesSection.tsx (Media, Enterprise, Legal, Banking Defense)
│       ├── Section 8: AuthSection.tsx (Authentication & Security Gateway)
│       └── Footer: CtaFooterSection.tsx (Python SDK Quickstart & Attribution)
│
├── 📊 [Enterprise Forensics Dashboard] app/dashboard/
│   ├── layout.tsx (Collapsible Cyber Sidebar + Telemetry Header + Active Route HUD)
│   ├── page.tsx (Live Media Analysis Studio — Video / Image / Audio Inspector)
│   ├── history/page.tsx (Forensic Scan Logs, Threat Filtering, Search & Detail Drawer)
│   ├── reports/page.tsx (Forensic Attestation Certificate Generator & PDF/JSON Exporter)
│   └── settings/page.tsx (API Keys Generation, Profile Config & Security Settings)
│
└── 🧠 [API & Services Layer] lib/api/
    ├── analysis.ts (FastAPI AI Inference Connection + High-Fidelity Realistic Offline Engine)
    ├── auth.ts (User Session Management, LocalStorage Persistence & Auth State)
    ├── history.ts (Forensic Audit Logs, Local Database CRUD & Stats Aggregation)
    └── reports.ts (Tamper-evident Forensic Certificate & Report Generation Engine)
```

---

## 2. ⚙️ Technology Stack & Dependencies (Kaunsi Tech Kaha Use Ho Rahi Hai)

| Layer / Module | Technology / Library | Purpose / Role |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19 | Server & Client Components, Dynamic Routing, Fast Hydration |
| **Language** | TypeScript (Strict Typing) | Robust Type Safety across API contracts and Component Props |
| **Animation Engine** | GSAP 3.x, GSAP ScrollTrigger | Scroll-driven timeline scrubbing, Stage Pinning, Staggered reveals |
| **Canvas Rendering** | HTML5 2D Canvas (GPU-Accelerated) | 60/120 FPS high-precision 240-frame robotic head sequence |
| **Styling & Theme** | Vanilla CSS Tokens + TailwindCSS | Glassmorphic HUD, Cyber neon gradients, Orbitron / Inter fonts |
| **Iconography** | Lucide React | High-contrast cybersecurity, biometric, and telemetry icons |
| **State & Storage** | LocalStorage + Reactive Event Listeners | Client-side persistent scan history, user profile, and session tokens |
| **Backend Integration** | FastAPI / Python (REST API) | Python AI neural network inference (`/api/v1/analyze`) with automatic fallback |

---

## 3. 🧩 Core Architectural Modules & Components (Deep Dive)

### 3.1 🛰️ Global Scroll Engine (`ScrollEngine.tsx`)
- **Kaam kya hai?** Scroll telemetry ko calculate karke pure application me bina extra re-renders ke sync karna.
- **Global Reactive Store (`globalScrollState`)**:
  - `targetScrollY` aur `currentScrollY` maintain karta hai.
  - `globalProgress` (0.0 se 1.0) aur `horizontalProgress` calculate karta hai.
- **Dual-loop Telemetry**:
  - Window scroll listener se direct coordinate capture.
  - `requestAnimationFrame` (RAF) loop se high-refresh display monitors (120Hz/144Hz) par zero stuttering scrolling ensure karta hai.

---

### 3.2 🤖 Global Robotic Face Canvas (`GlobalRoboticFace.tsx` & `RoboticFaceStage.tsx`)
- **Kaam kya hai?** User jaise-jaise page scroll karta hai, ek 3D robotic metallic face 360-degree inspect hota hua frame-by-frame scrub hota hai.
- **2-Tier Smart Preload Strategy**:
  - **Tier 1 (Instant Responsiveness)**: Shuru me har 4th frame (`step = 4`) load hota hai taaki initial render instant ho.
  - **Tier 2 (Background Hydration)**: Baki saare frames asynchronously background me memory me load hote hain bina UI thread ko block kiye.
- **Dynamic Mouse Parallax**:
  - User ke cursor position ke mutabiq face par subtle tilt aur angle shift apply hota hai (LERP damping ke sath).
- **GPU Canvas Pipeline**:
  - Device Pixel Ratio (DPR) aware high-resolution scaling.
  - Cyber scanline laser effect jo face ke upar vertically continuously sweep karta hai.

---

### 3.3 🎭 Master Pinned Cinematic Sequence (`HeroProblemSequence.tsx`)
- **Kaam kya hai?** Hero section aur Problem section ko ek single `250vh` pinned stage me seamless morph karna.
- **5-Phase Scroll Scrubbing Breakdown**:
  1. `0% – 20% (Hero Section Exit)`: Hero title aur CTA fade out hote hain (`opacity: 1 ➔ 0`) aur halka sa upward translate hote hain.
  2. `20% – 35% (Black Void Buffer)`: Pure dark screen transition aati hai taaki content clash na ho.
  3. `35% – 60% (Problem Background Reveal)`: Background video (`/assets/section2-bg.mp4`) zoom-in se settle hoti hai (`scale: 1.05 ➔ 1.00`).
  4. `60% – 80% (Threat Cards Staggered Unmasking)`: Problem section ke cyber badges, threat metrics cards aur real-world attack stats step-by-step reveal hote hain.
  5. `80% – 100% (Problem Section Active)`: Problem section fully interactive rehta hai aur fir natural scroll flow me Section 3 me enter kar jata hai.
- **Interactive Spotlight Aperture Mask**:
  - Hero image ke upar mouse pointer move karne par real-time forensic scanning mesh reveal hota hai.
  - User aperture size choose kar sakta hai: `Compact (140px)`, `Standard (260px)`, `Wide (380px)`.

---

### 3.4 ⚡ Vertical Section Flow (`VerticalSectionsFlow.tsx`)
- **Sections 3 to 8 Container**: Saare core landing page sections ek transparent glass container me render hote hain taaki background ka robotic face continuously visible rahe.
- **Included Sections**:
  - **Section 3 (`HowItWorksSection.tsx`)**: 6-Stage end-to-end multimodal pipeline ka visual timeline.
  - **Section 4 (`FeaturesSection.tsx`)**: Spatial frequency, rPPG heart rate pulse, aur phoneme lip-sync detection modules.
  - **Section 5 (`LiveDemoSection.tsx`)**: Real-time webcam / microphone input tester with simulated threat telemetry radar.
  - **Section 6 (`TrustTechSection.tsx`)**: Model weights, cross-validation AUC scores (99.4%), aur dataset benchmark tables.
  - **Section 7 (`UseCasesSection.tsx`)**: Media houses, Banking KYC, Courtroom evidence, aur Social platforms ke liye solutions.
  - **Section 8 (`AuthSection.tsx`)**: Security key access, login, and registration trigger point.
  - **Footer (`CtaFooterSection.tsx`)**: Quickstart Python SDK (`pip install omniface-sdk`), CLI terminal output preview aur links.

---

## 4. 🎛️ Dashboard & Enterprise Forensics Studio (`app/dashboard/`)

Dashboard platform ka main operational center hai jaha forensic investigators aur security teams live files analyze karti hain.

```
Dashboard Architecture
├── [Layout] app/dashboard/layout.tsx
│   ├── Collapsible Cyber Sidebar (Navigation, Status Badges, System Health)
│   ├── Top Header (Live System Telemetry, Session ID, User Profile Dropdown)
│   └── Main Workspace Container
│
├── [Analyze Studio] app/dashboard/page.tsx
│   ├── Dropzone / Media Uploader (Video, Image, Audio)
│   ├── Multi-Stage Live Processing Animation (0% ➔ 100%)
│   ├── Forensic Verdict Banner (DEEPFAKE DETECTED / AUTHENTIC MEDIA / SUSPICIOUS MANIPULATION)
│   ├── Confidence Gauge (e.g. 94.6% Confidence)
│   ├── Forensic Indicators Breakdown (Spatial Seams, rPPG Pulse, Audio Sync)
│   └── Modality Specific Inspectors:
│       ├── Video: Suspicious Frame Timeline Scrubber
│       ├── Image: Spatial Artifact Heatmap Overlay
│       └── Audio: Vocal Harmonizer Spectrogram & Waveform
│
├── [Audit History] app/dashboard/history/page.tsx
│   ├── Scan Metrics Overview (Total Scans, Flagged Deepfakes, Verified Authentic)
│   ├── Real-time Filter (All / Deepfakes / Authentic / Media Type)
│   ├── Search Bar (File Name, SHA-256 Hash, Verdict)
│   └── Detailed Forensic Slide-over Drawer (Signals, Raw Data, Metadata)
│
├── [Reports & Attestation] app/dashboard/reports/page.tsx
│   ├── Verified Forensic Reports Table
│   ├── Cryptographic SHA-256 Attestation Hash Display
│   └── Multi-Format Export:
│       ├── Download Full PDF Dossier
│       ├── View Digital HTML Certificate
│       └── Export JSON Telemetry
│
└── [User & API Settings] app/dashboard/settings/page.tsx
    ├── API Key Generation & Management (`omni_live_...`)
    ├── Profile Settings (Name, Email, Organization)
    └── Security & Notifications Toggle
```

---

## 5. 🧠 API & Services Architecture (`lib/api/`)

Frontend pure decoupling pattern follow karta hai jaha UI components direct business logic ya storage se deal nahi karte, balki dedicated services use karte hain:

```
UI Components (Dashboard / Pages)
       │
       ▼
┌────────────────────────────────────────────────────────┐
│               Service Abstraction Layer                │
├─────────────────┬────────────────────┬─────────────────┤
│  analysis.ts    │     auth.ts        │   history.ts    │
│ (Inference API) │ (Session & Profile)│ (Scan Audit Log)│
└────────┬────────┴─────────┬──────────┴────────┬────────┘
         │                  │                   │
         ▼                  ▼                   ▼
┌──────────────────┐ ┌──────────────────────────────────┐
│ FastAPI Backend  │ │ LocalStorage Engine / Browser DB │
│ (127.0.0.1:8000) │ │ (Offline Persistence & Fallback) │
└──────────────────┘ └──────────────────────────────────┘
```

### 5.1 `analysis.ts` (Media Analysis Service)
- **FastAPI Real Inference**: Next.js client backend endpoint (`/api/v1/analyze`) par `multipart/form-data` file bhejta hai.
- **Offline High-Fidelity Fallback**: Agar Python backend server offline hai, toh system graceful degradation ke sath realistic deepfake analysis generate karta hai (genuine indicator scores, dynamic processing latency, rPPG pulse waveforms, aur SHA-256 hash).
- **Strict Data Contract (`AnalysisResult`)**:
  - `classification`: `'DEEPFAKE DETECTED' | 'AUTHENTIC MEDIA' | 'SUSPICIOUS MANIPULATION'`
  - `confidence`: Percentage (e.g. `94.6%`)
  - `indicators`: Array of `{ name, score, status, description }`
  - `suspiciousFrames`, `audioWaveform`, `sha256`, `processingTimeMs`.

### 5.2 `history.ts` (Forensic Logs Service)
- Har completed analysis scan ko auto-save karta hai browser storage me.
- Seed data provide karta hai taaki initial testing par empty state na dikhe.
- Methods: `getAll()`, `getById(id)`, `save(record)`, `delete(id)`, `getStats()`.

### 5.3 `reports.ts` (Certification & Export Service)
- Forensic investigation reports generate karta hai.
- `exportReport(result, 'pdf' | 'certificate' | 'json')` pipeline provides instant download with digital forensic stamping.

### 5.4 `auth.ts` (Authentication Service)
- Current logged-in user state, tokens aur user role (`Tier: Enterprise Investigator / Level 4 Clearance`) handle karta hai.

---

## 6. 🔬 Multimodal Forensic AI Pipeline (AI Model Kaise Kaam Karta Hai)

OmniFace 3 distinct biological aur neural modalities ko cross-examine karta hai:

```
                            ┌────────────────────────┐
                            │    Input Media File    │
                            │ (Video / Image / Audio)│
                            └───────────┬────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│ 1. Spatial Domain    │     │ 2. Biometrics (rPPG) │     │ 3. Cross-Modal Audio │
│                      │     │                      │     │                      │
│ • High-frequency FFT │     │ • Micro-vascular     │     │ • Phoneme vs Viseme  │
│ • Blending seams     │     │   sub-surface pulse  │     │   lip sync latency   │
│ • Checkerboard noise │     │ • Heart rate (BPM)   │     │ • Voice synthesis    │
│   residual artifacts │     │ • Blood volume pulse │     │   harmonic anomaly   │
└──────────┬───────────┘     └──────────┬───────────┘     └──────────┬───────────┘
           │                            │                            │
           └────────────────────────────┼────────────────────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │   Cross-Attention Neural      │
                        │        Lattice Fusion         │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │     Cryptographic Hash        │
                        │    (SHA-256 Attestation)      │
                        └───────────────┬───────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │       FINAL VERDICT           │
                        │    [ DEEPFAKE DETECTED ]      │
                        │    Confidence: 94.6% AUC      │
                        │    Chain of Custody Ready     │
                        └───────────────────────────────┘
```

1. **Spatial Frequency & Boundary Residuals**: Generative models (StyleGAN, Diffusion, FaceSwap) pixel boundaries par unnatural frequency residuals chhodte hain jo 2D Fourier Transform se detect hote hain.
2. **Biological rPPG Pulse (Remote Photoplethysmography)**: Asli insaan ke chehre par blood flow ki vajah se micro-color variations hote hain jo pulse create karte hain. AI deepfakes me ye blood volume pulse **0.0 BPM (Flatline)** hota hai.
3. **Phoneme-Viseme Cross-Attention Drift**: Audio me bole gaye words (phonemes) aur video me lip movements (visemes) ke darmiyan milliseconds ka synchronization offset detect hota hai.

---

## 7. 📁 Complete Project Directory Tree (Folder Structure)

```
Omniface version 2.0/
│
├── Frontend/
│   ├── ARCHITECTURE.md                                # Root System Architecture (This File)
│   ├── package-lock.json                              # Dependencies Lockfile
│   └── omniface-__-multimodal-deepfake-forensics/     # Next.js Application Core
│       ├── app/
│       │   ├── globals.css                            # Global CSS Variables, Themes & HUD Styling
│       │   ├── layout.tsx                             # Master HTML Layout with Fonts & Meta
│       │   ├── page.tsx                               # Cinematic Landing Page
│       │   ├── login/page.tsx                         # Login Portal
│       │   ├── register/page.tsx                      # User Registration
│       │   ├── api/
│       │   │   └── upload/route.ts                    # Next.js API Route for File Ingestion
│       │   └── dashboard/
│       │       ├── layout.tsx                         # Dashboard Shell (Sidebar + Navigation)
│       │       ├── page.tsx                           # Forensic Studio (Main Analysis View)
│       │       ├── history/page.tsx                   # Scan Logs & Threat Filtering
│       │       ├── reports/page.tsx                   # Certification & Report Exporter
│       │       └── settings/page.tsx                  # API Keys & User Preferences
│       │
│       ├── components/
│       │   ├── AuthSection.tsx                        # Section 8: Authentication Gateway
│       │   ├── CtaFooterSection.tsx                   # Footer: Python SDK & Attribution
│       │   ├── FeaturesSection.tsx                    # Section 4: Forensic Capabilities
│       │   ├── GlobalRoboticFace.tsx                  # 240-Frame Canvas Layer
│       │   ├── HeroNav.tsx                            # Top Cyber Nav with Live Attestation Badge
│       │   ├── HeroProblemSequence.tsx                # Master 250vh Hero->Problem Scrub Stage
│       │   ├── HowItWorksSection.tsx                  # Section 3: 6-Stage Forensic Pipeline
│       │   ├── LiveDemoSection.tsx                    # Section 5: Real-time Camera/Mic Simulator
│       │   ├── ProblemSection.tsx                     # Section 2: Synthetic Threat Landscape
│       │   ├── RoboticFaceStage.tsx                   # Canvas Robotic Head Render Engine
│       │   ├── ScrollEngine.tsx                       # Synchronous Scroll Telemetry Engine
│       │   ├── TrustTechSection.tsx                   # Section 6: Research Benchmarks & Validation
│       │   ├── UseCasesSection.tsx                    # Section 7: Enterprise Defense Verticals
│       │   └── VerticalSectionsFlow.tsx               # Transparent Container for Sections 3-8
│       │
│       ├── lib/
│       │   ├── utils.ts                               # Tailwind CSS Classnames Utility
│       │   └── api/
│       │       ├── analysis.ts                        # Media Analysis Service & Data Models
│       │       ├── auth.ts                            # Session & User Profile Service
│       │       ├── history.ts                         # Scan Logs Storage & Query Service
│       │       └── reports.ts                         # PDF & Certificate Export Engine
│       │
│       ├── public/
│       │   ├── assets/
│       │   │   ├── robot_frames/                      # 240 Frame PNGs (ezgif-frame-001.png to 240.png)
│       │   │   └── section2-bg.mp4                    # Problem Section High-Def Video Texture
│       │   ├── hero-base.png                          # Base Hero Visual Layer
│       │   └── hero-reveal.png                        # Forensic Mesh Reveal Mask
│       │
│       ├── package.json                               # Dependencies & Build Scripts
│       ├── tsconfig.json                              # TypeScript Rules & Path Aliases (`@/*`)
│       └── next.config.ts                             # Next.js Runtime Configuration
```

---

## 8. 🚀 Performance, Security & Optimization Principles

1. **Zero Cumulative Layout Shift (CLS = 0)**:
   - Saare stage containers fixed/absolute geometry aur clamp sizing (`clamp(24px, 3vw, 32px)`) follow karte hain taaki scroll ke waqt koi sudden jump na aaye.
2. **GPU Hardware Acceleration**:
   - High-load canvas nodes aur moving layers par `will-change: transform, opacity` aur `transform: translate3d(0,0,0)` use kiya gaya hai.
3. **Memory Leak Prevention**:
   - `GlobalRoboticFace` me animation frames aur scroll event listeners component unmount hone par cleanly cancel/remove hote hain.
4. **Resilient Offline Architecture**:
   - Backend unavailable hone par bhi user ko crash screen dekhne ko nahi milti; frontend intelligent mock telemetry generator use karke full investigation experience provide karta hai.
5. **Chain-of-Custody Evidence Security**:
   - Har scan par SHA-256 digital fingerprint generate hoti hai jo tamper-proof forensics report banati hai.

---
*Documentation Version: 2.0.0 (Enterprise Multimodal Release)*  
*Maintained by: OmniFace Core Engineering & Research Team*
