import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, RefreshCw, MessageSquare, Bot, ChevronDown, Mic, Globe } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export type HostPersonaId = 'sparky' | 'penny' | 'maya' | 'leo';

export interface HostPersona {
  id: HostPersonaId;
  name: string;
  title: string;
  avatarEmoji: string;
  voicePitch: number;
  voiceRate: number;
  tagline: string;
  langAccent?: string;
}

export const HOST_PERSONAS: Record<HostPersonaId, HostPersona> = {
  sparky: {
    id: 'sparky',
    name: 'Sparky',
    title: 'Robo Cashier 🤖',
    avatarEmoji: '🤖',
    voicePitch: 1.2,
    voiceRate: 0.95,
    tagline: 'Beep boop! Let\'s compute your shopping math!',
  },
  maya: {
    id: 'maya',
    name: 'Maya Didi',
    title: 'Store Manager 👩‍💼',
    avatarEmoji: '👩‍💼',
    voicePitch: 1.05,
    voiceRate: 0.95,
    tagline: 'Welcome to our store! Let\'s find the best deals!',
  },
  penny: {
    id: 'penny',
    name: 'Penny Owl',
    title: 'Smart Coin Expert 🦉',
    avatarEmoji: '🦉',
    voicePitch: 0.98,
    voiceRate: 0.9,
    tagline: 'Hoo-hoo! Count every coin and save big!',
  },
  leo: {
    id: 'leo',
    name: 'Leo Champion',
    title: 'Budget Master 🦁',
    avatarEmoji: '🦁',
    voicePitch: 0.9,
    voiceRate: 0.95,
    tagline: 'Roar! You are a super money master!',
  },
};

/**
 * Natural Speech Formatter: Converts currency symbols and math operators to spoken language
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/₹\s*([0-9.]+)/g, '$1 rupees')
    .replace(/\$\s*([0-9.]+)/g, '$1 dollars')
    .replace(/€\s*([0-9.]+)/g, '$1 euros')
    .replace(/£\s*([0-9.]+)/g, '$1 pounds')
    .replace(/×/g, ' multiplied by ')
    .replace(/\+/g, ' plus ')
    .replace(/-(?=\s*[0-9])/g, ' minus ')
    .replace(/=/g, ' equals ')
    .replace(/🍎/g, 'apple ')
    .replace(/🍌/g, 'banana ')
    .replace(/🍪/g, 'cookie ')
    .replace(/🥛/g, 'milk ')
    .replace(/📦|💵|🛒|📅|🏷️|👛|💡|🎉|✨|⚡|🛍️/g, '')
    .trim();
}

interface VoiceHostProps {
  currentMessage: string;
  autoSpeak?: boolean;
  onToggleAutoSpeak?: (enabled: boolean) => void;
  selectedPersona?: HostPersonaId;
  onSelectPersona?: (personaId: HostPersonaId) => void;
  isSpeaking: boolean;
  onTriggerSpeech: (text: string) => void;
}

export const VoiceHost: React.FC<VoiceHostProps> = ({
  currentMessage,
  autoSpeak = true,
  onToggleAutoSpeak,
  selectedPersona = 'sparky',
  onSelectPersona,
  isSpeaking,
  onTriggerSpeech,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const host = HOST_PERSONAS[selectedPersona] || HOST_PERSONAS.sparky;

  return (
    <div className="w-full bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-white rounded-3xl p-3.5 border-2 border-amber-300/80 shadow-md flex items-start gap-3.5 relative mb-4">
      {/* Host Avatar (Clickable to speak / change) */}
      <div className="relative shrink-0 flex flex-col items-center">
        <motion.button
          type="button"
          id="btn-voice-host-avatar"
          onClick={() => {
            soundManager.playClick();
            onTriggerSpeech(currentMessage);
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          animate={isSpeaking ? { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] } : {}}
          transition={isSpeaking ? { repeat: Infinity, duration: 0.6 } : {}}
          className={`w-13 h-13 rounded-2xl flex items-center justify-center text-3xl cursor-pointer transition-all border-2 shadow-md relative ${
            isSpeaking
              ? 'bg-gradient-to-tr from-amber-400 to-orange-500 border-amber-400 ring-4 ring-amber-300/70 shadow-[0_0_18px_rgba(251,191,36,0.7)]'
              : 'bg-white border-amber-300 hover:border-amber-500 hover:bg-amber-50'
          }`}
          title="Click to hear Host speak"
        >
          <span className="select-none">{host.avatarEmoji}</span>

          {/* Speaking Soundwaves Indicator */}
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
            </span>
          )}
        </motion.button>

        {/* Change Host Switcher Button */}
        {onSelectPersona && (
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setShowPersonaMenu(!showPersonaMenu);
            }}
            className="mt-1 text-[11px] text-amber-900 hover:text-amber-700 font-bold underline transition-colors cursor-pointer flex items-center gap-0.5"
          >
            <span>Change</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Host Speech Bubble Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-black text-xs sm:text-sm text-amber-950 tracking-wide">{host.name}</span>
            <span className="text-[10px] text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300 font-bold">
              {host.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto-narration Toggle */}
            {onToggleAutoSpeak && (
              <button
                type="button"
                id="btn-toggle-auto-narrate"
                onClick={() => {
                  soundManager.playClick();
                  onToggleAutoSpeak(!autoSpeak);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                  autoSpeak
                    ? 'bg-amber-500 text-white border border-amber-600'
                    : 'bg-white text-slate-600 border border-slate-300 hover:border-amber-300'
                }`}
                title={autoSpeak ? 'Auto Voice Host is ON (Reads questions automatically)' : 'Auto Voice Host is OFF'}
              >
                {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span>{autoSpeak ? 'Awaaz ON' : 'Awaaz OFF'}</span>
              </button>
            )}

            {/* Speak Now Button */}
            <button
              type="button"
              id="btn-host-speak-now"
              onClick={() => {
                soundManager.playClick();
                onTriggerSpeech(currentMessage);
              }}
              className={`px-2 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                  : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 hover:border-amber-400'
              }`}
              title="Read aloud"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Suno</span>
            </button>
          </div>
        </div>

        {/* Message Bubble Text */}
        <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed bg-white/95 p-3 rounded-2xl border border-amber-200/90 shadow-inner">
          {currentMessage}
        </p>
      </div>

      {/* Persona Selection Dropdown */}
      <AnimatePresence>
        {showPersonaMenu && onSelectPersona && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="absolute top-18 left-3 z-30 bg-white border-2 border-amber-300 rounded-3xl p-3 shadow-xl w-64 text-slate-900"
          >
            <div className="text-xs font-bold text-amber-950 mb-2 px-1 flex items-center justify-between border-b border-amber-100 pb-1.5">
              <span>Choose Voice Host:</span>
              <button
                type="button"
                onClick={() => setShowPersonaMenu(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5">
              {Object.values(HOST_PERSONAS).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPersona(p.id);
                    setShowPersonaMenu(false);
                    onTriggerSpeech(`Namaste! I am ${p.name}, your voice host! ${p.tagline}`);
                  }}
                  className={`w-full p-2 rounded-2xl flex items-center gap-2.5 text-left text-xs transition-colors cursor-pointer border ${
                    selectedPersona === p.id
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                      : 'hover:bg-amber-50/70 border-transparent text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{p.avatarEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold leading-tight text-slate-900">{p.name}</div>
                    <div className="text-[10px] text-amber-800 font-medium">
                      {p.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
