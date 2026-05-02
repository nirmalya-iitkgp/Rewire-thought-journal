# Rewire: Privacy-First Digital Wellness

Rewire is a specialized web application designed to help people break compulsive digital coping habits and reduce loneliness through behavioral neuroscience and simple, human-centric design.

## The Philosophy

Unlike traditional "habit trackers," Rewire avoids streaks, counters, and clinical jargon. It acts as a **Calm Friend**, offering one action at a time and focusing on long-term growth rather than short-term compliance.

### The Two-Layer Architecture

1.  **Layer 1: The Engine (Invisible)**
    All algorithms and behavioral research logic live here. It tracks impulsivity (delay discounting), habit momentum, and trigger patterns without surfacing complex charts or scores to the user.
2.  **Layer 2: The Experience (Visible)**
    A warm, minimal interface that provides plain-language micro-copy, grounding exercises, and "Connection Missions" to encourage real-world social interaction.

## Core Features

-   **Decision Engine**: Analyzes your current state (mood, time, energy) to suggest the one most helpful action for right now.
-   **Panic Mode ("I need a minute")**: A guided breathing and grounding environment designed to ride out intense urges using personalized decay models.
-   **Connection Missions**: Achievable, real-world tasks designed to reduce social isolation.
-   **Silent Progress**: Replaces numbers with narrative reflections and growth metaphors (🌱 → 🌲).
-   **Privacy-First**: Zero tracking. Zero cloud by default. Everything is stored locally on your device using encrypted IndexedDB.

## Technical Stack

-   **Frontend**: React 19, TypeScript, Vite.
-   **Styling**: Tailwind CSS 4, Shadcn/UI.
-   **Logic**: Custom TypeScript Engines for behavioral modeling.
-   **Storage**: Dexie.js (IndexedDB).
-   **Animations**: Framer Motion / Motion.

## Privacy & Security

Rewire is built with a "Zero Knowledge" architecture. 
-   No accounts are required.
-   No telemetry or analytics.
-   Data is stored locally and can be exported or deleted entirely by the user at any time.

---
*Created with care for personal growth.*
