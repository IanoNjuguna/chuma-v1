
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  riskScore?: RiskScore;
}

export interface RiskScore {
  riskLevel: 'Low' | 'Medium' | 'High';
  justification: string;
}
