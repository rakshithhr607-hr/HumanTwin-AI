import React, { useState } from 'react';
import {
  Compass,
  Sliders,
  Clock,
  Target,
  TrendingUp,
  Brain,
  History,
  CheckCircle2,
  Sparkles,
  Info,
  Calendar,
  Lock
} from 'lucide-react';

export default function KnowledgeBaseTab({ overview }) {
  const [activeSection, setActiveSection] = useState('all');

  const preferences = overview?.preferences || [];
  const routines = overview?.routines || [];
  const goals = overview?.goals || [];
  const patterns = overview?.patterns || [];
  const updates = overview?.twin_updates || [];

  const sections = [
    { id: 'all', label: 'All Knowledge' },
    { id: 'preferences', label: `Preferences (${preferences.length})` },
    { id: 'patterns', label: `Inferred Habits (${patterns.length})` },
    { id: 'routines', label: `Routine (${routines.length})` },
    { id: 'goals', label: `Goals (${goals.length})` },
    { id: 'history', label: `Twin Updates (${updates.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white m-0">What Does My Digital Twin Know About Me?</h2>
              <p className="text-xs text-slate-400 m-0">
                Transparent inspection of all explicit inputs, learned rules, and system-inferred tendencies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
              User-Provided
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              System-Inferred
            </span>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
              Learned from Feedback
            </span>
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Preferences Section */}
      {(activeSection === 'all' || activeSection === 'preferences') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white m-0">Stored Preferences</h3>
            </div>
            <span className="text-xs text-slate-400">{preferences.length} Active Records</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preferences.map((p) => {
              const isFeedbackRule = p.source?.includes('Feedback') || p.key === 'priority_rule_assignment_48h';
              const isInferred = p.is_system_inferred;

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border text-xs flex flex-col justify-between transition ${
                    isFeedbackRule
                      ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-semibold text-white text-sm">{p.title}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFeedbackRule
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : isInferred
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {p.source}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-3">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Category: {p.category}</span>
                    <span className="font-medium text-slate-300 font-mono">Value: {p.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. System-Inferred Behavioral Patterns */}
      {(activeSection === 'all' || activeSection === 'patterns') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white m-0">System-Inferred Behavioral Patterns</h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Derived from Stored History
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed m-0">
            These patterns are calculated from your real study logs and past submissions to protect against unrealistic plans.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {pat.category}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {Math.round(pat.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 leading-snug">
                    "{pat.pattern_text}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-2">
                  <span>Source: {pat.source_type}</span>
                  <span className="text-slate-300">Evidence: {pat.evidence_count} historical sessions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Routine Schedule */}
      {(activeSection === 'all' || activeSection === 'routines') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white m-0">Daily Routine & Calendar Anchors</h3>
            </div>
            <span className="text-xs text-slate-400">{routines.length} Blocks</span>
          </div>

          <div className="space-y-2.5">
            {routines.map((r, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <div>
                    <h5 className="text-sm font-bold text-white m-0">{r.activity_name}</h5>
                    <p className="text-xs text-slate-400 m-0 mt-0.5">{r.notes}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2.5 py-1 rounded bg-slate-800 font-mono text-xs text-indigo-300 border border-slate-700">
                    {r.start_time} – {r.end_time}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                    {r.days_of_week}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                    {r.flexibility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Active Goals */}
      {(activeSection === 'all' || activeSection === 'goals') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white m-0">Explicit Stated Goals</h3>
            </div>
            <span className="text-xs text-slate-400">{goals.length} Goals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((g) => (
              <div key={g.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{g.title}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                    {g.category}
                  </span>
                </div>
                <p className="text-slate-300 leading-snug">{g.details}</p>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Target: {g.target_date}</span>
                    <span className="font-semibold text-slate-200">{g.progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${g.progress_pct}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Twin Updates History */}
      {(activeSection === 'all' || activeSection === 'history') && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white m-0">Twin Learning & Evolution Audit Log</h3>
            </div>
            <span className="text-xs text-slate-400">{updates.length} Updates</span>
          </div>

          <div className="space-y-3">
            {updates.map((u) => (
              <div key={u.id} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{u.change_summary}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                    {u.update_type}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-0.5">BEFORE:</span>
                    <span className="text-slate-300 italic">"{u.before_state}"</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-semibold block mb-0.5">AFTER:</span>
                    <span className="text-emerald-300 font-semibold">"{u.after_state}"</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
