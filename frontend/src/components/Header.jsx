import React from 'react';
import {
  Brain,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Zap,
  SlidersHorizontal,
  Compass,
  MessageSquare,
  LayoutDashboard,
  HelpCircle
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  overview,
  onReset,
  onLoadDemo,
  loading
}) {
  const user = overview?.user || { name: 'Arjun', role: 'Engineering Student' };
  const confidencePct = overview?.stats?.twin_confidence_pct || 88;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'what-if', label: 'What-If Simulator', icon: Sparkles, badge: 'Core' },
    { id: 'knowledge', label: 'What Twin Knows', icon: Compass },
    { id: 'chat', label: 'Ask Digital Twin', icon: MessageSquare },
    { id: 'privacy', label: 'Data Control', icon: SlidersHorizontal },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0">HumanTwin AI</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0">Your evolving personal digital twin</p>
          </div>
        </div>

        {/* User Badge & Privacy Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Privacy Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Controlled by you</span>
          </div>

          {/* Twin Confidence Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{confidencePct}% Calibrated</span>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-[10px] text-white">
              {user.name?.[0] || 'A'}
            </div>
            <span className="text-slate-200 font-medium">{user.name}</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">({user.role})</span>
          </div>

          {/* Demo Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLoadDemo}
              disabled={loading}
              title="Populates Arjun synthetic student demo scenario"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-medium transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Load Demo Student</span>
            </button>

            <button
              onClick={onReset}
              disabled={loading}
              title="Reset twin to baseline calibrated state"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition border border-slate-700 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
