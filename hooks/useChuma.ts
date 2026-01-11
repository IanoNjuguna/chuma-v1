
import { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Message, RiskScore } from '../types.ts';
import { SYSTEM_INSTRUCTION, RISK_ASSESSMENT_PROMPT, RISK_SCORE_SCHEMA } from '../constants.ts';

const API_KEY = import.meta.env.VITE_API_KEY;

export const useChuma = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'bot',
      text: "Hello! I'm Chuma, your personal financial analyst. You can ask me about finance or upload a financial statement for a credit risk assessment.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up PDF.js worker using a blob to avoid CORS issues.
  useEffect(() => {
    const setupPdfWorker = async () => {
      try {
        const workerUrl = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs';
        const response = await fetch(workerUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF worker: ${response.statusText}`);
        }
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        GlobalWorkerOptions.workerSrc = objectUrl;

        // Cleanup the object URL when the component unmounts
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (e) {
        console.error("Error setting up PDF.js worker:", e);
        setError("Failed to initialize PDF processing capabilities. Please try refreshing the page.");
      }
    };

    if (typeof window !== 'undefined' && !GlobalWorkerOptions.workerSrc) {
      setupPdfWorker();
    }
  }, []); // Run only once on mount

  const ai = useMemo(() => API_KEY ? new GoogleGenAI({ apiKey: API_KEY, vertexai: true }) : null, []);
  const chat = useMemo(() => ai ? ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction: SYSTEM_INSTRUCTION },
  }) : null, [ai]);

  useEffect(() => {
    if (!API_KEY) {
      setError("API key is not configured. Please set the API_KEY environment variable.");
    }
  }, []);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    let fullText = '';
  
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
      fullText += pageText + '\n\n';
    }
  
    return fullText;
  };

  const readFileContent = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      return extractTextFromPdf(file);
    } else {
      // Assume text-based file
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    }
  };

  const handleRiskAnalysis = async (file: File) => {
    if (!ai) return;
    setIsLoading(true);
    setError(null);

    try {
      const fileContent = await readFileContent(file);
      if (!fileContent.trim()) {
        throw new Error("The document appears to be empty or could not be read.");
      }
      const prompt = RISK_ASSESSMENT_PROMPT(fileContent);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: prompt }] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: RISK_SCORE_SCHEMA,
        },
      });
      
      const jsonText = response.text.trim();
      const riskScoreData = JSON.parse(jsonText) as RiskScore;

      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Here is the credit risk analysis for ${file.name}.`,
        riskScore: riskScoreData,
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during risk analysis.';
      setError(`Failed to analyze file. ${errorMessage}`);
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: `I'm sorry, but I encountered an error while analyzing the financial statement. Please ensure the file is a valid statement and try again. PDFs are supported.`,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextMessage = async (text: string) => {
    if (!chat) return;
    setIsLoading(true);
    setError(null);
    
    let fullResponse = '';
    const botMessageId = Date.now().toString();

    try {
      const stream = await chat.sendMessageStream({ message: text });
      
      setMessages((prev) => [...prev, { id: botMessageId, sender: 'bot', text: '...' }]);

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response. ${errorMessage}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: `Sorry, I encountered an error: ${errorMessage}` } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text: string, file?: File) => {
    if (!ai || !chat) {
      setError("AI client is not initialized.");
      return;
    }

    if (!text.trim() && !file) {
      return;
    }

    const userMessageText = file ? (text.trim() ? `${text.trim()} (File: ${file.name})` : `File sent: ${file.name}`) : text;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Keyword check for analysis requests
    const analysisKeywords = ['analyze', 'analysis', 'statement', 'attached', 'risk score', 'financials'];
    const requiresFile = analysisKeywords.some(keyword => text.toLowerCase().includes(keyword));

    if (requiresFile && !file) {
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: "It looks like you're asking for a financial analysis. Please use the paperclip icon to attach a document (PDF, TXT, CSV) for me to review.",
      };
      setMessages((prev) => [...prev, botMessage]);
      return; // Stop further processing
    }

    if (file) {
      await handleRiskAnalysis(file);
    } else if (text) {
      await handleTextMessage(text);
    }
  };

  return { messages, sendMessage, isLoading, error };
};
