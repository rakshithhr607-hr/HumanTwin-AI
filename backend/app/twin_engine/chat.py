from typing import Dict, Any, List
from .engine import TwinEngine
from ..services.ai_provider import ai_service

class TwinChatEngine:
    @staticmethod
    async def chat(user_id: int, message: str) -> Dict[str, Any]:
        context = TwinEngine.build_user_context(user_id)
        msg_lower = message.lower()

        # Check for learned priority rule
        has_learned_priority = any(
            p.get("key") == "priority_rule_assignment_48h"
            for p in context.get("preferences", [])
        )

        factors = [
            f"Active Tasks: {len(context.get('tasks', []))} tracked",
            "Evening study window: 6:00 PM – 9:00 PM",
            "College hours: 9:00 AM – 4:00 PM (Mon-Fri)",
            f"48h Assignment Priority Rule: {'Active' if has_learned_priority else 'Inactive'}"
        ]

        # Attempt external AI call if configured
        if ai_service.is_configured():
            system_instruction = (
                "You are HumanTwin AI, a personal digital twin decision-support system. "
                "You understand the user's explicit goals, preferences, routine, deadlines, and patterns. "
                "Always be transparent, helpful, realistic, and never pretend to make decisions for them. "
                "Here is the user's permitted context:\n"
                f"{context}\n"
                "Answer the user's query thoughtfully based solely on this context."
            )
            ai_reply = await ai_service.generate_response(system_instruction, message)
            if ai_reply:
                return {
                    "reply": ai_reply,
                    "factors_considered": factors,
                    "suggested_actions": [
                        "Run What-If simulation for tomorrow",
                        "View schedule breakdown",
                        "Check privacy permissions"
                    ],
                    "ai_provider_used": f"{ai_service.provider.capitalize()} ({ai_service.model})"
                }

        # Deterministic Grounded Fallback Engine
        if "tonight" in msg_lower or "focus on today" in msg_lower or "what should i study" in msg_lower:
            if has_learned_priority:
                reply = (
                    "Based on your learned priority ('Assignments due within 48h take priority over exam prep'), "
                    "tonight's focus should be your **Physics Assignment** (due October 2, ~3.5h remaining). "
                    "I recommend a 90-minute deep block from 6:00 PM – 7:30 PM, a 15-minute break, "
                    "and a 60-minute finishing block from 7:45 PM – 8:45 PM. This safely locks in your assignment submission."
                )
            else:
                reply = (
                    "Tonight during your 6:00 PM – 9:00 PM study window, your top priorities are:\n"
                    "1. **Mathematics Exam Preparation** (October 4, 45% ready, requires ~4.4h more effort).\n"
                    "2. **Physics Assignment** (October 2, requires ~3.5h remaining).\n\n"
                    "I recommend a balanced split: 90 minutes on Math (6:00–7:30 PM), a 15-minute mental break, "
                    "and 60 minutes on Physics (7:45–8:45 PM). This prevents you from falling behind on either deadline."
                )
            suggested_actions = ["Simulate What-If scenario", "View tonight's schedule", "Adjust study duration"]

        elif "skip" in msg_lower or "skip studying" in msg_lower:
            reply = (
                "If you skip studying tonight (3 available hours lost):\n"
                "• **Physics Assignment** (due Oct 2) will face an acute crisis: tomorrow (Oct 2) is a college day (9 AM – 4 PM), "
                "leaving virtually no daytime study buffer.\n"
                "• **Mathematics Exam** (due Oct 4) will be compressed into just Oct 3, requiring ~5 hours of cramming.\n\n"
                "**Risk Assessment:** High Risk. Your historical patterns indicate you tend to underestimate assignment time by 20%."
            )
            factors.append("Simulation: -3 hours study capacity tonight")
            suggested_actions = ["What-If: Skip tonight vs 1.5h mini-session", "Adjust today's routine"]

        elif "extra hours" in msg_lower or "2 extra hours" in msg_lower:
            reply = (
                "Adding 2 extra hours tomorrow (e.g. extending study to 5 hours or using the 4:00–6:00 PM buffer):\n"
                "• **Benefit:** You can fully finish the Physics Assignment (3.5h) AND complete 1.5h of Math exam prep in a single day.\n"
                "• **Risk:** May encroach on your transit buffer or push past your 10:30 PM sleep schedule, conflicting with your goal to maintain consistent sleep (7.5-8 hrs)."
            )
            factors.append("Health Goal: Maintain consistent sleep (10:30 PM - 6:30 AM)")
            suggested_actions = ["Check schedule buffer", "Run What-If on extra hours"]

        elif "pattern" in msg_lower or "patterns" in msg_lower:
            patterns = context.get("patterns", [])
            pattern_bullets = "\n".join([f"• {p.get('pattern')}" for p in patterns])
            reply = (
                "Here are the behavioral patterns I have detected from your verified study and task history:\n\n"
                f"{pattern_bullets}\n\n"
                "These patterns are system-inferred from your historical logs, not arbitrary guesses."
            )
            suggested_actions = ["Review behavioral patterns", "Manage data permissions"]

        elif "falling behind" in msg_lower or "behind" in msg_lower:
            reply = (
                "Analyzing your current workload:\n"
                "• You have 3 concurrent commitments due within 6 days (Physics Oct 2, Math Oct 4, Programming Oct 6).\n"
                "• Total estimated effort needed: 4.0h (Physics) + 4.4h (Math) + 5.0h (Programming) = 13.4 hours.\n"
                "• With college taking 35 hours/week (9 AM – 4 PM), your standard study capacity is 3 hours/day (15 hours over 5 days).\n"
                "• The margin is tight (1.6 hour buffer). Any postponement of the Physics assignment immediately pushes Math into cram territory."
            )
            suggested_actions = ["Run What-If Simulator", "View workload distribution"]

        else:
            reply = (
                f"As Arjun's Digital Twin, I am actively tracking your 3 goals, {len(context.get('tasks', []))} active tasks, "
                f"and 7 personal preferences. You currently have Physics Assignment due October 2 and Mathematics Exam on October 4. "
                "How would you like to plan your evening or simulate a decision?"
            )
            suggested_actions = ["Ask: What should I study tonight?", "Ask: What if I skip studying tonight?", "Open What-If Simulator"]

        return {
            "reply": reply,
            "factors_considered": factors,
            "suggested_actions": suggested_actions,
            "ai_provider_used": "TwinEngine Rule-Based Fallback"
        }
