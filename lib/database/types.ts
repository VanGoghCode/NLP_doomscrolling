/**
 * Database Types
 * TypeScript types matching the PostgreSQL schema
 */

export interface User {
  id: string;
  anonymousId: string;
  createdAt: Date;
  lastActiveAt: Date;
  metadata: Record<string, unknown>;
}

export interface AssessmentSession {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt: Date | null;
  durationSeconds: number | null;
  isComplete: boolean;
  version: string;
  metadata: Record<string, unknown>;
}

export interface AssessmentResponseRecord {
  id: string;
  sessionId: string;
  questionId: string;
  originalItem: string;
  construct: string;
  dimension: string;
  score: number;
  responseTimeMs: number | null;
  createdAt: Date;
}

export interface AssessmentResultRecord {
  id: string;
  sessionId: string;
  overallScore: number;
  overallPercentile: number;
  overallSeverity: string;
  dimensionScores: Record<string, number>;
  constructScores: Record<string, number>;
  topConcerns: string[];
  recommendations: string[];
  createdAt: Date;
}

export interface SessionHistory {
  id: string;
  userId: string;
  sessionId: string;
  overallScore: number;
  dimensionScores: Record<string, number>;
  recordedAt: Date;
}

export interface AggregatedStats {
  id: string;
  periodType: 'daily' | 'weekly' | 'monthly' | 'all_time';
  periodStart: Date;
  periodEnd: Date;
  totalSessions: number;
  completedSessions: number;
  completionRate: number | null;
  scoreMean: number | null;
  scoreMedian: number | null;
  scoreStdDev: number | null;
  scoreMin: number | null;
  scoreMax: number | null;
  severityDistribution: Record<string, number>;
  dimensionAverages: Record<string, number>;
  demographicBreakdown: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchSampleStat {
  id: string;
  construct: string;
  statType: string;
  value: number;
  sampleSize: number | null;
  createdAt: Date;
}

// API types
export interface CreateSessionRequest {
  anonymousId: string;
  metadata?: Record<string, unknown>;
}

export interface SubmitResponseRequest {
  sessionId: string;
  questionId: string;
  score: number;
  responseTimeMs?: number;
}

export interface CompleteSessionRequest {
  sessionId: string;
}

export interface UserProgressView {
  userId: string;
  anonymousId: string;
  totalSessions: number;
  firstAssessment: Date | null;
  latestAssessment: Date | null;
  latestScore: number | null;
  firstScore: number | null;
  scoreChange: number | null;
}

export interface DashboardOverview {
  totalUsers: number;
  completedAssessments: number;
  avgScore: number | null;
  lowSeverityCount: number;
  moderateSeverityCount: number;
  highSeverityCount: number;
  severeSeverityCount: number;
}
