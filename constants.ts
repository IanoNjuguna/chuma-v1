
import { Type } from '@google/genai';

export const BOT_NAME = 'Chuma';

export const SYSTEM_INSTRUCTION = `You are ${BOT_NAME}, a world-class financial analyst AI. Your expertise lies in analyzing corporate financial statements and answering questions about financial matters with precision and clarity. You must always maintain a professional and authoritative tone.

When a user provides you with financial data and asks for a credit risk assessment, you must analyze the data and respond ONLY with a JSON object that conforms to the schema provided. Do not add any other text, greetings, or explanations outside of the JSON object.

For all other financial questions, provide a helpful and informative text-based answer.`;

export const RISK_ASSESSMENT_PROMPT = (fileContent: string) =>
  `Here is a financial statement. Please perform a credit risk assessment and respond only with the JSON object as instructed in your system prompt. Statement:\n\n${fileContent}`;

export const RISK_SCORE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    riskLevel: {
      type: Type.STRING,
      description: 'The assessed credit risk level. Must be one of: Low, Medium, High.',
      enum: ['Low', 'Medium', 'High'],
    },
    justification: {
      type: Type.STRING,
      description: 'A concise, one-to-two sentence justification for the assigned risk level, based on the provided financial data.',
    },
  },
  required: ['riskLevel', 'justification'],
};
