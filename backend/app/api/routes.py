from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status

from ..models.db_manager import DBManager
from ..schemas.schemas import (
    ProfileOut, ProfileUpdate,
    GoalCreate, GoalUpdate, GoalOut,
    PreferenceCreate, PreferenceUpdate, PreferenceOut,
    RoutineCreate, RoutineUpdate, RoutineOut,
    TaskCreate, TaskUpdate, TaskOut,
    BehaviorPatternOut, TwinUpdateOut,
    DataPermissionOut, DataPermissionUpdate,
    WhatIfRequest, WhatIfResponse,
    FeedbackRequest, FeedbackResponse,
    ChatRequest, ChatResponse,
    TwinOverviewOut
)
from ..twin_engine.demo_data import populate_demo_student
from ..twin_engine.simulation import SimulatorEngine
from ..twin_engine.learning import LearningEngine
from ..twin_engine.chat import TwinChatEngine

router = APIRouter(prefix="/api", tags=["HumanTwin API"])

def get_current_user_id() -> int:
    """Helper to ensure at least one demo user exists."""
    user_id = DBManager.get_first_user_id()
    if not user_id:
        user = populate_demo_student()
        user_id = user["id"]
    return user_id


# =====================================================================
# Profile & Twin Overview Endpoints
# =====================================================================
@router.get("/profile", response_model=ProfileOut)
def get_profile():
    user_id = get_current_user_id()
    profile = DBManager.get_user_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=ProfileOut)
def update_profile(data: ProfileUpdate):
    user_id = get_current_user_id()
    updated = DBManager.update_profile(
        user_id=user_id,
        name=data.name,
        role=data.role,
        bio=data.bio,
        current_workload=data.current_workload
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Profile not found")
    return updated

@router.get("/twin", response_model=TwinOverviewOut)
def get_twin_overview():
    user_id = get_current_user_id()
    profile = DBManager.get_user_profile(user_id)
    if not profile:
        populate_demo_student()
        profile = DBManager.get_user_profile(user_id)

    goals = DBManager.get_goals(user_id)
    preferences = DBManager.get_preferences(user_id)
    routines = DBManager.get_routines(user_id)
    tasks = DBManager.get_tasks(user_id)
    patterns = DBManager.get_patterns(user_id)
    updates = DBManager.get_twin_updates(user_id)
    permissions = DBManager.get_permissions(user_id)

    stats = {
        "preferences_count": len([p for p in preferences if p["active"]]),
        "goals_count": len(goals),
        "tasks_count": len(tasks),
        "patterns_count": len(patterns),
        "twin_confidence_pct": int((profile["twin_confidence"] or 0.88) * 100),
        "privacy_status": "Strictly Controlled by You"
    }

    return {
        "user": profile,
        "goals": goals,
        "preferences": preferences,
        "routines": routines,
        "tasks": tasks,
        "patterns": patterns,
        "twin_updates": updates,
        "permissions": permissions,
        "stats": stats
    }


# =====================================================================
# Goals Endpoints
# =====================================================================
@router.get("/goals", response_model=List[GoalOut])
def get_goals():
    user_id = get_current_user_id()
    return DBManager.get_goals(user_id)

@router.post("/goals", response_model=GoalOut)
def create_goal(data: GoalCreate):
    user_id = get_current_user_id()
    return DBManager.add_goal(user_id, data.model_dump())


# =====================================================================
# Tasks Endpoints
# =====================================================================
@router.get("/tasks", response_model=List[TaskOut])
def get_tasks():
    user_id = get_current_user_id()
    return DBManager.get_tasks(user_id)

@router.post("/tasks", response_model=TaskOut)
def create_task(data: TaskCreate):
    user_id = get_current_user_id()
    return DBManager.add_task(user_id, data.model_dump())

@router.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, data: TaskUpdate):
    user_id = get_current_user_id()
    updated = DBManager.update_task(task_id, user_id, data.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    user_id = get_current_user_id()
    success = DBManager.delete_task(task_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}


# =====================================================================
# Preferences, Routines, Patterns
# =====================================================================
@router.get("/preferences", response_model=List[PreferenceOut])
def get_preferences():
    user_id = get_current_user_id()
    return DBManager.get_preferences(user_id)

@router.get("/routines", response_model=List[RoutineOut])
def get_routines():
    user_id = get_current_user_id()
    return DBManager.get_routines(user_id)

@router.get("/patterns", response_model=List[BehaviorPatternOut])
def get_patterns():
    user_id = get_current_user_id()
    return DBManager.get_patterns(user_id)


# =====================================================================
# What-If Simulation
# =====================================================================
@router.post("/what-if", response_model=WhatIfResponse)
def simulate_what_if(req: WhatIfRequest):
    user_id = get_current_user_id()
    result = SimulatorEngine.simulate(
        user_id=user_id,
        query=req.query,
        scenario_a_focus=req.scenario_a_focus or "Focus on Mathematics exam",
        scenario_b_focus=req.scenario_b_focus or "Complete Physics assignment first",
        days_horizon=req.days_horizon or 2
    )
    return result


# =====================================================================
# Feedback / Learning Loop
# =====================================================================
@router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(req: FeedbackRequest):
    user_id = get_current_user_id()
    result = LearningEngine.process_feedback(
        user_id=user_id,
        simulation_id=req.simulation_id,
        was_useful=req.was_useful,
        user_choice=req.user_choice or "assignment_first",
        reason_category=req.reason_category or "assignment_deadline_priority",
        custom_reason=req.custom_reason
    )
    return result


# =====================================================================
# Privacy & Permissions Control
# =====================================================================
@router.get("/permissions", response_model=List[DataPermissionOut])
def get_permissions():
    user_id = get_current_user_id()
    return DBManager.get_permissions(user_id)

@router.put("/permissions/{perm_id}", response_model=DataPermissionOut)
def update_permission(perm_id: int, data: DataPermissionUpdate):
    user_id = get_current_user_id()
    updated = DBManager.update_permission(perm_id, user_id, data.enabled)
    if not updated:
        raise HTTPException(status_code=404, detail="Permission category not found")
    return updated

@router.post("/permissions/clear-history")
def clear_history():
    user_id = get_current_user_id()
    DBManager.clear_history(user_id)
    return {"message": "Decision and feedback history cleared successfully."}


# =====================================================================
# Reset & Demo Seeding
# =====================================================================
@router.post("/twin/reset")
def reset_twin():
    user = populate_demo_student()
    return {"message": "Digital Twin reset to baseline calibrated state.", "user_id": user["id"]}

@router.post("/demo/load")
def load_demo():
    user = populate_demo_student()
    return {"message": "Demo student Arjun loaded successfully!", "user_id": user["id"]}


# =====================================================================
# Conversational AI
# =====================================================================
@router.post("/chat", response_model=ChatResponse)
async def chat_with_twin(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    user_id = get_current_user_id()
    result = await TwinChatEngine.chat(user_id=user_id, message=req.message)
    return result
