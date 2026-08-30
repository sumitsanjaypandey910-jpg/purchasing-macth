import React, { useState } from 'react';
import { StoreItem, CurrencyCode, MoneyDenomination } from '../../types';
import { GameCard } from './GameCard';
import { MoneyWallet } from './MoneyWallet';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { formatMoney } from '../../data/gameData';

interface ItemPriceMatchProps {
  item: StoreItem;
  currency: CurrencyCode;
  onSuccessMatch: (paidAmount: number, attempts: number) => void;
  onErrorAttempt: (paidAmount: number, targetAmount: number) => void;
  streak: number;
}

export const ItemPriceMatch: React.FC<ItemPriceMatchProps> = ({
  item,
  currency,
  onSuccessMatch,
  onErrorAttempt,
  streak,
}) => {
  const [selectedMoney, setSelectedMoney] = useState<Array<{ id: string; denom: MoneyDenomination; instanceId: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const targetAmount = item.price;
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

    if (Math.abs(currentTotal - targetAmount) < 0.005) {
      setErrorMessage(null);
      onSuccessMatch(currentTotal, attempts + 1);
    } else {
      const diff = Math.abs(currentTotal - targetAmount);
      if (currentTotal < targetAmount) {
        setErrorMessage(`Almost! You put ${formatMoney(currentTotal, currency)}, but need ${formatMoney(targetAmount, currency)} (add ${formatMoney(diff, currency)} more).`);
      } else {
        setErrorMessage(`Oops! You put ${formatMoney(currentTotal, currency)}, which is ${formatMoney(diff, currency)} too much. Remove some money!`);
      }
      onErrorAttempt(currentTotal, targetAmount);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-5xl mx-auto">
      {/* Left side: Item on store showcase */}
      <div className="lg:w-5/12 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-100/70 via-orange-50/50 to-white rounded-3xl border-2 border-amber-200/90 shadow-md relative overflow-hidden">
        {/* Decorative corner tag */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-amber-500/10 text-amber-900 px-3 py-1 rounded-full text-xs font-kid font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            <span>Store Shelf Item</span>
          </div>

          <button
            type="button"
            onClick={() => setShowHint(h => !h)}
            className="flex items-center gap-1 text-xs font-kid font-bold text-amber-800 hover:text-amber-950 bg-amber-200/70 hover:bg-amber-300/80 px-2.5 py-1 rounded-full transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Need Hint?'}</span>
          </button>
        </div>

        {/* The Item Card */}
        <div className="py-4">
          <GameCard
            item={item}
            currency={currency}
            size="lg"
            showPrice={true}
          />
        </div>

        {/* Prompt Instruction */}
        <div className="w-full text-center mt-3 bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 border border-amber-200 shadow-sm">
          <p className="font-kid font-bold text-slate-800 text-sm md:text-base">
            Can you pay the exact price of <span className="text-amber-600 text-lg font-bold">{formatMoney(item.price, currency)}</span> for the <span className="text-slate-900">{item.name}</span>?
          </p>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs font-kid text-amber-900 bg-amber-100/90 p-2.5 rounded-xl border border-amber-300 text-left"
              >
                💡 <strong>Hint:</strong> Look at the dollar/coin amounts in the wallet on the right. Try combining the biggest bill or coin that is less than or equal to {formatMoney(item.price, currency)} first!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side: Interactive Register / Money Wallet */}
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
              <p className="text-xs text-rose-600 mt-0.5">Don't worry! Tap any coin in the tray to remove it and try again.</p>
            </div>
          </motion.div>
        )}

        <MoneyWallet
          currency={currency}
          selectedMoney={selectedMoney}
          onAddMoney={handleAddMoney}
          onRemoveMoney={handleRemoveMoney}
          onClear={handleClear}
          targetAmount={targetAmount}
          onSubmitPay={handleSubmit}
          submitLabel={`Pay ${formatMoney(item.price, currency)} & Buy!`}
        />
      </div>
    </div>
  );
};
