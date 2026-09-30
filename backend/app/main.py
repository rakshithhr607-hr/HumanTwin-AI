import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .models.database import init_db
from .models.db_manager import DBManager
from .twin_engine.demo_data import populate_demo_student
from ..authentication import router as auth_router
from .api.routes import router

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize native sqlite tables
    init_db()

    # Seed demo student Arjun if database is empty
    if not DBManager.get_first_user_id():
        populate_demo_student()

    yield

app = FastAPI(
    title="HumanTwin AI API",
    description="Backend services for HumanTwin AI - Personal Digital Twin decision support platform",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(router)

@app.get("/")
def root():
    return {
        "product": "HumanTwin AI",
        "tagline": "Your evolving personal digital twin",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "profile": "/api/profile",
            "twin_overview": "/api/twin",
            "what_if": "/api/what-if",
            "feedback": "/api/feedback",
            "permissions": "/api/permissions",
            "chat": "/api/chat"
        }
    }
