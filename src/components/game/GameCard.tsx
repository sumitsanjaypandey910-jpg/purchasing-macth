import React from 'react';
import { StoreItem, CurrencyCode } from '../../types';
import { formatMoney } from '../../data/gameData';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface GameCardProps {
  item: StoreItem;
  currency: CurrencyCode;
  isSelected?: boolean;
  isMatched?: boolean;
  onClick?: () => void;
  showPrice?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GameCard: React.FC<GameCardProps> = ({
  item,
  currency,
  isSelected = false,
  isMatched = false,
  onClick,
  showPrice = true,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-3 w-36 min-h-40',
    md: 'p-4 w-48 min-h-56',
    lg: 'p-5 w-60 min-h-68',
  }[size];

  const emojiSizes = {
    sm: 'text-5xl',
    md: 'text-7xl',
    lg: 'text-8xl',
  }[size];

  return (
    <motion.button
      type="button"
      id={`game-item-${item.id}`}
      whileHover={!disabled && !isMatched ? { scale: 1.04, y: -2 } : {}}
      whileTap={!disabled && !isMatched ? { scale: 0.96 } : {}}
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`relative flex flex-col items-center justify-between rounded-3xl border-2 transition-all text-left shadow-sm ${sizeClasses} ${
        isMatched
          ? 'bg-emerald-50/80 border-emerald-300 opacity-80 cursor-default ring-4 ring-emerald-200'
          : isSelected
          ? 'bg-amber-100/90 border-amber-500 shadow-md ring-4 ring-amber-300/60 scale-[1.02]'
          : 'bg-white hover:bg-amber-50/50 border-slate-200 hover:border-amber-300 shadow-slate-200/50 cursor-pointer'
      }`}
    >
      {/* Badge if present */}
      {item.badge && !isMatched && (
        <span className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {item.badge}
        </span>
      )}

      {isMatched && (
        <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}

      {/* Item Icon / Emoji Container */}
      <div className={`w-full aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 mb-2 group-hover:scale-105 transition-transform ${emojiSizes}`}>
        <span className="select-none filter drop-shadow-sm animate-pop">{item.emoji}</span>
      </div>

      {/* Item Name */}
      <div className="w-full text-center">
        <h4 className="font-kid font-bold text-slate-800 text-sm md:text-base leading-tight truncate px-1">
          {item.name}
        </h4>
      </div>

      {/* Price Tag */}
      {showPrice && (
        <div className="mt-2 w-full flex justify-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-white font-kid font-bold text-base md:text-lg rounded-xl shadow-inner border border-amber-600">
            <span>{formatMoney(item.price, currency)}</span>
          </div>
        </div>
      )}
    </motion.button>
  );
};
