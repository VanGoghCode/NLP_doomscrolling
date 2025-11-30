/**
 * Scoring Methodology
 * 
 * Calculates subscale scores, overall scores, and provides percentile comparisons
 * based on the research sample distribution.
 */

import { CONSTRUCTS, USER_DIMENSIONS, SCALE_INFO, getSeverityLevel } from './constructs';
import { ASSESSMENT_QUESTIONS, AssessmentQuestion } from './questions';

export interface AssessmentResponse {
  questionId: string;
  score: number;
  timestamp: Date;
}

export interface ConstructScore {
  constructId: string;
  name: string;
  score: number;
  percentile: number;
  itemCount: number;
}

export interface DimensionScore {
  dimensionId: string;
  name: string;
  score: number;
  percentile: number;
  severity: string;
  recommendations: string[];
}

export interface AssessmentResult {
  overallScore: number;
  overallPercentile: number;
  overallSeverity: ReturnType<typeof getSeverityLevel>;
  constructScores: ConstructScore[];
  constructScoreMap: Record<string, number>; // For predictions
  dimensionScores: DimensionScore[];
  topConcerns: DimensionScore[];
  completedAt: Date;
  sessionId: string;
}

// Research sample statistics (calculated from the actual dataset)
// n=401 participants from "The Dark at the End of the Tunnel" study
export const RESEARCH_SAMPLE_STATS = {
  overall: { mean: 3.55, sd: 0.72, n: 401 },
  constructs: {
    frequency: { mean: 3.39, sd: 0.86 },   // DS1
    control: { mean: 2.73, sd: 1.19 },      // DS2
    emotional: { mean: 3.38, sd: 1.12 },    // DS3
    time: { mean: 3.89, sd: 0.78 },         // DS4
    compulsive: { mean: 3.04, sd: 0.95 },   // DS5
    awareness: { mean: 3.96, sd: 0.75 },    // DS6
    interference: { mean: 3.84, sd: 0.88 }, // DS7
    coping: { mean: 4.16, sd: 0.73 }        // DS8
  },
  dimensions: {
    behavioral_control: { mean: 2.89, sd: 1.07 },  // DS2 + DS5
    emotional_wellbeing: { mean: 3.77, sd: 0.93 }, // DS3 + DS8
    time_management: { mean: 3.64, sd: 0.82 },     // DS4 + DS1
    daily_functioning: { mean: 3.84, sd: 0.88 },   // DS7
    self_awareness: { mean: 3.96, sd: 0.75 }       // DS6
  }
};

// Percentile cutoffs (approximated from normal distribution)
const PERCENTILE_TABLE = [
  { percentile: 99, zScore: 2.33 },
  { percentile: 95, zScore: 1.65 },
  { percentile: 90, zScore: 1.28 },
  { percentile: 85, zScore: 1.04 },
  { percentile: 80, zScore: 0.84 },
  { percentile: 75, zScore: 0.67 },
  { percentile: 70, zScore: 0.52 },
  { percentile: 60, zScore: 0.25 },
  { percentile: 50, zScore: 0 },
  { percentile: 40, zScore: -0.25 },
  { percentile: 30, zScore: -0.52 },
  { percentile: 25, zScore: -0.67 },
  { percentile: 20, zScore: -0.84 },
  { percentile: 15, zScore: -1.04 },
  { percentile: 10, zScore: -1.28 },
  { percentile: 5, zScore: -1.65 },
  { percentile: 1, zScore: -2.33 }
];

/**
 * Calculate z-score and convert to percentile
 */
function scoreToPercentile(score: number, mean: number, sd: number): number {
  const zScore = (score - mean) / sd;
  
  // Find closest percentile
  for (const entry of PERCENTILE_TABLE) {
    if (zScore >= entry.zScore) {
      return entry.percentile;
    }
  }
  return 1;
}

/**
 * Calculate score for a specific construct
 */
export function calculateConstructScore(
  responses: AssessmentResponse[],
  constructId: string
): ConstructScore {
  const construct = CONSTRUCTS.find(c => c.id === constructId);
  if (!construct) throw new Error(`Unknown construct: ${constructId}`);
  
  const questions = ASSESSMENT_QUESTIONS.filter(q => q.construct === constructId);
  const relevantResponses = responses.filter(r => 
    questions.some(q => q.id === r.questionId)
  );
  
  if (relevantResponses.length === 0) {
    return {
      constructId,
      name: construct.name,
      score: 0,
      percentile: 0,
      itemCount: 0
    };
  }
  
  const totalScore = relevantResponses.reduce((sum, r) => sum + r.score, 0);
  const avgScore = totalScore / relevantResponses.length;
  
  const stats = RESEARCH_SAMPLE_STATS.constructs[constructId as keyof typeof RESEARCH_SAMPLE_STATS.constructs];
  const percentile = scoreToPercentile(avgScore, stats.mean, stats.sd);
  
  return {
    constructId,
    name: construct.name,
    score: Math.round(avgScore * 100) / 100,
    percentile,
    itemCount: relevantResponses.length
  };
}

/**
 * Calculate score for a user-facing dimension
 */
export function calculateDimensionScore(
  responses: AssessmentResponse[],
  dimensionId: string
): DimensionScore {
  const dimension = USER_DIMENSIONS.find(d => d.id === dimensionId);
  if (!dimension) throw new Error(`Unknown dimension: ${dimensionId}`);
  
  const questions = ASSESSMENT_QUESTIONS.filter(q => q.dimension === dimensionId);
  const relevantResponses = responses.filter(r => 
    questions.some(q => q.id === r.questionId)
  );
  
  if (relevantResponses.length === 0) {
    return {
      dimensionId,
      name: dimension.name,
      score: 0,
      percentile: 0,
      severity: "unknown",
      recommendations: []
    };
  }
  
  const totalScore = relevantResponses.reduce((sum, r) => sum + r.score, 0);
  const avgScore = totalScore / relevantResponses.length;
  
  // Apply dimension weight for severity calculation
  const weightedScore = avgScore * dimension.weight;
  
  const stats = RESEARCH_SAMPLE_STATS.dimensions[dimensionId as keyof typeof RESEARCH_SAMPLE_STATS.dimensions];
  const percentile = scoreToPercentile(avgScore, stats.mean, stats.sd);
  
  // For self_awareness: HIGH score = HIGH awareness = GOOD (invert severity)
  // High awareness is a protective factor, not a risk factor
  const isAwarenessDimension = dimensionId === 'self_awareness';
  const severity = getSeverityLevel(avgScore, isAwarenessDimension);
  
  // Select relevant recommendations based on score
  // For awareness, low score (low awareness) needs more recommendations
  const effectiveScoreForRecs = isAwarenessDimension ? (8 - avgScore) : avgScore;
  const numRecommendations = effectiveScoreForRecs > 4 ? 4 : effectiveScoreForRecs > 3 ? 3 : 2;
  const recommendations = dimension.recommendations.slice(0, numRecommendations);
  
  return {
    dimensionId,
    name: dimension.name,
    score: Math.round(avgScore * 100) / 100,
    percentile,
    severity: severity.label,
    recommendations
  };
}

/**
 * Calculate overall assessment score
 * Note: Awareness questions are inverted since high awareness = good (lowers overall risk)
 */
export function calculateOverallScore(responses: AssessmentResponse[]): number {
  if (responses.length === 0) return 0;
  
  // Get awareness question IDs
  const awarenessQuestionIds = ASSESSMENT_QUESTIONS
    .filter(q => q.dimension === 'self_awareness')
    .map(q => q.id);
  
  // Calculate total with awareness inverted (8 - score)
  // High awareness is protective, so it should reduce overall risk score
  const totalScore = responses.reduce((sum, r) => {
    const isAwarenessQuestion = awarenessQuestionIds.includes(r.questionId);
    const effectiveScore = isAwarenessQuestion ? (8 - r.score) : r.score;
    return sum + effectiveScore;
  }, 0);
  
  return Math.round((totalScore / responses.length) * 100) / 100;
}

/**
 * Calculate complete assessment results
 */
export function calculateAssessmentResults(
  responses: AssessmentResponse[],
  sessionId: string
): AssessmentResult {
  // Calculate construct scores
  const constructScores = CONSTRUCTS.map(c => 
    calculateConstructScore(responses, c.id)
  ).filter(s => s.itemCount > 0);
  
  // Create a map for predictions
  const constructScoreMap: Record<string, number> = {};
  constructScores.forEach(cs => {
    constructScoreMap[cs.constructId] = cs.score;
  });
  
  // Calculate dimension scores
  const dimensionScores = USER_DIMENSIONS.map(d => 
    calculateDimensionScore(responses, d.id)
  ).filter(s => s.score > 0);
  
  // Calculate overall score
  const overallScore = calculateOverallScore(responses);
  const overallPercentile = scoreToPercentile(
    overallScore, 
    RESEARCH_SAMPLE_STATS.overall.mean, 
    RESEARCH_SAMPLE_STATS.overall.sd
  );
  const overallSeverity = getSeverityLevel(overallScore);
  
  // Find top concerns (highest scoring dimensions)
  // Exclude self_awareness because high awareness score = good (not a concern)
  const topConcerns = [...dimensionScores]
    .filter(d => d.dimensionId !== 'self_awareness') // Awareness is protective, not a concern
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter(d => d.score >= 3.5); // Only include if above moderate threshold
  
  return {
    overallScore,
    overallPercentile,
    overallSeverity,
    constructScores,
    constructScoreMap,
    dimensionScores,
    topConcerns,
    completedAt: new Date(),
    sessionId
  };
}

/**
 * Generate interpretation text based on score
 */
export function getScoreInterpretation(score: number, percentile: number): string {
  if (score <= 2.5) {
    return `Your score is in the ${percentile}th percentile, which is below average. Your scrolling habits appear to be generally healthy compared to the research sample.`;
  } else if (score <= 4.0) {
    return `Your score is in the ${percentile}th percentile, which is around average. You show some patterns that could benefit from mindful attention.`;
  } else if (score <= 5.5) {
    return `Your score is in the ${percentile}th percentile, which is above average. Your scrolling habits may be having a noticeable impact on your wellbeing.`;
  } else {
    return `Your score is in the ${percentile}th percentile, indicating significant concerns. We strongly recommend implementing some changes to your scrolling habits.`;
  }
}

/**
 * Calculate comparison with research sample
 */
export function compareToResearchSample(score: number): {
  comparison: 'below' | 'around' | 'above';
  difference: number;
  description: string;
} {
  const mean = RESEARCH_SAMPLE_STATS.overall.mean;
  const difference = Math.abs(score - mean);
  
  if (score < mean - 0.5) {
    return {
      comparison: 'below',
      difference: Math.round(difference * 100) / 100,
      description: `Your score is ${difference.toFixed(1)} points below the study average of ${mean.toFixed(1)}`
    };
  } else if (score > mean + 0.5) {
    return {
      comparison: 'above',
      difference: Math.round(difference * 100) / 100,
      description: `Your score is ${difference.toFixed(1)} points above the study average of ${mean.toFixed(1)}`
    };
  } else {
    return {
      comparison: 'around',
      difference: Math.round(difference * 100) / 100,
      description: `Your score is very close to the study average of ${mean.toFixed(1)}`
    };
  }
}
