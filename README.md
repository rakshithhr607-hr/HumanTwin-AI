# HumanTwin AI

> **An evolving AI-powered Digital Twin that learns from permitted user context, simulates decisions, and provides personalized decision support.**

[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8.svg)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg)](https://www.sqlite.org/)
[![Human In The Loop](https://img.shields.io/badge/Governance-Human--In--The--Loop-10b981.svg)](#privacy--governance)

---

## 1. Product Vision & Story

Existing digital assistants (Siri, ChatGPT, Alexa) answer isolated, transactional questions, but **they do not continuously understand the person behind those questions**.

**HumanTwin AI** creates an evolving digital representation of the user based **only** on information the user explicitly provides or permits the system to use. It is designed as a **decision-support platform**, NOT an autonomous system that makes decisions for the user. The human remains in full control at all times.

### Core Capabilities

1. **Context Understanding**: Synthesizes active workload, stated goals, daily calendar anchors, and study pacing.
2. **Behavioral Pattern Recognition**: Inferences habits (e.g. session length thresholds, deadline proximity patterns) from real historical logs rather than inventing assumptions.
3. **What-If Simulation**: Compares prospective decisions before you commit, calculating realistic available hours, conflict risks, and deadline pressures.
4. **Active Learning Feedback Loop**: Captures explicit user feedback (`👍 Yes` / `👎 No`), updating underlying decision rules live in the model (`Before` vs `After` rule tracking).
5. **Zero-Leakage Privacy Control**: Fine-grained permissions over 8 data categories with one-click data deletion and twin resets.

---

## 2. Hackathon Demo Scenario (Arjun)

The system comes pre-configured with a synthetic engineering student named **Arjun**:

* **Goals**: Score well in upcoming exams, complete assignments on time, maintain consistent sleep (7.5–8 hrs), improve programming skills.
* **Routine**:
  * College Lectures & Labs: `9:00 AM – 4:00 PM` (Mon–Fri)
  * Campus Buffer / Transit: `4:00 PM – 6:00 PM`
  * Evening Study Window: `6:00 PM – 9:00 PM` (3.0 hours available study capacity)
  * Dinner & Wind Down: `9:00 PM – 10:30 PM`
  * Sleep: `10:30 PM – 6:30 AM` (Non-negotiable health anchor)
* **Upcoming Deadlines**:
  1. **Physics Assignment**: Due **October 2** (4.0 hrs required, High Priority)
  2. **Mathematics Exam**: Due **October 4** (8.0 hrs required, 45% prepared, High Priority)
  3. **Programming Assignment**: Due **October 6** (5.0 hrs required, Medium Priority)
* **Historical Patterns (System-Inferred)**:
  * Studies 2–3 hours on weekdays in the evening.
  * Historical volume increases by ~45% in the 72h window before exams.
  * Often delays assignments until close to the deadline.
  * Completes sessions more consistently when limited to 60–90 minutes with breaks.
  * Tends to underestimate assignment completion time by ~20%.

---

## 3. The 9-Step Hackathon Presentation Flow

Follow this exact live presentation flow (also accessible via the top walkthrough banner in the UI):

1. **Step 1: Open HumanTwin AI**
   * Review the header: `"Your Digital Twin currently understands 7 preferences, 4 goals, 3 tasks, and 5 behavioral patterns."`
   * Observe confidence rating (`88% Calibrated`) and privacy status (`Controlled by you`).

2. **Step 2: Inspect "What Does My Twin Know About Me?"**
   * Navigate to the **What Twin Knows** tab.
   * View the distinct labeling: `[User-Provided]`, `[System-Inferred]`, `[Learned from Feedback]`.

3. **Step 3: Launch What-If Simulator**
   * Ask: *"What will happen if I spend the next two days preparing for my Mathematics exam instead of working on my Physics assignment?"*

4. **Step 4: Compare Side-by-Side Scenarios**
   * **Scenario A (Focus on Math Exam)**: Math reaches 85% readiness, but Physics is postponed. **High Risk** due to October 2 deadline collision with 9 AM – 4 PM college hours.
   * **Scenario B (Complete Physics First)**: Physics 100% completed & submitted. Math prep paces across Oct 2 evening and Oct 3. **Low Risk** for Physics / **Moderate Risk** for Math.

5. **Step 5: Review Personalized Recommendation & Explainability**
   * System recommends a balanced schedule:
     * `6:00 PM – 7:30 PM` → Mathematics Exam Prep (90 min focused session)
     * `7:30 PM – 7:45 PM` → Rest Break (15 min)
     * `7:45 PM – 8:45 PM` → Physics Assignment (60 min)
     * `8:45 PM – 9:00 PM` → Review & Tomorrow's Plan (15 min)
   * Click **"Why am I seeing this recommendation?"** to inspect all 7 grounded factors.

6. **Step 6: User Provides Feedback**
   * Click **"👎 No, I would choose differently"**.
   * Select: *"I would still choose the assignment first."*

7. **Step 7: Provide Feedback Reason**
   * Select: *"The assignment deadline is more important to me."*
   * Click **Submit & Update Twin**.

8. **Step 8: Observe Live Twin Update ✓**
   * The **Twin Updated ✓** banner appears immediately showing:
     * **BEFORE FEEDBACK**: `"User tends to prioritize upcoming exams or balanced splitting."`
     * **AFTER FEEDBACK**: `"When an assignment deadline is within 48 hours, prioritize the assignment even when an exam is approaching."`

9. **Step 9: Dynamic Re-Evaluation (The "Aha!" Moment)**
   * Click **"Re-Simulate with Updated Twin"**.
   * The system dynamically updates its recommendation:
     * Recommendation now selects **Scenario B** (Physics first) because of your newly learned priority rule!
     * Practical schedule shifts to allocating `6:00 PM – 8:45 PM` directly to Physics!

---

## 4. Architecture & Tech Stack

```
human-twin/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py         # REST endpoints for twin, what-if, feedback, chat
│   │   ├── models/
│   │   │   ├── database.py       # Native SQLite database setup
│   │   │   └── db_manager.py     # Clean CRUD operations & queries
│   │   ├── schemas/
│   │   │   └── schemas.py        # Pydantic data schemas
│   │   ├── services/
│   │   │   └── ai_provider.py    # LLM abstraction (Gemini / OpenAI / Fallback)
│   │   ├── twin_engine/
│   │   │   ├── engine.py         # Privacy context builder & pattern identifier
│   │   │   ├── simulation.py     # Deterministic What-If scenario engine
│   │   │   ├── learning.py       # Active feedback & preference learning loop
│   │   │   ├── chat.py           # Grounded conversational reasoning engine
│   │   │   └── demo_data.py      # Arjun synthetic student seeder
│   │   └── main.py               # FastAPI entrypoint & CORS setup
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx        # Top brand, status pills, and demo controls
│   │   │   └── WalkthroughBanner.jsx # 9-step guided walkthrough tracker
│   │   ├── pages/
│   │   │   ├── DashboardTab.jsx  # Overview, routine, goals, deadlines, insights
│   │   │   ├── WhatIfTab.jsx     # Core feature: simulator, scenarios, learning
│   │   │   ├── KnowledgeBaseTab.jsx # "What does my twin know about me?"
│   │   │   ├── ChatTab.jsx       # Natural language conversational AI
│   │   │   └── DataControlTab.jsx# Privacy center & category permissions
│   │   ├── services/
│   │   │   └── api.js            # Frontend API client
│   │   ├── App.jsx               # Root application assembly
│   │   └── index.css             # Tailwind CSS styling & custom scrollbars
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── .env.example
├── docker-compose.yml
└── README.md
```

### Technology Highlights
* **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons.
* **Backend**: Python 3.11+, FastAPI, Native SQLite3 (thread-safe, zero external ORM bottlenecks).
* **AI Provider Abstraction**: Supports Google Gemini REST API, OpenAI REST API, and a built-in deterministic rule-based **TwinEngine Fallback** ensuring 100% demo reliability even without an external API key.

---

## 5. Getting Started (Local Run)

### Prerequisites
* Python 3.10+
* Node.js v18+ and npm

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API will run at: `http://127.0.0.1:8000`*
*Interactive Swagger docs at: `http://127.0.0.1:8000/docs`*

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend web application will run at: `http://127.0.0.1:5173`*

---

## 6. Environment Variables

Copy `.env.example` to `.env`:

```env
# AI Provider: "gemini", "openai", or "none" (deterministic fallback)
AI_PROVIDER=gemini
AI_API_KEY=your_api_key_here
AI_MODEL=gemini-2.5-flash

PORT=8000
HOST=127.0.0.1
```

> **Note**: Even if `AI_API_KEY` is empty, HumanTwin AI automatically activates its deterministic **TwinEngine Local Simulation Engine**, guaranteeing that all What-If simulations, recommendations, explainability factors, and feedback updates function with 100% precision.

---

## 7. Docker Deployment

Run both backend and frontend via Docker Compose:

```bash
docker-compose up --build
```
* Access frontend at `http://localhost:5173`
* Access backend at `http://localhost:8000`

---

## 8. Privacy & Governance Guarantee

* **Strict Sandboxing**: The twin only processes data categories marked `Enabled` in the Data Control tab.
* **Non-Autonomous**: The twin never commits to schedules or deletes tasks on its own; it provides decision options with clear risk ratings (`Low`, `Moderate`, `High`).
* **Audit Trail**: Every learned update is timestamped with its explicit `Before` and `After` states.
* **Instant Reset**: One-click database wipe and reset restores the system to baseline state anytime.

---

## 9. Future Roadmap

1. **Multi-Horizon Simulations**: Simulating multi-week semesters and exam clusters.
2. **Context Connectors**: Optional, opt-in integration with Google Classroom, Canvas LMS, and local iCal files with explicit approval dialogs.
3. **Biometric Recovery Corroboration**: Integrating sleep tracking from wearables (e.g. Fitbit/Apple Health) to refine fatigue-aware scheduling.
4. **Exportable Plan Deliverables**: Syncing accepted plans directly into Google Calendar or Notion.

---

*Built with passion for hackathon excellence: Reliability > Features, Demo Experience > Complexity, Clear Explanation > Black-Box AI.*
