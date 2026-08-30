import React from 'react';
import { CurrencyCode, MoneyDenomination } from '../../types';
import { CURRENCY_CONFIGS, formatMoney } from '../../data/gameData';
import { soundManager } from '../../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Trash2, Plus, ArrowRight, Sparkles } from 'lucide-react';

interface MoneyWalletProps {
  currency: CurrencyCode;
  selectedMoney: Array<{ id: string; denom: MoneyDenomination; instanceId: string }>;
  onAddMoney: (denom: MoneyDenomination) => void;
  onRemoveMoney: (instanceId: string) => void;
  onClear: () => void;
  targetAmount?: number;
  onSubmitPay?: () => void;
  disabled?: boolean;
  submitLabel?: string;
  showComparison?: boolean;
}

export const MoneyWallet: React.FC<MoneyWalletProps> = ({
  currency,
  selectedMoney,
  onAddMoney,
  onRemoveMoney,
  onClear,
  targetAmount,
  onSubmitPay,
  disabled = false,
  submitLabel = 'Match & Purchase!',
  showComparison = true,
}) => {
  const currencyConfig = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const currentSum = Math.round(selectedMoney.reduce((sum, item) => sum + item.denom.value, 0) * 100) / 100;
  
  const isExact = targetAmount !== undefined && Math.abs(currentSum - targetAmount) < 0.005;
  const isOver = targetAmount !== undefined && currentSum > targetAmount + 0.005;
  const isUnder = targetAmount !== undefined && currentSum < targetAmount - 0.005;

  const handleDenomClick = (denom: MoneyDenomination) => {
    if (disabled) return;
    soundManager.playCoin();
    onAddMoney(denom);
  };

  const handleRemoveClick = (instanceId: string) => {
    if (disabled) return;
    soundManager.playPop();
    onRemoveMoney(instanceId);
  };

  // Group denominations into bills and coins
  const bills = currencyConfig.denominations.filter(d => d.type === 'bill');
  const coins = currencyConfig.denominations.filter(d => d.type === 'coin');

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-3xl p-4 md:p-6 border-2 border-amber-200/80 shadow-md flex flex-col gap-4">
      {/* Upper Section: Selected Money Tray (The Register Tray) */}
      <div className="bg-amber-50/70 rounded-2xl p-3 md:p-4 border-2 border-dashed border-amber-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Coins className="w-4 h-4" />
            </div>
            <span className="font-kid font-bold text-slate-800 text-base md:text-lg">
              Payment Tray (Tap to remove)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-kid text-right">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Your Total</span>
              <span className={`text-xl md:text-2xl font-bold ${
                isExact ? 'text-emerald-600' : isOver ? 'text-rose-500' : 'text-slate-800'
              }`}>
                {formatMoney(currentSum, currency)}
              </span>
            </div>

            {selectedMoney.length > 0 && (
              <button
                type="button"
                id="btn-clear-tray"
                onClick={onClear}
                disabled={disabled}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                title="Clear Tray"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Money Items Pills */}
        <div className="min-h-16 max-h-36 overflow-y-auto flex flex-wrap items-center gap-2 p-2 bg-white/80 rounded-xl border border-amber-200/60">
          {selectedMoney.length === 0 ? (
            <div className="w-full text-center py-3 text-slate-400 font-kid text-sm italic">
              Tap coins or bills below to add money to this tray! 🪙
            </div>
          ) : (
            <AnimatePresence>
              {selectedMoney.map((item) => (
                <motion.button
                  key={item.instanceId}
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveClick(item.instanceId)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-kid font-bold text-sm shadow-sm border-2 cursor-pointer ${
                    item.denom.type === 'coin'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  }`}
                  title="Click to remove from tray"
                >
                  <span>{item.denom.type === 'coin' ? '🪙' : '💵'}</span>
                  <span>{item.denom.shortLabel}</span>
                  <span className="text-slate-400 text-xs ml-0.5">×</span>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Target and Feedback Comparison */}
        {showComparison && targetAmount !== undefined && (
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs md:text-sm font-kid">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Target Price:</span>
              <span className="font-bold text-amber-700 text-base">{formatMoney(targetAmount, currency)}</span>
            </div>

            {selectedMoney.length > 0 && (
              <div>
                {isExact && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" /> Exact match! Perfect!
                  </span>
                )}
                {isUnder && (
                  <span className="text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Need {formatMoney(targetAmount - currentSum, currency)} more
                  </span>
                )}
                {isOver && (
                  <span className="text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    Too much by {formatMoney(currentSum - targetAmount, currency)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lower Section: Bank / Wallet Picker */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-kid font-bold text-slate-700 text-sm md:text-base flex items-center gap-1.5">
            <span>👛</span> Kids Money Wallet (Tap to add):
          </span>
          <span className="text-xs text-slate-500 font-medium">Currency: {currencyConfig.name} ({currencyConfig.symbol})</span>
        </div>

        {/* Bills Rack */}
        {bills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-full md:w-auto mr-1">Bills:</span>
            {bills.map((denom) => (
              <motion.button
                key={denom.id}
                type="button"
                id={`btn-denom-${denom.id}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDenomClick(denom)}
                disabled={disabled}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-kid font-bold text-sm md:text-base shadow-sm hover:shadow border border-emerald-600 cursor-pointer active:brightness-95 transition-all"
              >
                <span>💵</span>
                <span>{denom.label}</span>
                <Plus className="w-3.5 h-3.5 opacity-80" />
              </motion.button>
            ))}
          </div>
        )}

        {/* Coins Rack */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-full md:w-auto mr-1">Coins:</span>
          {coins.map((denom) => (
            <motion.button
              key={denom.id}
              type="button"
              id={`btn-denom-${denom.id}`}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDenomClick(denom)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-yellow-950 font-kid font-bold text-sm md:text-base shadow-sm hover:shadow border border-yellow-600/70 cursor-pointer active:brightness-95 transition-all"
            >
              <span>🪙</span>
              <span>{denom.shortLabel}</span>
              <Plus className="w-3 h-3 text-yellow-900/70" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submit Action Button */}
      {onSubmitPay && (
        <div className="pt-2">
          <motion.button
            type="button"
            id="btn-submit-purchase"
            whileHover={!disabled && currentSum > 0 ? { scale: 1.02 } : {}}
            whileTap={!disabled && currentSum > 0 ? { scale: 0.98 } : {}}
            onClick={onSubmitPay}
            disabled={disabled || currentSum === 0}
            className={`w-full py-3.5 px-6 rounded-2xl font-kid font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
              disabled || currentSum === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : isExact
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200 ring-4 ring-emerald-300/50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-200'
            }`}
          >
            <span>{submitLabel}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </div>
  );
};
