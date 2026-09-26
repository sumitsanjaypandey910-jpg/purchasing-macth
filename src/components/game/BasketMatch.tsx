import React, { useState } from 'react';
import { StoreItem, CurrencyCode, MoneyDenomination } from '../../types';
import { MoneyWallet } from './MoneyWallet';
import { formatMoney } from '../../data/gameData';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface BasketMatchProps {
  items: StoreItem[];
  currency: CurrencyCode;
  onSuccessMatch: (paidAmount: number, attempts: number) => void;
  onErrorAttempt: (paidAmount: number, targetAmount: number) => void;
  streak: number;
}

export const BasketMatch: React.FC<BasketMatchProps> = ({
  items,
  currency,
  onSuccessMatch,
  onErrorAttempt,
  streak,
}) => {
  const [selectedMoney, setSelectedMoney] = useState<Array<{ id: string; denom: MoneyDenomination; instanceId: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const totalBasketPrice = Math.round(items.reduce((sum, item) => sum + item.price, 0) * 100) / 100;
  const currentTotal = Math.round(selectedMoney.reduce((sum, m) => sum + m.denom.value, 0) * 100) / 100;

  const handleAddMoney = (denom: MoneyDenomination) => {
    setErrorMessage(null);
    setSelectedMoney(prev => [
      ...prev,
      { id: denom.id, denom, instanceId: `${denom.id}_${Date.now()}_${Math.random()}` }
    ]);
  };

  const handleRemoveMoney = (instanceId: string) => {
    setErrorMessage(null);
    setSelectedMoney(prev => prev.filter(m => m.instanceId !== instanceId));
  };

  const handleClear = () => {
    setErrorMessage(null);
    setSelectedMoney([]);
  };

  const handleSubmit = () => {
    setAttempts(a => a + 1);

    if (Math.abs(currentTotal - totalBasketPrice) < 0.005) {
      setErrorMessage(null);
      onSuccessMatch(currentTotal, attempts + 1);
    } else {
      const diff = Math.abs(currentTotal - totalBasketPrice);
      if (currentTotal < totalBasketPrice) {
        setErrorMessage(`Close! Your basket total is ${formatMoney(totalBasketPrice, currency)}. You put ${formatMoney(currentTotal, currency)} (add ${formatMoney(diff, currency)}).`);
      } else {
        setErrorMessage(`Oops! You put ${formatMoney(currentTotal, currency)}, which is ${formatMoney(diff, currency)} more than the basket total.`);
      }
      onErrorAttempt(currentTotal, totalBasketPrice);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-5xl mx-auto">
      {/* Left side: Shopping Basket with multiple items */}
      <div className="lg:w-5/12 flex flex-col justify-between p-5 md:p-6 bg-gradient-to-b from-sky-100/70 via-indigo-50/40 to-white rounded-3xl border-2 border-sky-200/90 shadow-md">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 bg-sky-500/10 text-sky-900 px-3 py-1 rounded-full text-xs font-kid font-bold uppercase tracking-wider">
            <ShoppingCart className="w-3.5 h-3.5 text-sky-600" />
            <span>Shopping Cart Total</span>
          </div>

          <button
            type="button"
            onClick={() => setShowHint(h => !h)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-kid font-black text-sky-900 hover:text-sky-950 bg-sky-200 hover:bg-sky-300 px-3.5 py-1.5 rounded-full transition-colors border border-sky-400 cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-sky-800" />
            <span>{showHint ? 'Hide Hint' : '💡 Need Hint?'}</span>
          </button>
        </div>

        {/* Basket visual display */}
        <div className="flex flex-col gap-2.5 my-2">
          {items.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center justify-between p-3 bg-white/90 rounded-2xl border border-sky-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-sm">{item.emoji}</span>
                <div>
                  <h4 className="font-kid font-bold text-slate-800 text-sm">{item.name}</h4>
                  <span className="text-xs text-slate-500 font-medium capitalize">{item.category}</span>
                </div>
              </div>
              <div className="font-kid font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200 text-sm">
                {formatMoney(item.price, currency)}
              </div>
            </div>
          ))}
        </div>

        {/* Addition equation helper & Question */}
        <div className="p-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl shadow-sm text-center font-kid">
          <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-sky-100 mb-1.5 flex items-center justify-center gap-1.5">
            <span>❓</span>
            <span>Question: Pay Exact Basket Total</span>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap text-base md:text-lg font-black">
            {items.map((item, i) => (
              <React.Fragment key={`math-${item.id}-${i}`}>
                {i > 0 && <Plus className="w-4 h-4 opacity-90 stroke-[3]" />}
                <span>{formatMoney(item.price, currency)}</span>
              </React.Fragment>
            ))}
            <span className="text-xl font-black">=</span>
            <span className="text-xl md:text-2xl font-black bg-white text-indigo-900 px-3 py-1 rounded-xl shadow-inner">
              {formatMoney(totalBasketPrice, currency)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-sky-100 mt-2 font-bold">Add up the items and pay the exact basket total!</p>
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3.5 text-sm sm:text-base md:text-lg font-kid text-sky-950 bg-sky-100/95 p-3.5 sm:p-4 rounded-2xl border-2 border-sky-400 text-left shadow-sm leading-relaxed"
            >
              <div className="flex items-center gap-1.5 font-black text-sky-900 text-xs sm:text-sm uppercase tracking-wider mb-1">
                <span className="text-lg">💡</span>
                <span>Basket Total Hint:</span>
              </div>
              <p className="font-bold">
                Total is <strong className="text-indigo-900 font-black text-base sm:text-lg underline">{formatMoney(totalBasketPrice, currency)}</strong>. Try placing a bill first, then adding coins for any remaining cents!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side: Money Wallet */}
      <div className="lg:w-7/12 flex flex-col justify-between">
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-800 font-kid text-sm flex items-start gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{errorMessage}</p>
              <p className="text-xs text-rose-600 mt-0.5">Adjust the coins and bills in the tray to match {formatMoney(totalBasketPrice, currency)}.</p>
            </div>
          </motion.div>
        )}

        <MoneyWallet
          currency={currency}
          selectedMoney={selectedMoney}
          onAddMoney={handleAddMoney}
          onRemoveMoney={handleRemoveMoney}
          onClear={handleClear}
          targetAmount={totalBasketPrice}
          onSubmitPay={handleSubmit}
          submitLabel={`Pay Basket (${formatMoney(totalBasketPrice, currency)})`}
        />
      </div>
    </div>
  );
};
