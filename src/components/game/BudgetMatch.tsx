import React, { useState } from 'react';
import { StoreItem, CurrencyCode } from '../../types';
import { GameCard } from './GameCard';
import { formatMoney } from '../../data/gameData';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Sparkles, Check, AlertCircle, ShoppingCart, HelpCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface BudgetMatchProps {
  shelfItems: StoreItem[];
  targetBudget: number;
  currency: CurrencyCode;
  onSuccessMatch: (selectedItems: StoreItem[], totalSpent: number, attempts: number) => void;
  onErrorAttempt: (currentSpent: number, targetBudget: number) => void;
  streak: number;
}

export const BudgetMatch: React.FC<BudgetMatchProps> = ({
  shelfItems,
  targetBudget,
  currency,
  onSuccessMatch,
  onErrorAttempt,
  streak,
}) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const selectedItems = shelfItems.filter(item => selectedItemIds.includes(item.id));
  const currentTotal = Math.round(selectedItems.reduce((sum, item) => sum + item.price, 0) * 100) / 100;
  const isExact = Math.abs(currentTotal - targetBudget) < 0.005;
  const isOver = currentTotal > targetBudget + 0.005;
  const remaining = Math.round((targetBudget - currentTotal) * 100) / 100;

  const toggleItem = (item: StoreItem) => {
    setErrorMessage(null);
    if (selectedItemIds.includes(item.id)) {
      soundManager.playPop();
      setSelectedItemIds(prev => prev.filter(id => id !== item.id));
    } else {
      soundManager.playCoin();
      setSelectedItemIds(prev => [...prev, item.id]);
    }
  };

  const handleClear = () => {
    soundManager.playPop();
    setSelectedItemIds([]);
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    setAttempts(a => a + 1);

    if (isExact) {
      setErrorMessage(null);
      onSuccessMatch(selectedItems, currentTotal, attempts + 1);
    } else {
      if (isOver) {
        setErrorMessage(`Over budget! Your cart is ${formatMoney(currentTotal, currency)}, which is ${formatMoney(currentTotal - targetBudget, currency)} more than your ${formatMoney(targetBudget, currency)} budget.`);
      } else {
        setErrorMessage(`You still have ${formatMoney(remaining, currency)} left in your budget! Pick more items to match exactly ${formatMoney(targetBudget, currency)}.`);
      }
      onErrorAttempt(currentTotal, targetBudget);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Top Banner: Budget & Live Cart Meter */}
      <div className="p-5 md:p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl shadow-lg border-2 border-purple-300/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
              👛
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-200 font-bold font-kid block">
                Target Budget Challenge
              </span>
              <h3 className="font-kid font-bold text-2xl md:text-3xl text-yellow-300">
                Spend Exactly {formatMoney(targetBudget, currency)}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 font-kid">
            <div className="text-center">
              <span className="text-xs text-purple-200 block font-medium">Cart Total</span>
              <span className={`text-xl md:text-2xl font-bold ${
                isExact ? 'text-emerald-300' : isOver ? 'text-rose-300' : 'text-white'
              }`}>
                {formatMoney(currentTotal, currency)}
              </span>
            </div>

            <div className="h-8 w-px bg-white/20" />

            <div className="text-center">
              <span className="text-xs text-purple-200 block font-medium">Remaining</span>
              <span className={`text-xl md:text-2xl font-bold ${
                isExact ? 'text-emerald-300' : remaining < 0 ? 'text-rose-300' : 'text-yellow-300'
              }`}>
                {remaining >= 0 ? formatMoney(remaining, currency) : `-${formatMoney(Math.abs(remaining), currency)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Items summary preview bar */}
        <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm font-kid">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-purple-200 font-bold flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" /> Selected ({selectedItems.length}):
            </span>
            {selectedItems.length === 0 ? (
              <span className="text-purple-300 italic">Tap items below to fill your cart!</span>
            ) : (
              selectedItems.map(item => (
                <span key={item.id} className="bg-white/20 px-2.5 py-1 rounded-xl text-white font-bold flex items-center gap-1 border border-white/20">
                  <span>{item.emoji}</span>
                  <span>{item.name} ({formatMoney(item.price, currency)})</span>
                </span>
              ))
            )}
          </div>

          {selectedItems.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-purple-200 hover:text-white underline font-bold transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* Error / Feedback notification */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-800 font-kid text-sm flex items-start gap-2.5 shadow-sm"
        >
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{errorMessage}</p>
            <p className="text-xs text-rose-600 mt-0.5">Tap on any selected item to remove it or tap new items to adjust.</p>
          </div>
        </motion.div>
      )}

      {/* Store Shelf Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="font-kid font-bold text-slate-800 text-lg flex items-center gap-2">
            <span>🏪</span> Store Shelves (Tap to select items):
          </h4>
          <button
            type="button"
            onClick={() => setShowHint(h => !h)}
            className="flex items-center gap-1 text-xs font-kid font-bold text-indigo-800 hover:text-indigo-950 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Shopping Hint'}</span>
          </button>
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 text-xs md:text-sm font-kid text-indigo-900 bg-indigo-50/90 p-3 rounded-2xl border border-indigo-200 text-left"
            >
              💡 <strong>Budget Strategy:</strong> You need exactly {formatMoney(targetBudget, currency)}. Look for 2 or 3 items whose prices add up to {formatMoney(targetBudget, currency)}!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {shelfItems.map(item => (
            <GameCard
              key={item.id}
              item={item}
              currency={currency}
              isSelected={selectedItemIds.includes(item.id)}
              onClick={() => toggleItem(item)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Bottom Submit Bar */}
      <div className="pt-2">
        <motion.button
          type="button"
          id="btn-submit-budget-cart"
          whileHover={!selectedItems.length ? {} : { scale: 1.02 }}
          whileTap={!selectedItems.length ? {} : { scale: 0.98 }}
          onClick={handleSubmit}
          disabled={selectedItems.length === 0}
          className={`w-full py-4 px-6 rounded-2xl font-kid font-bold text-lg md:text-xl flex items-center justify-center gap-2 shadow-lg transition-all ${
            selectedItems.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : isExact
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-emerald-200 ring-4 ring-emerald-300/60'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-200'
          }`}
        >
          <span>Purchase Budget Cart ({formatMoney(currentTotal, currency)})</span>
          {isExact && <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />}
        </motion.button>
      </div>
    </div>
  );
};
