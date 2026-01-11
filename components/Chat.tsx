
import React, { useState, useRef, useEffect } from 'react';
import { useChuma } from '../hooks/useChuma.ts';
import Message from './Message.tsx';
import InputBar from './InputBar.tsx';
import { BOT_NAME } from '../constants.ts';

const Chat = () => {
  const { messages, sendMessage, isLoading, error } = useChuma();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full max-h-screen bg-[#121212] flex-1">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center font-bold text-white">
              C
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <InputBar onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;
