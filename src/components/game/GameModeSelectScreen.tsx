import React from 'react';
import { CurrencyCode, DifficultyLevel, GameMode } from '../../types';
import { CURRENCY_CONFIGS } from '../../data/gameData';
import { soundManager } from '../../utils/audio';
import { motion } from 'motion/react';
import {
  Sparkles,
  Volume2,
  Coins,
  ArrowRight,
  ShoppingBag,
  Calculator,
  Wallet,
  Trophy,
  Flame,
  Award,
  Store,
  Layers,
  CheckCircle2,
  DollarSign,
  Receipt,
  ShoppingCart,
  Percent,
} from 'lucide-react';

interface GameModeSelectScreenProps {
  onSelectMode: (mode: GameMode) => void;
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  difficulty: DifficultyLevel;
  onChangeDifficulty: (d: DifficultyLevel) => void;
  totalScore: number;
  streak: number;
  childName: string;
}

export const GameModeSelectScreen: React.FC<GameModeSelectScreenProps> = ({
  onSelectMode,
  currency,
  onChangeCurrency,
  difficulty,
  onChangeDifficulty,
  totalScore,
  streak,
  childName,
}) => {
  const currencySymbol = CURRENCY_CONFIGS[currency]?.symbol || '₹';

  const handleModeClick = (mode: GameMode) => {
    soundManager.playClick();
    soundManager.playLevelTransition();
    onSelectMode(mode);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-3 flex flex-col items-center">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs sm:text-sm font-black mb-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          <span>Select Your Game Mode • Choose How You Want to Play</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Welcome to <span className="text-amber-600">Purchasing Match</span>! 🛒
        </h1>
        <p className="text-sm sm:text-base text-amber-950/80 font-medium max-w-2xl mx-auto mt-1">
          Pick one of the 3 fun games below to practice smart shopping, count real bills & coins, or run the cashier register!
        </p>

        {/* Quick Settings Bar: Difficulty & Currency */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {/* Difficulty Segmented Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-amber-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-amber-950/70 px-2 uppercase tracking-wider font-mono">
              Level:
            </span>
            {(['starter', 'junior', 'master'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                id={`btn-diff-${lvl}`}
                onClick={() => {
                  soundManager.playClick();
                  onChangeDifficulty(lvl);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer capitalize ${
                  difficulty === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-xs border border-amber-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
                }`}
              >
                {lvl === 'starter' ? '🌱 Starter' : lvl === 'junior' ? '⭐ Junior' : '🔥 Master'}
              </button>
            ))}
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border-2 border-amber-200/90 shadow-xs">
            <Coins className="w-4 h-4 text-amber-600" />
            <span className="text-[11px] font-bold text-amber-950/70 uppercase tracking-wider font-mono">
              Currency:
            </span>
            <select
              value={currency}
              onChange={(e) => {
                soundManager.playCoin();
                onChangeCurrency(e.target.value as CurrencyCode);
              }}
              className="font-mono font-black text-xs text-amber-950 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                <option key={c} value={c}>
                  {c} ({CURRENCY_CONFIGS[c].symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* ================= THE THREE PRIMARY GAME BLOCKS ================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-7">
        {/* BLOCK 1: SMART STORE MATCH (VOICE HOST & QUIZ) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group relative bg-white/95 rounded-[32px] p-5 lg:p-6 border-3 border-amber-300/90 hover:border-amber-500 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden"
        >
          {/* Top Decorative Ribbon / Glow */}
          <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-300/40 transition-colors" />

          <div>
            {/* Tag & Voice Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Mode 1 • Popular
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-orange-100/90 border border-orange-200 px-2 py-0.5 rounded-full">
                <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                <span>Bolne Wala Awaaz</span>
              </span>
            </div>

            {/* Showcase Visual Art */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-tr from-amber-100 via-orange-50 to-amber-50 border-2 border-amber-200/80 flex flex-col items-center justify-center p-3 mb-4 relative overflow-hidden group-hover:border-amber-400 transition-colors">
              {/* Large Apple & Grocery Items Showcase */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-5xl select-none filter drop-shadow-md transform group-hover:scale-110 transition-transform">
                  🍎
                </span>
                <span className="text-3xl select-none opacity-80 filter drop-shadow-sm">
                  🧃
                </span>
                <span className="text-3xl select-none opacity-80 filter drop-shadow-sm">
                  🥐
                </span>
              </div>
              <div className="bg-amber-200/90 text-amber-950 font-mono font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-300 shadow-xs">
                Apple = {currencySymbol}25 • Deal Multipacks
              </div>
            </div>

            {/* Title & Headline */}
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
              Smart Store Match
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-amber-900/80 mt-1 mb-3">
              Apple & grocery price quiz with animated Voice Host narration!
            </p>

            {/* Bullet Highlights */}
            <ul className="space-y-2 mb-5 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">🎧</span>
                <span>
                  <strong>Voice Host Narration:</strong> Reads challenges aloud in clear, friendly speech.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">🍎</span>
                <span>
                  <strong>Real Store Math:</strong> Multiply apple quantities, bundles, and seasonal deals.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">⚡</span>
                <span>
                  <strong>4-Choice Quiz:</strong> Fast multiple choice buttons with instant feedback & streaks.
                </span>
              </li>
            </ul>
          </div>

          {/* Action Play Button */}
          <button
            type="button"
            id="btn-play-smart-store"
            onClick={() => handleModeClick('frequency-annual-match')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-slate-950 font-black text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-600/40"
          >
            <span>Play Smart Store Match</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* BLOCK 2: PAY ITEM WITH CASH (WALLET & REGISTER) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group relative bg-white/95 rounded-[32px] p-5 lg:p-6 border-3 border-emerald-300/90 hover:border-emerald-500 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden"
        >
          {/* Top Decorative Ribbon / Glow */}
          <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-300/40 transition-colors" />

          <div>
            {/* Tag & Wallet Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Mode 2 • Hands-On
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Interactive Wallet</span>
              </span>
            </div>

            {/* Showcase Visual Art */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-tr from-emerald-100/70 via-teal-50 to-amber-50 border-2 border-emerald-200/80 flex flex-col items-center justify-center p-3 mb-4 relative overflow-hidden group-hover:border-emerald-400 transition-colors">
              {/* Bills & Coins Showcase */}
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="px-2.5 py-1 bg-emerald-200 text-emerald-950 rounded-lg font-mono font-black text-xs border border-emerald-400 shadow-xs transform -rotate-3 group-hover:rotate-0 transition-transform">
                  💵 {currencySymbol}50
                </div>
                <div className="px-2.5 py-1 bg-amber-200 text-amber-950 rounded-lg font-mono font-black text-xs border border-amber-400 shadow-xs transform rotate-3 group-hover:rotate-0 transition-transform">
                  💵 {currencySymbol}20
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-mono font-black text-xs border-2 border-amber-500 shadow-xs">
                  🪙
                </div>
              </div>
              <div className="bg-emerald-200/90 text-emerald-950 font-mono font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
                Tap Exact Notes & Coins
              </div>
            </div>

            {/* Title & Headline */}
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
              Pay Item with Cash
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-emerald-900/80 mt-1 mb-3">
              Count authentic bills and coins from your wallet to pay exact price!
            </p>

            {/* Bullet Highlights */}
            <ul className="space-y-2 mb-5 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">🏷️</span>
                <span>
                  <strong>Store Counter Shelf:</strong> An item appears with its official price tag.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">🪙</span>
                <span>
                  <strong>Interactive Wallet:</strong> Tap realistic notes & coins to put money on the tray.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">🎯</span>
                <span>
                  <strong>Exact Amount Matching:</strong> Visual hints ensure you don't overpay or underpay.
                </span>
              </li>
            </ul>
          </div>

          {/* Action Play Button */}
          <button
            type="button"
            id="btn-play-pay-item"
            onClick={() => handleModeClick('item-price-match')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-600/40"
          >
            <span>Play Pay Item with Cash</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* BLOCK 3: CASHIER CHANGE RETURN (REGISTER SIMULATOR) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="group relative bg-white/95 rounded-[32px] p-5 lg:p-6 border-3 border-sky-300/90 hover:border-sky-500 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden"
        >
          {/* Top Decorative Ribbon / Glow */}
          <div className="absolute top-0 right-0 left-0 h-2.5 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-500" />
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-200/30 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-300/40 transition-colors" />

          <div>
            {/* Tag & Cashier Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="bg-sky-100 text-sky-900 border border-sky-300 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Mode 3 • Cashier
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                <Receipt className="w-3.5 h-3.5 text-sky-600" />
                <span>Smart Cashier</span>
              </span>
            </div>

            {/* Showcase Visual Art */}
            <div className="w-full h-36 rounded-2xl bg-gradient-to-tr from-sky-100/70 via-blue-50 to-amber-50 border-2 border-sky-200/80 flex flex-col items-center justify-center p-3 mb-4 relative overflow-hidden group-hover:border-sky-400 transition-colors">
              {/* Cash Register Illustration */}
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="w-12 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xl shadow-md border-2 border-sky-300">
                  🏧
                </div>
                <div className="flex flex-col items-start font-mono text-[11px]">
                  <span className="text-slate-600">Customer Gave: <strong className="text-sky-700">{currencySymbol}100</strong></span>
                  <span className="text-slate-600">Item Price: <strong className="text-rose-600">{currencySymbol}60</strong></span>
                </div>
              </div>
              <div className="bg-sky-200/90 text-sky-950 font-mono font-black text-xs px-2.5 py-0.5 rounded-full border border-sky-300 shadow-xs">
                Return Change = {currencySymbol}40 🔄
              </div>
            </div>

            {/* Title & Headline */}
            <h3 className="text-xl lg:text-2xl font-black text-slate-900 leading-tight group-hover:text-sky-700 transition-colors">
              Cashier Change Return
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-sky-900/80 mt-1 mb-3">
              Calculate exact change due and hand back the right notes and coins!
            </p>

            {/* Bullet Highlights */}
            <ul className="space-y-2 mb-5 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold shrink-0 mt-0.5">🏧</span>
                <span>
                  <strong>Run the Register:</strong> The customer gives you a large note to pay for an item.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold shrink-0 mt-0.5">➖</span>
                <span>
                  <strong>Mental Math Subtraction:</strong> Calculate Customer Paid minus Item Price.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-600 font-bold shrink-0 mt-0.5">🔄</span>
                <span>
                  <strong>Cash Register Drawer:</strong> Pick and return the right coins and notes to finish the order.
                </span>
              </li>
            </ul>
          </div>

          {/* Action Play Button */}
          <button
            type="button"
            id="btn-play-cashier-change"
            onClick={() => handleModeClick('cashier-change-match')}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-400 to-indigo-400 hover:from-sky-600 hover:to-indigo-500 text-slate-950 font-black text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-sky-600/40"
          >
            <span>Play Cashier Change Return</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* ================= SECONDARY BONUS MODES ROW ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full bg-white/80 rounded-2xl p-4 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-200 text-amber-950 flex items-center justify-center text-sm font-bold">
            🛍️
          </div>
          <div>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide block">
              Also Available in Store
            </span>
            <span className="text-xs text-amber-900/80">
              Try shopping cart totals or staying inside your pocket budget:
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleModeClick('basket-sum-match')}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-700" />
            <span>🛒 Cart Total Match</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeClick('budget-shopper')}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>👛 Budget Shopper</span>
          </button>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-5 text-center text-xs text-amber-950/70 font-semibold flex items-center gap-4">
        <span>🏆 Total Score: <strong className="text-amber-700">{totalScore} pts</strong></span>
        <span>•</span>
        <span>🔥 Best Streak: <strong className="text-orange-600">{streak}</strong></span>
        <span>•</span>
        <span>👤 Player: <strong className="text-slate-800">{childName}</strong></span>
      </div>
    </div>
  );
};
