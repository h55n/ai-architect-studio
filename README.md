# 🏛️ AI Architect Studio

> **Describe your dream. Watch it breathe. Step inside.**

AI Architect Studio is a professional-grade architectural experimentation platform. It utilizes a sophisticated two-phase AI pipeline to translate human lifestyle preferences into precise, interactive 3D spatial geometry.

![Header](https://raw.githubusercontent.com/h55n/ai-architect-studio/master/docs/assets/banner_placeholder.png)

---

## ✨ Key Experience

### 🤖 Two-Phase Architectural AI
Forget generic boxes. Our bespoke pipeline uses **Mistral Large** to first draft an **Architectural Brief** (intent, style, mood) before a secondary **Structural Pass** calculates precise coordinates, wall cutouts, and volumetric light shafts.

### 📐 High-Fidelity 3D Viewer
*   **Procedural Geometry:** Real wall thickness, floor trim, and window/door openings.
*   **Volumetric Sunlight:** Real-time spotlights simulating sun-path through window glass.
*   **Interactive HUD:** Section planes (X-Ray), Exploded architectural diagrams, and smooth 2D/3D transitions.
*   **ACES Filmic:** Cinema-grade tone mapping and soft-shadow rendering.

### 🛠️ Custom Builder (Beta)
A blank-canvas canvas powered by `@dnd-kit`. Drag rooms, walls, and furniture directly from an asset library onto the infinite grid using professional-grade raycasting and transformation handles.

---

## 🚀 Quick Start

### 1. Bootstrap Environment
```bash
# Install dependencies and setup local config
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure Credentials
Edit your `.env` file with your [Mistral API Key](https://console.mistral.ai/):
```env
MISTRAL_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Launch Studio
```bash
npm run dev
```
Open [localhost:3000](http://localhost:3000).

---

## 🎨 Design System

Our aesthetic prioritizes **Premium Minimalism** with a warm **Ceramic & Glass** palette.

| Token | Variable | Value (Light) | Role |
| :--- | :--- | :--- | :--- |
| **Beige** | `--bg` | `#FDF8E2` | Canvas & Background |
| **Ink** | `--text-primary` | `#1A1828` | High-contrast Typography |
| **Violet** | `--violet-dark` | `#504E76` | Structural UI & Borders |
| **Accent** | `--accent` | `#1A56DB` | Primary Interaction |
| **Sage** | `--sage` | `#A3B565` | Cinematic Accents |

---

## 🛠️ Technology Stack

*   **Framework:** Next.js 14 (App Router)
*   **3D Engine:** React Three Fiber + Three.js + @react-three/drei
*   **Intelligence:** Mistral AI (Large-latest + Small-latest)
*   **State:** Zustand (Theme-aware & Scene-aware)
*   **Validation:** Zod
*   **Dnd:** @dnd-kit
*   **Styling:** Tailwind CSS + Vanilla CSS Tokens

---

## 📂 Project Architecture

```
/ai-architect-studio
├── src/
│   ├── app/
│   │   ├── page.tsx              ← AI Quiz Entry
│   │   ├── viewer/               ← AI Result Visualization
│   │   ├── builder/              ← Manual Scratch Mode [NEW]
│   │   └── api/                  ← Split-Phase Generation
│   ├── components/
│   │   ├── quiz/                 ← Lifecycle Components
│   │   ├── viewer/               ← Advanced 3D Assets
│   │   └── ui/                   ← Glassmorphism Primitives
│   ├── store/                    ← Global Reactive States
│   └── styles/                   ← Token-based CSS System
└── scripts/                      ← Dev Automation
```

---

## 🛡️ License
Private Repository. All Rights Reserved.
