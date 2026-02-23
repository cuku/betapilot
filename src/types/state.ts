export type WorkflowState =
  | 'UNINITIALIZED'
  | 'SPEC_CREATED'
  | 'PLAN_CREATED'
  | 'IMPLEMENTING'
  | 'TESTING'
  | 'REVIEW'
  | 'COMPLETE'
  | 'ERROR';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

export interface PatchInfo {
  filePath: string;
  originalContent: string;
  newContent: string;
  diff: string;
}

export interface PlanStep {
  id: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  patches?: PatchInfo[];
  command?: string;
  output?: string;
}

export interface TestResult {
  passed: boolean;
  command: string;
  output: string;
  exitCode: number;
  duration?: number;
}

export interface ReviewSummary {
  filesChanged: string[];
  totalLinesAdded: number;
  totalLinesRemoved: number;
  risks: string[];
  nextSteps: string[];
  openQuestions: string[];
}

export interface DoctorResult {
  node: { installed: boolean; version?: string };
  git: { installed: boolean; isRepo: boolean };
  apiKey: { hasKey: boolean; provider?: string };
  config: { exists: boolean; valid: boolean };
}
