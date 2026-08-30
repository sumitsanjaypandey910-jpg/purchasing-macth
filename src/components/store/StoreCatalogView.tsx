import React, { useState } from 'react';
import { CurrencyCode, ItemCategory, StoreItem } from '../../types';
import { STORE_ITEMS, scaleItemPrice, formatMoney } from '../../data/gameData';
import { GameCard } from '../game/GameCard';
import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, Filter, Store } from 'lucide-react';

interface StoreCatalogViewProps {
  currency: CurrencyCode;
  onPlayWithItem?: (item: StoreItem) => void;
}

export const StoreCatalogView: React.FC<StoreCatalogViewProps> = ({
  currency,
  onPlayWithItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');

  const categories: Array<{ id: ItemCategory | 'all'; label: string; emoji: string }> = [
    { id: 'all', label: 'All Items', emoji: '🛍️' },
    { id: 'fruits', label: 'Fresh Market', emoji: '🍎' },
    { id: 'bakery', label: 'Sweet Bakery', emoji: '🧁' },
    { id: 'toys', label: 'Toy Shop', emoji: '🧸' },
    { id: 'stationery', label: 'School Art', emoji: '🎨' },
    { id: 'clothes', label: 'Fashion & Wear', emoji: '🧢' },
  ];

  const scaledItems = STORE_ITEMS.map(item => ({
    ...item,
    price: scaleItemPrice(item.price, currency),
  }));

  const filteredItems = scaledItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-emerald-300/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-100 font-kid text-xs font-bold uppercase tracking-wider">
              <Store className="w-4 h-4" />
              <span>Full Store Inventory Catalog</span>
            </div>
            <h2 className="font-kid font-bold text-2xl md:text-3xl text-white mt-1">
              Store Shelf Items & Price Catalog
            </h2>
            <p className="font-kid text-sm text-emerald-100 mt-1 max-w-xl">
              Explore all goods available for children to match and purchase. Prices dynamically convert to {currency}.
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 font-kid text-center">
            <span className="text-xs text-emerald-100 block">Total Catalog Items</span>
            <span className="text-2xl font-bold text-white">{STORE_ITEMS.length} Items</span>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl font-kid font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className="flex justify-center">
            <GameCard
              item={item}
              currency={currency}
              size="sm"
              showPrice={true}
              onClick={() => onPlayWithItem?.(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
