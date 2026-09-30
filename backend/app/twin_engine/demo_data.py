from typing import Dict, Any
from ..models.database import get_connection

def populate_demo_student() -> Dict[str, Any]:
    """
    Populates or resets the database with synthetic student Arjun's profile.
    This guarantees a zero-setup, flawless hackathon demonstration.
    """
    conn = get_connection()
    cur = conn.cursor()

    # Clean existing data
    cur.execute("DELETE FROM feedbacks;")
    cur.execute("DELETE FROM decisions;")
    cur.execute("DELETE FROM twin_updates;")
    cur.execute("DELETE FROM scenario_simulations;")
    cur.execute("DELETE FROM behavior_patterns;")
    cur.execute("DELETE FROM data_permissions;")
    cur.execute("DELETE FROM tasks;")
    cur.execute("DELETE FROM routines;")
    cur.execute("DELETE FROM preferences;")
    cur.execute("DELETE FROM goals;")
    cur.execute("DELETE FROM profiles;")
    cur.execute("DELETE FROM users;")

    # 1. Create User
    cur.execute("""
        INSERT INTO users (name, role, email)
        VALUES ('Arjun', 'Engineering Student', 'arjun.demo@humantwin.ai');
    """)
    user_id = cur.lastrowid

    # 2. Create Profile
    cur.execute("""
        INSERT INTO profiles (user_id, bio, current_workload, twin_confidence, confidence_notes)
        VALUES (?, ?, ?, ?, ?);
    """, (
        user_id,
        "Junior Engineering Student balancing challenging coursework, upcoming exams, and coding assignments.",
        "Heavy (1 Exam, 2 Assignments upcoming)",
        0.88,
        "Twin initialized from 7 user preferences, 3 goals, 3 tasks, and 5 historical patterns."
    ))

    # 3. Create Goals
    goals = [
        ("Score well in upcoming exams", "Academic", "October 4, 2026", "In Progress", "High", 65,
         "Maintain high GPA; target grade A in Mathematics and Core Engineering.", "user_provided"),
        ("Complete assignments on time", "Academic", "October 6, 2026", "In Progress", "High", 40,
         "Submit Physics and Programming assignments with zero late penalty.", "user_provided"),
        ("Maintain consistent sleep", "Health & Wellness", "Ongoing", "In Progress", "Medium", 75,
         "Target 7.5 to 8 hours nightly sleep (10:30 PM - 6:30 AM).", "user_provided"),
        ("Improve programming skills", "Skills", "End of Semester", "In Progress", "Medium", 30,
         "Master data structures and write clean, modular python code.", "user_provided")
    ]
    cur.executemany("""
        INSERT INTO goals (user_id, title, category, target_date, status, priority, progress_pct, details, source_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, [(user_id, *g) for g in goals])

    # 4. Create Preferences
    preferences = [
        ("evening_study", "Evening Study Preference", "Prefers studying in the evening between 6:00 PM and 9:00 PM.",
         "Schedule", "18:00 - 21:00", 0, "User-Provided", 1.0, 1),
        ("session_duration", "Session Duration", "Likes focused 60–90 minute study sessions with brief breaks.",
         "Focus Pacing", "60-90 min", 0, "User-Provided", 1.0, 1),
        ("morning_study_avoidance", "Morning Study Avoidance", "Avoids early-morning study; cognitive peak is in the late afternoon and evening.",
         "Schedule", "avoid_pre_0800", 0, "User-Provided", 0.95, 1),
        ("subject_ordering", "Subject Ordering", "Prefers tackling difficult subjects before easier subjects while energy is high.",
         "Study Habits", "hard_first", 0, "User-Provided", 1.0, 1),
        ("deadline_proximity_habit", "Deadline Proximity Tendency", "Usually completes assignments close to the deadline.",
         "Prioritization", "close_to_deadline", 0, "User-Provided", 0.90, 1),
        ("break_duration", "Pacing Breaks", "Recharges with 10–15 minute hydration and stretching intervals.",
         "Focus Pacing", "15 min break", 0, "User-Provided", 1.0, 1),
        ("calendar_adherence", "Structured Plan Adherence", "Consistently performs better when study blocks are planned in advance.",
         "Study Habits", "structured_blocks", 0, "User-Provided", 0.95, 1)
    ]
    cur.executemany("""
        INSERT INTO preferences (user_id, key, title, description, category, value, is_system_inferred, source, confidence, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, [(user_id, *p) for p in preferences])

    # 5. Create Routines
    routines = [
        ("College Lectures & Labs", "Academics", "09:00 AM", "04:00 PM", "Mon-Fri", "Fixed",
         "Mandatory attendance, lecture classes and departmental lab sessions.", "user_provided"),
        ("Daily Evening Study", "Academics", "06:00 PM", "09:00 PM", "Daily", "Semi-flexible",
         "Primary 3-hour dedicated self-study block.", "user_provided"),
        ("Sleep Routine", "Health", "10:30 PM", "06:30 AM", "Daily", "Fixed",
         "Non-negotiable sleep schedule to maintain cognitive endurance.", "user_provided"),
        ("Transit & Campus Buffer", "Buffer", "04:00 PM", "06:00 PM", "Mon-Fri", "Flexible",
         "Commute home, snacks, gym/walk, and mental reset.", "user_provided"),
        ("Dinner & Wind Down", "Personal", "09:00 PM", "10:30 PM", "Daily", "Semi-flexible",
         "Dinner with family/roommates, light reading, preparing for bed.", "user_provided")
    ]
    cur.executemany("""
        INSERT INTO routines (user_id, activity_name, category, start_time, end_time, days_of_week, flexibility, notes, source_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, [(user_id, *r) for r in routines])

    # 6. Create Tasks
    tasks = [
        ("Physics Assignment", "Engineering Physics", "Assignment", "October 2", 4.0, 0.5, 15, "High", "In Progress", "user_provided"),
        ("Mathematics Exam", "Applied Mathematics", "Exam", "October 4", 8.0, 3.6, 45, "High", "In Progress", "user_provided"),
        ("Programming Assignment", "Computer Science", "Assignment", "October 6", 5.0, 0.0, 0, "Medium", "Pending", "user_provided")
    ]
    cur.executemany("""
        INSERT INTO tasks (user_id, title, subject, category, deadline, estimated_hours, completed_hours, current_progress_pct, priority, status, source_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, [(user_id, *t) for t in tasks])

    # 7. Create Historical Behavior Patterns
    patterns = [
        ("Usually studies 2–3 hours on weekdays during the evening window.", "Study Habit", 18, 0.92, "system_inferred"),
        ("Studies significantly more before exams (+45% study volume in the 72h window preceding an exam).", "Exam Preparation", 6, 0.88, "system_inferred"),
        ("Often postpones assignments until close to the deadline (submits within final 12-18 hours).", "Prioritization", 12, 0.89, "system_inferred"),
        ("Completes planned study sessions more consistently when sessions are limited to 60–90 minutes.", "Focus Pacing", 24, 0.94, "system_inferred"),
        ("Tends to underestimate assignment completion time by approximately 20%.", "Time Estimation", 9, 0.82, "system_inferred")
    ]
    cur.executemany("""
        INSERT INTO behavior_patterns (user_id, pattern_text, category, evidence_count, confidence, source_type)
        VALUES (?, ?, ?, ?, ?, ?);
    """, [(user_id, *pat) for pat in patterns])

    # 8. Create Data Permissions
    permissions = [
        ("Goals", 1, "4 active academic, health, and skill goals with progress percentages.",
         "Enables Digital Twin to align decision trade-offs with your personal ambitions."),
        ("Preferences", 1, "7 verified study habits, session length limits, and timing preferences.",
         "Ensures recommendations match your natural cognitive energy and pacing."),
        ("Routine", 1, "Daily schedule including college classes (9 AM-4 PM), sleep, and buffers.",
         "Allows What-If simulations to accurately calculate realistic available hours."),
        ("Tasks", 1, "Current workload (Physics Assignment, Math Exam, Programming Assignment).",
         "Computes deadline pressure, required effort, and overdue risks."),
        ("Calendar", 1, "Academic lecture slots and college lab schedules.",
         "Guarantees no study blocks are scheduled over mandatory classes."),
        ("Study History", 1, "Logs of past study durations, completion rates, and fatigue patterns.",
         "Detects reliable behavioral patterns rather than relying on wishful thinking."),
        ("Decision History", 1, "Past What-If choices, feedback reasons, and priority shifts.",
         "Evolves the twin when your priorities and life circumstances change."),
        ("Personal Notes", 0, "No private reflective notes recorded.",
         "Kept disabled by default for maximum privacy.")
    ]
    cur.executemany("""
        INSERT INTO data_permissions (user_id, category, enabled, stored_description, purpose)
        VALUES (?, ?, ?, ?, ?);
    """, [(user_id, *p) for p in permissions])

    # 9. Initial Baseline Update
    cur.execute("""
        INSERT INTO twin_updates (user_id, update_type, before_state, after_state, change_summary)
        VALUES (?, 'twin_initialized', 'Cold start / Uncalibrated',
                'Calibrated with 7 preferences, 3 goals, 3 tasks, and 5 historical patterns.',
                'Digital Twin initial baseline established for Arjun.');
    """, (user_id,))

    conn.commit()

    cur.execute("SELECT * FROM users WHERE id = ?;", (user_id,))
    user_row = cur.fetchone()
    conn.close()

    return user_row
