import React from 'react';
import { ArcadeItem } from '../../types';
import {
  Scissors,
  Clapperboard,
  Footprints,
  Shirt,
  Coffee,
  Dumbbell,
  Tv,
  ShoppingCart,
  Smartphone,
  BookOpen,
  Pizza,
  Bus,
  Sparkles,
} from 'lucide-react';

interface ArcadeVectorIconProps {
  iconKey: ArcadeItem['iconKey'];
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ArcadeVectorIcon: React.FC<ArcadeVectorIconProps> = ({
  iconKey,
  className = '',
  size = 'xl',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  // Render SVG or custom composite icon
  switch (iconKey) {
    case 'scissors':
      // Scissors + Comb composite from screenshot!
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          >
            {/* Comb beneath */}
            <path d="M 22 75 L 78 50 L 73 40 L 17 65 Z" fill="rgba(255,255,255,0.1)" />
            <line x1="26" y1="73" x2="30" y2="82" />
            <line x1="34" y1="69" x2="38" y2="78" />
            <line x1="42" y1="65" x2="46" y2="74" />
            <line x1="50" y1="61" x2="54" y2="70" />
            <line x1="58" y1="57" x2="62" y2="66" />
            <line x1="66" y1="53" x2="70" y2="62" />
            <line x1="74" y1="49" x2="78" y2="58" />

            {/* Scissors Handles */}
            <circle cx="35" cy="28" r="9" />
            <circle cx="65" cy="28" r="9" />

            {/* Scissors Blades */}
            <line x1="39" y1="36" x2="68" y2="72" />
            <line x1="61" y1="36" x2="32" y2="72" />
            {/* Center Pivot Screw */}
            <circle cx="50" cy="51" r="2.5" fill="currentColor" />
          </svg>
        </div>
      );

    case 'mask':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          >
            {/* Theater Comedy & Tragedy Masks */}
            {/* Mask 1 */}
            <path d="M 20 28 C 20 18, 52 18, 52 28 C 52 50, 48 68, 36 74 C 24 68, 20 50, 20 28 Z" fill="rgba(255,255,255,0.08)" />
            <circle cx="29" cy="36" r="3" fill="currentColor" />
            <circle cx="43" cy="36" r="3" fill="currentColor" />
            <path d="M 28 52 Q 36 60, 44 52" />

            {/* Mask 2 (overlapping tragedy) */}
            <path d="M 50 38 C 50 28, 80 28, 80 38 C 80 60, 76 78, 65 84 C 54 78, 50 60, 50 38 Z" fill="rgba(255,255,255,0.08)" />
            <circle cx="58" cy="46" r="3" fill="currentColor" />
            <circle cx="72" cy="46" r="3" fill="currentColor" />
            <path d="M 58 64 Q 65 56, 72 64" />
          </svg>
        </div>
      );

    case 'sneaker':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          >
            {/* Running Sneaker Profile */}
            <path d="M 18 64 L 18 52 C 18 42, 28 36, 38 42 L 56 46 L 76 56 C 84 60, 86 68, 86 70 L 18 70 Z" fill="rgba(255,255,255,0.08)" />
            {/* Sole */}
            <path d="M 14 70 L 88 70 C 90 70, 92 74, 90 78 L 14 78 C 12 78, 12 70, 14 70 Z" fill="currentColor" />
            {/* Laces */}
            <line x1="42" y1="44" x2="48" y2="52" />
            <line x1="50" y1="46" x2="56" y2="54" />
            <line x1="58" y1="49" x2="64" y2="57" />
          </svg>
        </div>
      );

    case 'shirt':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          >
            {/* Hanger Hook */}
            <path d="M 50 16 C 50 10, 56 10, 56 16 C 56 22, 50 22, 50 26" />
            <path d="M 28 34 L 50 26 L 72 34" />
            {/* Shirt Body */}
            <path d="M 36 30 L 22 42 L 30 52 L 36 46 L 36 82 L 64 82 L 64 46 L 70 52 L 78 42 L 64 30 Z" fill="rgba(255,255,255,0.08)" />
            {/* Collar */}
            <path d="M 42 30 L 50 38 L 58 30" />
          </svg>
        </div>
      );

    case 'coffee':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <Coffee className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    case 'dumbbell':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <Dumbbell className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    case 'screen':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <Tv className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    case 'cart':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <ShoppingCart className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    case 'phone':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <Smartphone className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    case 'book':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <BookOpen className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    case 'pizza':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <Pizza className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    case 'bus':
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <Bus className="w-full h-full text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={2.2} />
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
          <Sparkles className="w-full h-full text-white" />
        </div>
      );
  }
};
