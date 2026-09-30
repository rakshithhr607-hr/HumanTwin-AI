import sqlite3
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from .database import get_connection

class DBManager:
    @staticmethod
    def get_first_user_id() -> Optional[int]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users LIMIT 1;")
        row = cur.fetchone()
        conn.close()
        return row["id"] if row else None

    @staticmethod
    def get_user_profile(user_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT u.id as user_id, u.name, u.role, u.email,
                   p.id, p.bio, p.current_workload, p.twin_confidence, p.confidence_notes
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            WHERE u.id = ?;
        """, (user_id,))
        row = cur.fetchone()
        conn.close()
        return row

    @staticmethod
    def update_profile(user_id: int, name: Optional[str] = None, role: Optional[str] = None,
                       bio: Optional[str] = None, current_workload: Optional[str] = None) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        if name or role:
            cur.execute("""
                UPDATE users
                SET name = COALESCE(?, name),
                    role = COALESCE(?, role),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?;
            """, (name, role, user_id))

        if bio or current_workload:
            cur.execute("""
                UPDATE profiles
                SET bio = COALESCE(?, bio),
                    current_workload = COALESCE(?, current_workload),
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?;
            """, (bio, current_workload, user_id))

        conn.commit()
        conn.close()
        return DBManager.get_user_profile(user_id)

    @staticmethod
    def get_goals(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM goals WHERE user_id = ? ORDER BY id ASC;", (user_id,))
        rows = cur.fetchall()
        conn.close()
        return rows

    @staticmethod
    def add_goal(user_id: int, goal_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO goals (user_id, title, category, target_date, status, priority, progress_pct, details, source_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            user_id,
            goal_data.get("title"),
            goal_data.get("category", "Academic"),
            goal_data.get("target_date"),
            goal_data.get("status", "In Progress"),
            goal_data.get("priority", "High"),
            goal_data.get("progress_pct", 50),
            goal_data.get("details"),
            goal_data.get("source_type", "user_provided")
        ))
        goal_id = cur.lastrowid
        conn.commit()
        cur.execute("SELECT * FROM goals WHERE id = ?;", (goal_id,))
        row = cur.fetchone()
        conn.close()
        return row

    @staticmethod
    def get_tasks(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM tasks WHERE user_id = ? ORDER BY id ASC;", (user_id,))
        rows = cur.fetchall()
        conn.close()
        return rows

    @staticmethod
    def add_task(user_id: int, task_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO tasks (user_id, title, subject, category, deadline, estimated_hours, completed_hours, current_progress_pct, priority, status, source_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            user_id,
            task_data.get("title"),
            task_data.get("subject", "General"),
            task_data.get("category", "Assignment"),
            task_data.get("deadline"),
            task_data.get("estimated_hours", 4.0),
            task_data.get("completed_hours", 0.0),
            task_data.get("current_progress_pct", 0),
            task_data.get("priority", "High"),
            task_data.get("status", "Pending"),
            task_data.get("source_type", "user_provided")
        ))
        task_id = cur.lastrowid
        conn.commit()
        cur.execute("SELECT * FROM tasks WHERE id = ?;", (task_id,))
        row = cur.fetchone()
        conn.close()
        return row

    @staticmethod
    def update_task(task_id: int, user_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        fields = []
        values = []
        for k, v in data.items():
            if v is not None:
                fields.append(f"{k} = ?")
                values.append(v)
        if not fields:
            conn.close()
            return None
        values.extend([task_id, user_id])
        query = f"UPDATE tasks SET {', '.join(fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?;"
        cur.execute(query, tuple(values))
        conn.commit()
        cur.execute("SELECT * FROM tasks WHERE id = ?;", (task_id,))
        row = cur.fetchone()
        conn.close()
        return row

    @staticmethod
    def delete_task(task_id: int, user_id: int) -> bool:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?;", (task_id, user_id))
        count = cur.rowcount
        conn.commit()
        conn.close()
        return count > 0

    @staticmethod
    def get_preferences(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM preferences WHERE user_id = ? ORDER BY id ASC;", (user_id,))
        rows = cur.fetchall()
        conn.close()
        return rows

    @staticmethod
    def get_routines(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM routines WHERE user_id = ? ORDER BY id ASC;", (user_id,))
        rows = cur.fetchall()
        conn.close()
        return rows

    @staticmethod
    def get_patterns(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM behavior_patterns WHERE user_id = ? ORDER BY id ASC;", (user_id,))
        rows = cur.fetchall()
        conn.close()
        return rows

    @staticmethod
    def get_twin_updates(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM twin_updates WHERE user_id = ? ORDER BY id DESC;", (user_id,))
        rows = cur.fetchall()
        conn.close()
        return rows

    @staticmethod
    def get_permissions(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM data_permissions WHERE user_id = ? ORDER BY id ASC;", (user_id,))
        rows = cur.fetchall()
        conn.close()
        return rows

    @staticmethod
    def update_permission(perm_id: int, user_id: int, enabled: bool) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE data_permissions
            SET enabled = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?;
        """, (1 if enabled else 0, perm_id, user_id))
        conn.commit()
        cur.execute("SELECT * FROM data_permissions WHERE id = ?;", (perm_id,))
        row = cur.fetchone()
        conn.close()
        return row

    @staticmethod
    def clear_history(user_id: int) -> bool:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM feedbacks WHERE user_id = ?;", (user_id,))
        cur.execute("DELETE FROM decisions WHERE user_id = ?;", (user_id,))
        cur.execute("DELETE FROM twin_updates WHERE user_id = ?;", (user_id,))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def save_simulation(user_id: int, query: str, scenario_a: Dict, scenario_b: Dict,
                        recommendation: Dict, why_factors: List[str], ai_provider: str) -> int:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO scenario_simulations (user_id, query, scenario_a_json, scenario_b_json, recommendation_json, explanation_factors_json, ai_provider_used)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (
            user_id,
            query,
            json.dumps(scenario_a),
            json.dumps(scenario_b),
            json.dumps(recommendation),
            json.dumps(why_factors),
            ai_provider
        ))
        sim_id = cur.lastrowid
        conn.commit()
        conn.close()
        return sim_id

    @staticmethod
    def save_feedback(user_id: int, sim_id: Optional[int], useful: bool, choice: Optional[str],
                      reason_category: str, explanation: Optional[str], applied_rule: str) -> int:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO feedbacks (user_id, simulation_id, was_useful, user_choice, reason_category, explanation, applied_rule)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (
            user_id,
            sim_id,
            1 if useful else 0,
            choice,
            reason_category,
            explanation,
            applied_rule
        ))
        fb_id = cur.lastrowid
        conn.commit()
        conn.close()
        return fb_id

    @staticmethod
    def add_or_update_learned_preference(user_id: int, key: str, title: str, description: str,
                                        category: str, value: str, source: str) -> int:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id FROM preferences WHERE user_id = ? AND key = ?;", (user_id, key))
        row = cur.fetchone()
        if row:
            pref_id = row["id"]
            cur.execute("""
                UPDATE preferences
                SET description = ?, source = ?, confidence = 0.96, active = 1, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?;
            """, (description, source, pref_id))
        else:
            cur.execute("""
                INSERT INTO preferences (user_id, key, title, description, category, value, is_system_inferred, source, confidence, active)
                VALUES (?, ?, ?, ?, ?, ?, 1, ?, 0.96, 1);
            """, (user_id, key, title, description, category, value, source))
            pref_id = cur.lastrowid
        conn.commit()
        conn.close()
        return pref_id

    @staticmethod
    def add_twin_update(user_id: int, update_type: str, before_state: str, after_state: str, change_summary: str):
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO twin_updates (user_id, update_type, before_state, after_state, change_summary)
            VALUES (?, ?, ?, ?, ?);
        """, (user_id, update_type, before_state, after_state, change_summary))
        conn.commit()
        conn.close()

    @staticmethod
    def bump_profile_confidence(user_id: int, increment: float = 0.04, note: Optional[str] = None):
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT twin_confidence FROM profiles WHERE user_id = ?;", (user_id,))
        row = cur.fetchone()
        curr_conf = row["twin_confidence"] if row else 0.88
        new_conf = min(0.96, curr_conf + increment)
        cur.execute("""
            UPDATE profiles
            SET twin_confidence = ?,
                confidence_notes = COALESCE(?, confidence_notes),
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?;
        """, (new_conf, note, user_id))
        conn.commit()
        conn.close()
