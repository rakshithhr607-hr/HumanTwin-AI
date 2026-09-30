import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { api } from '../services/api';

export default function DataControlTab({
  overview,
  onRefreshOverview,
  onReset
}) {
  const [permissions, setPermissions] = useState(overview?.permissions || []);
  const [savingId, setSavingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Sync permissions if overview updates
  React.useEffect(() => {
    if (overview?.permissions) {
      setPermissions(overview.permissions);
    }
  }, [overview]);

  const handleToggle = async (perm) => {
    setSavingId(perm.id);
    const newStatus = !perm.enabled;
    try {
      await api.updatePermission(perm.id, newStatus);
      setPermissions((prev) =>
        prev.map((p) => (p.id === perm.id ? { ...p, enabled: newStatus } : p))
      );
      setStatusMessage({
        type: 'success',
        text: `Category "${perm.category}" is now ${newStatus ? 'ENABLED' : 'DISABLED'}. Twin context updated.`
      });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to update category permission.' });
    } finally {
      setSavingId(null);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your decision and feedback history?")) return;
    try {
      await api.clearHistory();
      setStatusMessage({
        type: 'success',
        text: 'Decision and feedback history cleared successfully.'
      });
      if (onRefreshOverview) onRefreshOverview();
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to clear history.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero & Privacy Architecture */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white m-0">Data Control & Privacy Center</h2>
              <p className="text-xs text-slate-400 m-0">
                You retain complete, fine-grained authority over what your Digital Twin can access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear History</span>
            </button>

            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Digital Twin</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Strict Privacy Guarantee</span>
          </div>
          <p className="m-0 leading-relaxed text-slate-400">
            HumanTwin AI operates under a zero-leakage policy. It NEVER connects to external personal emails, calendars, or private storage without explicit permission. When a category is disabled below, its data is strictly stripped from the AI reasoning engine.
          </p>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="ml-2 font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Permissions Category Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-white m-0">Permitted Data Categories</h3>
          <span className="text-xs text-slate-400">
            {permissions.filter((p) => p.enabled).length} of {permissions.length} categories enabled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissions.map((perm) => {
            const isSaving = savingId === perm.id;
            return (
              <div
                key={perm.id}
                className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                  perm.enabled
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-slate-950/50 border-slate-900 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{perm.category}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          perm.enabled
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {perm.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggle(perm)}
                      disabled={isSaving}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer disabled:opacity-50 ${
                        perm.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          perm.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Information Stored */}
                  <div className="mb-2 text-xs">
                    <span className="text-slate-400 font-medium block mb-0.5">What is stored:</span>
                    <p className="text-slate-200 leading-snug m-0 bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      {perm.stored_description}
                    </p>
                  </div>

                  {/* Why Twin Uses It */}
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium block mb-0.5">Why the twin uses it:</span>
                    <p className="text-slate-300 leading-snug m-0">
                      {perm.purpose}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {perm.enabled ? 'Active in What-If simulations' : 'Excluded from twin context'}
                  </span>
                  <button
                    onClick={() => handleToggle(perm)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    {perm.enabled ? 'Disable Category' : 'Enable Category'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
