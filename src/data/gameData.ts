import {
  CurrencyCode,
  CurrencyConfig,
  MoneyDenomination,
  Badge,
  ArcadeItem,
  FrequencyChallenge,
  PurchasingChallenge,
  StoreItem,
  DifficultyLevel,
  MathSkill,
} from '../types';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    isDecimal: false,
    denominations: [
      { id: 'inr_coin_1', type: 'coin', value: 1, label: '₹1 Coin', shortLabel: '₹1', color: 'bg-slate-200 text-slate-900 border-slate-400', textColor: 'text-slate-900', borderColor: 'border-slate-400', size: 'sm' },
      { id: 'inr_coin_2', type: 'coin', value: 2, label: '₹2 Coin', shortLabel: '₹2', color: 'bg-slate-300 text-slate-900 border-slate-400', textColor: 'text-slate-900', borderColor: 'border-slate-400', size: 'md' },
      { id: 'inr_coin_5', type: 'coin', value: 5, label: '₹5 Coin', shortLabel: '₹5', color: 'bg-amber-300 text-amber-950 border-amber-500', textColor: 'text-amber-950', borderColor: 'border-amber-500', size: 'lg' },
      { id: 'inr_coin_10', type: 'coin', value: 10, label: '₹10 Coin', shortLabel: '₹10', color: 'bg-gradient-to-r from-amber-200 to-slate-200 text-slate-950 border-amber-600', textColor: 'text-slate-950', borderColor: 'border-amber-600', size: 'xl' },
      { id: 'inr_bill_10', type: 'bill', value: 10, label: '₹10 Note', shortLabel: '₹10', color: 'bg-amber-800 text-amber-50 border-amber-950', textColor: 'text-amber-50', borderColor: 'border-amber-950' },
      { id: 'inr_bill_20', type: 'bill', value: 20, label: '₹20 Note', shortLabel: '₹20', color: 'bg-lime-300 text-lime-950 border-lime-600', textColor: 'text-lime-950', borderColor: 'border-lime-600' },
      { id: 'inr_bill_50', type: 'bill', value: 50, label: '₹50 Note', shortLabel: '₹50', color: 'bg-cyan-300 text-cyan-950 border-cyan-600', textColor: 'text-cyan-950', borderColor: 'border-cyan-600' },
      { id: 'inr_bill_100', type: 'bill', value: 100, label: '₹100 Note', shortLabel: '₹100', color: 'bg-purple-300 text-purple-950 border-purple-600', textColor: 'text-purple-950', borderColor: 'border-purple-600' },
      { id: 'inr_bill_200', type: 'bill', value: 200, label: '₹200 Note', shortLabel: '₹200', color: 'bg-orange-400 text-orange-950 border-orange-700', textColor: 'text-orange-950', borderColor: 'border-orange-700' },
      { id: 'inr_bill_500', type: 'bill', value: 500, label: '₹500 Note', shortLabel: '₹500', color: 'bg-stone-300 text-stone-900 border-stone-500', textColor: 'text-stone-900', borderColor: 'border-stone-500' },
    ]
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    isDecimal: true,
    denominations: [
      { id: 'usd_coin_1', type: 'coin', value: 0.01, label: '1¢', shortLabel: '1¢', color: 'bg-amber-700 text-amber-100 border-amber-900', textColor: 'text-amber-100', borderColor: 'border-amber-900', size: 'sm' },
      { id: 'usd_coin_5', type: 'coin', value: 0.05, label: '5¢', shortLabel: '5¢', color: 'bg-slate-300 text-slate-800 border-slate-400', textColor: 'text-slate-800', borderColor: 'border-slate-400', size: 'sm' },
      { id: 'usd_coin_10', type: 'coin', value: 0.10, label: '10¢', shortLabel: '10¢', color: 'bg-slate-200 text-slate-800 border-slate-300', textColor: 'text-slate-800', borderColor: 'border-slate-300', size: 'sm' },
      { id: 'usd_coin_25', type: 'coin', value: 0.25, label: '25¢', shortLabel: '25¢', color: 'bg-slate-300 text-slate-900 border-slate-400', textColor: 'text-slate-900', borderColor: 'border-slate-400', size: 'md' },
      { id: 'usd_coin_100', type: 'coin', value: 1.00, label: '$1 Coin', shortLabel: '$1', color: 'bg-yellow-400 text-yellow-950 border-yellow-600', textColor: 'text-yellow-950', borderColor: 'border-yellow-600', size: 'lg' },
      { id: 'usd_bill_1', type: 'bill', value: 1.00, label: '$1 Bill', shortLabel: '$1', color: 'bg-emerald-100 text-emerald-900 border-emerald-500', textColor: 'text-emerald-900', borderColor: 'border-emerald-500' },
      { id: 'usd_bill_5', type: 'bill', value: 5.00, label: '$5 Bill', shortLabel: '$5', color: 'bg-emerald-200 text-emerald-950 border-emerald-600', textColor: 'text-emerald-950', borderColor: 'border-emerald-600' },
      { id: 'usd_bill_10', type: 'bill', value: 10.00, label: '$10 Bill', shortLabel: '$10', color: 'bg-teal-100 text-teal-950 border-teal-600', textColor: 'text-teal-950', borderColor: 'border-teal-600' },
      { id: 'usd_bill_20', type: 'bill', value: 20.00, label: '$20 Bill', shortLabel: '$20', color: 'bg-green-200 text-green-950 border-green-700', textColor: 'text-green-950', borderColor: 'border-green-700' },
    ]
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    isDecimal: true,
    denominations: [
      { id: 'eur_coin_5c', type: 'coin', value: 0.05, label: '5c', shortLabel: '5c', color: 'bg-amber-600 text-amber-100 border-amber-800', textColor: 'text-amber-100', borderColor: 'border-amber-800', size: 'sm' },
      { id: 'eur_coin_10c', type: 'coin', value: 0.10, label: '10c', shortLabel: '10c', color: 'bg-yellow-500 text-yellow-950 border-yellow-600', textColor: 'text-yellow-950', borderColor: 'border-yellow-600', size: 'sm' },
      { id: 'eur_coin_20c', type: 'coin', value: 0.20, label: '20c', shortLabel: '20c', color: 'bg-yellow-500 text-yellow-950 border-yellow-600', textColor: 'text-yellow-950', borderColor: 'border-yellow-600', size: 'md' },
      { id: 'eur_coin_50c', type: 'coin', value: 0.50, label: '50c', shortLabel: '50c', color: 'bg-yellow-400 text-yellow-950 border-yellow-600', textColor: 'text-yellow-950', borderColor: 'border-yellow-600', size: 'md' },
      { id: 'eur_coin_1', type: 'coin', value: 1.00, label: '€1', shortLabel: '€1', color: 'bg-amber-200 text-amber-950 border-amber-500', textColor: 'text-amber-950', borderColor: 'border-amber-500', size: 'lg' },
      { id: 'eur_coin_2', type: 'coin', value: 2.00, label: '€2', shortLabel: '€2', color: 'bg-amber-300 text-amber-950 border-amber-600', textColor: 'text-amber-950', borderColor: 'border-amber-600', size: 'xl' },
      { id: 'eur_bill_5', type: 'bill', value: 5.00, label: '€5 Bill', shortLabel: '€5', color: 'bg-slate-200 text-slate-900 border-slate-500', textColor: 'text-slate-900', borderColor: 'border-slate-500' },
      { id: 'eur_bill_10', type: 'bill', value: 10.00, label: '€10 Bill', shortLabel: '€10', color: 'bg-rose-200 text-rose-950 border-rose-600', textColor: 'text-rose-950', borderColor: 'border-rose-600' },
      { id: 'eur_bill_20', type: 'bill', value: 20.00, label: '€20 Bill', shortLabel: '€20', color: 'bg-sky-200 text-sky-950 border-sky-600', textColor: 'text-sky-950', borderColor: 'border-sky-600' },
    ]
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    isDecimal: true,
    denominations: [
      { id: 'gbp_coin_5p', type: 'coin', value: 0.05, label: '5p', shortLabel: '5p', color: 'bg-slate-200 text-slate-800 border-slate-400', textColor: 'text-slate-800', borderColor: 'border-slate-400', size: 'sm' },
      { id: 'gbp_coin_10p', type: 'coin', value: 0.10, label: '10p', shortLabel: '10p', color: 'bg-slate-300 text-slate-900 border-slate-500', textColor: 'text-slate-900', borderColor: 'border-slate-500', size: 'sm' },
      { id: 'gbp_coin_20p', type: 'coin', value: 0.20, label: '20p', shortLabel: '20p', color: 'bg-slate-200 text-slate-800 border-slate-400', textColor: 'text-slate-800', borderColor: 'border-slate-400', size: 'md' },
      { id: 'gbp_coin_50p', type: 'coin', value: 0.50, label: '50p', shortLabel: '50p', color: 'bg-slate-300 text-slate-900 border-slate-500', textColor: 'text-slate-900', borderColor: 'border-slate-500', size: 'md' },
      { id: 'gbp_coin_1', type: 'coin', value: 1.00, label: '£1', shortLabel: '£1', color: 'bg-yellow-400 text-yellow-950 border-yellow-600', textColor: 'text-yellow-950', borderColor: 'border-yellow-600', size: 'lg' },
      { id: 'gbp_coin_2', type: 'coin', value: 2.00, label: '£2', shortLabel: '£2', color: 'bg-amber-300 text-amber-950 border-amber-600', textColor: 'text-amber-950', borderColor: 'border-amber-600', size: 'xl' },
      { id: 'gbp_bill_5', type: 'bill', value: 5.00, label: '£5 Note', shortLabel: '£5', color: 'bg-teal-200 text-teal-950 border-teal-600', textColor: 'text-teal-950', borderColor: 'border-teal-600' },
      { id: 'gbp_bill_10', type: 'bill', value: 10.00, label: '£10 Note', shortLabel: '£10', color: 'bg-orange-200 text-orange-950 border-orange-600', textColor: 'text-orange-950', borderColor: 'border-orange-600' },
      { id: 'gbp_bill_20', type: 'bill', value: 20.00, label: '£20 Note', shortLabel: '£20', color: 'bg-purple-200 text-purple-950 border-purple-600', textColor: 'text-purple-950', borderColor: 'border-purple-600' },
    ]
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    isDecimal: true,
    denominations: [
      { id: 'cad_coin_5c', type: 'coin', value: 0.05, label: '5¢', shortLabel: '5¢', color: 'bg-slate-300 text-slate-800 border-slate-400', textColor: 'text-slate-800', borderColor: 'border-slate-400', size: 'sm' },
      { id: 'cad_coin_10c', type: 'coin', value: 0.10, label: '10¢', shortLabel: '10¢', color: 'bg-slate-200 text-slate-800 border-slate-300', textColor: 'text-slate-800', borderColor: 'border-slate-300', size: 'sm' },
      { id: 'cad_coin_25c', type: 'coin', value: 0.25, label: '25¢', shortLabel: '25¢', color: 'bg-slate-300 text-slate-900 border-slate-400', textColor: 'text-slate-900', borderColor: 'border-slate-400', size: 'md' },
      { id: 'cad_coin_1', type: 'coin', value: 1.00, label: 'Loonie ($1)', shortLabel: '$1', color: 'bg-yellow-400 text-yellow-950 border-yellow-600', textColor: 'text-yellow-950', borderColor: 'border-yellow-600', size: 'lg' },
      { id: 'cad_bill_5', type: 'bill', value: 5.00, label: '$5 Bill', shortLabel: '$5', color: 'bg-blue-200 text-blue-950 border-blue-600', textColor: 'text-blue-950', borderColor: 'border-blue-600' },
    ]
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    isDecimal: true,
    denominations: [
      { id: 'aud_coin_1', type: 'coin', value: 1.00, label: '$1 Coin', shortLabel: '$1', color: 'bg-yellow-400 text-yellow-950 border-yellow-600', textColor: 'text-yellow-950', borderColor: 'border-yellow-600', size: 'lg' },
      { id: 'aud_bill_5', type: 'bill', value: 5.00, label: '$5 Note', shortLabel: '$5', color: 'bg-purple-200 text-purple-950 border-purple-600', textColor: 'text-purple-950', borderColor: 'border-purple-600' },
    ]
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    isDecimal: false,
    denominations: [
      { id: 'jpy_coin_10', type: 'coin', value: 10, label: '¥10', shortLabel: '¥10', color: 'bg-amber-600 text-amber-100 border-amber-800', textColor: 'text-amber-100', borderColor: 'border-amber-800', size: 'md' },
      { id: 'jpy_coin_100', type: 'coin', value: 100, label: '¥100', shortLabel: '¥100', color: 'bg-slate-300 text-slate-900 border-slate-500', textColor: 'text-slate-900', borderColor: 'border-slate-500', size: 'lg' },
      { id: 'jpy_bill_1000', type: 'bill', value: 1000, label: '¥1,000', shortLabel: '¥1000', color: 'bg-blue-100 text-blue-950 border-blue-500', textColor: 'text-blue-950', borderColor: 'border-blue-500' },
    ]
  }
};

export const STORE_ITEMS: StoreItem[] = [
  { id: 'item_apple', name: 'Crispy Red Apple', category: 'fruits', price: 1.00, emoji: '🍎', tagline: 'Fresh & crunchy sweet orchard apple', difficultyRecommended: 'starter' },
  { id: 'item_banana', name: 'Golden Banana Bunch', category: 'fruits', price: 0.75, emoji: '🍌', tagline: 'Energy-packed potassium fruit bundle', difficultyRecommended: 'starter' },
  { id: 'item_cookie', name: 'Choco Chip Cookie', category: 'bakery', price: 0.50, emoji: '🍪', tagline: 'Baked fresh with real cocoa chunks', difficultyRecommended: 'starter' },
  { id: 'item_milk', name: 'Creamy Milk Bottle', category: 'groceries', price: 2.00, emoji: '🥛', tagline: 'Nutritious wholesome farm fresh dairy', difficultyRecommended: 'starter' },
  { id: 'item_donut', name: 'Rainbow Sprinkle Donut', category: 'bakery', price: 1.50, emoji: '🍩', tagline: 'Glazed pink with colorful candy sprinkles', difficultyRecommended: 'junior' },
  { id: 'item_juice', name: 'Orange Sunrise Juice', category: 'dining', price: 2.25, emoji: '🧃', tagline: 'Cold pressed 100% natural vitamin C juice', difficultyRecommended: 'junior' },
  { id: 'item_pencil', name: 'Starlight Color Pencils', category: 'stationery', price: 3.50, emoji: '✏️', tagline: '12-pack premium sketch artist pencils', difficultyRecommended: 'junior' },
  { id: 'item_bear', name: 'Cuddly Teddy Bear', category: 'toys', price: 5.00, emoji: '🧸', tagline: 'Super soft plush friend with bow tie', difficultyRecommended: 'junior' },
  { id: 'item_robot', name: 'Sci-Fi Toy Robot', category: 'toys', price: 7.50, emoji: '🤖', tagline: 'Walking robotic hero with glowing visor', difficultyRecommended: 'master' },
  { id: 'item_book_space', name: 'Solar Space Encyclopedia', category: 'education', price: 6.00, emoji: '🚀', tagline: 'Fascinating space exploration picture book', difficultyRecommended: 'master' },
  { id: 'item_backpack', name: 'Explorer School Backpack', category: 'clothes', price: 12.00, emoji: '🎒', tagline: 'Durable multi-pocket water resistant bag', difficultyRecommended: 'master' },
  { id: 'item_cap', name: 'Sunbeam Snapback Cap', category: 'clothes', price: 4.50, emoji: '🧢', tagline: 'Trendy sporty baseball cap for sunny days', difficultyRecommended: 'junior' },
];

export const ARCADE_ITEMS: ArcadeItem[] = [
  {
    id: 'item_haircut',
    name: 'Haircut & Styling',
    category: 'grooming',
    basePriceINR: 250,
    basePriceUSD: 30,
    iconKey: 'scissors',
    tagline: 'Salon & Barber Fresh Trim',
  },
  {
    id: 'item_theater',
    name: 'Movie Cinema Ticket',
    category: 'entertainment',
    basePriceINR: 300,
    basePriceUSD: 15,
    iconKey: 'mask',
    tagline: 'Popcorn & Blockbuster Show',
  },
  {
    id: 'item_sneakers',
    name: 'Running Sport Shoes',
    category: 'footwear',
    basePriceINR: 2400,
    basePriceUSD: 60,
    iconKey: 'sneaker',
    tagline: 'Athletic Sneakers & Comfort',
  },
  {
    id: 'item_shirt',
    name: 'Designer Casual Shirt',
    category: 'apparel',
    basePriceINR: 800,
    basePriceUSD: 35,
    iconKey: 'shirt',
    tagline: 'Cotton Wear & Style',
  },
  {
    id: 'item_coffee',
    name: 'Artisan Cafe Latte / Chai',
    category: 'dining',
    basePriceINR: 120,
    basePriceUSD: 5,
    iconKey: 'coffee',
    tagline: 'Fresh Brew & Warm Froth',
  },
  {
    id: 'item_gym',
    name: 'Fitness Gym Pass',
    category: 'fitness',
    basePriceINR: 1500,
    basePriceUSD: 45,
    iconKey: 'dumbbell',
    tagline: 'Strength & Cardio Workout',
  },
  {
    id: 'item_streaming',
    name: 'Streaming Video OTT',
    category: 'entertainment',
    basePriceINR: 299,
    basePriceUSD: 12,
    iconKey: 'screen',
    tagline: 'Unlimited Shows & Movies',
  },
  {
    id: 'item_groceries',
    name: 'Fresh Market Basket',
    category: 'groceries',
    basePriceINR: 1200,
    basePriceUSD: 50,
    iconKey: 'cart',
    tagline: 'Veggies, Fruits & Dairy',
  },
  {
    id: 'item_phone',
    name: '5G Data & Mobile Plan',
    category: 'tech',
    basePriceINR: 399,
    basePriceUSD: 25,
    iconKey: 'phone',
    tagline: 'High Speed Unlimited Calling',
  },
  {
    id: 'item_pizza',
    name: 'Cheesy Gourmet Pizza',
    category: 'dining',
    basePriceINR: 450,
    basePriceUSD: 18,
    iconKey: 'pizza',
    tagline: 'Woodfire Crust & Herbs',
  },
  {
    id: 'item_book',
    name: 'Skill & Math Books',
    category: 'education',
    basePriceINR: 350,
    basePriceUSD: 20,
    iconKey: 'book',
    tagline: 'Knowledge & Learning Guide',
  },
  {
    id: 'item_bus',
    name: 'City Metro Transit Pass',
    category: 'transport',
    basePriceINR: 600,
    basePriceUSD: 30,
    iconKey: 'bus',
    tagline: 'Commute & Travel Pass',
  },
];

export const BADGES: Badge[] = [
  { id: 'badge_first_match', title: 'First Purchase', description: 'Matched your very first item correctly!', emoji: '🛍️', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'badge_coin_master', title: 'Money Master', description: 'Matched 5 money problems with 100% accuracy', emoji: '🪙', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'badge_speedy_shopper', title: 'Lightning Fast', description: 'Completed a calculation in under 4 seconds', emoji: '⚡', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'badge_streak_5', title: 'Arcade Streak', description: 'Got 5 perfect purchase matches in a row!', emoji: '🔥', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'badge_change_wizard', title: 'Budget Prodigy', description: 'Calculated exact annual spend effortlessly', emoji: '🧮', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
];

export function scaleItemPrice(baseUsdPrice: number, currency: CurrencyCode): number {
  if (currency === 'INR') {
    if (baseUsdPrice <= 1) return 10;
    if (baseUsdPrice <= 2) return 20;
    if (baseUsdPrice <= 4) return 50;
    if (baseUsdPrice <= 7) return 100;
    return 200;
  }
  if (currency === 'JPY') return Math.round(baseUsdPrice * 140);
  return baseUsdPrice;
}

export function formatMoney(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.INR;
  const num = Math.round(amount * 100) / 100;
  
  if (currencyCode === 'INR') {
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  }

  if (config.isDecimal) {
    if (Number.isInteger(num)) {
      return `${config.symbol}${num}`;
    }
    return `${config.symbol}${num.toFixed(2)}`;
  } else {
    return `${config.symbol}${Math.round(num).toLocaleString()}`;
  }
}

export function getItemBasePrice(item: ArcadeItem, currency: CurrencyCode): number {
  if (currency === 'INR') return item.basePriceINR;
  if (currency === 'JPY') return item.basePriceUSD * 140;
  if (currency === 'EUR') return Math.round(item.basePriceUSD * 0.92);
  if (currency === 'GBP') return Math.round(item.basePriceUSD * 0.78);
  if (currency === 'CAD') return Math.round(item.basePriceUSD * 1.35);
  if (currency === 'AUD') return Math.round(item.basePriceUSD * 1.5);
  return item.basePriceUSD;
}

export function generateFrequencyChallenge(
  item: ArcadeItem,
  currency: CurrencyCode,
  difficulty: 'starter' | 'junior' | 'master'
): FrequencyChallenge {
  const basePrice = getItemBasePrice(item, currency);

  const templates = [
    { multiplier: 1, multiplierLabel: '1x', frequencyUnit: 'year' as const, frequencyLabel: 'A YEAR', targetPeriod: 'annually' as const, targetPeriodLabel: 'IS ANNUALLY:', factor: 1 },
    { multiplier: 2, multiplierLabel: '2x', frequencyUnit: 'month' as const, frequencyLabel: 'A MONTH', targetPeriod: 'annually' as const, targetPeriodLabel: 'IS ANNUALLY:', factor: 24 },
    { multiplier: 1, multiplierLabel: '1x', frequencyUnit: 'month' as const, frequencyLabel: 'A MONTH', targetPeriod: 'annually' as const, targetPeriodLabel: 'IS ANNUALLY:', factor: 12 },
    { multiplier: 1, multiplierLabel: '1x', frequencyUnit: 'week' as const, frequencyLabel: 'A WEEK', targetPeriod: 'monthly' as const, targetPeriodLabel: 'IS MONTHLY (4 WKS):', factor: 4 },
    { multiplier: 2, multiplierLabel: '2x', frequencyUnit: 'year' as const, frequencyLabel: 'A YEAR', targetPeriod: 'annually' as const, targetPeriodLabel: 'IS ANNUALLY:', factor: 2 },
    { multiplier: 4, multiplierLabel: '4x', frequencyUnit: 'year' as const, frequencyLabel: 'A YEAR', targetPeriod: 'annually' as const, targetPeriodLabel: 'IS ANNUALLY:', factor: 4 },
  ];

  let eligible = templates;
  if (difficulty === 'starter') {
    eligible = [templates[0], templates[4], templates[5]];
  } else if (difficulty === 'junior') {
    eligible = [templates[0], templates[2], templates[3], templates[4]];
  }

  const chosen = eligible[Math.floor(Math.random() * eligible.length)];
  const correct = basePrice * chosen.factor;

  const distractors = new Set<number>();
  if (correct !== basePrice) distractors.add(basePrice);
  else distractors.add(Math.round(basePrice * 2));

  const d2 = Math.max(1, basePrice * (chosen.factor > 1 ? chosen.factor - 1 : chosen.factor + 1));
  if (d2 !== correct) distractors.add(d2);

  const d3 = Math.round(correct * 1.2);
  if (d3 !== correct) distractors.add(d3);

  const d4 = Math.round(correct * 0.8);
  if (d4 !== correct && d4 > 0) distractors.add(d4);

  let offsetMultiplier = 1.5;
  while (distractors.size < 3) {
    const generated = Math.round(correct * offsetMultiplier);
    if (generated !== correct) distractors.add(generated);
    offsetMultiplier += 0.5;
  }

  const options = Array.from(distractors).slice(0, 3);
  options.push(correct);

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    id: `chal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    item,
    basePrice,
    multiplier: chosen.multiplier,
    multiplierLabel: chosen.multiplierLabel,
    frequencyUnit: chosen.frequencyUnit,
    frequencyLabel: chosen.frequencyLabel,
    targetPeriod: chosen.targetPeriod,
    targetPeriodLabel: chosen.targetPeriodLabel,
    correctAnswer: correct,
    options,
    mathSkill: 'annual_frequency_calc',
  };
}

export interface ScenarioDefinition {
  type: PurchasingChallenge['scenarioType'];
  categoryBadge: string;
  generate: (item: StoreItem, currency: CurrencyCode, difficulty: DifficultyLevel) => {
    questionText: string;
    formulaHint: string;
    basePrice: number;
    secondaryAmount?: number;
    correctAnswer: number;
    explanation: string;
    mathSkill: MathSkill;
  };
}

export function generateSmartPurchasingChallenge(
  item: StoreItem,
  currency: CurrencyCode,
  difficulty: DifficultyLevel,
  scenarioIndex?: number
): PurchasingChallenge {
  const scaledPrice = scaleItemPrice(item.price, currency);

  const scenarioPool: ScenarioDefinition[] = [
    // 1. Quantity Multiplication
    {
      type: 'quantity_multiplication',
      categoryBadge: 'Quantity Purchase 📦',
      generate: (it, curr, diff) => {
        const qty = diff === 'starter' ? (Math.random() > 0.5 ? 2 : 3) : (Math.floor(Math.random() * 4) + 3);
        const total = scaledPrice * qty;
        return {
          questionText: `You want to buy ${qty} ${it.name}s at ${formatMoney(scaledPrice, curr)} each. What is the total price?`,
          formulaHint: `${qty} × ${formatMoney(scaledPrice, curr)} = ?`,
          basePrice: scaledPrice,
          secondaryAmount: qty,
          correctAnswer: total,
          explanation: `${qty} items × ${formatMoney(scaledPrice, curr)} = ${formatMoney(total, curr)}`,
          mathSkill: 'multiplication_budget',
        };
      }
    },
    // 2. Cashier Change Math
    {
      type: 'cashier_change',
      categoryBadge: 'Cashier Change 💵',
      generate: (it, curr, diff) => {
        let billGiven = 100;
        if (curr === 'INR') {
          if (scaledPrice <= 20) billGiven = 50;
          else if (scaledPrice <= 50) billGiven = 100;
          else if (scaledPrice <= 100) billGiven = 200;
          else billGiven = 500;
        } else {
          if (scaledPrice <= 2) billGiven = 5;
          else if (scaledPrice <= 5) billGiven = 10;
          else billGiven = 20;
        }
        const change = billGiven - scaledPrice;
        return {
          questionText: `You buy a ${it.name} for ${formatMoney(scaledPrice, curr)} and give the cashier ${formatMoney(billGiven, curr)}. How much change should you get back?`,
          formulaHint: `${formatMoney(billGiven, curr)} - ${formatMoney(scaledPrice, curr)} = ?`,
          basePrice: scaledPrice,
          secondaryAmount: billGiven,
          correctAnswer: change,
          explanation: `Paid ${formatMoney(billGiven, curr)} - Cost ${formatMoney(scaledPrice, curr)} = ${formatMoney(change, curr)} change`,
          mathSkill: 'subtraction_change',
        };
      }
    },
    // 3. Combo Snack Deal
    {
      type: 'combo_addition',
      categoryBadge: 'Combo Basket 🛒',
      generate: (it, curr, diff) => {
        const extraAdd = curr === 'INR' ? (diff === 'starter' ? 20 : 50) : (diff === 'starter' ? 2 : 5);
        const comboTotal = scaledPrice + extraAdd;
        return {
          questionText: `You buy a ${it.name} (${formatMoney(scaledPrice, curr)}) plus a healthy drink pack (${formatMoney(extraAdd, curr)}). How much is the total combo?`,
          formulaHint: `${formatMoney(scaledPrice, curr)} + ${formatMoney(extraAdd, curr)} = ?`,
          basePrice: scaledPrice,
          secondaryAmount: extraAdd,
          correctAnswer: comboTotal,
          explanation: `${formatMoney(scaledPrice, curr)} + ${formatMoney(extraAdd, curr)} = ${formatMoney(comboTotal, curr)} total`,
          mathSkill: 'addition',
        };
      }
    },
    // 4. Weekly Snack Allowance
    {
      type: 'weekly_frequency',
      categoryBadge: 'Weekly School Plan 📅',
      generate: (it, curr, diff) => {
        const days = 5;
        const total = scaledPrice * days;
        return {
          questionText: `If you have 1 ${it.name} each school day for 5 days at ${formatMoney(scaledPrice, curr)} per day, how much do you spend in a school week?`,
          formulaHint: `5 days × ${formatMoney(scaledPrice, curr)} = ?`,
          basePrice: scaledPrice,
          secondaryAmount: days,
          correctAnswer: total,
          explanation: `5 days × ${formatMoney(scaledPrice, curr)} = ${formatMoney(total, curr)} per week`,
          mathSkill: 'annual_frequency_calc',
        };
      }
    },
    // 5. Discount Deal Coupon
    {
      type: 'discount_deal',
      categoryBadge: 'Discount Deal 🏷️',
      generate: (it, curr, diff) => {
        let discount = curr === 'INR' ? (scaledPrice >= 100 ? 30 : 10) : (scaledPrice >= 5 ? 2 : 1);
        if (discount >= scaledPrice) discount = Math.max(1, Math.floor(scaledPrice / 2));
        const finalPrice = scaledPrice - discount;
        return {
          questionText: `The ${it.name} is priced at ${formatMoney(scaledPrice, curr)}, but you have a special ${formatMoney(discount, curr)} discount coupon! What is the final price?`,
          formulaHint: `${formatMoney(scaledPrice, curr)} - ${formatMoney(discount, curr)} = ?`,
          basePrice: scaledPrice,
          secondaryAmount: discount,
          correctAnswer: finalPrice,
          explanation: `Original ${formatMoney(scaledPrice, curr)} - ${formatMoney(discount, curr)} coupon = ${formatMoney(finalPrice, curr)}`,
          mathSkill: 'subtraction_change',
        };
      }
    },
    // 6. Allowance / Budget Leftover
    {
      type: 'budget_leftover',
      categoryBadge: 'Pocket Money Budget 👛',
      generate: (it, curr, diff) => {
        const pocketMoney = curr === 'INR' ? (scaledPrice + 50) : (scaledPrice + 5);
        const leftover = pocketMoney - scaledPrice;
        return {
          questionText: `You have ${formatMoney(pocketMoney, curr)} in your pocket wallet. After buying the ${it.name} for ${formatMoney(scaledPrice, curr)}, how much money is left?`,
          formulaHint: `${formatMoney(pocketMoney, curr)} - ${formatMoney(scaledPrice, curr)} = ?`,
          basePrice: scaledPrice,
          secondaryAmount: pocketMoney,
          correctAnswer: leftover,
          explanation: `Wallet ${formatMoney(pocketMoney, curr)} - Item ${formatMoney(scaledPrice, curr)} = ${formatMoney(leftover, curr)} left`,
          mathSkill: 'budgeting',
        };
      }
    }
  ];

  const chosenScenario = scenarioIndex !== undefined 
    ? scenarioPool[scenarioIndex % scenarioPool.length]
    : scenarioPool[Math.floor(Math.random() * scenarioPool.length)];

  const data = chosenScenario.generate(item, currency, difficulty);

  // Generate 3 clever distractors
  const distractors = new Set<number>();
  const correct = data.correctAnswer;

  const d1 = correct + (currency === 'INR' ? 10 : 1);
  if (d1 !== correct && d1 > 0) distractors.add(d1);

  const d2 = correct - (currency === 'INR' ? 10 : 1);
  if (d2 !== correct && d2 > 0) distractors.add(d2);

  const d3 = Math.round(correct * 1.5);
  if (d3 !== correct && d3 > 0) distractors.add(d3);

  const d4 = Math.max(1, Math.round(correct * 0.5));
  if (d4 !== correct && d4 > 0) distractors.add(d4);

  let offset = 2;
  while (distractors.size < 3) {
    const gen = correct + (currency === 'INR' ? offset * 20 : offset);
    if (gen !== correct && gen > 0) distractors.add(gen);
    offset++;
  }

  const options = Array.from(distractors).slice(0, 3);
  options.push(correct);

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    id: `purch_chal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    scenarioType: chosenScenario.type,
    categoryBadge: chosenScenario.categoryBadge,
    itemEmoji: item.emoji,
    itemName: item.name,
    itemCategory: item.category,
    questionText: data.questionText,
    formulaHint: data.formulaHint,
    basePrice: data.basePrice,
    secondaryAmount: data.secondaryAmount,
    correctAnswer: correct,
    options,
    mathSkill: data.mathSkill,
    explanation: data.explanation,
  };
}
