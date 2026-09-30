from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Profile Schemas
class ProfileOut(BaseModel):
    id: int
    user_id: int
    name: str
    role: str
    email: str
    bio: str
    current_workload: str
    twin_confidence: float
    confidence_notes: str

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    current_workload: Optional[str] = None

# Goal Schemas
class GoalBase(BaseModel):
    title: str
    category: str = "Academic"
    target_date: Optional[str] = None
    status: str = "In Progress"
    priority: str = "High"
    progress_pct: int = 50
    details: Optional[str] = None
    source_type: str = "user_provided"

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    target_date: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    progress_pct: Optional[int] = None
    details: Optional[str] = None

class GoalOut(GoalBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Preference Schemas
class PreferenceBase(BaseModel):
    key: str
    title: str
    description: str
    category: str = "Study Habits"
    value: str = "true"
    is_system_inferred: bool = False
    source: str = "User-Provided"
    confidence: float = 1.0
    active: bool = True

class PreferenceCreate(PreferenceBase):
    pass

class PreferenceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    value: Optional[str] = None
    active: Optional[bool] = None

class PreferenceOut(PreferenceBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Routine Schemas
class RoutineBase(BaseModel):
    activity_name: str
    category: str = "Academics"
    start_time: str
    end_time: str
    days_of_week: str = "Mon-Fri"
    flexibility: str = "Fixed"
    notes: Optional[str] = None
    source_type: str = "user_provided"

class RoutineCreate(RoutineBase):
    pass

class RoutineUpdate(BaseModel):
    activity_name: Optional[str] = None
    category: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    days_of_week: Optional[str] = None
    flexibility: Optional[str] = None
    notes: Optional[str] = None

class RoutineOut(RoutineBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str
    subject: str = "General"
    category: str = "Assignment"
    deadline: str
    estimated_hours: float = 4.0
    completed_hours: float = 0.0
    current_progress_pct: int = 0
    priority: str = "High"
    status: str = "Pending"
    source_type: str = "user_provided"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    category: Optional[str] = None
    deadline: Optional[str] = None
    estimated_hours: Optional[float] = None
    completed_hours: Optional[float] = None
    current_progress_pct: Optional[int] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class TaskOut(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# BehaviorPattern Schemas
class BehaviorPatternOut(BaseModel):
    id: int
    user_id: int
    pattern_text: str
    category: str
    evidence_count: int
    confidence: float
    source_type: str
    created_at: datetime

    class Config:
        from_attributes = True

# TwinUpdate Schemas
class TwinUpdateOut(BaseModel):
    id: int
    user_id: int
    update_type: str
    before_state: str
    after_state: str
    change_summary: str
    created_at: datetime

    class Config:
        from_attributes = True

# DataPermission Schemas
class DataPermissionOut(BaseModel):
    id: int
    category: str
    enabled: bool
    stored_description: str
    purpose: str

    class Config:
        from_attributes = True

class DataPermissionUpdate(BaseModel):
    enabled: bool

# What-If Simulation Schemas
class ScenarioDetail(BaseModel):
    scenario_id: str # "A" or "B"
    title: str
    focus: str
    available_study_time: str
    tasks_completed: List[str]
    tasks_delayed: List[str]
    deadline_pressure: str # "Low risk", "Moderate risk", "High risk"
    deadline_pressure_reason: str
    expected_progress: Dict[str, Any]
    risks: List[str]
    benefits: List[str]
    potential_conflicts: List[str]

class PlanSlot(BaseModel):
    time_slot: str
    activity: str
    rationale: str

class RecommendationOut(BaseModel):
    summary: str
    suggested_plan: List[PlanSlot]
    why_factors: List[str]
    confidence_score: float = 0.88
    source_label: str = "Derived from current active goals, deadlines, and learned rules"

class WhatIfRequest(BaseModel):
    query: str
    scenario_a_focus: Optional[str] = "Focus on Mathematics exam"
    scenario_b_focus: Optional[str] = "Complete Physics assignment first"
    days_horizon: Optional[int] = 2

class WhatIfResponse(BaseModel):
    simulation_id: int
    query: str
    scenarios: List[ScenarioDetail]
    recommendation: RecommendationOut
    why_factors: List[str]
    context_used: Dict[str, Any]
    ai_provider_used: str

# Feedback Schemas
class FeedbackRequest(BaseModel):
    simulation_id: Optional[int] = None
    was_useful: bool
    user_choice: Optional[str] = "assignment_first"
    reason_category: str = "assignment_deadline_priority"
    custom_reason: Optional[str] = None

class FeedbackResponse(BaseModel):
    success: bool
    message: str
    before_rule: str
    after_rule: str
    twin_updated: bool
    new_preference_id: Optional[int] = None
    change_summary: str

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    reply: str
    factors_considered: List[str]
    suggested_actions: List[str]
    ai_provider_used: str

# Comprehensive Twin Overview
class TwinOverviewOut(BaseModel):
    user: ProfileOut
    goals: List[GoalOut]
    preferences: List[PreferenceOut]
    routines: List[RoutineOut]
    tasks: List[TaskOut]
    patterns: List[BehaviorPatternOut]
    twin_updates: List[TwinUpdateOut]
    permissions: List[DataPermissionOut]
    stats: Dict[str, Any]
