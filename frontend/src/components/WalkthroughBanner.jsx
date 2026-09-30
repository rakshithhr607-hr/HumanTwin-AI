import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';

export default function WalkthroughBanner({
  currentStep,
  setCurrentStep,
  onTriggerDemoStep,
  onReset
}) {
  const [isOpen, setIsOpen] = useState(true);

  const steps = [
    {
      num: 1,
      title: 'Inspect Digital Twin',
      desc: 'Verify 7 preferences, 3 goals, 3 tasks, and 5 behavioral patterns.',
      actionLabel: 'View Dashboard',
      tab: 'dashboard'
    },
    {
      num: 2,
      title: 'What Twin Knows',
      desc: 'Inspect user-provided preferences vs system-inferred habits.',
      actionLabel: 'Open Knowledge',
      tab: 'knowledge'
    },
    {
      num: 3,
      title: 'What-If Simulation',
      desc: 'Simulate: Math Exam preparation vs Physics Assignment.',
      actionLabel: 'Launch What-If',
      tab: 'what-if'
    },
    {
      num: 4,
      title: 'Scenario Comparison',
      desc: 'Compare Scenario A vs B (Available time, deadline pressure, risks).',
      actionLabel: 'View Scenarios',
      tab: 'what-if'
    },
    {
      num: 5,
      title: 'Explainable Advice',
      desc: 'Inspect personalized recommendation & click "Why am I seeing this?".',
      actionLabel: 'View Factors',
      tab: 'what-if'
    },
    {
      num: 6,
      title: 'Provide Feedback',
      desc: 'Click "👎 No, I would choose differently" / Assignment first.',
      actionLabel: 'Give Feedback',
      tab: 'what-if'
    },
    {
      num: 7,
      title: 'Select Reason',
      desc: 'Choose: "The assignment deadline is more important to me".',
      actionLabel: 'Select Reason',
      tab: 'what-if'
    },
    {
      num: 8,
      title: 'Twin Updated ✓',
      desc: 'Watch the Before vs After rule update live in the model.',
      actionLabel: 'Verify Learning',
      tab: 'what-if'
    },
    {
      num: 9,
      title: 'Dynamic Re-Evaluation',
      desc: 'Re-simulate! The recommendation updates to recommend Assignment first!',
      actionLabel: 'Re-Simulate',
      tab: 'what-if'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-indigo-900/40 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Toggle header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Hackathon Presentation Walkthrough
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                • 9-Step Interactive Scenario for Judges
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerDemoStep(3)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium transition cursor-pointer"
            >
              <Play className="w-3 h-3 text-indigo-300 fill-indigo-300" />
              <span>Run Live What-If Demo</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 p-1 transition cursor-pointer"
            >
              <span>{isOpen ? 'Collapse' : 'Expand Steps'}</span>
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Steps container */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
              {steps.map((s) => {
                const isCompleted = currentStep > s.num;
                const isCurrent = currentStep === s.num;

                return (
                  <button
                    key={s.num}
                    onClick={() => {
                      setCurrentStep(s.num);
                      onTriggerDemoStep(s.num);
                    }}
                    className={`text-left p-2 rounded-lg border transition flex flex-col justify-between cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                        : isCompleted
                        ? 'bg-slate-900/60 border-emerald-900/40 text-slate-300 hover:bg-slate-800/50'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : isCompleted
                            ? 'bg-emerald-600/30 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          Step {s.num}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        ) : null}
                      </div>
                      <div className="text-xs font-semibold leading-tight line-clamp-1 text-slate-200">
                        {s.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                        {s.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
