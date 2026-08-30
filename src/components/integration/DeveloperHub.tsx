import React, { useState } from 'react';
import { CurrencyCode, DifficultyLevel, GameMode, GameTheme, GameScoreEvent } from '../../types';
import { motion } from 'motion/react';
import {
  Code2,
  Copy,
  Check,
  Play,
  Sliders,
  Layers,
  Terminal,
  ShieldCheck,
  FileCode,
  Share2,
  Sparkles
} from 'lucide-react';

interface DeveloperHubProps {
  currentCurrency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  currentDifficulty: DifficultyLevel;
  onChangeDifficulty: (d: DifficultyLevel) => void;
  currentGameMode: GameMode;
  onChangeGameMode: (m: GameMode) => void;
  currentTheme: GameTheme;
  onChangeTheme: (t: GameTheme) => void;
  childName: string;
  onChangeChildName: (name: string) => void;
  maxRounds: number;
  onChangeMaxRounds: (r: number) => void;
  onSimulateEvent: (event: GameScoreEvent) => void;
}

export const DeveloperHub: React.FC<DeveloperHubProps> = ({
  currentCurrency,
  onChangeCurrency,
  currentDifficulty,
  onChangeDifficulty,
  currentGameMode,
  onChangeGameMode,
  currentTheme,
  onChangeTheme,
  childName,
  onChangeChildName,
  maxRounds,
  onChangeMaxRounds,
  onSimulateEvent,
}) => {
  const [activeSnippetTab, setActiveSnippetTab] = useState<'jsx' | 'hook' | 'iframe' | 'schema'>('jsx');
  const [copied, setCopied] = useState(false);

  // Generate dynamic JSX code snippet based on active configurator values
  const jsxSnippet = `import React, { useState } from 'react';
import { PurchasingMatchGame } from './components/game/PurchasingMatchGame';
import type { GameScoreEvent, GameSessionSummary } from './types';

export function MyReactApp() {
  const [playerPoints, setPlayerPoints] = useState(0);

  const handleScoreUpdate = (event: GameScoreEvent) => {
    console.log('[Game Event]', event.eventType, event.pointsEarned);
    // 1. Update player points in your existing app state
    setPlayerPoints((prev) => prev + event.pointsEarned);

    // 2. Optional: Send telemetry to your existing backend / API
    // fetch('/api/player/progress', { method: 'POST', body: JSON.stringify(event) });
  };

  const handleGameComplete = (summary: GameSessionSummary) => {
    console.log('Finished game with accuracy:', summary.accuracyPercentage);
    // Save session stats to parent dashboard
  };

  return (
    <div className="p-4">
      {/* Existing App Header */}
      <h1>Welcome to My Kids Learning Portal</h1>
      <p>Current Dashboard Points: {playerPoints}</p>

      {/* Drop-in Purchasing Match Game */}
      <PurchasingMatchGame
        childId="user_123"
        childName="${childName}"
        currency="${currentCurrency}"
        difficulty="${currentDifficulty}"
        gameMode="${currentGameMode}"
        theme="${currentTheme}"
        maxRounds={${maxRounds}}
        soundEnabled={true}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={handleGameComplete}
      />
    </div>
  );
}`;

  const hookSnippet = `// Custom React Hook for syncing with your existing Game Dashboard
import { useState, useCallback } from 'react';
import type { GameScoreEvent, GameSessionSummary, MathSkill } from './types';

export function usePurchasingMatchBridge() {
  const [dashboardScore, setDashboardScore] = useState(0);
  const [recentEvents, setRecentEvents] = useState<GameScoreEvent[]>([]);
  const [skillMastery, setSkillMastery] = useState<Record<string, number>>({});

  const handleScoreEvent = useCallback((event: GameScoreEvent) => {
    setDashboardScore(event.totalScore);
    setRecentEvents((prev) => [event, ...prev].slice(0, 50));
    
    // Auto-compute skill progress
    if (event.mathSkill) {
      setSkillMastery((prev) => ({
        ...prev,
        [event.mathSkill]: event.accuracy,
      }));
    }
  }, []);

  return {
    dashboardScore,
    recentEvents,
    skillMastery,
    handleScoreEvent,
  };
}`;

  const iframeSnippet = `<!-- Option 2: Embed via iframe / Micro-frontend with postMessage API -->
<iframe
  id="purchasing-match-frame"
  src="https://your-game-domain.app/?childName=${encodeURIComponent(childName)}&currency=${currentCurrency}&mode=${currentGameMode}"
  width="100%"
  height="700"
  style="border: none; border-radius: 24px;"
></iframe>

<script>
  // Listen for real-time score events from iframe
  window.addEventListener('message', (event) => {
    if (event.data?.source === 'PURCHASING_MATCH_GAME') {
      const { eventType, pointsEarned, totalScore, mathSkill } = event.data.payload;
      console.log('Received Game Event:', eventType, pointsEarned, 'points');
      
      // Update host dashboard
      updateParentDashboard(totalScore);
    }
  });
</script>`;

  const schemaSnippet = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PurchasingMatchEvent",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "eventType": { 
      "type": "string", 
      "enum": ["ITEM_MATCHED", "LEVEL_COMPLETED", "STREAK_BONUS", "ERROR_ATTEMPT", "GAME_SESSION_END", "BADGE_UNLOCKED"] 
    },
    "childId": { "type": "string" },
    "childName": { "type": "string" },
    "timestamp": { "type": "number" },
    "pointsEarned": { "type": "number" },
    "totalScore": { "type": "number" },
    "currentStreak": { "type": "number" },
    "highestStreak": { "type": "number" },
    "accuracy": { "type": "number" },
    "mathSkill": { 
      "type": "string",
      "enum": ["coin_recognition", "addition", "subtraction_change", "budgeting", "value_estimation"]
    },
    "details": { "type": "object" }
  }
}`;

  const activeCode = {
    jsx: jsxSnippet,
    hook: hookSnippet,
    iframe: iframeSnippet,
    schema: schemaSnippet,
  }[activeSnippetTab];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerSimulatedEvent = () => {
    const simEvent: GameScoreEvent = {
      id: `sim_evt_${Date.now()}`,
      eventType: 'ITEM_MATCHED',
      childId: 'child_demo',
      childName: childName || 'Alex',
      timestamp: Date.now(),
      pointsEarned: 150,
      totalScore: 750,
      currentStreak: 3,
      highestStreak: 4,
      accuracy: 95,
      mathSkill: 'addition',
      gameMode: currentGameMode,
      difficulty: currentDifficulty,
      details: {
        itemName: 'Simulated Grocery Basket',
        itemPrice: 4.5,
        userPaid: 4.5,
        timeTakenSeconds: 4,
      }
    };
    onSimulateEvent(simEvent);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase font-bold tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>React Component Integration Hub</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Embed Purchasing Match into Your React Game App
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              This game is fully modular, typed, and self-contained. You can drop <code className="text-amber-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded">&lt;PurchasingMatchGame /&gt;</code> into any existing React project, listen to real-time point events, and automatically stream telemetry to your dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-simulate-event"
              onClick={handleTriggerSimulatedEvent}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Test Dashboard Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Configurator Panel | Right Code Generator Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Configurator Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Props Configurator</h3>
          </div>

          {/* Child Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Child Player Name</label>
            <input
              type="text"
              id="input-child-name"
              value={childName}
              onChange={(e) => onChangeChildName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Alex, Maya"
            />
          </div>

          {/* Currency Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Currency Standard</label>
            <select
              id="select-currency"
              value={currentCurrency}
              onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="CAD">CAD (C$) - Canadian Dollar</option>
              <option value="AUD">AUD (A$) - Australian Dollar</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
            </select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Difficulty (Age Group)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'starter', label: 'Starter (4-6)' },
                { id: 'junior', label: 'Junior (6-8)' },
                { id: 'master', label: 'Master (8+)' },
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChangeDifficulty(d.id as DifficultyLevel)}
                  className={`py-2 px-1 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    currentDifficulty === d.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Default Game Mode</label>
            <select
              id="select-game-mode"
              value={currentGameMode}
              onChange={(e) => onChangeGameMode(e.target.value as GameMode)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="item-price-match">Single Item & Price Match</option>
              <option value="basket-sum-match">Shopping Basket Total Match</option>
              <option value="cashier-change-match">Cashier Change Subtraction</option>
              <option value="budget-shopper">Target Budget Challenge</option>
            </select>
          </div>

          {/* Theme Palette */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Color Theme</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['sunny', 'candyland', 'safari', 'ocean', 'space'] as GameTheme[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChangeTheme(t)}
                  className={`py-1.5 px-2 text-center text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${
                    currentTheme === t
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Max Rounds */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Rounds Per Game Session</span>
              <span className="text-indigo-600">{maxRounds} Rounds</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={maxRounds}
              onChange={(e) => onChangeMaxRounds(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Code Display (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Top Bar with Tabs and Copy Button */}
          <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1">
              {[
                { id: 'jsx', label: 'React JSX Snippet', icon: FileCode },
                { id: 'hook', label: 'Dashboard State Hook', icon: Terminal },
                { id: 'iframe', label: 'Iframe Embed', icon: Share2 },
                { id: 'schema', label: 'Event JSON Schema', icon: ShieldCheck },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSnippetTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeSnippetTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              id="btn-copy-code"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Viewer */}
          <div className="p-4 font-mono-code text-xs overflow-x-auto leading-relaxed max-h-[460px] text-slate-300">
            <pre className="whitespace-pre">{activeCode}</pre>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Props above dynamically update in real time based on your configuration.
            </span>
            <span className="text-slate-500 font-mono">React 18+ / React 19 ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
