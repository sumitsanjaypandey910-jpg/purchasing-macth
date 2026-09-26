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
  autoStart?: boolean;
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
  autoStart = true,
}) => {
  const [hasStarted, setHasStarted] = useState(autoStart);
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

  // Voice Host speech synthesis engine with Indian English & natural voice auto-selection
  const triggerHostSpeech = (textToSpeak: string, personaId: HostPersonaId = selectedPersona) => {
    if (isMuted || typeof window === 'undefined') return;

    const persona = HOST_PERSONAS[personaId] || HOST_PERSONAS.sparky;
    const cleanSpeech = cleanTextForSpeech(textToSpeak);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      utterance.pitch = persona.voicePitch;
      utterance.rate = persona.voiceRate;

      // Select natural voice (Indian English or clearest English voice if available)
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const indianVoice = voices.find(v => v.lang === 'en-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('india'));
        const friendlyVoice = voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny'));
        const fallbackEnglish = voices.find(v => v.lang.startsWith('en'));
        utterance.voice = indianVoice || friendlyVoice || fallbackEnglish || voices[0];
      }

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
    <div className="w-full max-w-md md:max-w-lg mx-auto bg-white/95 text-slate-900 rounded-[32px] p-4 sm:p-6 shadow-xl border-2 border-amber-200/90 relative overflow-hidden flex flex-col items-center">
      {/* Background Soft Glow Accents */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar with Level, Timer, Streak, and Controls */}
      <div className="w-full flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-amber-200/80 relative z-10">
        {/* Round Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-950 font-mono font-bold text-xs rounded-xl shadow-xs">
            Round {roundIndex + 1}/{maxRounds}
          </span>
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-xs rounded-xl">
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
            className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer shadow-xs"
            title={isMuted ? 'Unmute Game' : 'Mute Game'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
          </button>

          <button
            type="button"
            id="btn-toggle-pause"
            onClick={() => {
              soundManager.playClick();
              setIsPaused(!isPaused);
            }}
            className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer shadow-xs"
            title={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-amber-700" />}
          </button>

          <button
            type="button"
            id="btn-restart-game"
            onClick={handleRestart}
            className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer shadow-xs"
            title="Restart Match"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
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
        <div className="mb-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
          <span>{currentChallenge.categoryBadge}</span>
        </div>

        {/* Item Showcase Card with Large Apple & Item Display */}
        <motion.div
          key={currentChallenge.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-white rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-md flex flex-col items-center mb-3.5 relative"
        >
          {/* Audio repeat button on top-right */}
          <button
            type="button"
            id="btn-repeat-question-voice"
            onClick={() => {
              soundManager.playClick();
              triggerHostSpeech(`${currentChallenge.itemName}. ${currentChallenge.questionText}`);
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            title="Listen to question aloud"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span className="text-[11px] font-bold">Awaaz</span>
          </button>

          {/* LARGE EXPANDED ITEM EMOJI AVATAR (Apple thoda bada) */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-200 via-orange-100 to-amber-50 border-3 border-amber-300/90 flex items-center justify-center text-6xl sm:text-7xl mb-2.5 shadow-md shadow-amber-200/50"
          >
            <span className="select-none filter drop-shadow-md">{currentChallenge.itemEmoji}</span>
          </motion.div>

          {/* Item Name & Base Price */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 text-center leading-tight mb-1">
            {currentChallenge.itemName}
          </h2>
          <div className="text-xs sm:text-sm text-amber-950 font-mono font-black bg-amber-200/90 px-3.5 py-1 rounded-full border border-amber-300 mb-3 shadow-xs">
            1 Item = {formatMoney(currentChallenge.basePrice, currency)}
          </div>

          {/* Prominent, Bold & Clear Purchasing Question Text */}
          <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-md text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs uppercase tracking-wider mb-2">
              <span className="text-sm">❓</span>
              <span>Question / Sawal</span>
            </div>
            <p className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
              {currentChallenge.questionText}
            </p>
          </div>

          {/* Large & Prominent Math Formula Hint */}
          <div className="mt-3.5 px-5 py-2.5 bg-gradient-to-r from-amber-100 via-amber-200/90 to-amber-100 rounded-2xl border-2 border-amber-400 text-amber-950 shadow-sm flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl filter drop-shadow-xs">💡</span>
            <span className="text-base sm:text-lg md:text-xl font-mono font-black tracking-wide">
              Hint: {currentChallenge.formulaHint}
            </span>
          </div>
        </motion.div>

        {/* Live Step-by-Step Feedback Banner */}
        <AnimatePresence>
          {feedbackText && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`w-full mb-3 p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-black flex items-center gap-2.5 border-2 shadow-xs ${
                answerStatus === 'correct'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-400'
                  : 'bg-rose-50 text-rose-950 border-rose-400'
              }`}
            >
              {answerStatus === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 UNIFIED-COLOR ANSWER OPTION CARDS (Matching Pay Item Interface) */}
        <div className="w-full grid grid-cols-2 gap-3">
          {currentChallenge.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectAnswer = Math.abs(option - currentChallenge.correctAnswer) < 0.01;

            let cardStyles =
              'bg-white hover:bg-amber-50/80 text-slate-900 border-2 border-amber-200/90 hover:border-amber-400 shadow-sm hover:shadow-md';

            if (isSelected) {
              if (answerStatus === 'correct') {
                cardStyles =
                  'bg-emerald-500 border-2 border-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-102';
              } else if (answerStatus === 'wrong') {
                cardStyles =
                  'bg-rose-500 border-2 border-rose-600 text-white shadow-lg shadow-rose-500/30 animate-shake';
              }
            } else if (answerStatus === 'correct' && isCorrectAnswer) {
              cardStyles = 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black';
            }

            return (
              <motion.button
                key={`${currentChallenge.id}_opt_${idx}`}
                type="button"
                id={`btn-purchasing-option-${idx}`}
                disabled={answerStatus !== 'idle' || isPaused || !hasStarted}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => soundManager.playHover()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
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
            className="absolute inset-0 bg-amber-50/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 border-2 border-amber-300 flex items-center justify-center text-4xl mb-4 shadow-lg shadow-amber-300/60 animate-bounce">
              🍎
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-wide mb-1">Purchasing Match</h3>
            <p className="text-xs sm:text-sm text-slate-700 mb-6 max-w-xs leading-relaxed font-medium">
              Solve store math with your Voice Host! Calculate real prices, apple deals, discounts, and cashier change.
            </p>

            <button
              type="button"
              id="btn-start-purchasing-game"
              onClick={handleStartGame}
              className="w-full max-w-xs py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-base uppercase tracking-wider shadow-lg shadow-amber-400/40 transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-600"
            >
              <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Start Game (Awaaz Ke Saath)</span>
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
            className="absolute inset-0 bg-amber-50/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-amber-900 mb-3 shadow-md">
              <Pause className="w-7 h-7 text-amber-900" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Game Paused</h3>
            <p className="text-xs text-slate-600 mb-6">Take a quick breath and resume whenever you're ready!</p>

            <div className="w-full max-w-xs space-y-2.5">
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-600"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Resume Game</span>
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-amber-100 text-slate-800 font-bold text-xs border border-amber-300 transition-colors cursor-pointer shadow-xs"
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

