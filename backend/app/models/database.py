import os
import sqlite3
from typing import Generator
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_DIR = os.path.join(BASE_DIR, "database")
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "humantwin.db")

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = dict_factory
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def get_db():
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL DEFAULT 'Arjun',
        role TEXT NOT NULL DEFAULT 'Engineering Student',
        email TEXT DEFAULT 'arjun.demo@humantwin.ai',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        bio TEXT,
        current_workload TEXT,
        twin_confidence REAL DEFAULT 0.88,
        confidence_notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'Academic',
        target_date TEXT,
        status TEXT DEFAULT 'In Progress',
        priority TEXT DEFAULT 'High',
        progress_pct INTEGER DEFAULT 50,
        details TEXT,
        source_type TEXT DEFAULT 'user_provided',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        key TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT DEFAULT 'Study Habits',
        value TEXT DEFAULT 'true',
        is_system_inferred INTEGER DEFAULT 0,
        source TEXT DEFAULT 'User-Provided',
        confidence REAL DEFAULT 1.0,
        active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_name TEXT NOT NULL,
        category TEXT DEFAULT 'Academics',
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        days_of_week TEXT DEFAULT 'Mon-Fri',
        flexibility TEXT DEFAULT 'Fixed',
        notes TEXT,
        source_type TEXT DEFAULT 'user_provided',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        subject TEXT DEFAULT 'General',
        category TEXT DEFAULT 'Assignment',
        deadline TEXT NOT NULL,
        estimated_hours REAL DEFAULT 4.0,
        completed_hours REAL DEFAULT 0.0,
        current_progress_pct INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'High',
        status TEXT DEFAULT 'Pending',
        source_type TEXT DEFAULT 'user_provided',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        query TEXT NOT NULL,
        chosen_scenario TEXT,
        context_snapshot TEXT,
        rationale TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        simulation_id INTEGER,
        was_useful INTEGER NOT NULL,
        user_choice TEXT,
        reason_category TEXT NOT NULL,
        explanation TEXT,
        applied_rule TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS behavior_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pattern_text TEXT NOT NULL,
        category TEXT DEFAULT 'Study Habit',
        evidence_count INTEGER DEFAULT 5,
        confidence REAL DEFAULT 0.85,
        source_type TEXT DEFAULT 'system_inferred',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS twin_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        update_type TEXT DEFAULT 'feedback_learning',
        before_state TEXT NOT NULL,
        after_state TEXT NOT NULL,
        change_summary TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS data_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        enabled INTEGER DEFAULT 1,
        stored_description TEXT NOT NULL,
        purpose TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scenario_simulations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        query TEXT NOT NULL,
        scenario_a_json TEXT NOT NULL,
        scenario_b_json TEXT NOT NULL,
        recommendation_json TEXT NOT NULL,
        explanation_factors_json TEXT NOT NULL,
        ai_provider_used TEXT DEFAULT 'TwinEngine Fallback',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    conn.close()
