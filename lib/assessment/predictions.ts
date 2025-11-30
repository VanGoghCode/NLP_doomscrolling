/**
 * Predictive Analysis Module
 * 
 * Based on correlations and patterns observed in the research dataset (n=401),
 * this module provides predictive insights about future behaviors and risks
 * based on the user's assessment responses.
 */

import { CONSTRUCT_BENCHMARKS } from './questions';

export interface ConstructScore {
  constructId: string;
  score: number;
}

export interface PredictiveInsight {
  id: string;
  category: 'risk' | 'behavior' | 'wellbeing' | 'positive';
  title: string;
  description: string;
  probability: number; // 0-100
  severity: 'low' | 'moderate' | 'high' | 'critical';
  icon: string;
  recommendation: string;
}

export interface PredictiveProfile {
  riskLevel: 'minimal' | 'low' | 'moderate' | 'elevated' | 'high';
  riskScore: number; // 0-100
  predictions: PredictiveInsight[];
  protectiveFactors: string[];
  riskFactors: string[];
  weeklyTimeEstimate: { min: number; max: number }; // hours
  comparisonToSample: {
    percentile: number;
    description: string;
  };
}

/**
 * Calculate z-score for a given value
 */
function calculateZScore(value: number, mean: number, sd: number): number {
  return (value - mean) / sd;
}

/**
 * Convert z-score to percentile (approximation)
 */
function zToPercentile(z: number): number {
  // Using approximation for normal distribution CDF
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  
  const percentile = (0.5 * (1.0 + sign * y)) * 100;
  return Math.round(Math.min(99, Math.max(1, percentile)));
}

/**
 * Generate predictive profile based on construct scores
 * @param constructScores - Individual construct scores
 * @param overallScore - The overall assessment score
 * @param overallPercentile - Pre-calculated percentile from scoring module (for consistency)
 */
export function generatePredictiveProfile(
  constructScores: Record<string, number>,
  overallScore: number,
  overallPercentile?: number
): PredictiveProfile {
  const predictions: PredictiveInsight[] = [];
  const protectiveFactors: string[] = [];
  const riskFactors: string[] = [];
  
  // Calculate z-score for internal calculations
  const overallZ = calculateZScore(overallScore, 3.55, 0.72);
  
  // Risk score should align with percentile for consistency
  // Use the pre-calculated percentile if provided, otherwise calculate from z-score
  const riskScore = overallPercentile ?? zToPercentile(overallZ);
  
  // Determine risk level
  let riskLevel: PredictiveProfile['riskLevel'];
  if (overallScore <= 2.0) riskLevel = 'minimal';
  else if (overallScore <= 2.8) riskLevel = 'low';
  else if (overallScore <= 3.8) riskLevel = 'moderate';
  else if (overallScore <= 4.8) riskLevel = 'elevated';
  else riskLevel = 'high';
  
  // Analyze each construct for predictions
  const controlScore = constructScores.control || 3;
  const copingScore = constructScores.coping || 3;
  const emotionalScore = constructScores.emotional || 3;
  const interferenceScore = constructScores.interference || 3;
  const timeScore = constructScores.time || 3;
  const compulsiveScore = constructScores.compulsive || 3;
  const awarenessScore = constructScores.awareness || 3;
  const frequencyScore = constructScores.frequency || 3;
  
  // ============================================
  // BEHAVIORAL PREDICTIONS
  // ============================================
  
  // Predict escalation risk (based on control + compulsive)
  const escalationRisk = (controlScore + compulsiveScore) / 2;
  if (escalationRisk > 4.5) {
    predictions.push({
      id: 'escalation',
      category: 'risk',
      title: 'Escalation Risk',
      description: 'Your pattern suggests difficulty regulating usage. Without intervention, scrolling time may increase over the next 3 months.',
      probability: Math.round(45 + (escalationRisk - 4.5) * 20),
      severity: escalationRisk > 5.5 ? 'critical' : 'high',
      icon: 'TrendingUp',
      recommendation: 'Set daily time limits using built-in phone features and track your progress weekly.'
    });
    riskFactors.push('Low perceived control over scrolling behavior');
  } else if (escalationRisk < 2.5) {
    protectiveFactors.push('Strong self-regulation abilities');
  }
  
  // Predict sleep disruption (based on interference + time)
  const sleepRisk = (interferenceScore * 0.6 + timeScore * 0.4);
  if (sleepRisk > 4.0) {
    predictions.push({
      id: 'sleep',
      category: 'behavior',
      title: 'Sleep Pattern Impact',
      description: 'Based on your time distortion and life interference scores, you likely experience delayed sleep onset or reduced sleep quality.',
      probability: Math.round(40 + (sleepRisk - 4.0) * 15),
      severity: sleepRisk > 5.0 ? 'high' : 'moderate',
      icon: 'Moon',
      recommendation: 'Establish a phone-free period 1 hour before bed. Keep your phone outside the bedroom.'
    });
    riskFactors.push('Evening/nighttime scrolling affecting sleep');
  }
  
  // ============================================
  // EMOTIONAL WELLBEING PREDICTIONS
  // ============================================
  
  // Predict anxiety/mood impact (based on emotional + coping)
  const moodRisk = (emotionalScore * 0.5 + copingScore * 0.5);
  if (moodRisk > 4.0) {
    predictions.push({
      id: 'mood',
      category: 'wellbeing',
      title: 'Mood Vulnerability',
      description: 'Your emotional sensitivity to content combined with coping-driven scrolling creates a cycle that may worsen anxiety or low mood.',
      probability: Math.round(50 + (moodRisk - 4.0) * 18),
      severity: moodRisk > 5.0 ? 'high' : 'moderate',
      icon: 'Cloud',
      recommendation: 'Practice the "STOP" technique: Stop, Take a breath, Observe your feelings, Proceed mindfully.'
    });
    riskFactors.push('Using scrolling to cope with negative emotions');
  }
  
  // Predict news fatigue (based on emotional + awareness)
  if (emotionalScore > 4.0 && awarenessScore > 4.0) {
    predictions.push({
      id: 'fatigue',
      category: 'wellbeing',
      title: 'News Fatigue Syndrome',
      description: 'High emotional reactivity plus awareness of harm indicates you may be experiencing or developing news fatigue and information overload.',
      probability: Math.round(55 + (emotionalScore - 4.0) * 10),
      severity: emotionalScore > 5.0 ? 'high' : 'moderate',
      icon: 'Battery',
      recommendation: 'Schedule specific "news windows" (e.g., 15 min morning, 15 min evening) instead of constant checking.'
    });
  }
  
  // ============================================
  // PRODUCTIVITY PREDICTIONS
  // ============================================
  
  // Predict work/study interference (based on interference + compulsive)
  const productivityRisk = (interferenceScore * 0.6 + compulsiveScore * 0.4);
  if (productivityRisk > 3.5) {
    predictions.push({
      id: 'productivity',
      category: 'behavior',
      title: 'Productivity Impact',
      description: 'Your compulsive checking patterns suggest likely work interruptions and reduced focus during tasks.',
      probability: Math.round(35 + (productivityRisk - 3.5) * 20),
      severity: productivityRisk > 4.5 ? 'high' : 'moderate',
      icon: 'Clock',
      recommendation: 'Use "Do Not Disturb" mode during work blocks. Try the Pomodoro technique: 25 min work, 5 min break.'
    });
    riskFactors.push('Compulsive checking interfering with focused work');
  }
  
  // ============================================
  // POSITIVE PREDICTIONS
  // ============================================
  
  // Predict recovery potential (based on awareness + low control issues)
  if (awarenessScore > 4.0 && controlScore < 3.5) {
    predictions.push({
      id: 'recovery',
      category: 'positive',
      title: 'High Recovery Potential',
      description: 'Your strong awareness combined with maintained self-control suggests excellent potential for positive behavior change.',
      probability: Math.round(60 + (awarenessScore - 4.0) * 15),
      severity: 'low',
      icon: 'Sunrise',
      recommendation: 'Channel your awareness into action. Start with one small change this week.'
    });
    protectiveFactors.push('Strong awareness of scrolling\'s impact');
    protectiveFactors.push('Maintained ability to self-regulate');
  }
  
  // Predict natural moderation (low overall scores)
  if (overallScore < 2.8) {
    predictions.push({
      id: 'healthy',
      category: 'positive',
      title: 'Healthy Digital Habits',
      description: 'Your scores indicate a balanced relationship with social media. You\'re at low risk for problematic doomscrolling.',
      probability: 85,
      severity: 'low',
      icon: 'Check',
      recommendation: 'Maintain your current habits. Consider helping friends who struggle with overuse.'
    });
    protectiveFactors.push('Balanced approach to social media');
    protectiveFactors.push('Low emotional dependence on scrolling');
  }
  
  // ============================================
  // TIME ESTIMATES
  // ============================================
  
  // Estimate weekly scrolling time based on frequency and time distortion
  const baseHours = frequencyScore * 2; // Rough estimate
  const timeMultiplier = 1 + (timeScore - 3.5) * 0.2; // Adjust for time distortion
  const estimatedHours = baseHours * timeMultiplier;
  
  const weeklyTimeEstimate = {
    min: Math.max(2, Math.round(estimatedHours * 0.7)),
    max: Math.round(estimatedHours * 1.3)
  };
  
  // ============================================
  // COMPARISON TO RESEARCH SAMPLE
  // ============================================
  
  // Use pre-calculated percentile if provided (for consistency with scoring.ts)
  // Otherwise fall back to z-score approximation
  const percentile = overallPercentile ?? zToPercentile(overallZ);
  let comparisonDescription: string;
  
  if (percentile <= 25) {
    comparisonDescription = 'Your scores are lower than most participants in the research study. This suggests healthier scrolling habits than average.';
  } else if (percentile <= 50) {
    comparisonDescription = 'Your scores are around the average of the research sample. You show typical patterns of social media use.';
  } else if (percentile <= 75) {
    comparisonDescription = 'Your scores are higher than most study participants. Consider implementing some protective strategies.';
  } else {
    comparisonDescription = 'Your scores are significantly higher than most study participants. We recommend taking proactive steps to manage your scrolling habits.';
  }
  
  // Add remaining risk/protective factors based on scores
  if (copingScore > 4.5) {
    riskFactors.push('Strong reliance on scrolling for emotional regulation');
  }
  if (emotionalScore < 2.5) {
    protectiveFactors.push('Low emotional reactivity to content');
  }
  if (timeScore < 3.0) {
    protectiveFactors.push('Good awareness of time spent scrolling');
  }
  if (frequencyScore > 4.5) {
    riskFactors.push('Very high frequency of social media checking');
  }
  // High awareness is a protective factor (user recognizes the problem)
  if (awarenessScore > 4.5) {
    protectiveFactors.push('High self-awareness of scrolling\'s negative effects');
  }
  // Low awareness is a risk factor (user doesn't see the problem)
  if (awarenessScore < 2.5) {
    riskFactors.push('Low awareness of scrolling\'s impact on wellbeing');
  }
  
  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    predictions: predictions.sort((a, b) => b.probability - a.probability),
    protectiveFactors: [...new Set(protectiveFactors)],
    riskFactors: [...new Set(riskFactors)],
    weeklyTimeEstimate,
    comparisonToSample: {
      percentile,
      description: comparisonDescription
    }
  };
}

/**
 * Get a summary label for the risk level
 */
export function getRiskLevelLabel(level: PredictiveProfile['riskLevel']): {
  label: string;
  color: string;
  description: string;
} {
  const labels = {
    minimal: {
      label: 'Minimal Risk',
      color: '#10B981',
      description: 'Your digital habits are healthy and balanced.'
    },
    low: {
      label: 'Low Risk',
      color: '#22C55E',
      description: 'Minor areas for improvement, but overall healthy patterns.'
    },
    moderate: {
      label: 'Moderate Risk',
      color: '#F59E0B',
      description: 'Some concerning patterns that would benefit from attention.'
    },
    elevated: {
      label: 'Elevated Risk',
      color: '#EF4444',
      description: 'Significant patterns suggesting problematic scrolling behavior.'
    },
    high: {
      label: 'High Risk',
      color: '#DC2626',
      description: 'Strong indicators of doomscrolling that may be affecting wellbeing.'
    }
  };
  
  return labels[level];
}
