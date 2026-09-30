import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Zap,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Play
} from 'lucide-react';
import { api } from '../services/api';

export default function WhatIfTab({
  overview,
  initialQuery = '',
  onFeedbackGiven,
  onRefreshOverview
}) {
  const [query, setQuery] = useState(
    initialQuery ||
    "What will happen if I spend the next two days preparing for my Mathematics exam instead of working on my Physics assignment?"
  );
  const [daysHorizon, setDaysHorizon] = useState(2);
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState(null);

  // Explainability toggle
  const [showExplanation, setShowExplanation] = useState(false);

  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackUseful, setFeedbackUseful] = useState(null);
  const [feedbackChoice, setFeedbackChoice] = useState('assignment_first');
  const [feedbackReason, setFeedbackReason] = useState('assignment_deadline_priority');
  const [customReason, setCustomReason] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);

  // Update query if initialQuery changes from outside
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSimulate = async (customQuery) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.simulateWhatIf(
        q,
        "Focus on Mathematics exam",
        "Complete Physics assignment first",
        daysHorizon
      );
      setSimulation(res);
      setShowExplanation(false);
    } catch (err) {
      setError(err.message || "Simulation failed. Using grounded local fallback.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = (useful) => {
    setFeedbackUseful(useful);
    setShowFeedbackModal(true);
    setFeedbackResult(null);
  };

  const handleSubmitFeedback = async () => {
    setSubmittingFeedback(true);
    try {
      const res = await api.submitFeedback({
        simulationId: simulation?.simulation_id,
        wasUseful: feedbackUseful,
        userChoice: feedbackChoice,
        reasonCategory: feedbackReason,
        customReason: customReason
      });
      setFeedbackResult(res);
      setShowFeedbackModal(false);
      if (onFeedbackGiven) onFeedbackGiven(res);
      if (onRefreshOverview) onRefreshOverview();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReSimulateAfterUpdate = async () => {
    await handleSimulate();
  };

  // Helper for risk badge styling
  const getRiskBadge = (pressureStr) => {
    const p = (pressureStr || '').toLowerCase();
    if (p.includes('high')) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>High Risk</span>
        </span>
      );
    }
    if (p.includes('moderate')) {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Moderate Risk</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Low Risk</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Simulator Hero & Query Input */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
              Core Feature
            </span>
            <h2 className="text-xl font-bold text-white m-0">WHAT IF? Decision Simulator</h2>
          </div>
          <span className="text-xs text-slate-400">
            Powered by permitted user schedule, preferences, and verified patterns
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-4 max-w-3xl leading-relaxed">
          Ask complex hypothetical questions about upcoming decisions. HumanTwin AI compares prospective outcomes, highlights schedule collisions, and quantifies deadline pressure before you commit.
        </p>

        {/* Input & Action */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={2}
              placeholder="e.g. What will happen if I spend the next two days preparing for my Mathematics exam instead of working on my Physics assignment?"
              className="w-full p-3.5 pr-28 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
            />
            <button
              onClick={() => handleSimulate()}
              disabled={loading || !query.trim()}
              className="absolute right-3 bottom-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simulate</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Scenarios:</span>
            <button
              onClick={() => {
                const q = "What will happen if I spend the next two days preparing for my Mathematics exam instead of working on my Physics assignment?";
                setQuery(q);
                handleSimulate(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 transition cursor-pointer"
            >
              🎯 Math Exam vs Physics (Hackathon Demo Step 3)
            </button>
            <button
              onClick={() => {
                const q = "What if I complete Physics assignment tonight and start Math prep tomorrow?";
                setQuery(q);
                handleSimulate(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              📝 Finish Physics Tonight
            </button>
            <button
              onClick={() => {
                const q = "What if I skip studying tonight and add 2 hours to tomorrow?";
                setQuery(q);
                handleSimulate(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              ⏸️ Skip Tonight (-3h)
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK LEARNING SUCCESS BANNER (Key Demo Step 8) */}
      {feedbackResult && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 text-slate-200 shadow-md animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-400 m-0">Twin Updated ✓</h3>
                <span className="text-xs text-slate-300">
                  Active learning loop triggered: Preference and decision heuristics recalibrated.
                </span>
              </div>
            </div>

            <button
              onClick={handleReSimulateAfterUpdate}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Re-Simulate with Updated Twin (Step 9) →</span>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                BEFORE FEEDBACK
              </span>
              <p className="text-slate-300 italic m-0">"{feedbackResult.before_rule}"</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                AFTER FEEDBACK (NEW LEARNED PREFERENCE)
              </span>
              <p className="text-emerald-300 font-semibold m-0">"{feedbackResult.after_rule}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => handleSimulate()} className="underline font-semibold ml-2">
            Retry
          </button>
        </div>
      )}

      {/* SIMULATION RESULTS */}
      {simulation && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section: Side-by-Side Scenarios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white m-0 flex items-center gap-2">
                <span>Scenario Comparison</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                  Horizon: {daysHorizon} Days (Oct 1–2)
                </span>
              </h3>
              <span className="text-[11px] text-slate-400 italic">
                *Clearly labeled estimates based on your 3h/day evening study block.
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {simulation.scenarios.map((sc) => {
                const isA = sc.scenario_id === 'A';
                return (
                  <div
                    key={sc.scenario_id}
                    className={`rounded-xl border p-5 transition flex flex-col justify-between ${
                      isA
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isA ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            SCENARIO {sc.scenario_id}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1 m-0">{sc.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{sc.focus}</p>
                        </div>
                        {getRiskBadge(sc.deadline_pressure)}
                      </div>

                      {/* Study Time Allocation */}
                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3.5 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Available Study Time:</span>
                        <span className="font-semibold text-slate-200">{sc.available_study_time}</span>
                      </div>

                      {/* Deadline Pressure Analysis */}
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-slate-300 block mb-1">
                          Deadline Pressure Analysis:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 m-0">
                          {sc.deadline_pressure_reason}
                        </p>
                      </div>

                      {/* Expected Progress Matrix */}
                      <div className="mb-4">
                        <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Estimated Task Progress:
                        </span>
                        <div className="space-y-1.5 text-xs">
                          {Object.entries(sc.expected_progress || {}).map(([taskName, progText], i) => (
                            <div key={i} className="flex justify-between items-center py-1 px-2 rounded bg-slate-950/40 border border-slate-800/40">
                              <span className="text-slate-400">{taskName}</span>
                              <span className="font-semibold text-slate-200">{progText}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risks vs Benefits */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                        {/* Risks */}
                        <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
                          <span className="font-semibold text-rose-300 flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Identified Risks</span>
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] p-0 m-0">
                            {sc.risks.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Benefits */}
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                          <span className="font-semibold text-emerald-300 flex items-center gap-1 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Expected Benefits</span>
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] p-0 m-0">
                            {sc.benefits.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Potential Conflicts */}
                      {sc.potential_conflicts?.length > 0 && (
                        <div className="text-[11px] text-slate-400 p-2 rounded bg-slate-950/50 border border-slate-800/60">
                          <span className="font-semibold text-slate-300">Potential Schedule Conflicts: </span>
                          {sc.potential_conflicts.join("; ")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Personalized Recommendation */}
          <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </span>
                <h3 className="text-base font-bold text-white m-0">Personalized Recommendation</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                {simulation.recommendation.source_label}
              </span>
            </div>

            {/* Recommendation Statement */}
            <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950/50 p-4 rounded-xl border border-indigo-950">
              "{simulation.recommendation.summary}"
            </p>

            {/* Practical Plan Breakdown */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Practical Recommended Plan (6:00 PM – 9:00 PM)</span>
                </span>
                <span className="text-[11px] text-slate-400">Respects 60-90 min session & rest preference</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {simulation.recommendation.suggested_plan.map((slot, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-300 block mb-1">
                        {slot.time_slot}
                      </span>
                      <h5 className="text-xs font-bold text-white m-0 mb-1.5">{slot.activity}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug m-0">
                      {slot.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Explainability Section: "Why am I seeing this?" */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Why am I seeing this recommendation?</span>
                {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showExplanation && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 animate-fadeIn">
                  <span className="text-slate-300 font-semibold block mb-1">
                    Grounded Factors Considered:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {simulation.why_factors.map((factor, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span className="leading-snug">{factor}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 m-0 italic">
                    Strict privacy enforcement: Only permitted categories (tasks, routine, study habits) were queried. No autonomous decisions are made on your behalf.
                  </p>
                </div>
              )}
            </div>

            {/* FEEDBACK / LEARNING LOOP (Prompt Section 6) */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-300 font-semibold block">Was this recommendation useful?</span>
                <span className="text-slate-400 text-[11px]">
                  Your choice updates the Digital Twin's priority heuristics.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenFeedback(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Yes, this fits me</span>
                </button>

                <button
                  onClick={() => handleOpenFeedback(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-medium transition cursor-pointer shadow-sm"
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                  <span>No, I would choose differently</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK DIALOG / MODAL (The Critical Hackathon Interaction) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Twin Learning Loop
                </span>
                <h3 className="text-base font-bold text-white mt-1 m-0">
                  {feedbackUseful ? 'Affirm Recommendation' : 'How would you choose differently?'}
                </h3>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed m-0">
              {feedbackUseful
                ? 'Your feedback will reinforce balanced task interleaving in future What-If simulations.'
                : 'Help your Digital Twin understand why this plan does not match your instincts so it can evolve its decision rules.'}
            </p>

            {/* Selection */}
            {!feedbackUseful && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Your preferred alternative:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setFeedbackChoice('assignment_first')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                        feedbackChoice === 'assignment_first'
                          ? 'bg-indigo-950/80 border-indigo-500 text-white ring-1 ring-indigo-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-bold block">Assignment First</span>
                      <span className="text-[10px] text-slate-400">Complete Physics assignment before exam prep</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFeedbackChoice('exam_first')}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                        feedbackChoice === 'exam_first'
                          ? 'bg-indigo-950/80 border-indigo-500 text-white ring-1 ring-indigo-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-bold block">Exam Preparation First</span>
                      <span className="text-[10px] text-slate-400">Focus on Math exam mastery</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Why? (Reason Category):
                  </label>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { id: 'assignment_deadline_priority', label: 'The assignment deadline is more important to me (Recommended for Demo)' },
                      { id: 'another_task_first', label: 'I prefer another task first' },
                      { id: 'deadline_less_important', label: 'Deadline is less important to me' },
                      { id: 'more_less_time', label: 'I have more/less time than expected' },
                      { id: 'priorities_changed', label: 'My priorities changed' },
                      { id: 'other', label: 'Other custom reason' }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        onClick={() => setFeedbackReason(opt.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${
                          feedbackReason === opt.id
                            ? 'bg-indigo-950/60 border-indigo-500 text-white'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="feedbackReason"
                          checked={feedbackReason === opt.id}
                          onChange={() => setFeedbackReason(opt.id)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Reason Notes */}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Optional note for your twin:
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="e.g. Always finish assignments due within 48 hours first"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {submittingFeedback ? 'Updating Twin...' : 'Submit & Update Twin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
