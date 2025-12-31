
export interface MathExplanation {
  formulaName: string;
  exactFormula: string;
  intuitiveMeaning: string;
  whenToUse: string;
  whenNotToUse: string;
  commonMistake: string;
  solvedExample: {
    steps: string[];
    result: string;
  };
  trapQuestion: {
    question: string;
    explanation: string;
  };
  memoryTrick: string;
  relatedFormulas: string[];
}

export type ThemeType = 'indigo' | 'emerald' | 'amber' | 'cyan';

export interface AppSettings {
  gradeLevel: number;
  explanationDepth: 'simple' | 'comprehensive';
  theme: ThemeType;
  enableThinking: boolean;
  enableVoice: boolean;
}

export type UserSession = {
  name: string;
  isLoggedIn: boolean;
};
