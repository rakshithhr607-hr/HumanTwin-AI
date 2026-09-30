import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

export default function ChatTab({ overview, onNavigateToWhatIf }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello Arjun! I am your personal Digital Twin. I have full context on your upcoming Mathematics exam (Oct 4), Physics assignment (Oct 2), and your 6:00–9:00 PM study routine. How can I help you plan or make a decision today?",
      factors: [
        "Active Tasks: Physics Assignment, Math Exam, Programming Assignment",
        "Evening Routine: 6:00 PM – 9:00 PM (3.0 hours)",
        "College: 9:00 AM – 4:00 PM (Mon-Fri)"
      ],
      actions: [
        "What should I study tonight?",
        "What if I skip studying tonight?",
        "What patterns do you see in my routine?"
      ],
      provider: "TwinEngine Local Grounding"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What should I study tonight?",
    "What if I skip studying tonight?",
    "What if I study 2 extra hours tomorrow?",
    "Why am I falling behind?",
    "What patterns do you see in my routine?"
  ];

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, text: m.text }));
      const res = await api.chatWithTwin(textToSend, historyPayload);

      const botMsg = {
        role: 'assistant',
        text: res.reply,
        factors: res.factors_considered || [],
        actions: res.suggested_actions || [],
        provider: res.ai_provider_used
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "AI service connection error. However, your saved Digital Twin profile is safe.",
          factors: ["Offline Fallback Active"],
          actions: [],
          provider: "Local Safety Shield"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white m-0">Conversational Digital Twin Interface</h2>
            <p className="text-xs text-slate-400 m-0">
              Ask natural-language questions grounded strictly in your permitted schedule and preferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Hallucination Grounding</span>
          </span>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap">Suggested Questions:</span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="h-[520px] overflow-y-auto p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={i}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs'
                    : 'bg-indigo-950 border border-indigo-500/40 text-indigo-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {/* Factors Considered Drawer */}
                {!isUser && msg.factors?.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Context Factors Analyzed:</span>
                    <ul className="list-disc list-inside space-y-0.5 m-0 p-0 text-slate-400">
                      {msg.factors.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next actions pills */}
                {!isUser && msg.actions?.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act.toLowerCase().includes('what-if') || act.toLowerCase().includes('simulate')) {
                            onNavigateToWhatIf();
                          } else {
                            handleSend(act);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-indigo-300 text-[11px] font-medium transition cursor-pointer"
                      >
                        ⚡ {act}
                      </button>
                    ))}
                  </div>
                )}

                {/* Provider pill */}
                {!isUser && msg.provider && (
                  <div className="text-[10px] text-slate-500 text-right pt-1">
                    Engine: {msg.provider}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <Brain className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span>Analyzing schedule, tasks, and historical patterns...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your twin anything: e.g. What should I study tonight? What if I skip studying?"
          className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
}
