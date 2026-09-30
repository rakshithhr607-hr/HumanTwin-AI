import React from 'react';
import {
  Clock,
  Target,
  Calendar,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Brain,
  Shield,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Zap,
  Activity
} from 'lucide-react';

export default function DashboardTab({
  overview,
  onNavigateToWhatIf,
  onRunPresetWhatIf,
  onNavigateToKnowledge,
  onNavigateToChat
}) {
  const user = overview?.user || {};
  const goals = overview?.goals || [];
  const tasks = overview?.tasks || [];
  const routines = overview?.routines || [];
  const patterns = overview?.patterns || [];
  const stats = overview?.stats || {};
  const updates = overview?.twin_updates || [];

  return (
    <div className="space-y-6">
      {/* Top Banner Message from Demo Step 1 */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white m-0">
              Your Digital Twin currently understands {stats.preferences_count || 7} preferences, {stats.goals_count || 4} goals, {stats.tasks_count || 3} tasks, and {stats.patterns_count || 5} behavioral patterns.
            </h2>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              Representation evolved solely from explicitly permitted student context. Non-autonomous decision support.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToKnowledge}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
          >
            What Twin Knows →
          </button>
          <button
            onClick={() => onRunPresetWhatIf("What will happen if I spend the next two days preparing for my Mathematics exam instead of working on my Physics assignment?")}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Launch What-If Demo</span>
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Twin Confidence */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Twin Confidence</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats.twin_confidence_pct || 88}%</span>
            <span className="text-xs text-emerald-400 font-medium">Calibrated</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            {user.confidence_notes || "Derived from 7 preferences & 5 verified patterns"}
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.twin_confidence_pct || 88}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Workload */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Current Workload</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300">Heavy</span>
            <span className="text-xs text-slate-400">3 Deadlines</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            1 Exam (Oct 4), 2 Assignments (Oct 2, Oct 6)
          </p>
          <div className="mt-3 flex gap-1.5">
            <span className="px-2 py-0.5 text-[10px] rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
              Oct 2 Urgent
            </span>
            <span className="px-2 py-0.5 text-[10px] rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              Oct 4 High
            </span>
          </div>
        </div>

        {/* Card 3: Evening Study Capacity */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Evening Study Routine</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">3.0 hrs</span>
            <span className="text-xs text-indigo-300">6:00 – 9:00 PM</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Available daily study block after college
          </p>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Sleep preserved: 10:30 PM - 6:30 AM</span>
          </div>
        </div>

        {/* Card 4: Privacy Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Data Permission</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">Strict Control</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Zero external data. Only permitted student inputs.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">7 Active Categories</span>
            <span className="text-emerald-400 font-medium">1 Protected</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Today's Context & Schedule Routine */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white m-0">Today's Context & Routine</h3>
              </div>
              <span className="text-xs text-slate-400">Weekday Schedule (Mon-Fri)</span>
            </div>

            <div className="space-y-3">
              {routines.map((r, i) => {
                const isStudy = r.activity_name?.toLowerCase().includes('study');
                const isSleep = r.activity_name?.toLowerCase().includes('sleep');
                const isCollege = r.activity_name?.toLowerCase().includes('college');

                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition ${
                      isStudy
                        ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200'
                        : isSleep
                        ? 'bg-purple-950/30 border-purple-500/30 text-purple-200'
                        : isCollege
                        ? 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isStudy ? 'bg-indigo-400' : isSleep ? 'bg-purple-400' : isCollege ? 'bg-amber-400' : 'bg-slate-400'
                      }`} />
                      <div>
                        <span className="font-semibold text-white">{r.activity_name}</span>
                        {r.notes && (
                          <span className="text-slate-400 text-[11px] block sm:inline sm:ml-2">
                            • {r.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 font-mono text-[11px] text-slate-200 border border-slate-700">
                        {r.start_time} – {r.end_time}
                      </span>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {r.flexibility}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Current Tasks & Upcoming Deadlines */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white m-0">Upcoming Deadlines & Workload</h3>
              </div>
              <span className="text-xs text-slate-400">October Academic Cycle</span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const isPhysics = task.title.includes('Physics');
                const isMath = task.title.includes('Mathematics');

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start sm:items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          task.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {task.priority} Priority
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-white m-0">{task.title}</h4>
                          <span className="text-xs text-slate-400">{task.subject} • {task.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs font-semibold text-slate-200">
                            Due: {task.deadline}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {task.estimated_hours}h required ({task.completed_hours}h done)
                          </div>
                        </div>

                        {isPhysics && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                            Due in 48h!
                          </span>
                        )}
                        {isMath && (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                            Exam in 4 days
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Preparation / Completion</span>
                        <span className="font-semibold text-slate-300">{task.current_progress_pct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isPhysics
                              ? 'bg-rose-500'
                              : isMath
                              ? 'bg-indigo-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${task.current_progress_pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Card: Main CTA: Ask / What-If */}
          <div className="bg-gradient-to-br from-indigo-900/60 via-slate-900 to-purple-900/40 border border-indigo-500/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-base font-bold text-white m-0">What If? Simulator</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test decisions before taking them. Compare time trade-offs, stress risks, and deadline pressures.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => onRunPresetWhatIf("What will happen if I spend the next two days preparing for my Mathematics exam instead of working on my Physics assignment?")}
                className="w-full text-left p-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-xs text-indigo-200 transition cursor-pointer flex items-center justify-between group"
              >
                <span className="line-clamp-2">"What if I spend the next 2 days on Math exam instead of Physics?"</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300 group-hover:translate-x-1 transition ml-1 shrink-0" />
              </button>

              <button
                onClick={() => onRunPresetWhatIf("What if I complete Physics assignment tonight and start Math prep tomorrow?")}
                className="w-full text-left p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition cursor-pointer flex items-center justify-between group"
              >
                <span className="line-clamp-1">"What if I finish Physics tonight & Math tomorrow?"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition ml-1 shrink-0" />
              </button>

              <button
                onClick={() => onRunPresetWhatIf("What if I skip studying tonight and add 2 hours to tomorrow?")}
                className="w-full text-left p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition cursor-pointer flex items-center justify-between group"
              >
                <span className="line-clamp-1">"What if I skip studying tonight?"</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition ml-1 shrink-0" />
              </button>
            </div>

            <button
              onClick={onNavigateToWhatIf}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer text-center"
            >
              Open What-If Simulator →
            </button>
          </div>

          {/* Card: Behavioral Insights (System-Inferred) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white m-0">Behavioral Insights</h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                System-Inferred
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Extracted from verified study session logs and submission histories. Not fabricated.
            </p>

            <div className="space-y-2.5">
              {patterns.map((pat) => (
                <div
                  key={pat.id}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1"
                >
                  <p className="text-slate-200 font-medium leading-snug m-0">
                    "{pat.pattern_text}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Category: {pat.category}</span>
                    <span className="text-emerald-400 font-medium">
                      {Math.round(pat.confidence * 100)}% Conf. ({pat.evidence_count} sessions)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Current Goals */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white m-0">Current Goals</h3>
              </div>
              <span className="text-xs text-slate-400">4 Active</span>
            </div>

            <div className="space-y-3">
              {goals.map((g) => (
                <div key={g.id} className="text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200">{g.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {g.category}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${g.progress_pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
