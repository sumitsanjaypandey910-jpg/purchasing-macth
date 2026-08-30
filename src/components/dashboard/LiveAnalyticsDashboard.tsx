import React, { useState } from 'react';
import { GameScoreEvent, GameSessionSummary, MathSkill, StoreItem } from '../../types';
import { formatMoney } from '../../data/gameData';
import { motion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Sparkles,
  Download,
  Users,
  Target,
  Code2,
  RefreshCw
} from 'lucide-react';

interface LiveAnalyticsDashboardProps {
  events: GameScoreEvent[];
  sessions: GameSessionSummary[];
  activeChildName: string;
  onClearEvents?: () => void;
  onSelectTab?: (tab: string) => void;
}

export const LiveAnalyticsDashboard: React.FC<LiveAnalyticsDashboardProps> = ({
  events,
  sessions,
  activeChildName,
  onClearEvents,
  onSelectTab,
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const [selectedEventDetail, setSelectedEventDetail] = useState<GameScoreEvent | null>(null);

  // Compute aggregate statistics
  const totalPoints = events.reduce((sum, e) => sum + e.pointsEarned, 0);
  const matchedEvents = events.filter(e => e.eventType === 'ITEM_MATCHED');
  const errorEvents = events.filter(e => e.eventType === 'ERROR_ATTEMPT');
  const totalAttempts = matchedEvents.length + errorEvents.length;
  const overallAccuracy = totalAttempts > 0 ? Math.round((matchedEvents.length / totalAttempts) * 100) : 100;
  const highestStreak = events.reduce((max, e) => Math.max(max, e.highestStreak || 0), 0);

  // Skills mastery calculations
  const skillsData: Record<MathSkill, { name: string; icon: string; attempts: number; successes: number; accuracy: number; desc: string }> = {
    annual_frequency_calc: { name: 'Annual Frequency Multiplier', icon: '⚡', attempts: 0, successes: 0, accuracy: 100, desc: 'Calculating annual spend across frequencies (1x a year, 2x a month)' },
    multiplication_budget: { name: 'Multiplication Budgeting', icon: '✖️', attempts: 0, successes: 0, accuracy: 100, desc: 'Multiplying quantity times price accurately' },
    coin_recognition: { name: 'Coin & Bill Matching', icon: '🪙', attempts: 0, successes: 0, accuracy: 100, desc: 'Matching coins & bills to exact single price tag' },
    addition: { name: 'Basket Cart Addition', icon: '🛒', attempts: 0, successes: 0, accuracy: 100, desc: 'Adding multiple items together in shopping basket' },
    subtraction_change: { name: 'Cashier Change Math', icon: '🧮', attempts: 0, successes: 0, accuracy: 100, desc: 'Calculating difference (Paid - Price = Change)' },
    budgeting: { name: 'Budget Planning', icon: '👛', attempts: 0, successes: 0, accuracy: 100, desc: 'Selecting multiple store items to match budget' },
    value_estimation: { name: 'Value Estimation', icon: '⚖️', attempts: 0, successes: 0, accuracy: 100, desc: 'Quick money denomination recognition' },
  };

  events.forEach(e => {
    if (e.mathSkill && skillsData[e.mathSkill]) {
      if (e.eventType === 'ITEM_MATCHED') {
        skillsData[e.mathSkill].attempts += 1;
        skillsData[e.mathSkill].successes += 1;
      } else if (e.eventType === 'ERROR_ATTEMPT') {
        skillsData[e.mathSkill].attempts += 1;
      }
    }
  });

  Object.keys(skillsData).forEach(k => {
    const s = skillsData[k as MathSkill];
    if (s.attempts > 0) {
      s.accuracy = Math.round((s.successes / s.attempts) * 100);
    }
  });

  // Filter events
  const filteredEvents = events.filter(e => {
    if (filterMode === 'all') return true;
    if (filterMode === 'matches') return e.eventType === 'ITEM_MATCHED';
    if (filterMode === 'errors') return e.eventType === 'ERROR_ATTEMPT';
    if (filterMode === 'badges') return e.eventType === 'BADGE_UNLOCKED';
    return true;
  });

  const exportTelemetryJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ childName: activeChildName, summary: { totalPoints, overallAccuracy, totalEvents: events.length }, events, sessions }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `purchasing_match_telemetry_${activeChildName}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="font-bold text-2xl text-slate-900 tracking-tight">
              Host App Shared Dashboard
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time score data & math skill telemetry streamed from the <span className="font-semibold text-slate-700">PurchasingMatchGame</span> React component.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={exportTelemetryJson}
            disabled={events.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Telemetry</span>
          </button>

          {onSelectTab && (
            <button
              type="button"
              onClick={() => onSelectTab('integration')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Integration SDK</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Points */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Game Points</span>
            <h3 className="text-3xl font-extrabold text-amber-500 mt-1 font-kid">{totalPoints}</h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Shared to player profile
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl border border-amber-200">
            🏆
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Math Accuracy</span>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1 font-kid">{overallAccuracy}%</h3>
            <span className="text-xs text-slate-500 font-medium mt-1 block">
              {matchedEvents.length} correct / {totalAttempts} attempts
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl border border-emerald-200">
            🎯
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Max Combo Streak</span>
            <h3 className="text-3xl font-extrabold text-orange-500 mt-1 font-kid">{highestStreak}x</h3>
            <span className="text-xs text-slate-500 font-medium mt-1 block">
              Bonus point multipliers
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl border border-orange-200">
            🔥
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Purchases Completed</span>
            <h3 className="text-3xl font-extrabold text-purple-600 mt-1 font-kid">{matchedEvents.length}</h3>
            <span className="text-xs text-slate-500 font-medium mt-1 block">
              {sessions.length} complete game sessions
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl border border-purple-200">
            🛍️
          </div>
        </div>
      </div>

      {/* Middle Section: Math Skills Breakdown & Live Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skills Mastery Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Math Learning Mastery</h3>
              <p className="text-xs text-slate-500">Skill proficiency based on game purchasing actions</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
              Curriculum Data
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {Object.entries(skillsData).map(([skillKey, skill]) => (
              <div key={skillKey} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <span>{skill.icon}</span>
                    <span>{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">
                      ({skill.successes}/{skill.attempts || 1} hits)
                    </span>
                    <span className={`font-bold font-kid text-sm ${
                      skill.accuracy >= 80 ? 'text-emerald-600' : skill.accuracy >= 50 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {skill.accuracy}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      skill.accuracy >= 80 ? 'bg-emerald-500' : skill.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${skill.accuracy}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Event Telemetry Stream (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span>📡</span> Live Game Events Log
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time events dispatched from the game component
                </p>
              </div>

              {/* Event Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'matches', label: 'Matches' },
                  { id: 'errors', label: 'Errors' },
                  { id: 'badges', label: 'Badges' },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterMode(f.id)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterMode === f.id ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List */}
            <div className="min-h-72 max-h-80 overflow-y-auto space-y-2 pr-1 mt-3">
              {filteredEvents.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-slate-400 text-sm italic gap-2">
                  <span className="text-3xl">🎮</span>
                  <p>No game events logged yet. Play the Purchasing Match game to see live telemetry stream here!</p>
                </div>
              ) : (
                filteredEvents.slice(0, 30).map((evt) => {
                  const timeStr = new Date(evt.timestamp).toLocaleTimeString();
                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedEventDetail(evt)}
                      className={`p-3 rounded-2xl border transition-all text-xs cursor-pointer hover:shadow-xs ${
                        evt.eventType === 'ITEM_MATCHED'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : evt.eventType === 'ERROR_ATTEMPT'
                          ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                          : evt.eventType === 'BADGE_UNLOCKED'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider bg-white/80 border">
                            {evt.eventType}
                          </span>
                          <span className="font-semibold text-slate-700">Mode: {evt.gameMode}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{timeStr}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span>
                          {evt.eventType === 'ITEM_MATCHED' && `Matched ${evt.details?.itemName || 'Item'} for $${evt.details?.itemPrice || ''}`}
                          {evt.eventType === 'ERROR_ATTEMPT' && `Attempt mismatch (Paid $${evt.details?.userPaid}, needed $${evt.details?.correctAmount})`}
                          {evt.eventType === 'BADGE_UNLOCKED' && `Unlocked badge "${evt.details?.badgeName}"`}
                          {evt.eventType === 'GAME_SESSION_END' && `Finished full session rounds`}
                        </span>

                        <span className="font-bold text-slate-900 font-kid">
                          {evt.pointsEarned > 0 ? `+${evt.pointsEarned} pts` : `0 pts`}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {onClearEvents && events.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClearEvents}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear Log History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Raw Event Modal Inspector */}
      {selectedEventDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-700 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
              <span className="font-bold text-amber-400 text-sm">Event Payload Inspector</span>
              <button
                type="button"
                onClick={() => setSelectedEventDetail(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            <pre className="overflow-x-auto p-3 bg-slate-950 rounded-xl max-h-80 text-emerald-400">
              {JSON.stringify(selectedEventDetail, null, 2)}
            </pre>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedEventDetail, null, 2));
                  setSelectedEventDetail(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-sans text-xs font-semibold hover:bg-indigo-700"
              >
                Copy JSON Payload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
