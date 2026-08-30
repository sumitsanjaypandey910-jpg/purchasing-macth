import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PurchasingMatchGameProps,
  CurrencyCode,
  GameMode,
  DifficultyLevel,
  StoreItem,
  GameScoreEvent,
  GameSessionSummary,
  MathSkill,
  Badge,
} from '../../types';
import { STORE_ITEMS, BADGES, scaleItemPrice, CURRENCY_CONFIGS, formatMoney } from '../../data/gameData';
import { soundManager } from '../../utils/audio';
import { SmartPurchasingMatch } from './SmartPurchasingMatch';
import { ArcadeFrequencyMatch } from './ArcadeFrequencyMatch';
import { ItemPriceMatch } from './ItemPriceMatch';
import { BasketMatch } from './BasketMatch';
import { ChangeCashierMatch } from './ChangeCashierMatch';
import { BudgetMatch } from './BudgetMatch';
import { CelebrationModal } from './CelebrationModal';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Flame,
  Star,
  Gamepad2,
  Tv,
  Coins,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const PurchasingMatchGame: React.FC<PurchasingMatchGameProps> = ({
  childId = 'child_alex',
  childName = 'Alex',
  currency = 'INR',
  difficulty = 'starter',
  gameMode = 'frequency-annual-match',
  theme = 'neon-arcade',
  soundEnabled = true,
  maxRounds = 10,
  embedded = false,
  onScoreUpdate,
  onGameComplete,
  onItemPurchased,
  onSkillProgress,
  onEventLog,
  broadcastPostMessage = true,
}) => {
  const [activeGameMode, setActiveGameMode] = useState<GameMode>(gameMode);
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>(difficulty);
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(currency);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<Badge | null>(null);

  // Round specific states
  const [roundItemIndex, setRoundItemIndex] = useState(0);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [pointsLastRound, setPointsLastRound] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());

  // Analytics tracking
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [successfulMatches, setSuccessfulMatches] = useState(0);
  const [skillStats, setSkillStats] = useState<Record<string, { attempts: number; successes: number; accuracy: number }>>({
    annual_frequency_calc: { attempts: 0, successes: 0, accuracy: 100 },
    coin_recognition: { attempts: 0, successes: 0, accuracy: 100 },
    addition: { attempts: 0, successes: 0, accuracy: 100 },
    subtraction_change: { attempts: 0, successes: 0, accuracy: 100 },
    budgeting: { attempts: 0, successes: 0, accuracy: 100 },
  });

  // Sync props
  useEffect(() => {
    soundManager.setEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    setActiveGameMode(gameMode);
  }, [gameMode]);

  useEffect(() => {
    setActiveDifficulty(difficulty);
  }, [difficulty]);

  useEffect(() => {
    setActiveCurrency(currency);
  }, [currency]);

  // Scaled store items
  const filteredItems = useMemo(() => {
    return STORE_ITEMS.map((item) => {
      let scaledPrice = scaleItemPrice(item.price, activeCurrency);
      if (activeDifficulty === 'starter') {
        scaledPrice = Math.max(1, Math.round(scaledPrice));
      } else if (activeDifficulty === 'junior') {
        scaledPrice = Math.round(scaledPrice * 2) / 2;
      }
      return { ...item, price: scaledPrice };
    });
  }, [activeCurrency, activeDifficulty]);

  const currentStoreItem = filteredItems[roundItemIndex % filteredItems.length];

  const basketItems = useMemo(() => {
    const count = activeDifficulty === 'starter' ? 2 : 3;
    const items: StoreItem[] = [];
    for (let i = 0; i < count; i++) {
      const idx = (roundItemIndex + i * 2) % filteredItems.length;
      items.push(filteredItems[idx]);
    }
    return items;
  }, [filteredItems, roundItemIndex, activeDifficulty]);

  const customerPaidAmount = useMemo(() => {
    if (!currentStoreItem) return 10;
    const price = currentStoreItem.price;
    if (activeCurrency === 'INR') {
      if (price <= 10) return 20;
      if (price <= 20) return 50;
      if (price <= 50) return 100;
      if (price <= 100) return 200;
      return 500;
    }
    if (price <= 1) return 2;
    if (price <= 5) return 10;
    if (price <= 10) return 20;
    return Math.ceil(price / 10) * 10;
  }, [currentStoreItem, activeCurrency]);

  const budgetTarget = useMemo(() => {
    if (activeCurrency === 'INR') {
      return activeDifficulty === 'starter' ? 100 : activeDifficulty === 'junior' ? 250 : 500;
    }
    return activeDifficulty === 'starter' ? 10 : activeDifficulty === 'junior' ? 20 : 35;
  }, [activeDifficulty, activeCurrency]);

  const budgetShelfItems = useMemo(() => {
    return filteredItems.slice(roundItemIndex, roundItemIndex + 6);
  }, [filteredItems, roundItemIndex]);

  // Handlers
  const handleScoreEvent = (event: GameScoreEvent) => {
    setTotalScore(event.totalScore);
    setStreak(event.currentStreak);
    if (event.currentStreak > highestStreak) setHighestStreak(event.currentStreak);

    if (event.eventType === 'ITEM_MATCHED') {
      setSuccessfulMatches((prev) => prev + 1);
    }
    setTotalAttempts((prev) => prev + 1);

    onScoreUpdate?.(event);
    onEventLog?.(event);
  };

  const handleRestart = () => {
    soundManager.playClick();
    soundManager.playLevelTransition();
    setCurrentRound(1);
    setTotalScore(0);
    setStreak(0);
    setHighestStreak(0);
    setTotalAttempts(0);
    setSuccessfulMatches(0);
    setIsSessionComplete(false);
    setRoundStartTime(Date.now());
  };

  const handleNextRound = () => {
    soundManager.playClick();
    soundManager.playLevelTransition();
    setIsCelebrationOpen(false);

    if (currentRound >= maxRounds) {
      setIsSessionComplete(true);
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      const accuracy = totalAttempts > 0 ? Math.round((successfulMatches / totalAttempts) * 100) : 100;
      const finalStars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

      const summary: GameSessionSummary = {
        sessionId: `sess_${Date.now()}`,
        childId,
        childName,
        startTime,
        endTime: Date.now(),
        durationSeconds,
        totalScore,
        starsEarned: finalStars,
        roundsPlayed: maxRounds,
        roundsWon: successfulMatches,
        accuracyPercentage: accuracy,
        longestStreak: highestStreak,
        badgesUnlocked: unlockedBadges,
        skillsBreakdown: skillStats,
        itemsPurchased: filteredItems.slice(0, successfulMatches).map((it) => ({
          itemName: it.name,
          price: it.price,
          category: it.category,
        })),
      };

      onGameComplete?.(summary);
    } else {
      setCurrentRound((prev) => prev + 1);
      setRoundItemIndex((prev) => prev + 1);
      setRoundStartTime(Date.now());
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Mode Switcher Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'frequency-annual-match', label: 'Smart Challenge', icon: '🛍️' },
            { id: 'item-price-match', label: 'Pay Item', icon: '🏷️' },
            { id: 'basket-sum-match', label: 'Cart Total', icon: '🛒' },
            { id: 'cashier-change-match', label: 'Cashier Change', icon: '💵' },
            { id: 'budget-shopper', label: 'Budget Cart', icon: '👛' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              id={`tab-mode-${m.id}`}
              onClick={() => {
                soundManager.playClick();
                soundManager.playLevelTransition();
                setActiveGameMode(m.id as GameMode);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                activeGameMode === m.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-105'
                  : 'bg-indigo-950/80 text-indigo-300 hover:text-white border border-indigo-800/80'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Currency Quick Tag */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            const codes: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP'];
            const next = codes[(codes.indexOf(activeCurrency) + 1) % codes.length];
            setActiveCurrency(next);
          }}
          className="px-2.5 py-1 rounded-xl bg-indigo-950 border border-indigo-700/60 text-amber-300 text-xs font-mono font-bold flex items-center gap-1 hover:bg-indigo-900 transition-colors cursor-pointer shrink-0"
          title="Click to Switch Currency"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>{activeCurrency} ({CURRENCY_CONFIGS[activeCurrency].symbol})</span>
        </button>
      </div>

      {/* Main Game Mode Render */}
      {activeGameMode === 'frequency-annual-match' ? (
        /* FLAGSHIP SMART PURCHASING MATCH CHALLENGE */
        <SmartPurchasingMatch
          childId={childId}
          childName={childName}
          currency={activeCurrency}
          onChangeCurrency={setActiveCurrency}
          difficulty={activeDifficulty}
          maxRounds={maxRounds}
          soundEnabled={soundOn}
          onScoreUpdate={handleScoreEvent}
          onGameComplete={onGameComplete}
          onEventLog={onEventLog}
          broadcastPostMessage={broadcastPostMessage}
        />
      ) : (
        /* Classic Cash / Wallet Game Modes */
        <div className="w-full max-w-md md:max-w-lg mx-auto bg-white rounded-[32px] p-5 shadow-xl border border-amber-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-600">Round {currentRound} of {maxRounds}</span>
            <span className="text-sm font-bold text-indigo-600">{totalScore} Points</span>
          </div>

          {activeGameMode === 'item-price-match' && (
            <ItemPriceMatch
              key={`round-item-${roundItemIndex}-${activeCurrency}`}
              item={currentStoreItem}
              currency={activeCurrency}
              onSuccessMatch={() => handleNextRound()}
              onErrorAttempt={() => {}}
              streak={streak}
            />
          )}

          {activeGameMode === 'basket-sum-match' && (
            <BasketMatch
              key={`round-basket-${roundItemIndex}-${activeCurrency}`}
              items={basketItems}
              currency={activeCurrency}
              onSuccessMatch={() => handleNextRound()}
              onErrorAttempt={() => {}}
              streak={streak}
            />
          )}

          {activeGameMode === 'cashier-change-match' && (
            <ChangeCashierMatch
              key={`round-change-${roundItemIndex}-${activeCurrency}`}
              item={currentStoreItem}
              customerPaid={customerPaidAmount}
              currency={activeCurrency}
              onSuccessMatch={() => handleNextRound()}
              onErrorAttempt={() => {}}
              streak={streak}
            />
          )}

          {activeGameMode === 'budget-shopper' && (
            <BudgetMatch
              key={`round-budget-${roundItemIndex}-${activeCurrency}`}
              shelfItems={budgetShelfItems}
              targetBudget={budgetTarget}
              currency={activeCurrency}
              onSuccessMatch={() => handleNextRound()}
              onErrorAttempt={() => {}}
              streak={streak}
            />
          )}
        </div>
      )}

      {/* Celebration Modal for classic modes */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        pointsEarned={pointsLastRound}
        totalScore={totalScore}
        streak={streak}
        roundNumber={currentRound}
        maxRounds={maxRounds}
        unlockedBadge={justUnlockedBadge}
        onNextRound={handleNextRound}
        isGameComplete={currentRound >= maxRounds}
      />
    </div>
  );
};
