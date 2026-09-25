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
import { GameModeSelectScreen } from './components/game/GameModeSelectScreen';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { soundManager } from './utils/audio';

export default function App() {
  // Navigation state: 'mode-select' is the first interface with 3 game blocks!
  const [currentView, setCurrentView] = useState<'mode-select' | 'in-game'>('mode-select');

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

  // Handler when player selects a game block from the 3 blocks interface
  const handleSelectGameMode = (selectedMode: GameMode) => {
    setGameMode(selectedMode);
    setCurrentView('in-game');

    const modeLabels: Record<GameMode, string> = {
      'frequency-annual-match': 'Smart Store Match',
      'item-price-match': 'Pay Item with Cash',
      'cashier-change-match': 'Cashier Change Return',
      'basket-sum-match': 'Cart Total Match',
      'budget-shopper': 'Budget Shopper',
    };

    setToastMessage(`Starting ${modeLabels[selectedMode]}! 🚀`);
    setTimeout(() => setToastMessage(null), 2500);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#fffbeb] via-[#fef3c7]/30 to-[#ffedd5]/50 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Global Header */}
      <Header
        totalPoints={totalScore}
        streak={currentStreak}
        currency={currency}
        onChangeCurrency={setCurrency}
        childName={childName}
        currentView={currentView}
        onGoToModeSelect={() => setCurrentView('mode-select')}
      />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-18 right-6 z-50 bg-white text-amber-950 px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-400 font-black text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 md:py-6 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentView === 'mode-select' ? (
            /* FIRST INTERFACE: 3 Distinct Game Mode Blocks */
            <motion.div
              key="mode-selection-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="w-full flex justify-center"
            >
              <GameModeSelectScreen
                onSelectMode={handleSelectGameMode}
                currency={currency}
                onChangeCurrency={setCurrency}
                difficulty={difficulty}
                onChangeDifficulty={setDifficulty}
                totalScore={totalScore}
                streak={currentStreak}
                childName={childName}
              />
            </motion.div>
          ) : (
            /* ACTIVE GAMEPLAY INTERFACE */
            <motion.div
              key={`gameplay-screen-${gameMode}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full flex justify-center"
            >
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
                onBackToMenu={() => setCurrentView('mode-select')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Footer */}
      <footer className="w-full bg-amber-100/60 border-t border-amber-200 py-3 text-center text-xs text-amber-950/70 font-semibold">
        Purchasing Match • Kids Real-World Money & Smart Shopping Math
      </footer>
    </div>
  );
}

