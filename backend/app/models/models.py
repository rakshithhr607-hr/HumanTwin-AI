from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, default="Arjun")
    role = Column(String(100), default="Engineering Student")
    email = Column(String(120), default="arjun@example.edu")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("Preference", back_populates="user", cascade="all, delete-orphan")
    routines = relationship("Routine", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    patterns = relationship("BehaviorPattern", back_populates="user", cascade="all, delete-orphan")
    twin_updates = relationship("TwinUpdate", back_populates="user", cascade="all, delete-orphan")
    permissions = relationship("DataPermission", back_populates="user", cascade="all, delete-orphan")
    simulations = relationship("ScenarioSimulation", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, default="Passionate engineering student balancing coursework, exams, and projects.")
    current_workload = Column(String(100), default="Heavy (1 Exam, 2 Assignments upcoming)")
    twin_confidence = Column(Float, default=0.88) # 88% confidence
    confidence_notes = Column(Text, default="Twin calibrated from 7 explicit preferences, 3 goals, 3 tasks, and 5 historical patterns.")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), default="Academic") # Academic, Health & Wellness, Career, Skills
    target_date = Column(String(50), nullable=True)
    status = Column(String(50), default="In Progress") # In Progress, Completed, Paused
    priority = Column(String(20), default="High") # High, Medium, Low
    progress_pct = Column(Integer, default=50)
    details = Column(Text, nullable=True)
    source_type = Column(String(50), default="user_provided") # user_provided, system_inferred
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="goals")


class Preference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key = Column(String(100), nullable=False) # e.g. "evening_study", "session_duration"
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Study Habits") # Study Habits, Schedule, Prioritization, Environment
    value = Column(String(200), default="true")
    is_system_inferred = Column(Boolean, default=False) # Clearly distinguish user vs inferred
    source = Column(String(100), default="User-Provided") # User-Provided, System-Inferred, Learned from Feedback
    confidence = Column(Float, default=1.0) # 0.0 - 1.0
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="preferences")


class Routine(Base):
    __tablename__ = "routines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_name = Column(String(150), nullable=False)
    category = Column(String(100), default="Academics") # Academics, Personal, Health, Buffer
    start_time = Column(String(20), nullable=False) # "09:00 AM" or "09:00"
    end_time = Column(String(20), nullable=False) # "04:00 PM" or "16:00"
    days_of_week = Column(String(100), default="Mon-Fri") # Mon-Fri, Daily, Weekends
    flexibility = Column(String(50), default="Fixed") # Fixed, Semi-flexible, Flexible
    notes = Column(Text, nullable=True)
    source_type = Column(String(50), default="user_provided")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="routines")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    subject = Column(String(100), default="General")
    category = Column(String(50), default="Assignment") # Assignment, Exam, Project, Reading
    deadline = Column(String(50), nullable=False) # e.g. "October 2" or "2026-10-02"
    estimated_hours = Column(Float, default=4.0)
    completed_hours = Column(Float, default=0.0)
    current_progress_pct = Column(Integer, default=0) # 0 to 100
    priority = Column(String(20), default="High") # High, Medium, Low
    status = Column(String(50), default="Pending") # Pending, In Progress, Completed
    source_type = Column(String(50), default="user_provided")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="tasks")


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(Text, nullable=False)
    chosen_scenario = Column(String(100), nullable=True) # "Scenario A", "Scenario B", "Custom"
    context_snapshot = Column(Text, nullable=True) # JSON snapshot of active tasks/deadlines
    rationale = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="decisions")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    simulation_id = Column(Integer, nullable=True)
    was_useful = Column(Boolean, nullable=False) # True if "Yes, this fits me", False if "No, I would choose differently"
    user_choice = Column(String(100), nullable=True) # "assignment_first", "exam_first", etc.
    reason_category = Column(String(100), nullable=False) # "assignment_deadline_priority", "another_task_first", etc.
    explanation = Column(Text, nullable=True)
    applied_rule = Column(Text, nullable=True) # Rule generated/updated in response
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")


class BehaviorPattern(Base):
    __tablename__ = "behavior_patterns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pattern_text = Column(Text, nullable=False)
    category = Column(String(100), default="Study Habit") # Study Habit, Time Estimation, Stress Response, Pacing
    evidence_count = Column(Integer, default=5)
    confidence = Column(Float, default=0.85)
    source_type = Column(String(50), default="system_inferred") # system_inferred, ai_generated
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="patterns")


class TwinUpdate(Base):
    __tablename__ = "twin_updates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    update_type = Column(String(100), default="feedback_learning") # feedback_learning, pattern_discovered, preference_added
    before_state = Column(Text, nullable=False)
    after_state = Column(Text, nullable=False)
    change_summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="twin_updates")


class DataPermission(Base):
    __tablename__ = "data_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False) # Goals, Preferences, Routine, Tasks, Calendar, Study History, Decision History, Personal Notes
    enabled = Column(Boolean, default=True)
    stored_description = Column(Text, nullable=False)
    purpose = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="permissions")


class ScenarioSimulation(Base):
    __tablename__ = "scenario_simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(Text, nullable=False)
    scenario_a_json = Column(Text, nullable=False)
    scenario_b_json = Column(Text, nullable=False)
    recommendation_json = Column(Text, nullable=False)
    explanation_factors_json = Column(Text, nullable=False)
    ai_provider_used = Column(String(50), default="TwinEngine Fallback") # "gemini", "openai", "TwinEngine Rule-Based Fallback"
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="simulations")
