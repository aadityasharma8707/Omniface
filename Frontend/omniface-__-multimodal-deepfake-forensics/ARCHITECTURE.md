# OmniFace — Multimodal Deepfake Forensics
## Frontend System Architecture & Engineering Specification

---

## 1. Executive Architecture Overview

**OmniFace** is an advanced, research-grade synthetic media forensics platform. The frontend is engineered as a high-performance, GPU-accelerated **Next.js (App Router)** single-page application combining **GSAP ScrollTrigger cinematic sequencing**, **hardware-accelerated HTML5 Canvas frame scrubbing**, and **translucent glassmorphic HUD interfaces**.

```
OmniFace Frontend Architecture
│
├── [Root Layer] app/layout.tsx + app/globals.css
│
├── [Master Scroll Engine] components/ScrollEngine.tsx (Global Synchronous Telemetry)
│
├── [Global Canvas Layer (z-index: 0)] components/GlobalRoboticFace.tsx
│   └── 240-Frame Preloaded Canvas Sequence + Mouse Parallax + Cyber Scanning HUD
│
└── [Interactive Foreground (z-index: 10)] app/page.tsx
    ├── [Pinned Cinematic Sequence (250vh)] components/HeroProblemSequence.tsx
    │   ├── Stage Layer 1: Section 1 (Hero) — Operative Mesh & Spotlight Masking
    │   └── Stage Layer 2: Section 2 (Problem) — Video Background & Threat Vectors
    │
    └── [Vertical Flow Container] components/VerticalSectionsFlow.tsx
        ├── Section 3: How It Works / Forensic Pipeline (6-Stage Multimodal Fusion)
        ├── Section 4: Features Section (Biological & Spatial Detection)
        ├── Section 5: Live Demo Section (Simulated Radar & Attestation Verdict)
        ├── Section 6: Research Architecture & Trust/Tech (Methodology & Benchmarks)
        ├── Section 7: Use Cases (Media, Finance, Government, Enterprise)
        ├── Section 8: Auth & Verification Gateway (Credentials & Access)
        └── Footer: Quickstart SDK & Forensic Terminal
```

---

## 2. Technology Stack

| Layer | Technologies / Libraries | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19, TypeScript | Server Components, Client Hydration, Type Safety |
| **Animation Engine** | GSAP 3.x, GSAP ScrollTrigger | Scroll-driven timeline scrubbing, pinning, stage orchestration |
| **Rendering** | HTML5 Canvas 2D Context (Hardware-Accelerated) | 60/120fps 240-frame sequence rendering, mouse tilt |
| **Styling** | Vanilla CSS Tokens (`globals.css`), TailwindCSS | Cyberpunk dark theme, glassmorphic HUD, Orbitron & Inter typography |
| **Icons** | Lucide React | High-contrast cybersecurity & telemetry iconography |

---

## 3. Core Architectural Modules

### 3.1 Master Directional Scroll Engine (`ScrollEngine.tsx`)
- **Global Reactive Store (`globalScrollState`)**: Maintains zero-re-render shared scroll telemetry (`targetScrollY`, `currentScrollY`, `globalProgress`, `globalOpacity`, `horizontalProgress`).
- **Synchronous Telemetry**: Runs an immediate synchronous scroll listener alongside a high-frequency `requestAnimationFrame` (RAF) loop for smooth momentum tracking on high-refresh displays.

### 3.2 Global Robotic Face Canvas (`GlobalRoboticFace.tsx`)
- **Preload Strategy**: Two-tier memory preloading for 240 PNG image frames (`/assets/robot_frames/ezgif-frame-XXX.png`):
  - *Tier 1*: Loads keyframes every 4th frame for instant responsiveness.
  - *Tier 2*: Background asynchronous hydration of remaining frames with nearest-neighbor fallback.
- **ScrollTrigger Activation**: Automatically activates when **Section 3 (How It Works)** reaches the viewport threshold (`start: 'top 85%'`, `end: 'bottom bottom'`).
- **GPU Canvas Pipeline**:
  - Device Pixel Ratio (DPR) scaled canvas rasterization.
  - Aspect-ratio cover calculations with vertical parallax motion (`translateY(-8vh) → translateY(+8vh)`).
  - Continuous mouse-tilt telemetry (`targetX`, `targetY` lerp damping).
  - Real-time animated cyber scan line and radial vignette.

### 3.3 Master Pinned Sequence (`HeroProblemSequence.tsx`)
- **Pinned 250vh Stage**: Pins Section 1 (Hero) and Section 2 (Problem) into a single 100dvh viewport stage.
- **5-Phase Scroll Scrub Progression**:
  1. `0% – 20% (Hero Exit)`: Hero section fades out (`1 → 0`) with subtle upward translation (`0 → -40px`).
  2. `20% – 35% (Black Transition)`: Viewport holds at pure black for visual separation.
  3. `35% – 60% (Problem Background)`: Background video (`/assets/section2-bg.mp4`) scales down (`1.05 → 1.00`) and fades in (`0 → 1`).
  4. `60% – 80% (Content Reveal)`: Sequential staggered reveal of Section badge, blurred title unmasking (`8px → 0px`), subtitle, threat cards, and stats banner.
  5. `80% – 100% (Problem Settled)`: Problem section fully established and interactive.
- **Natural Unpin Transition**: Problem section smoothly scrolls up into Section 3 without vanishing or artificial clipping.
- **Interactive Spotlight Mesh**: Dynamic circular radial-gradient mask on `#reveal-img` responding to mouse and touch coordinates with adjustable aperture sizes (`Compact (140px)`, `Standard (260px)`, `Wide (380px)`).

### 3.4 Vertical Section Flow (`VerticalSectionsFlow.tsx`)
- **Transparent Layout Container**: Renders with `backgroundColor: 'transparent'` to allow the persistent robotic face canvas (`z-index: 0`) to shine through.
- **ScrollTrigger Reveal Hooks**: Employs `toggleActions: 'play none none reverse'` so cards reveal smoothly upon entering the viewport and **never vanish or fade out when centered**.
- **Transparent Borderless Cyber Cards**:
  - Pure translucent gradient: `linear-gradient(135deg, rgba(0, 229, 255, 0.04) 0%, rgba(10, 16, 26, 0.35) 45%, rgba(6, 10, 16, 0.48) 100%)`.
  - `backdrop-filter: blur(16px)`.
  - Borderless (`border: none`) with soft atmospheric box shadows (`0 8px 32px rgba(0, 0, 0, 0.45)`).
  - High-contrast text with ambient drop shadows for readability.

---

## 4. Multimodal Forensics Pipeline Overview

```
                          ┌────────────────────────┐
                          │  Input Media Asset     │
                          │ (Image / Video / Audio)│
                          └───────────┬────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │    Feature Extraction     │
                        ├───────────────────────────┤
                        │ • Spatial Frequency       │
                        │ • Biological rPPG Pulse   │
                        │ • Phoneme / Audio Sync    │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │ Cross-Attention Fusion    │
                        │      Neural Lattice       │
                        └─────────────┬─────────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │   Forensic Attestation    │
                        │  Confidence: 99.4% AUC    │
                        │   Latency: 12ms Verdict   │
                        └───────────────────────────┘
```

---

## 5. File Structure & Component Map

```
Frontend/omniface-__-multimodal-deepfake-forensics/
├── app/
│   ├── globals.css                # Global Cyber Design Tokens, Animations & Cards
│   ├── layout.tsx                 # Root HTML shell & metadata
│   └── page.tsx                   # Master Landing Page orchestration
├── components/
│   ├── AuthSection.tsx            # Section 8: Authentication & Access Gateway
│   ├── CtaFooterSection.tsx       # Footer: Python SDK Quickstart & Attribution
│   ├── FeaturesSection.tsx        # Section 4: Forensic Capabilities & Detection
│   ├── GlobalRoboticFace.tsx      # Persistent 240-Frame Canvas Animation Layer
│   ├── HeroNav.tsx                # Floating Top Cyber Navigation Bar
│   ├── HeroProblemSequence.tsx    # Master 250vh Pinned Hero->Problem Sequence
│   ├── HowItWorksSection.tsx      # Section 3: 6-Stage End-to-End Forensic Pipeline
│   ├── LiveDemoSection.tsx        # Section 5: Real-time Live Telemetry Simulator
│   ├── ProblemSection.tsx         # Section 2: Threat Landscape & Synthesis Vectors
│   ├── ScrollEngine.tsx           # Directional Synchronous Scroll Telemetry System
│   ├── TrustTechSection.tsx       # Section 6: Research Architecture & Benchmarks
│   ├── UseCasesSection.tsx        # Section 7: Industry Defense Verticals
│   └── VerticalSectionsFlow.tsx   # Master Transparent Container for Sections 3–8
├── public/
│   ├── assets/
│   │   ├── robot_frames/          # 240 PNG Frames for Robotic Head Sequence
│   │   └── section2-bg.mp4        # Section 2 Problem Video Background
│   ├── hero-base.png              # Operative Hero Base Texture
│   └── hero-reveal.png            # Operative Hero Forensic Mesh Texture
├── package.json                   # Dependencies and Scripts
├── tsconfig.json                  # TypeScript Compiler Configuration
└── ARCHITECTURE.md                # System Architecture & Technical Documentation
```

---

## 6. Performance & Quality Benchmarks

- **Zero Layout Shift (CLS)**: Absolute pinning and isolated stage layers guarantee stable geometry during scroll.
- **Synchronous 1:1 Scrub**: Eliminates lerp decay delays and float precision deadzones.
- **Hardware Acceleration**: Critical layout nodes specify `will-change: transform, opacity` with canvas blits rounded to integer pixel coordinates.
- **Responsive Geometry**: Viewport calculations utilize clamp scaling (`clamp(14px, 2vh, 28px)`) ensuring proportional aesthetics from mobile screens to 4K ultra-wide monitors.
