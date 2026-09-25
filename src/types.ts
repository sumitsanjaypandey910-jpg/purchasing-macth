export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  denominations: MoneyDenomination[];
  isDecimal: boolean;
}

export interface MoneyDenomination {
  id: string;
  type: 'coin' | 'bill';
  value: number;
  label: string;
  shortLabel: string;
  color: string;
  textColor: string;
  borderColor: string;
  iconName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export type ItemCategory = 
  | 'grooming' 
  | 'entertainment' 
  | 'footwear' 
  | 'apparel' 
  | 'dining' 
  | 'fitness' 
  | 'tech' 
  | 'groceries' 
  | 'education' 
  | 'transport'
  | 'fruits'
  | 'bakery'
  | 'toys'
  | 'stationery'
  | 'clothes';

export interface StoreItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  emoji: string;
  tagline: string;
  difficultyRecommended?: 'starter' | 'junior' | 'master';
}

export interface ArcadeItem {
  id: string;
  name: string;
  category: ItemCategory;
  basePriceINR: number;
  basePriceUSD: number;
  iconKey: 'scissors' | 'mask' | 'sneaker' | 'shirt' | 'coffee' | 'dumbbell' | 'screen' | 'cart' | 'phone' | 'book' | 'pizza' | 'bus';
  tagline: string;
}

export interface PurchasingChallenge {
  id: string;
  scenarioType: 
    | 'quantity_multiplication'
    | 'cashier_change'
    | 'combo_addition'
    | 'weekly_frequency'
    | 'discount_deal'
    | 'budget_leftover';
  categoryBadge: string;
  itemEmoji: string;
  itemName: string;
  itemCategory: ItemCategory;
  questionText: string;
  formulaHint: string;
  basePrice: number;
  secondaryAmount?: number;
  correctAnswer: number;
  options: number[];
  mathSkill: MathSkill;
  explanation: string;
}

export type FrequencyUnit = 'day' | 'week' | 'month' | 'year' | 'quarter';

export interface FrequencyChallenge {
  id: string;
  item: ArcadeItem;
  basePrice: number;
  multiplier: number;
  multiplierLabel: string;
  frequencyUnit: FrequencyUnit;
  frequencyLabel: string;
  targetPeriod: 'annually' | 'monthly' | 'weekly' | 'daily';
  targetPeriodLabel: string;
  correctAnswer: number;
  options: number[];
  mathSkill: MathSkill;
}

export type GameMode = 
  | 'frequency-annual-match'
  | 'item-price-match'
  | 'basket-sum-match'
  | 'cashier-change-match'
  | 'budget-shopper';

export type DifficultyLevel = 'starter' | 'junior' | 'master';

export type GameTheme = 'neon-arcade' | 'sunny' | 'candyland' | 'space' | 'safari' | 'ocean';

export type MathSkill = 
  | 'annual_frequency_calc'
  | 'multiplication_budget'
  | 'coin_recognition'
  | 'addition'
  | 'subtraction_change'
  | 'budgeting'
  | 'value_estimation';

export interface GameScoreEvent {
  id: string;
  eventType: 
    | 'ITEM_MATCHED' 
    | 'LEVEL_COMPLETED' 
    | 'STREAK_BONUS' 
    | 'ERROR_ATTEMPT' 
    | 'GAME_SESSION_END' 
    | 'BADGE_UNLOCKED'
    | 'CHANGE_RETURNED';
  childId: string;
  childName: string;
  timestamp: number;
  pointsEarned: number;
  totalScore: number;
  currentStreak: number;
  highestStreak: number;
  accuracy: number;
  mathSkill: MathSkill;
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  details?: {
    itemName?: string;
    itemPrice?: number;
    userPaid?: number;
    correctAmount?: number;
    timeTakenSeconds?: number;
    badgeName?: string;
    level?: number;
    challengeType?: string;
  };
}

export interface GameSessionSummary {
  sessionId: string;
  childId: string;
  childName: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  totalScore: number;
  starsEarned: number;
  roundsPlayed: number;
  roundsWon: number;
  accuracyPercentage: number;
  longestStreak: number;
  badgesUnlocked: string[];
  skillsBreakdown: Record<string, { attempts: number; successes: number; accuracy: number }>;
  itemsPurchased: Array<{ itemName: string; price: number; category: string }>;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  unlockedAt?: number;
}

export interface PurchasingMatchGameProps {
  childId?: string;
  childName?: string;
  currency?: CurrencyCode;
  difficulty?: DifficultyLevel;
  gameMode?: GameMode;
  theme?: GameTheme;
  soundEnabled?: boolean;
  maxRounds?: number;
  targetScore?: number;
  embedded?: boolean;
  onScoreUpdate?: (event: GameScoreEvent) => void;
  onGameComplete?: (summary: GameSessionSummary) => void;
  onItemPurchased?: (item: any, pointsEarned: number) => void;
  onSkillProgress?: (skill: MathSkill, accuracy: number) => void;
  onEventLog?: (event: GameScoreEvent) => void;
  broadcastPostMessage?: boolean;
  onBackToMenu?: () => void;
}
