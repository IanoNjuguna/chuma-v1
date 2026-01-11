
import React from 'react';
import { RiskScore } from '../types.ts';

interface RiskScoreDisplayProps {
  scoreData: RiskScore;
}

const RiskScoreDisplay = ({ scoreData }: RiskScoreDisplayProps) => {
  const { riskLevel, justification } = scoreData;

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'Low':
        return { text: 'text-green-400', bg: 'bg-green-900/50', border: 'border-green-700' };
      case 'Medium':
        return { text: 'text-yellow-400', bg: 'bg-yellow-900/50', border: 'border-yellow-700' };
      case 'High':
        return { text: 'text-red-400', bg: 'bg-red-900/50', border: 'border-red-700' };
      default:
        return { text: 'text-slate-400', bg: 'bg-slate-900/50', border: 'border-slate-700' };
    }
  };

  const colors = getRiskColor();

  return (
    <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
      <div>
        <p className="text-sm text-slate-400 uppercase tracking-wider">Credit Risk</p>
        <p className={`text-4xl font-bold mt-1 ${colors.text}`}>{riskLevel}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <p className="text-sm text-slate-300 font-semibold">Justification:</p>
        <p className="text-sm text-slate-400 mt-1">{justification}</p>
      </div>
    </div>
  );
};

export default RiskScoreDisplay;
