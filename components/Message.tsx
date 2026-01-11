
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message as MessageType } from '../types.ts';
import { BOT_NAME } from '../constants.ts';
import RiskScoreDisplay from './RiskScoreDisplay.tsx';

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
          isBot ? 'bg-red-800' : 'bg-slate-600'
        }`}
      >
        {isBot ? BOT_NAME.charAt(0) : 'Y'}
      </div>
      <div
        className={`max-w-xl rounded-lg px-4 py-3 shadow-md ${
          isBot ? 'bg-gray-800 text-slate-300' : 'bg-blue-600 text-white'
        }`}
      >
        {message.riskScore ? (
          <RiskScoreDisplay scoreData={message.riskScore} />
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
