from typing import Dict, Any, Optional
from ..models.db_manager import DBManager

class LearningEngine:
    """
    Feedback and active learning engine for HumanTwin AI.
    Processes user feedback on recommendations, recalibrates the Digital Twin's
    internal heuristics, stores explicit before/after states, and updates understanding confidence.
    """

    @staticmethod
    def process_feedback(
        user_id: int,
        simulation_id: Optional[int],
        was_useful: bool,
        user_choice: Optional[str] = "assignment_first",
        reason_category: str = "assignment_deadline_priority",
        custom_reason: Optional[str] = None
    ) -> Dict[str, Any]:
        # Define the exact Before / After rule texts as specified in prompt section 6 & 16
        before_rule = "User tends to prioritize upcoming exams or balanced splitting."
        after_rule = "When an assignment deadline is within 48 hours, prioritize the assignment even when an exam is approaching."
        change_summary = (
            "New learned preference: When an assignment deadline is within 48 hours, "
            "prioritize the assignment even when an exam is approaching."
        )

        applied_rule_str = after_rule if not was_useful else "Affirmed current balanced recommendation heuristic."

        # 1. Store feedback record
        DBManager.save_feedback(
            user_id=user_id,
            sim_id=simulation_id,
            useful=was_useful,
            choice=user_choice,
            reason_category=reason_category,
            explanation=custom_reason or f"User opted for {user_choice} due to {reason_category}",
            applied_rule=applied_rule_str
        )

        pref_id = None
        # 2. If user chose differently or prioritized assignment deadline:
        # Update or create the learned preference
        if not was_useful or reason_category in ["assignment_deadline_priority", "another_task_first"]:
            pref_id = DBManager.add_or_update_learned_preference(
                user_id=user_id,
                key="priority_rule_assignment_48h",
                title="Learned Rule: 48h Assignment Priority",
                description=after_rule,
                category="Prioritization",
                value="prioritize_assignment_within_48h",
                source="Learned from Feedback"
            )

            # 3. Record TwinUpdate for audit trail
            DBManager.add_twin_update(
                user_id=user_id,
                update_type="preference_learned",
                before_state=before_rule,
                after_state=after_rule,
                change_summary=change_summary
            )

            # 4. Bump Twin Confidence
            DBManager.bump_profile_confidence(
                user_id=user_id,
                increment=0.04,
                note="Twin updated with feedback-calibrated prioritization rule: 48h assignment deadlines override exam preparation."
            )

        return {
            "success": True,
            "message": "Twin Updated ✓",
            "before_rule": before_rule,
            "after_rule": after_rule,
            "twin_updated": True,
            "new_preference_id": pref_id,
            "change_summary": change_summary
        }
