import React from 'react';
import { CurrencyCode } from '../../types';
import { CURRENCY_CONFIGS } from '../../data/gameData';
import { soundManager } from '../../utils/audio';
import { Trophy, Flame, Coins, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalPoints: number;
  streak: number;
  currency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  childName: string;
}

export const Header: React.FC<HeaderProps> = ({
  totalPoints,
  streak,
  currency,
  onChangeCurrency,
  childName,
}) => {
  const handleCurrencyChange = (c: CurrencyCode) => {
    soundManager.playCoin();
    onChangeCurrency(c);
  };

  return (
    <header className="w-full bg-[#0d102b]/95 backdrop-blur-md border-b border-indigo-900/60 sticky top-0 z-40 shadow-lg text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-xl shadow-md text-white border border-amber-300/40">
            🛍️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-white tracking-wide leading-tight">
                Purchasing Match
              </h1>
              <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
                Smart Math
              </span>
            </div>
            <p className="text-xs text-indigo-300/70 hidden sm:block">
              Kids Real-World Money & Purchasing Math Challenge
            </p>
          </div>
        </div>

        {/* Right Player Tally & Currency Picker */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Streak pill if > 0 */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/20 border border-orange-500/40 rounded-xl text-orange-300 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span>{streak} Streak</span>
            </div>
          )}

          {/* Points Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-950/90 rounded-xl border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-mono font-bold shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{totalPoints} pts</span>
          </div>

          {/* Quick Currency Selector */}
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
            className="px-2.5 py-1 rounded-xl bg-[#14183d] border border-indigo-700/60 text-xs font-mono font-bold text-amber-300 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Switch Game Currency"
          >
            {Object.keys(CURRENCY_CONFIGS).map((code) => (
              <option key={code} value={code} className="bg-slate-900 text-white">
                {code} ({CURRENCY_CONFIGS[code as CurrencyCode].symbol})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
