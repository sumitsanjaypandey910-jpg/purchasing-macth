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
  ArrowLeft,
  LayoutGrid,
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
  onBackToMenu,
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

  const handleClassicSuccess = (mode: GameMode, skill: MathSkill, attemptsCount: number = 1) => {
    soundManager.playCorrect();
    soundManager.playCoin();

    const basePoints = 100;
    const streakBonus = streak * 25;
    const firstTryBonus = attemptsCount === 1 ? 50 : 15;
    const earnedPoints = basePoints + streakBonus + firstTryBonus;

    const nextStreak = streak + 1;
    const nextTotalScore = totalScore + earnedPoints;

    setTotalScore(nextTotalScore);
    setStreak(nextStreak);
    if (nextStreak > highestStreak) setHighestStreak(nextStreak);
    setPointsLastRound(earnedPoints);
    setSuccessfulMatches((prev) => prev + 1);
    setTotalAttempts((prev) => prev + 1);

    const scoreEvt: GameScoreEvent = {
      id: `evt_classic_${Date.now()}`,
      eventType: 'ITEM_MATCHED',
      childId,
      childName,
      timestamp: Date.now(),
      pointsEarned: earnedPoints,
      totalScore: nextTotalScore,
      currentStreak: nextStreak,
      highestStreak: Math.max(highestStreak, nextStreak),
      accuracy: Math.round(((successfulMatches + 1) / (totalAttempts + 1)) * 100),
      mathSkill: skill,
      gameMode: mode,
      difficulty: activeDifficulty,
      details: {
        itemName: currentStoreItem?.name,
        itemPrice: currentStoreItem?.price,
      },
    };

    onScoreUpdate?.(scoreEvt);
    onEventLog?.(scoreEvt);

    setIsCelebrationOpen(true);
  };

  const handleClassicError = () => {
    soundManager.playError();
    setStreak(0);
    setTotalAttempts((prev) => prev + 1);
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
      <div className="w-full max-w-5xl mb-4 flex flex-wrap items-center justify-between gap-2.5 px-2">
        {/* Back to 3 Blocks / Mode Selection Screen button */}
        {onBackToMenu && (
          <button
            type="button"
            id="btn-back-to-mode-selection"
            onClick={() => {
              soundManager.playClick();
              onBackToMenu();
            }}
            className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm border border-amber-600 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Return to the 3 Game Modes Selection Interface"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All 3 Games Interface</span>
          </button>
        )}

        {/* Quick Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'frequency-annual-match', label: '1. Smart Store (Voice)', icon: '🛍️' },
            { id: 'item-price-match', label: '2. Pay Item (Cash)', icon: '🏷️' },
            { id: 'cashier-change-match', label: '3. Cashier Change', icon: '💵' },
            { id: 'basket-sum-match', label: 'Cart Total', icon: '🛒' },
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
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105 border-2 border-amber-600'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
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
          className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-amber-50 transition-colors cursor-pointer shrink-0 shadow-xs"
          title="Click to Switch Currency"
        >
          <Coins className="w-3.5 h-3.5 text-amber-600" />
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
        /* Classic Cash / Wallet Game Modes with Spacious Layout */
        <div className="w-full max-w-5xl mx-auto bg-white/95 rounded-[32px] p-4 sm:p-6 shadow-xl border-2 border-amber-200/90">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 border border-amber-300 rounded-xl text-xs font-mono font-black text-amber-950">
                Round {currentRound} of {maxRounds}
              </span>
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {activeGameMode === 'item-price-match' && '🏷️ Mode 2: Pay Item with Cash Counter'}
                {activeGameMode === 'cashier-change-match' && '💵 Mode 3: Cashier Change Return'}
                {activeGameMode === 'basket-sum-match' && '🛒 Cart Total Match'}
                {activeGameMode === 'budget-shopper' && '👛 Budget Shopper Match'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                {totalScore} Points
              </span>
              {streak > 0 && (
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  {streak} Streak
                </span>
              )}
            </div>
          </div>

          {activeGameMode === 'item-price-match' && (
            <ItemPriceMatch
              key={`round-item-${roundItemIndex}-${activeCurrency}`}
              item={currentStoreItem}
              currency={activeCurrency}
              onSuccessMatch={(paid, atts) => handleClassicSuccess('item-price-match', 'coin_recognition', atts)}
              onErrorAttempt={handleClassicError}
              streak={streak}
            />
          )}

          {activeGameMode === 'basket-sum-match' && (
            <BasketMatch
              key={`round-basket-${roundItemIndex}-${activeCurrency}`}
              items={basketItems}
              currency={activeCurrency}
              onSuccessMatch={(paid, atts) => handleClassicSuccess('basket-sum-match', 'addition', atts)}
              onErrorAttempt={handleClassicError}
              streak={streak}
            />
          )}

          {activeGameMode === 'cashier-change-match' && (
            <ChangeCashierMatch
              key={`round-change-${roundItemIndex}-${activeCurrency}`}
              item={currentStoreItem}
              customerPaid={customerPaidAmount}
              currency={activeCurrency}
              onSuccessMatch={(paid, atts) => handleClassicSuccess('cashier-change-match', 'subtraction_change', atts)}
              onErrorAttempt={handleClassicError}
              streak={streak}
            />
          )}

          {activeGameMode === 'budget-shopper' && (
            <BudgetMatch
              key={`round-budget-${roundItemIndex}-${activeCurrency}`}
              shelfItems={budgetShelfItems}
              targetBudget={budgetTarget}
              currency={activeCurrency}
              onSuccessMatch={(paid, atts) => handleClassicSuccess('budget-shopper', 'budgeting', atts)}
              onErrorAttempt={handleClassicError}
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
