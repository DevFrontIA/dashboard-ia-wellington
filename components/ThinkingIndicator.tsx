import React from 'react';
import { BotIcon, ThinkingIcon } from './icons';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-4 p-4" aria-live="polite" aria-label="Gemini is thinking">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-teal-500">
        <BotIcon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 pt-1 flex items-center gap-3">
        <ThinkingIcon className="w-5 h-5 text-purple-400 animate-spin" />
        <p className="text-gray-400 italic">Gemini is thinking...</p>
      </div>
    </div>
  );
};
