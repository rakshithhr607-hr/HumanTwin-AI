# HumanTwin AI

> **An evolving AI-powered Digital Twin that learns from permitted user context, simulates decisions, and provides personalized decision support.**

[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8.svg)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg)](https://www.sqlite.org/)
[![Human In The Loop](https://img.shields.io/badge/Governance-Human--In--The--Loop-10b981.svg)](#privacy--governance)

---

## About the Project

**HumanTwin AI** is an AI-powered personal Digital Twin designed to understand a user's goals, preferences, routines, tasks, deadlines, and behavioral patterns.

The system helps users make better day-to-day decisions by:
- Building a personalized Digital Twin from permitted user data
- Identifying meaningful behavioral patterns
- Simulating **What-If** scenarios before decisions are made
- Comparing possible outcomes, risks, and available time
- Providing explainable, personalized decision support
- Learning from explicit user feedback
- Giving users control over which data categories the Digital Twin can use

HumanTwin AI is designed as a **decision-support system**, not an autonomous system. The user remains in control of all decisions and data permissions.

### Key Features

- 🧠 **Digital Twin Dashboard**
- 🔮 **What-If Scenario Simulator**
- 📊 **Behavioral Pattern Recognition**
- 💬 **Chat with Your Digital Twin**
- 🔄 **Feedback-Based Learning**
- 🔐 **Privacy & Data Control**
- 💡 **Explainable Recommendations**
- 🎓 **Synthetic Student Demo Mode**
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
