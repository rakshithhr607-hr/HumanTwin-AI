import { useEffect, useState } from "react";
import { api } from "./services/api";

import DashboardTab from "./pages/DashboardTab";
import WhatIfTab from "./pages/WhatIfTab";
import KnowledgeBaseTab from "./pages/KnowledgeBaseTab";
import ChatTab from "./pages/ChatTab";
import DataControlTab from "./pages/DataControlTab";
import InsightsTab from "./pages/InsightsTab";

function App() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [whatIfQuery, setWhatIfQuery] = useState("");

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    try {
      setLoading(true);
      setError("");

      const data = await api.getTwinOverview();
      setOverview(data);
    } catch (err) {
      console.error(err);

      setError(
        "Could not connect to the HumanTwin backend. Make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    try {
      setLoading(true);
      await api.resetTwin();
      await loadOverview();
      setActiveTab("dashboard");
    } catch (err) {
      console.error(err);
      setError("Could not reset your digital twin.");
      setLoading(false);
    }
  }

  async function handleLoadDemo() {
    try {
      setLoading(true);
      await api.loadDemoStudent();
      await loadOverview();
      setActiveTab("dashboard");
    } catch (err) {
      console.error(err);
      setError("Could not load the demo student.");
      setLoading(false);
    }
  }

  function navigateToWhatIf(query = "") {
    setWhatIfQuery(query);
    setActiveTab("what-if");
  }

  function navigateToKnowledge() {
    setActiveTab("knowledge");
  }

  function navigateToChat() {
    setActiveTab("chat");
  }

  if (loading && !overview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin" />

          <h2 className="text-xl font-semibold">
            Loading HumanTwin...
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Connecting to your personal digital twin
          </p>
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 text-xl font-bold">
            !
          </div>

          <h2 className="text-xl font-semibold">
            Connection Error
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error}
          </p>

          <button
            onClick={loadOverview}
            className="mt-6 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = overview?.user || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="fixed left-0 top-0 z-30 flex h-screen w-[268px] flex-col border-r border-slate-800/80 bg-[#071120]">

          {/* Brand */}
          <div className="px-7 pt-8">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                HT
              </div>

              <div>
                <h1 className="text-lg font-bold text-white">
                  HumanTwin
                </h1>

                <p className="text-xs text-slate-500">
                  AI Personal Twin
                </p>
              </div>

            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-10 flex-1 px-4">

            <NavItem
              icon="⌂"
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />

            <NavItem
              icon="◉"
              label="My Twin"
              active={activeTab === "knowledge"}
              onClick={() => setActiveTab("knowledge")}
            />

            <NavItem
              icon="✓"
              label="Goals & Tasks"
              active={activeTab === "goals"}
              onClick={() => setActiveTab("goals")}
            />

            <NavItem
              icon="◌"
              label="What-If"
              active={activeTab === "what-if"}
              onClick={() => setActiveTab("what-if")}
            />

            <NavItem
              icon="◈"
              label="Insights"
              active={activeTab === "insights"}
              onClick={() => setActiveTab("insights")}
            />

            <NavItem
              icon="⚙"
              label="Privacy"
              active={activeTab === "privacy"}
              onClick={() => setActiveTab("privacy")}
            />

            <div className="my-5 border-t border-slate-800" />

            <NavItem
              icon="💬"
              label="Chat with Twin"
              active={activeTab === "chat"}
              onClick={() => setActiveTab("chat")}
            />

          </nav>

          {/* Privacy */}
          <div className="px-4 pb-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

              <div className="flex items-center gap-3">

                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Privacy Active
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your data is controlled by you
                  </p>
                </div>

              </div>

            </div>
          </div>

          <div className="px-7 pb-6 text-center text-xs text-slate-600">
            HumanTwin AI · v1.0
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="ml-[268px] min-h-screen flex-1">

          {/* TOP BAR */}
          <header className="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/90 px-8 py-4 backdrop-blur-xl">

            <div className="flex items-center justify-between gap-6">

              <div>

                <p className="text-[11px] font-bold tracking-[0.25em] text-blue-400">
                  PERSONAL DIGITAL TWIN
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  {activeTab === "dashboard" && "Dashboard"}
                  {activeTab === "knowledge" && "My Digital Twin"}
                  {activeTab === "goals" && "Goals & Tasks"}
                  {activeTab === "what-if" && "What-If Simulator"}
                  {activeTab === "insights" && "Insights"}
                  {activeTab === "privacy" && "Privacy & Data Control"}
                  {activeTab === "chat" && "Chat with Your Twin"}
                </h2>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={handleLoadDemo}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 hover:border-violet-500/50 hover:text-white"
                >
                  Load Demo
                </button>

                <button
                  onClick={handleReset}
                  className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-medium text-red-300 hover:bg-red-500/10"
                >
                  Reset Twin
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 font-bold text-white">
                    {(user.name || "A").charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden sm:block">

                    <p className="text-sm font-semibold text-white">
                      {user.name || "Arjun"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {user.role || "Student"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </header>

          {/* PAGE CONTENT */}
          <div className="px-8 pb-12 pt-8">

            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <DashboardTab
                overview={overview}
                onNavigateToWhatIf={navigateToWhatIf}
                onRunPresetWhatIf={navigateToWhatIf}
                onNavigateToKnowledge={navigateToKnowledge}
                onNavigateToChat={navigateToChat}
              />
            )}

            {/* GOALS & TASKS */}
            {activeTab === "goals" && (
              <DashboardTab
                overview={overview}
                onNavigateToWhatIf={navigateToWhatIf}
                onRunPresetWhatIf={navigateToWhatIf}
                onNavigateToKnowledge={navigateToKnowledge}
                onNavigateToChat={navigateToChat}
              />
            )}

            {/* INSIGHTS - FIXED */}
            {activeTab === "insights" && (
              <InsightsTab overview={overview} />
            )}

            {/* MY TWIN */}
            {activeTab === "knowledge" && (
              <KnowledgeBaseTab
                overview={overview}
              />
            )}

            {/* WHAT-IF */}
            {activeTab === "what-if" && (
              <WhatIfTab
                overview={overview}
                initialQuery={whatIfQuery}
                onFeedbackGiven={loadOverview}
                onRefreshOverview={loadOverview}
              />
            )}

            {/* CHAT */}
            {activeTab === "chat" && (
              <ChatTab
                overview={overview}
                onNavigateToWhatIf={navigateToWhatIf}
              />
            )}

            {/* PRIVACY */}
            {activeTab === "privacy" && (
              <DataControlTab
                overview={overview}
                onRefreshOverview={loadOverview}
                onReset={handleReset}
              />
            )}

          </div>

        </main>

      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`mb-2 flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all ${
        active
          ? "bg-blue-500/15 text-white shadow-inner"
          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
      }`}
    >

      <span
        className={`flex w-5 justify-center text-base ${
          active
            ? "text-blue-400"
            : "text-slate-500"
        }`}
      >
        {icon}
      </span>

      <span>{label}</span>

    </button>
  );
}

export default App;