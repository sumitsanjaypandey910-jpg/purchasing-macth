import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Trophy, ArrowRight, Flame, Award } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { Badge } from '../../types';

interface CelebrationModalProps {
  isOpen: boolean;
  pointsEarned: number;
  totalScore: number;
  streak: number;
  roundNumber: number;
  maxRounds: number;
  unlockedBadge?: Badge | null;
  onNextRound: () => void;
  isGameComplete?: boolean;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  pointsEarned,
  totalScore,
  streak,
  roundNumber,
  maxRounds,
  unlockedBadge,
  onNextRound,
  isGameComplete = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playFanfare();
      // Trigger festive colorful confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border-4 border-amber-300 relative text-center overflow-hidden"
        >
          {/* Top Decorative Sparkles */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* Stars visual */}
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15 * starIdx, type: 'spring', stiffness: 300 }}
                className="text-amber-400 drop-shadow-md"
              >
                <Star className="w-10 h-10 fill-amber-400" />
              </motion.div>
            ))}
          </div>

          <h2 className="font-kid font-bold text-3xl text-slate-800 tracking-wide mb-1">
            {isGameComplete ? '🎉 Match Completed!' : '✨ Perfect Match!'}
          </h2>
          <p className="font-kid text-slate-600 text-sm md:text-base mb-5">
            {isGameComplete 
              ? 'Awesome shopping math! You finished all store rounds!'
              : 'You matched the exact money and completed the purchase!'}
          </p>

          {/* Points & Score Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 mb-4 space-y-3 font-kid">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm font-semibold">Points Earned:</span>
              <span className="text-2xl font-bold text-amber-600 flex items-center gap-1">
                +{pointsEarned} <Sparkles className="w-4 h-4 text-amber-500" />
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
              <span className="text-slate-600 text-sm font-semibold">Total Points:</span>
              <span className="text-xl font-bold text-slate-800">{totalScore}</span>
            </div>

            {streak > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-orange-600 font-bold">
                <span className="flex items-center gap-1 text-sm">
                  <Flame className="w-4 h-4 text-orange-500" /> Streak Multiplier:
                </span>
                <span className="bg-orange-100 px-2.5 py-0.5 rounded-full text-sm">
                  {streak}x Combo! 🔥
                </span>
              </div>
            )}
          </div>

          {/* Unlocked Badge Alert if any */}
          {unlockedBadge && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-5 p-3.5 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl border-2 border-yellow-400 text-left flex items-center gap-3 shadow-sm font-kid"
            >
              <div className="text-3xl shrink-0 p-1 bg-white rounded-xl shadow-xs">
                {unlockedBadge.emoji}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider block">
                  New Badge Unlocked!
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{unlockedBadge.title}</h4>
                <p className="text-xs text-slate-600">{unlockedBadge.description}</p>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.button
            type="button"
            id="btn-modal-next-round"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNextRound}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-kid font-bold text-lg md:text-xl shadow-lg hover:shadow-xl shadow-amber-300/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>{isGameComplete ? 'View Shopping Report 📊' : `Next Round (${roundNumber + 1}/${maxRounds})`}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
