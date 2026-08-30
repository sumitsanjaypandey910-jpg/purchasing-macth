import React, { useState, useEffect, useRef } from 'react';
import {
  CurrencyCode,
  DifficultyLevel,
  ArcadeItem,
  FrequencyChallenge,
  GameScoreEvent,
  GameSessionSummary,
} from '../../types';
import {
  ARCADE_ITEMS,
  formatMoney,
  generateFrequencyChallenge,
  CURRENCY_CONFIGS,
} from '../../data/gameData';
import { ArcadeVectorIcon } from './ArcadeVectorIcon';
import { soundManager } from '../../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Info,
  ChevronRight,
  Coins,
} from 'lucide-react';

interface ArcadeFrequencyMatchProps {
  childId?: string;
  childName?: string;
  currency: CurrencyCode;
  onChangeCurrency?: (c: CurrencyCode) => void;
  difficulty: DifficultyLevel;
  maxRounds?: number;
  soundEnabled?: boolean;
  onScoreUpdate?: (event: GameScoreEvent) => void;
  onGameComplete?: (summary: GameSessionSummary) => void;
  onEventLog?: (event: GameScoreEvent) => void;
  broadcastPostMessage?: boolean;
}

export const ArcadeFrequencyMatch: React.FC<ArcadeFrequencyMatchProps> = ({
  childId = 'child_alex',
  childName = 'Alex',
  currency,
  onChangeCurrency,
  difficulty,
  maxRounds = 10,
  soundEnabled = true,
  onScoreUpdate,
  onGameComplete,
  onEventLog,
  broadcastPostMessage = true,
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // Timer state
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(120); // 2 minutes (1:20-2:00)
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(!soundEnabled);

  // Current challenge
  const [currentChallenge, setCurrentChallenge] = useState<FrequencyChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Audio prompt playing state
  const [isPlayingPromptAudio, setIsPlayingPromptAudio] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const roundStartTimeRef = useRef<number>(Date.now());

  // Keep sound manager in sync
  useEffect(() => {
    soundManager.setEnabled(!isMuted);
  }, [isMuted]);

  // Load new challenge for current round
  const loadChallenge = (itemIndex: number) => {
    const item = ARCADE_ITEMS[itemIndex % ARCADE_ITEMS.length];
    const challenge = generateFrequencyChallenge(item, currency, difficulty);
    setCurrentChallenge(challenge);
    setSelectedOption(null);
    setAnswerStatus('idle');
    setFeedbackText(null);
    roundStartTimeRef.current = Date.now();
  };

  // Initialize first challenge and when currency/difficulty changes
  useEffect(() => {
    loadChallenge(roundIndex);
  }, [currency, difficulty]);

  // Start game handler
  const handleStartGame = () => {
    soundManager.playClick();
    soundManager.playLevelTransition();
    setHasStarted(true);
    startTimeRef.current = Date.now();
    roundStartTimeRef.current = Date.now();
  };

  // Countdown timer effect
  useEffect(() => {
    if (!hasStarted || isPaused || isTransitioning || timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishGame();
          return 0;
        }
        if (prev <= 10) {
          soundManager.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isPaused, isTransitioning, timeRemainingSeconds]);

  // Format timer MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // User clicked an answer option
  const handleSelectOption = (option: number) => {
    if (answerStatus !== 'idle' || !currentChallenge || isPaused) return;

    soundManager.playSelect();
    setSelectedOption(option);
    setTotalAttempts((prev) => prev + 1);

    const isCorrect = option === currentChallenge.correctAnswer;
    const timeTaken = Math.max(1, Math.round((Date.now() - roundStartTimeRef.current) / 1000));

    if (isCorrect) {
      // WINNING CALCULATION
      setAnswerStatus('correct');
      soundManager.playCorrect();

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      if (newStreak > 1) {
        setTimeout(() => soundManager.playStreakBonus(newStreak), 200);
      }

      // Compute points
      const basePoints = 100;
      const speedBonus = Math.max(0, (10 - timeTaken) * 5);
      const streakBonus = (newStreak - 1) * 20;
      const pointsEarned = basePoints + speedBonus + streakBonus;

      const newTotalScore = score + pointsEarned;
      setScore(newTotalScore);
      setCorrectAnswersCount((prev) => prev + 1);

      // Dispatch Telemetry
      const scoreEvent: GameScoreEvent = {
        id: `evt_${Date.now()}`,
        eventType: 'ITEM_MATCHED',
        childId,
        childName,
        timestamp: Date.now(),
        pointsEarned,
        totalScore: newTotalScore,
        currentStreak: newStreak,
        highestStreak: Math.max(newStreak, highestStreak),
        accuracy: Math.round(((correctAnswersCount + 1) / (totalAttempts + 1)) * 100),
        mathSkill: currentChallenge.mathSkill,
        gameMode: 'frequency-annual-match',
        difficulty,
        details: {
          itemName: currentChallenge.item.name,
          itemPrice: currentChallenge.basePrice,
          correctAmount: currentChallenge.correctAnswer,
          userPaid: option,
          timeTakenSeconds: timeTaken,
          level: roundIndex + 1,
          challengeType: `${currentChallenge.multiplierLabel} ${currentChallenge.frequencyLabel}`,
        },
      };

      onScoreUpdate?.(scoreEvent);
      onEventLog?.(scoreEvent);

      if (broadcastPostMessage && typeof window !== 'undefined') {
        window.postMessage({ source: 'PURCHASING_MATCH_GAME', payload: scoreEvent }, '*');
      }

      // Advance to next round after animation
      setIsTransitioning(true);
      setTimeout(() => {
        // Play level transition sound on slide
        soundManager.playLevelTransition();

        if (roundIndex + 1 >= maxRounds) {
          handleFinishGame();
        } else {
          setRoundIndex((prev) => prev + 1);
          loadChallenge(roundIndex + 1);
          setIsTransitioning(false);
        }
      }, 950);
    } else {
      // WRONG ANSWER
      setAnswerStatus('wrong');
      soundManager.playWrong();
      setStreak(0);
      setFeedbackText(
        `Tip: ${formatMoney(currentChallenge.basePrice, currency)} × ${currentChallenge.multiplierLabel} = ${formatMoney(currentChallenge.correctAnswer, currency)}`
      );

      const errorEvent: GameScoreEvent = {
        id: `evt_err_${Date.now()}`,
        eventType: 'ERROR_ATTEMPT',
        childId,
        childName,
        timestamp: Date.now(),
        pointsEarned: 0,
        totalScore: score,
        currentStreak: 0,
        highestStreak,
        accuracy: Math.round((correctAnswersCount / (totalAttempts + 1)) * 100),
        mathSkill: currentChallenge.mathSkill,
        gameMode: 'frequency-annual-match',
        difficulty,
        details: {
          itemName: currentChallenge.item.name,
          itemPrice: currentChallenge.basePrice,
          correctAmount: currentChallenge.correctAnswer,
          userPaid: option,
          timeTakenSeconds: timeTaken,
        },
      };

      onScoreUpdate?.(errorEvent);
      onEventLog?.(errorEvent);

      // Allow retry after short delay
      setTimeout(() => {
        setAnswerStatus('idle');
        setSelectedOption(null);
      }, 1500);
    }
  };

  // Play Central Audio Button / Prompt reader
  const handlePlayCentralAudio = () => {
    soundManager.playClick();
    if (!currentChallenge) return;

    setIsPlayingPromptAudio(true);

    // If browser supports speech synthesis, read out the calculation nicely
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${currentChallenge.item.name}. ${formatMoney(currentChallenge.basePrice, currency)}, ${currentChallenge.multiplierLabel} ${currentChallenge.frequencyLabel.toLowerCase()}. What is the annual total?`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingPromptAudio(false);
      utterance.onerror = () => setIsPlayingPromptAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingPromptAudio(false), 800);
    }
  };

  // Finish Game Session
  const handleFinishGame = () => {
    soundManager.playFanfare();
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswersCount / totalAttempts) * 100) : 100;
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

    const summary: GameSessionSummary = {
      sessionId: `sess_${Date.now()}`,
      childId,
      childName,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      durationSeconds,
      totalScore: score,
      starsEarned: stars,
      roundsPlayed: roundIndex + 1,
      roundsWon: correctAnswersCount,
      accuracyPercentage: accuracy,
      longestStreak: highestStreak,
      badgesUnlocked: accuracy >= 90 ? ['badge_coin_master', 'badge_speedy_shopper'] : ['badge_first_match'],
      skillsBreakdown: {
        annual_frequency_calc: { attempts: totalAttempts, successes: correctAnswersCount, accuracy },
      },
      itemsPurchased: ARCADE_ITEMS.slice(0, roundIndex + 1).map((it) => ({
        itemName: it.name,
        price: it.basePriceINR,
        category: it.category,
      })),
    };

    onGameComplete?.(summary);
  };

  // Restart Game
  const handleRestart = () => {
    soundManager.playClick();
    soundManager.playLevelTransition();
    setRoundIndex(0);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setCorrectAnswersCount(0);
    setTotalAttempts(0);
    setTimeRemainingSeconds(120);
    setIsPaused(false);
    setHasStarted(true);
    loadChallenge(0);
  };

  // Toggle Pause
  const handleTogglePause = () => {
    soundManager.playPause();
    setIsPaused((prev) => !prev);
  };

  if (!currentChallenge) {
    return (
      <div className="flex items-center justify-center min-h-[500px] text-cyan-400 font-mono">
        Loading Arcade Stage...
      </div>
    );
  }

  // Active items for top breadcrumb carousel
  const upcomingItems = ARCADE_ITEMS.slice(roundIndex, roundIndex + 5);

  return (
    <div className="relative w-full max-w-md md:max-w-lg mx-auto select-none rounded-[36px] overflow-hidden bg-[#07071e] text-white shadow-2xl border border-indigo-900/60 font-sans">
      {/* Ambient Neon Purple & Cyan Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1454] via-[#0b0826] to-[#040314] -z-10" />

      {/* Subtle Matrix Neon Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2 text-sm z-20">
        {/* Left: Pause Icon & Score */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-arcade-pause"
            onClick={handleTogglePause}
            className="w-9 h-9 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/90 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            title="Pause Game"
          >
            {isPaused ? <Play className="w-4 h-4 text-cyan-300" /> : <Pause className="w-4 h-4 text-cyan-300" />}
          </button>

          {/* Current Score in vibrant cyan */}
          <div className="flex items-center gap-1 font-mono font-black text-xl text-cyan-400 tracking-wider drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            <span>{score}</span>
          </div>
        </div>

        {/* Center: Horizontal Icon Trail Carousel (Matching Screenshot) */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/40 backdrop-blur-md">
          {upcomingItems.map((item, idx) => {
            const isCurrent = idx === 0;
            return (
              <div
                key={`${item.id}_${idx}`}
                className={`relative transition-all duration-300 flex items-center justify-center ${
                  isCurrent
                    ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                    : 'text-indigo-400/60 scale-90'
                }`}
              >
                <ArcadeVectorIcon iconKey={item.iconKey} size="sm" />
                {isCurrent && (
                  <motion.div
                    layoutId="activeItemIndicator"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Sound Toggle & Timer in Glowing Cyan */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsMuted(!isMuted);
            }}
            className="w-8 h-8 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-cyan-300 border border-indigo-800/50 flex items-center justify-center transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-300" />}
          </button>

          <div
            className={`font-mono font-extrabold text-base tracking-wider ${
              timeRemainingSeconds <= 10
                ? 'text-rose-400 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
            }`}
          >
            {formatTimer(timeRemainingSeconds)}
          </div>
        </div>
      </div>

      {/* Streak Fire Banner if > 1 */}
      {streak > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-1.5 py-0.5 text-xs font-black text-amber-300 tracking-wider uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
          <span>{streak}x Combo Streak Active!</span>
        </motion.div>
      )}

      {/* ================= CENTER STAGE: 3D PODIUM & ITEM ================= */}
      <div className="relative px-6 pt-4 pb-2 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChallenge.id}
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.92 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Floating Vector Icon with Subtle Bobbing Animation */}
            <motion.button
              type="button"
              onClick={handlePlayCentralAudio}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="relative z-10 my-2 cursor-pointer focus:outline-none"
              title="Click to speak question"
            >
              <ArcadeVectorIcon iconKey={currentChallenge.item.iconKey} size="xl" />
            </motion.button>

            {/* 3D Isometric Neon Podium Pedestal (Exact from Screenshot) */}
            <div
              onClick={handlePlayCentralAudio}
              className="relative w-48 -mt-4 mb-4 z-0 flex flex-col items-center cursor-pointer group"
              title="Click to speak question"
            >
              {/* Top Surface of 3D Pedestal */}
              <div className="w-44 h-8 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-t-xl border-t border-x border-cyan-400/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] transform -skew-x-2" />

              {/* Front Face of Pedestal with Price Display */}
              <div className="w-48 py-2.5 bg-gradient-to-b from-[#221c6e] to-[#120e40] border border-cyan-400/40 rounded-b-2xl shadow-xl flex items-center justify-center group-hover:border-cyan-300 transition-colors">
                <span className="font-mono font-black text-2xl md:text-3xl text-cyan-400 tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">
                  {formatMoney(currentChallenge.basePrice, currency)}
                </span>
              </div>
            </div>

            {/* Frequency / Multiplier Box (Exact split container from screenshot) */}
            <div className="w-full max-w-sm mb-3">
              <div className="flex rounded-2xl border-2 border-cyan-400/90 overflow-hidden bg-[#0d0b33]/90 shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-md">
                {/* Left Compartment (1x, 2x, 4x, etc.) */}
                <div className="w-1/3 py-3 px-2 border-r-2 border-cyan-400/90 flex items-center justify-center bg-indigo-950/40">
                  <span className="font-sans font-black text-xl md:text-2xl text-white tracking-wide">
                    {currentChallenge.multiplierLabel}
                  </span>
                </div>

                {/* Right Compartment (A YEAR, A MONTH, etc.) */}
                <div className="w-2/3 py-3 px-4 flex items-center justify-center bg-indigo-950/20">
                  <span className="font-sans font-black text-lg md:text-xl text-white tracking-wider uppercase">
                    {currentChallenge.frequencyLabel}
                  </span>
                </div>
              </div>

              {/* Target Period Label (e.g. "IS ANNUALLY:") */}
              <div className="mt-2 text-center">
                <span className="font-sans font-extrabold text-xs md:text-sm text-cyan-400 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]">
                  {currentChallenge.targetPeriodLabel}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= BOTTOM 2x2 ANSWER GRID ================= */}
      <div className="px-6 pb-6 pt-1">
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {currentChallenge.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === currentChallenge.correctAnswer;

            let cardStyles =
              'bg-[#19154a] hover:bg-[#231f64] border border-indigo-700/60 text-cyan-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]';

            if (answerStatus !== 'idle') {
              if (isCorrectAnswer) {
                cardStyles =
                  'bg-emerald-600 border-2 border-emerald-300 text-white shadow-[0_0_24px_rgba(16,185,129,0.8)] scale-[1.03] animate-pulse';
              } else if (isSelected && !isCorrectAnswer) {
                cardStyles =
                  'bg-rose-900/90 border-2 border-rose-400 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.7)] shake';
              } else {
                cardStyles = 'bg-[#100d33] border border-indigo-950 text-indigo-400/40 opacity-40';
              }
            }

            return (
              <button
                key={`${currentChallenge.id}_opt_${idx}`}
                type="button"
                id={`btn-option-${idx}`}
                disabled={answerStatus !== 'idle' || isPaused || !hasStarted}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => soundManager.playHover()}
                className={`py-4 px-3 rounded-2xl font-mono font-black text-xl md:text-2xl transition-all duration-150 transform active:scale-95 cursor-pointer flex items-center justify-center select-none ${cardStyles}`}
              >
                <span>{formatMoney(option, currency)}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback helper if wrong */}
        {feedbackText && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center text-xs font-semibold text-amber-300 bg-amber-950/60 py-1 px-3 rounded-xl border border-amber-500/40 max-w-sm mx-auto"
          >
            {feedbackText}
          </motion.div>
        )}
      </div>

      {/* ================= START GAME OVERLAY (REMOVED AFTER GAME STARTS) ================= */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 border border-cyan-400 flex items-center justify-center text-white mb-4 shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-bounce">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-wide mb-1">Purchasing Match</h3>
            <p className="text-xs text-indigo-300/80 mb-6 max-w-xs leading-relaxed">
              Match the annual cost by calculating the item price and its frequency!
            </p>

            <button
              type="button"
              id="btn-start-game-play"
              onClick={handleStartGame}
              className="w-full max-w-xs py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Start Playing</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PAUSE MODAL OVERLAY ================= */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Pause className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-wide mb-1">Game Paused</h3>
            <p className="text-xs text-slate-300 mb-5 max-w-xs">
              Take a breath! Your score of <span className="text-cyan-400 font-bold">{score} pts</span> is saved.
            </p>

            {/* Currency Quick Switch in Pause */}
            <div className="w-full max-w-xs mb-4 bg-indigo-950/70 p-3 rounded-2xl border border-indigo-800">
              <div className="text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-center gap-1">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <span>Currency Denomination</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      onChangeCurrency?.(c);
                    }}
                    className={`py-1 rounded-lg text-xs font-bold transition-all ${
                      currency === c
                        ? 'bg-cyan-500 text-slate-950 shadow-xs'
                        : 'bg-indigo-900/60 text-slate-300 hover:bg-indigo-800'
                    }`}
                  >
                    {c} ({CURRENCY_CONFIGS[c].symbol})
                  </button>
                ))}
              </div>
            </div>

            {/* Resume & Restart Buttons */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              <button
                type="button"
                onClick={handleTogglePause}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all cursor-pointer"
              >
                Resume Game
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Round 1</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
