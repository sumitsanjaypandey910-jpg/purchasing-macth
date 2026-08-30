import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, RefreshCw, MessageSquare, Bot, ChevronDown } from 'lucide-react';
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
}

export const HOST_PERSONAS: Record<HostPersonaId, HostPersona> = {
  sparky: {
    id: 'sparky',
    name: 'Sparky',
    title: 'Robo Cashier',
    avatarEmoji: '🤖',
    voicePitch: 1.25,
    voiceRate: 0.95,
    tagline: 'Beep boop! Let\'s compute your shopping math!',
  },
  maya: {
    id: 'maya',
    name: 'Maya',
    title: 'Store Manager',
    avatarEmoji: '👩‍💼',
    voicePitch: 1.1,
    voiceRate: 0.98,
    tagline: 'Welcome to the store! Let\'s find the best deals!',
  },
  penny: {
    id: 'penny',
    name: 'Penny',
    title: 'Smart Owl',
    avatarEmoji: '🦉',
    voicePitch: 1.0,
    voiceRate: 0.9,
    tagline: 'Hoo-hoo! Think carefully and count your coins!',
  },
  leo: {
    id: 'leo',
    name: 'Leo',
    title: 'Budget Champion',
    avatarEmoji: '🦁',
    voicePitch: 0.9,
    voiceRate: 0.95,
    tagline: 'Roar! You have what it takes to master money!',
  },
};

/**
 * Natural Speech Formatter: Converts currency symbols and math operators to spoken English
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
    <div className="w-full bg-[#101438] rounded-2xl p-3 border border-indigo-700/60 shadow-md flex items-start gap-3 relative mb-3">
      {/* Host Avatar (Clickable to speak / change) */}
      <div className="relative shrink-0 flex flex-col items-center">
        <motion.button
          type="button"
          id="btn-voice-host-avatar"
          onClick={() => {
            soundManager.playClick();
            onTriggerSpeech(currentMessage);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isSpeaking ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : {}}
          transition={isSpeaking ? { repeat: Infinity, duration: 0.7 } : {}}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-all border shadow-md relative ${
            isSpeaking
              ? 'bg-gradient-to-tr from-amber-400 to-orange-500 border-amber-300 ring-4 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
              : 'bg-indigo-900/90 border-indigo-600 hover:border-amber-400'
          }`}
          title="Click to hear Host speak"
        >
          <span>{host.avatarEmoji}</span>

          {/* Speaking Soundwaves Indicator */}
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white"></span>
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
            className="mt-1 text-[10px] text-indigo-300 hover:text-amber-300 font-bold underline transition-colors cursor-pointer flex items-center gap-0.5"
          >
            <span>Change</span>
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* Host Speech Bubble Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xs text-amber-300 tracking-wide">{host.name}</span>
            <span className="text-[10px] text-indigo-300/80 bg-indigo-950 px-1.5 py-0.2 rounded-md border border-indigo-800 font-medium">
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
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  autoSpeak
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'bg-indigo-950 text-indigo-400 border border-indigo-800 hover:text-white'
                }`}
                title={autoSpeak ? 'Auto Voice Host is ON (Reads questions automatically)' : 'Auto Voice Host is OFF'}
              >
                {autoSpeak ? <Volume2 className="w-3 h-3 text-amber-400" /> : <VolumeX className="w-3 h-3 text-indigo-400" />}
                <span>{autoSpeak ? 'Auto-Voice ON' : 'Auto-Voice OFF'}</span>
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
              className={`p-1 rounded-lg text-xs transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : 'bg-indigo-900/80 text-amber-300 hover:bg-indigo-800 border border-indigo-700'
              }`}
              title="Read aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Bubble Text */}
        <p className="text-xs text-slate-200 font-medium leading-relaxed bg-[#0b0e2b] p-2.5 rounded-xl border border-indigo-900/90 shadow-inner">
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
            className="absolute top-16 left-3 z-30 bg-[#080b26] border border-indigo-700 rounded-2xl p-2.5 shadow-2xl w-60 text-white"
          >
            <div className="text-[11px] font-bold text-indigo-300 mb-2 px-1 flex items-center justify-between">
              <span>Choose Voice Host:</span>
              <button
                type="button"
                onClick={() => setShowPersonaMenu(false)}
                className="text-xs text-indigo-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              {Object.values(HOST_PERSONAS).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPersona(p.id);
                    setShowPersonaMenu(false);
                    onTriggerSpeech(`Hi! I am ${p.name}, your voice host! ${p.tagline}`);
                  }}
                  className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left text-xs transition-colors cursor-pointer ${
                    selectedPersona === p.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'hover:bg-indigo-900/60 text-slate-200'
                  }`}
                >
                  <span className="text-xl">{p.avatarEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold leading-tight">{p.name}</div>
                    <div className={`text-[10px] ${selectedPersona === p.id ? 'text-slate-900 font-medium' : 'text-indigo-400'}`}>
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
