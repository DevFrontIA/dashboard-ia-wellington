import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { UserIcon, BotIcon, SourceLinkIcon } from './icons';
import { marked } from 'marked';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatMessageProps {
  message: ChatMessageType;
}

// Basic markdown rendering to handle simple formatting
const renderMarkdown = (text: string) => {
    const rawMarkup = marked(text, { breaks: true, gfm: true });
    return { __html: rawMarkup as string };
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (message.text === '...THINKING...') {
    return <ThinkingIndicator />;
  }

  const isUser = message.role === 'user';
  const sources = message.groundingMetadata?.groundingChunks?.filter(chunk => chunk.web);

  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? '' : 'bg-gray-800/50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-500' : 'bg-teal-500'}`}>
        {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <BotIcon className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1 pt-1">
        <div 
          className="prose prose-invert prose-p:my-0 prose-headings:my-2" 
          dangerouslySetInnerHTML={renderMarkdown(message.text)}
        />
        {sources && sources.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
            <div className="flex flex-col gap-2">
              {sources.map((source, index) => (
                source.web && (
                  <a
                    key={index}
                    href={source.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
                  >
                    <SourceLinkIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{source.web.title || source.web.uri}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
