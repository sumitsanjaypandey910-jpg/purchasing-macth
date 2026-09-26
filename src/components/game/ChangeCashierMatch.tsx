import React, { useState } from 'react';
import { StoreItem, CurrencyCode, MoneyDenomination } from '../../types';
import { MoneyWallet } from './MoneyWallet';
import { formatMoney } from '../../data/gameData';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, HelpCircle, AlertCircle, ArrowRightLeft, UserCheck } from 'lucide-react';

interface ChangeCashierMatchProps {
  item: StoreItem;
  customerPaid: number;
  currency: CurrencyCode;
  onSuccessMatch: (paidAmount: number, attempts: number) => void;
  onErrorAttempt: (paidAmount: number, targetAmount: number) => void;
  streak: number;
}

export const ChangeCashierMatch: React.FC<ChangeCashierMatchProps> = ({
  item,
  customerPaid,
  currency,
  onSuccessMatch,
  onErrorAttempt,
  streak,
}) => {
  const [selectedMoney, setSelectedMoney] = useState<Array<{ id: string; denom: MoneyDenomination; instanceId: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const exactChangeDue = Math.round((customerPaid - item.price) * 100) / 100;
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

    if (Math.abs(currentTotal - exactChangeDue) < 0.005) {
      setErrorMessage(null);
      onSuccessMatch(currentTotal, attempts + 1);
    } else {
      const diff = Math.abs(currentTotal - exactChangeDue);
      if (currentTotal < exactChangeDue) {
        setErrorMessage(`Customer needs more change! Due is ${formatMoney(exactChangeDue, currency)}, you gave ${formatMoney(currentTotal, currency)}.`);
      } else {
        setErrorMessage(`Too much change! You gave ${formatMoney(currentTotal, currency)}, but change due is ${formatMoney(exactChangeDue, currency)}.`);
      }
      onErrorAttempt(currentTotal, exactChangeDue);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-5xl mx-auto">
      {/* Left side: Cashier Register & Customer Interaction */}
      <div className="lg:w-5/12 flex flex-col justify-between p-5 md:p-6 bg-gradient-to-b from-emerald-100/70 via-teal-50/40 to-white rounded-3xl border-2 border-emerald-200/90 shadow-md">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-900 px-3 py-1 rounded-full text-xs font-kid font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cashier Register Mode</span>
          </div>

          <button
            type="button"
            onClick={() => setShowHint(h => !h)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-kid font-black text-emerald-900 hover:text-emerald-950 bg-emerald-200 hover:bg-emerald-300 px-3.5 py-1.5 rounded-full transition-colors border border-emerald-400 cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-emerald-800" />
            <span>{showHint ? 'Hide Math' : '💡 Need Math Help?'}</span>
          </button>
        </div>

        {/* Customer Transaction Display */}
        <div className="space-y-3 my-2">
          {/* Customer Dialogue & Question */}
          <div className="bg-white/95 p-4 rounded-2xl border-2 border-emerald-300 shadow-md flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shrink-0 border border-emerald-300">
              🧒
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1 text-xs font-black uppercase text-emerald-900 tracking-wide mb-1">
                <span>❓</span>
                <span>Customer Order / Question:</span>
              </div>
              <p className="font-kid font-black text-slate-900 text-base sm:text-lg md:text-xl leading-snug">
                "I want to buy the <span className="text-emerald-800 font-black">{item.name}</span>! Here is{' '}
                <span className="text-emerald-800 font-black bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                  {formatMoney(customerPaid, currency)}
                </span>."
              </p>
            </div>
          </div>

          {/* Item details */}
          <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{item.emoji}</span>
              <div>
                <h4 className="font-kid font-bold text-slate-800 text-sm">{item.name}</h4>
                <span className="text-xs text-slate-500">Item Cost</span>
              </div>
            </div>
            <div className="font-kid font-bold text-emerald-800 text-base">
              {formatMoney(item.price, currency)}
            </div>
          </div>

          {/* Math breakdown banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-sm text-center font-kid">
            <div className="text-xs sm:text-sm text-emerald-100 uppercase font-black tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <span>❓</span>
              <span>Question: Calculate Change Due</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-base md:text-lg font-black">
              <span>Customer Paid ({formatMoney(customerPaid, currency)})</span>
              <span>−</span>
              <span>Price ({formatMoney(item.price, currency)})</span>
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black bg-white text-emerald-950 px-4 py-1 rounded-xl inline-block shadow-inner">
              Change Due = {formatMoney(exactChangeDue, currency)}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3.5 text-sm sm:text-base md:text-lg font-kid text-emerald-950 bg-emerald-100/95 p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-400 text-left shadow-sm leading-relaxed"
            >
              <div className="flex items-center gap-1.5 font-black text-emerald-900 text-xs sm:text-sm uppercase tracking-wider mb-1">
                <span className="text-lg">💡</span>
                <span>Cashier Math Hint:</span>
              </div>
              <p className="font-bold">
                {formatMoney(customerPaid, currency)} minus {formatMoney(item.price, currency)} equals{' '}
                <strong className="text-emerald-900 font-black text-base sm:text-lg underline">
                  {formatMoney(exactChangeDue, currency)}
                </strong>
                . Pick the coins/bills on the right to give exactly this amount!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side: Money Wallet for Change */}
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
              <p className="text-xs text-rose-600 mt-0.5">Check your change calculation and give back {formatMoney(exactChangeDue, currency)}.</p>
            </div>
          </motion.div>
        )}

        <MoneyWallet
          currency={currency}
          selectedMoney={selectedMoney}
          onAddMoney={handleAddMoney}
          onRemoveMoney={handleRemoveMoney}
          onClear={handleClear}
          targetAmount={exactChangeDue}
          onSubmitPay={handleSubmit}
          submitLabel={`Give Change (${formatMoney(exactChangeDue, currency)})`}
        />
      </div>
    </div>
  );
};
