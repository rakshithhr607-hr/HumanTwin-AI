import React from "react";
import {
  TrendingUp,
  Brain,
  Target,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  Activity,
} from "lucide-react";

export default function InsightsTab({ overview }) {
  const user = overview?.user || {};
  const goals = overview?.goals || [];
  const tasks = overview?.tasks || [];
  const patterns = overview?.patterns || [];
  const stats = overview?.stats || [];

  const completedGoals = goals.filter(
    (goal) => Number(goal.progress_pct || 0) >= 75
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Personalized Insights
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Analysis generated from your goals, tasks, routines, and
              behavioral patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Insight Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Twin Confidence
            </span>
            <Brain className="w-4 h-4 text-violet-400" />
          </div>

          <div className="mt-2 text-2xl font-bold text-white">
            {stats.twin_confidence_pct || 88}%
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Based on available user context
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Behavioral Patterns
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="mt-2 text-2xl font-bold text-white">
            {patterns.length}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Patterns identified from available history
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Goals Progress
            </span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>

          <div className="mt-2 text-2xl font-bold text-white">
            {completedGoals}/{goals.length}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Goals at 75% or higher progress
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              High Priority Tasks
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>

          <div className="mt-2 text-2xl font-bold text-amber-300">
            {highPriorityTasks}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Tasks requiring closer attention
          </p>
        </div>

      </div>

      {/* Behavioral Insights */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            Behavioral Insights
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          These insights are derived from the behavioral patterns available
          to the Digital Twin.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {patterns.length > 0 ? (
            patterns.map((pattern) => (
              <div
                key={pattern.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">
                    {pattern.category}
                  </span>

                  <span className="text-[10px] text-emerald-400">
                    {Math.round((pattern.confidence || 0) * 100)}% confidence
                  </span>
                </div>

                <p className="text-sm text-slate-200">
                  {pattern.pattern_text}
                </p>

                <p className="text-[11px] text-slate-500 mt-2">
                  Evidence: {pattern.evidence_count} historical sessions
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-400">
              Not enough behavioral history to generate detailed insights yet.
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h3 className="text-sm font-bold text-white">
            Personalized Recommendations
          </h3>
        </div>

        <div className="space-y-3">

          {highPriorityTasks > 0 && (
            <div className="flex gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">
                  Review high-priority tasks
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Your current workload contains {highPriorityTasks}
                  high-priority task(s).
                </p>
              </div>
            </div>
          )}

          {completedGoals > 0 && (
            <div className="flex gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">
                  Maintain your goal progress
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {completedGoals} goal(s) are currently at strong progress.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <Brain className="w-4 h-4 text-violet-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                Continue providing feedback
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Feedback helps the Digital Twin refine its understanding of
                your preferences and behavior.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Explanation */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2">
          How these insights are generated
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          HumanTwin analyzes the information available in the Digital Twin,
          including goals, tasks, routines, preferences, and behavioral
          patterns. The system uses this context to provide explainable
          decision-support insights while keeping the user in control.
        </p>
      </div>

    </div>
  );
}