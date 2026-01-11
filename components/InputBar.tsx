
import React, { useState, useRef } from 'react';
import { PaperclipIcon } from './icons/PaperclipIcon.tsx';
import { SendIcon } from './icons/SendIcon.tsx';

interface InputBarProps {
  onSend: (text: string, file?: File) => void;
  isLoading: boolean;
}

const InputBar = ({ onSend, isLoading }: InputBarProps) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || file) && !isLoading) {
      onSend(text.trim(), file || undefined);
      setText('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit for PDFs
        alert("File is too large. Please select a file smaller than 4MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default form submission or newline
      // Manually trigger the form's onSubmit handler
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      {file && (
        <div className="mb-2 flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-slate-200 animate-fade-in">
          <span className="font-medium truncate max-w-xs" title={file.name}>
            {file.name}
          </span>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="ml-2 text-red-400 hover:text-red-600 focus:outline-none"
            aria-label="Remove uploaded file"
            title="Remove uploaded file"
          >
            &times;
          </button>
        </div>
      )}
      <form ref={formRef} onSubmit={handleSend} className="flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,.csv,.pdf"
          aria-label="Attach file"
          title="Attach file"
        />
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={isLoading}
          className="p-2 text-slate-400 hover:text-white disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Attach file"
        >
          <PaperclipIcon />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a financial question or attach a statement..."
            title="Chat input"
            disabled={isLoading}
            className="w-full bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:bg-gray-800"
            aria-label="Chat input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || (!text.trim() && !file)}
          className="bg-red-800 text-white rounded-full p-2 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default InputBar;
