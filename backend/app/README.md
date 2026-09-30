# HumanTwin AI

### Your Evolving Personal Digital Twin

HumanTwin AI is a full-stack AI-powered personal digital twin platform designed to help students understand their routines, goals, tasks, preferences, and behavioral patterns.

Instead of simply tracking activities, HumanTwin AI builds a structured representation of the user's current state and uses it to provide personalized decision support.

---

## 🚀 Key Features

### 📊 Personal Dashboard
- Twin confidence score
- Goals overview
- Task overview
- Preferences
- Daily routines
- Behavioral patterns
- Workload insights

### 🔮 What-If Simulator
Compare different choices before making a decision.

Example:
> What if I spend the next 2 days preparing for my Mathematics exam instead of working on Physics?

The system compares scenarios and provides:
- Available study time
- Deadline pressure
- Task progress
- Risks
- Expected benefits
- Schedule conflicts

### 🤖 Chat with Twin
Interact with the digital twin using natural-language questions and receive personalized responses based on the twin's available context.

### 🧠 Digital Twin Knowledge
The system maintains information about:
- Goals
- Tasks
- Preferences
- Routines
- Behavioral patterns

### 🔐 Authentication
- User registration
- Secure password hashing
- Login
- Session management
- Logout

### 🛡️ Data Control
Users can view and control their stored data and privacy permissions.

---

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript
- Lucide React

### Backend
- Python
- FastAPI
- SQLite
- Pydantic

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman

---

## 🏗️ Project Structure

```text
HumanTwin AI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── twin_engine/
│   │   └── main.py
│   │
│   ├── authentication.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md