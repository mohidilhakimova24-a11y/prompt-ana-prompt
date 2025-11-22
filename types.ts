export enum PromptStyle {
  PROFESSIONAL = 'Professional',
  CREATIVE = 'Ijodiy',
  ACADEMIC = 'Akademik',
  TECHNICAL = 'Texnik (Kod)',
  DIRECT = 'To\'g\'ridan-to\'g\'ri va qisqa'
}

export enum ComplexityLevel {
  SIMPLE = 'Oddiy',
  MODERATE = 'O\'rtacha',
  COMPLEX = 'Murakkab (Chain-of-Thought)'
}

export interface OptimizationRequest {
  inputPrompt: string;
  style: PromptStyle;
  complexity: ComplexityLevel;
}

export interface OptimizedVariant {
  title: string;
  content: string;
  reasoning: string;
  tags: string[];
}

export interface OptimizationResult {
  originalAnalysis: {
    grammarIssues: string[];
    clarityScore: number;
    intentDetected: string;
  };
  variants: OptimizedVariant[];
}

export type PipelineStage = 'IDLE' | 'PREPROCESSING' | 'OPTIMIZING' | 'GENERATING' | 'FORMATTING' | 'COMPLETE' | 'ERROR';