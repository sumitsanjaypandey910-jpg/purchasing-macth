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
    <header className="w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200/90 sticky top-0 z-40 shadow-xs text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center text-xl shadow-md text-white border-2 border-amber-300">
            🛍️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-slate-900 tracking-wide leading-tight">
                Purchasing Match
              </h1>
              <span className="bg-amber-100 text-amber-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-300 font-mono">
                Smart Store
              </span>
            </div>
            <p className="text-xs text-amber-900/80 hidden sm:block font-medium">
              Kids Real-World Money & Purchasing Math Challenge
            </p>
          </div>
        </div>

        {/* Right Player Tally & Currency Picker */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Streak pill if > 0 */}
          {streak > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 border border-orange-300 rounded-xl text-orange-950 text-xs font-mono font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streak} Streak</span>
            </div>
          )}

          {/* Points Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 rounded-xl border border-amber-300 text-amber-950 text-xs sm:text-sm font-mono font-bold shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>{totalPoints} pts</span>
          </div>

          {/* Quick Currency Selector */}
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
            className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-xs font-mono font-bold text-amber-950 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            title="Switch Game Currency"
          >
            {Object.keys(CURRENCY_CONFIGS).map((code) => (
              <option key={code} value={code} className="bg-white text-slate-900">
                {code} ({CURRENCY_CONFIGS[code as CurrencyCode].symbol})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
