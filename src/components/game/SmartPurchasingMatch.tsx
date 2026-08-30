import React, { useState, useEffect, useRef } from 'react';
import {
  CurrencyCode,
  DifficultyLevel,
  PurchasingChallenge,
  GameScoreEvent,
  GameSessionSummary,
} from '../../types';
import {
  STORE_ITEMS,
  formatMoney,
  generateSmartPurchasingChallenge,
  CURRENCY_CONFIGS,
} from '../../data/gameData';
import { soundManager } from '../../utils/audio';
import {
  VoiceHost,
  HostPersonaId,
  HOST_PERSONAS,
  cleanTextForSpeech,
} from './VoiceHost';
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
  HelpCircle,
  ShoppingBag,
  Coins,
} from 'lucide-react';

interface SmartPurchasingMatchProps {
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

export const SmartPurchasingMatch: React.FC<SmartPurchasingMatchProps> = ({
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
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(120);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(!soundEnabled);

  // Voice Host state
  const [selectedPersona, setSelectedPersona] = useState<HostPersonaId>('sparky');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [hostMessage, setHostMessage] = useState<string>('Welcome! Tap Start to begin our shopping adventure!');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Current challenge
  const [currentChallenge, setCurrentChallenge] = useState<PurchasingChallenge | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const roundStartTimeRef = useRef<number>(Date.now());

  // Keep sound manager in sync
  useEffect(() => {
    soundManager.setEnabled(!isMuted);
    if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isMuted]);

  // Voice Host speech synthesis engine
  const triggerHostSpeech = (textToSpeak: string, personaId: HostPersonaId = selectedPersona) => {
    if (isMuted || typeof window === 'undefined') return;

    const persona = HOST_PERSONAS[personaId] || HOST_PERSONAS.sparky;
    const cleanSpeech = cleanTextForSpeech(textToSpeak);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      utterance.pitch = persona.voicePitch;
      utterance.rate = persona.voiceRate;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 1600);
    }
  };

  // Load new challenge for current round
  const loadChallenge = (itemIndex: number) => {
    const item = STORE_ITEMS[itemIndex % STORE_ITEMS.length];
    const challenge = generateSmartPurchasingChallenge(item, currency, difficulty, itemIndex);
    setCurrentChallenge(challenge);
    setSelectedOption(null);
    setAnswerStatus('idle');
    setFeedbackText(null);
    setIsTransitioning(false);
    roundStartTimeRef.current = Date.now();

    const newQuestionMsg = `${challenge.categoryBadge}: ${challenge.questionText}`;
    setHostMessage(newQuestionMsg);

    if (hasStarted && autoSpeak && !isMuted) {
      setTimeout(() => {
        triggerHostSpeech(challenge.questionText);
      }, 250);
    }
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

    const host = HOST_PERSONAS[selectedPersona] || HOST_PERSONAS.sparky;
    const welcomeMsg = `Welcome ${childName}! I am ${host.name}. Let's solve smart shopping math!`;
    setHostMessage(welcomeMsg);

    if (!isMuted) {
      triggerHostSpeech(welcomeMsg);
      // Then read first question shortly after
      if (autoSpeak && currentChallenge) {
        setTimeout(() => {
          setHostMessage(currentChallenge.questionText);
          triggerHostSpeech(currentChallenge.questionText);
        }, 2200);
      }
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!hasStarted || isPaused || isTransitioning || timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isPaused, isTransitioning, timeRemainingSeconds]);

  // Format timer MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Time expired handler
  const handleTimeExpired = () => {
    soundManager.playWrong();
    finishGameSession();
  };

  // Finish session
  const finishGameSession = () => {
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswersCount / totalAttempts) * 100) : 100;
    const finalStars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;

    const congratsMsg = `Woohoo ${childName}! You scored ${score} points with ${accuracy}% accuracy! High five!`;
    setHostMessage(congratsMsg);
    triggerHostSpeech(congratsMsg);

    const summary: GameSessionSummary = {
      sessionId: `sess_${Date.now()}`,
      childId,
      childName,
      startTime: startTimeRef.current,
      endTime: Date.now(),
      durationSeconds,
      totalScore: score,
      starsEarned: finalStars,
      roundsPlayed: roundIndex + 1,
      roundsWon: correctAnswersCount,
      accuracyPercentage: accuracy,
      longestStreak: highestStreak,
      badgesUnlocked: [],
      skillsBreakdown: {
        purchasing_math: { attempts: totalAttempts, successes: correctAnswersCount, accuracy },
      },
      itemsPurchased: STORE_ITEMS.slice(0, correctAnswersCount).map((it) => ({
        itemName: it.name,
        price: it.price,
        category: it.category,
      })),
    };

    onGameComplete?.(summary);

    if (broadcastPostMessage && typeof window !== 'undefined') {
      window.postMessage({ type: 'PURCHASING_MATCH_GAME_OVER', payload: summary }, '*');
    }
  };

  // Option select handler
  const handleSelectOption = (optionValue: number) => {
    if (answerStatus !== 'idle' || !currentChallenge || isPaused || !hasStarted) return;

    setSelectedOption(optionValue);
    setTotalAttempts((prev) => prev + 1);

    const isCorrect = Math.abs(optionValue - currentChallenge.correctAnswer) < 0.01;
    const timeTaken = Math.max(1, Math.round((Date.now() - roundStartTimeRef.current) / 1000));

    if (isCorrect) {
      soundManager.playCorrect();
      setAnswerStatus('correct');

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > highestStreak) setHighestStreak(nextStreak);

      const basePoints = 100;
      const speedBonus = Math.max(0, (10 - timeTaken) * 5);
      const streakBonus = nextStreak > 1 ? (nextStreak - 1) * 20 : 0;
      const roundPoints = basePoints + speedBonus + streakBonus;

      const newScore = score + roundPoints;
      setScore(newScore);
      setCorrectAnswersCount((prev) => prev + 1);

      const praisePhrases = [
        `Awesome job, ${childName}!`,
        `Super shopping match!`,
        `Spot on calculation!`,
        `Brilliant math!`,
      ];
      const randomPraise = praisePhrases[Math.floor(Math.random() * praisePhrases.length)];
      const successSpoken = `${randomPraise} ${currentChallenge.explanation}`;

      setFeedbackText(`🎉 ${randomPraise} ${currentChallenge.explanation}`);
      setHostMessage(`🎉 ${randomPraise} ${currentChallenge.explanation}`);

      if (autoSpeak && !isMuted) {
        triggerHostSpeech(successSpoken);
      }

      if (nextStreak % 3 === 0) {
        setTimeout(() => soundManager.playStreakBonus(), 300);
      }

      const scoreEvent: GameScoreEvent = {
        id: `evt_${Date.now()}`,
        eventType: 'ITEM_MATCHED',
        childId,
        childName,
        timestamp: Date.now(),
        pointsEarned: roundPoints,
        totalScore: newScore,
        currentStreak: nextStreak,
        highestStreak: Math.max(highestStreak, nextStreak),
        accuracy: Math.round(((correctAnswersCount + 1) / (totalAttempts + 1)) * 100),
        mathSkill: currentChallenge.mathSkill,
        gameMode: 'frequency-annual-match',
        difficulty,
        details: {
          itemName: currentChallenge.itemName,
          itemPrice: currentChallenge.basePrice,
          correctAmount: currentChallenge.correctAnswer,
          userPaid: optionValue,
          timeTakenSeconds: timeTaken,
        },
      };

      onScoreUpdate?.(scoreEvent);
      onEventLog?.(scoreEvent);

      if (broadcastPostMessage && typeof window !== 'undefined') {
        window.postMessage({ type: 'PURCHASING_MATCH_SCORE_UPDATE', payload: scoreEvent }, '*');
      }

      setIsTransitioning(true);
      setTimeout(() => {
        if (roundIndex + 1 >= maxRounds) {
          finishGameSession();
        } else {
          setRoundIndex((prev) => prev + 1);
          soundManager.playLevelTransition();
          loadChallenge(roundIndex + 1);
        }
      }, 1900);
    } else {
      soundManager.playWrong();
      setAnswerStatus('wrong');
      setStreak(0);

      const retrySpoken = `Almost! Here is a hint: ${currentChallenge.formulaHint}. ${currentChallenge.explanation}`;
      setFeedbackText(`Not quite! 💡 Hint: ${currentChallenge.formulaHint}`);
      setHostMessage(`💡 ${currentChallenge.explanation}`);

      if (autoSpeak && !isMuted) {
        triggerHostSpeech(retrySpoken);
      }

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
          itemName: currentChallenge.itemName,
          itemPrice: currentChallenge.basePrice,
          correctAmount: currentChallenge.correctAnswer,
          userPaid: optionValue,
          timeTakenSeconds: timeTaken,
        },
      };

      onScoreUpdate?.(errorEvent);
      onEventLog?.(errorEvent);

      setTimeout(() => {
        setSelectedOption(null);
        setAnswerStatus('idle');
        setFeedbackText(null);
      }, 2200);
    }
  };

  // Restart handler
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

  if (!currentChallenge) {
    return <div className="p-8 text-center text-indigo-300">Loading Purchasing Match Challenge...</div>;
  }

  return (
    <div className="w-full max-w-md md:max-w-lg mx-auto bg-[#0b0e2b] text-white rounded-[32px] p-4 sm:p-6 shadow-2xl border border-indigo-800/80 relative overflow-hidden flex flex-col items-center">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar with Level, Timer, Streak, and Controls */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 pb-3 border-b border-indigo-900/80 relative z-10">
        {/* Round Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs rounded-xl shadow-xs">
            Round {roundIndex + 1}/{maxRounds}
          </span>
          <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-mono text-xs rounded-xl">
            ⏱️ {formatTimer(timeRemainingSeconds)}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="btn-toggle-sound"
            onClick={() => {
              soundManager.playClick();
              setIsMuted(!isMuted);
            }}
            className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Game' : 'Mute Game'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            type="button"
            id="btn-toggle-pause"
            onClick={() => {
              soundManager.playClick();
              setIsPaused(!isPaused);
            }}
            className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-indigo-300" />}
          </button>

          <button
            type="button"
            id="btn-restart-game"
            onClick={handleRestart}
            className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 hover:text-white transition-colors cursor-pointer"
            title="Restart Match"
          >
            <RotateCcw className="w-4 h-4 text-indigo-300" />
          </button>
        </div>
      </div>

      {/* ================= INTERACTIVE VOICE HOST COMPONENT ================= */}
      <VoiceHost
        currentMessage={hostMessage}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={setAutoSpeak}
        selectedPersona={selectedPersona}
        onSelectPersona={setSelectedPersona}
        isSpeaking={isSpeaking}
        onTriggerSpeech={triggerHostSpeech}
      />

      {/* Main Purchasing Challenge Card */}
      <div className="w-full flex flex-col items-center relative z-10">
        {/* Scenario Category Pill */}
        <div className="mb-2.5 px-3.5 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/70 text-indigo-200 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
          <span>{currentChallenge.categoryBadge}</span>
        </div>

        {/* Item Showcase Card */}
        <motion.div
          key={currentChallenge.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full bg-[#12163d]/90 rounded-2xl p-3.5 sm:p-4 border border-indigo-700/60 shadow-lg flex flex-col items-center mb-3.5"
        >
          {/* Animated Item Emoji Avatar */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-indigo-500/20 border border-amber-400/40 flex items-center justify-center text-3xl mb-2 shadow-inner">
            <span>{currentChallenge.itemEmoji}</span>
          </div>

          {/* Item Name & Base Price */}
          <h2 className="text-base sm:text-lg font-black text-white text-center leading-tight mb-1">
            {currentChallenge.itemName}
          </h2>
          <div className="text-xs text-amber-300 font-mono font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-2.5">
            Base Unit: {formatMoney(currentChallenge.basePrice, currency)}
          </div>

          {/* Clear Purchasing Question Text */}
          <div className="w-full bg-[#080a21] rounded-xl p-3 border border-indigo-900 text-center relative group">
            <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-100 leading-relaxed">
              {currentChallenge.questionText}
            </p>
          </div>

          {/* Math Formula Hint Pill */}
          <div className="mt-2.5 px-3 py-1 bg-indigo-950/80 rounded-xl border border-indigo-800 text-amber-300 text-xs font-mono font-bold">
            💡 {currentChallenge.formulaHint}
          </div>
        </motion.div>

        {/* Live Step-by-Step Feedback Banner */}
        <AnimatePresence>
          {feedbackText && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`w-full mb-3 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                answerStatus === 'correct'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/60'
              }`}
            >
              {answerStatus === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedbackText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 UNIFIED-COLOR ANSWER OPTION CARDS */}
        <div className="w-full grid grid-cols-2 gap-3">
          {currentChallenge.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectAnswer = Math.abs(option - currentChallenge.correctAnswer) < 0.01;

            let cardStyles =
              'bg-[#13173d] hover:bg-[#1a2052] text-white border-2 border-indigo-600/50 hover:border-amber-400/70 shadow-md';

            if (isSelected) {
              if (answerStatus === 'correct') {
                cardStyles =
                  'bg-emerald-600 border-2 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-102';
              } else if (answerStatus === 'wrong') {
                cardStyles =
                  'bg-rose-600 border-2 border-rose-300 text-white shadow-[0_0_20px_rgba(244,63,94,0.7)] animate-shake';
              }
            } else if (answerStatus === 'correct' && isCorrectAnswer) {
              cardStyles = 'bg-emerald-600/90 border-2 border-emerald-400 text-white';
            }

            return (
              <motion.button
                key={`${currentChallenge.id}_opt_${idx}`}
                type="button"
                id={`btn-purchasing-option-${idx}`}
                disabled={answerStatus !== 'idle' || isPaused || !hasStarted}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => soundManager.playHover()}
                whileTap={{ scale: 0.96 }}
                className={`py-3.5 px-3 rounded-2xl font-mono font-black text-xl md:text-2xl transition-all duration-150 cursor-pointer flex items-center justify-center select-none ${cardStyles}`}
              >
                <span>{formatMoney(option, currency)}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ================= START GAME OVERLAY ================= */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 border border-amber-300 flex items-center justify-center text-3xl mb-4 shadow-[0_0_25px_rgba(251,191,36,0.6)] animate-bounce">
              🛍️
            </div>

            <h3 className="text-2xl font-black text-white tracking-wide mb-1">Purchasing Match</h3>
            <p className="text-xs text-indigo-300/80 mb-6 max-w-xs leading-relaxed">
              Test your smart shopping math skills with your Voice Host! Solve real store prices, discounts, combo deals, and cashier change.
            </p>

            <button
              type="button"
              id="btn-start-purchasing-game"
              onClick={handleStartGame}
              className="w-full max-w-xs py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Start with Voice Host</span>
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
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-900/90 border border-indigo-700 flex items-center justify-center text-indigo-300 mb-3 shadow-xl">
              <Pause className="w-7 h-7 text-amber-400" />
            </div>

            <h3 className="text-xl font-black text-white mb-1">Game Paused</h3>
            <p className="text-xs text-indigo-300/80 mb-6">Take a quick breath and resume whenever you're ready!</p>

            <div className="w-full max-w-xs space-y-2.5">
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Resume Game</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-2.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 font-bold text-xs border border-indigo-700/60 transition-colors cursor-pointer"
              >
                Restart Level
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

