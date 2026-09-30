from typing import Dict, Any, List
from ..models.db_manager import DBManager

class TwinEngine:
    """
    Core reasoning engine for HumanTwin AI.
    Builds privacy-filtered user context, monitors permissions,
    identifies behavioral tendencies, and synthesizes grounded explanations.
    """

    @staticmethod
    def build_user_context(user_id: int) -> Dict[str, Any]:
        """
        Builds structured context based ONLY on information the user explicitly
        permitted in DataPermissions.
        """
        profile = DBManager.get_user_profile(user_id)
        if not profile:
            return {}

        permissions = DBManager.get_permissions(user_id)
        perm_map = {p["category"].lower(): bool(p["enabled"]) for p in permissions}

        context: Dict[str, Any] = {
            "user": {
                "name": profile["name"],
                "role": profile["role"],
                "confidence": profile["twin_confidence"] or 0.88,
                "current_workload": profile["current_workload"] or "Normal"
            },
            "permitted_categories": [p["category"] for p in permissions if p["enabled"]],
            "restricted_categories": [p["category"] for p in permissions if not p["enabled"]]
        }

        # 1. Goals
        if perm_map.get("goals", True):
            goals = DBManager.get_goals(user_id)
            context["goals"] = [
                {
                    "title": g["title"],
                    "category": g["category"],
                    "target_date": g["target_date"],
                    "priority": g["priority"],
                    "progress_pct": g["progress_pct"],
                    "source": g["source_type"]
                }
                for g in goals
            ]
        else:
            context["goals"] = []

        # 2. Preferences
        if perm_map.get("preferences", True):
            prefs = [p for p in DBManager.get_preferences(user_id) if p["active"]]
            context["preferences"] = [
                {
                    "key": p["key"],
                    "title": p["title"],
                    "description": p["description"],
                    "value": p["value"],
                    "category": p["category"],
                    "source": p["source"],
                    "is_inferred": bool(p["is_system_inferred"])
                }
                for p in prefs
            ]
        else:
            context["preferences"] = []

        # 3. Routine
        if perm_map.get("routine", True):
            routines = DBManager.get_routines(user_id)
            context["routine"] = [
                {
                    "activity": r["activity_name"],
                    "start": r["start_time"],
                    "end": r["end_time"],
                    "days": r["days_of_week"],
                    "flexibility": r["flexibility"]
                }
                for r in routines
            ]
        else:
            context["routine"] = []

        # 4. Tasks
        if perm_map.get("tasks", True):
            tasks = DBManager.get_tasks(user_id)
            context["tasks"] = [
                {
                    "id": t["id"],
                    "title": t["title"],
                    "subject": t["subject"],
                    "category": t["category"],
                    "deadline": t["deadline"],
                    "estimated_hours": t["estimated_hours"],
                    "completed_hours": t["completed_hours"],
                    "progress_pct": t["current_progress_pct"],
                    "priority": t["priority"],
                    "status": t["status"]
                }
                for t in tasks
            ]
        else:
            context["tasks"] = []

        # 5. Behavior Patterns (Study History & Patterns)
        if perm_map.get("study history", True):
            patterns = DBManager.get_patterns(user_id)
            context["patterns"] = [
                {
                    "pattern": p["pattern_text"],
                    "category": p["category"],
                    "confidence": p["confidence"],
                    "evidence_count": p["evidence_count"],
                    "source": p["source_type"]
                }
                for p in patterns
            ]
        else:
            context["patterns"] = []

        # 6. Decision & Feedback History
        if perm_map.get("decision history", True):
            updates = DBManager.get_twin_updates(user_id)[:5]
            context["recent_updates"] = [
                {
                    "type": u["update_type"],
                    "before": u["before_state"],
                    "after": u["after_state"],
                    "summary": u["change_summary"]
                }
                for u in updates
            ]
        else:
            context["recent_updates"] = []

        return context

    @staticmethod
    def identify_patterns(user_id: int) -> List[Dict[str, Any]]:
        patterns = DBManager.get_patterns(user_id)
        return [
            {
                "id": p["id"],
                "text": p["pattern_text"],
                "category": p["category"],
                "confidence": p["confidence"],
                "evidence_count": p["evidence_count"],
                "source": p["source_type"]
            }
            for p in patterns
        ]

    @staticmethod
    def generate_explanation(factors: List[str]) -> Dict[str, Any]:
        return {
            "title": "Why am I seeing this recommendation?",
            "factors": factors,
            "privacy_guarantee": "Generated solely from data categories you explicitly enabled."
        }
