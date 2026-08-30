import React, { useState } from 'react';
import {
  CurrencyCode,
  DifficultyLevel,
  GameMode,
  GameTheme,
  GameScoreEvent,
  GameSessionSummary,
} from './types';
import { Header } from './components/common/Header';
import { PurchasingMatchGame } from './components/game/PurchasingMatchGame';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { soundManager } from './utils/audio';

export default function App() {
  // Configurator / Customization state (Default INR)
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('starter');
  const [gameMode, setGameMode] = useState<GameMode>('frequency-annual-match');
  const [theme, setTheme] = useState<GameTheme>('sunny');
  const [childName, setChildName] = useState<string>('Alex');
  const [maxRounds, setMaxRounds] = useState<number>(10);

  // Live telemetry events & sessions
  const [events, setEvents] = useState<GameScoreEvent[]>([]);
  const [sessions, setSessions] = useState<GameSessionSummary[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Aggregate total points calculation
  const totalScore = events.reduce((sum, e) => sum + e.pointsEarned, 0);
  const currentStreak = events.length > 0 ? events[0]?.currentStreak || 0 : 0;

  // Handle live incoming game events
  const handleScoreUpdate = (event: GameScoreEvent) => {
    setEvents((prev) => [event, ...prev]);

    if (event.pointsEarned > 0) {
      setToastMessage(`+${event.pointsEarned} Points! ⚡`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleGameComplete = (summary: GameSessionSummary) => {
    setSessions((prev) => [summary, ...prev]);
    setToastMessage(`Game complete! ${summary.totalScore} Total Points! 🏆`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#06071d] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Global Header */}
      <Header
        totalPoints={totalScore}
        streak={currentStreak}
        currency={currency}
        onChangeCurrency={setCurrency}
        childName={childName}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-18 right-6 z-50 bg-[#161a45] text-amber-300 px-4 py-2.5 rounded-2xl shadow-lg border border-amber-400/80 font-bold text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Direct Standalone Purchasing Match Screen */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col items-center justify-center">
        <PurchasingMatchGame
          childId="child_alex"
          childName={childName}
          currency={currency}
          difficulty={difficulty}
          gameMode={gameMode}
          theme={theme}
          soundEnabled={true}
          maxRounds={maxRounds}
          onScoreUpdate={handleScoreUpdate}
          onGameComplete={handleGameComplete}
          onEventLog={handleScoreUpdate}
          broadcastPostMessage={true}
        />
      </main>

      {/* Clean Footer */}
      <footer className="w-full bg-[#090b24] border-t border-indigo-950/80 py-3 text-center text-xs text-indigo-300/60 font-medium">
        Purchasing Match • Kids Real-World Money & Smart Shopping Math
      </footer>
    </div>
  );
}

