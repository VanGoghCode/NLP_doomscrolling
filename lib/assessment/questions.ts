/**
 * Doomscrolling Assessment Questions
 * 
 * Based on the 8 constructs from "The Dark at the End of the Tunnel" study (n=401):
 * - DS1: Scrolling Frequency & Engagement (mean: 3.39)
 * - DS2: Loss of Control (mean: 2.73 - lowest, positive sign)
 * - DS3: Emotional Impact (mean: 3.38)
 * - DS4: Time Distortion (mean: 3.89)
 * - DS5: Compulsive Checking (mean: 3.04)
 * - DS6: Harm Awareness (mean: 3.96 - high awareness)
 * - DS7: Life Interference (mean: 3.84)
 * - DS8: Coping Motivation (mean: 4.16 - highest, concerning)
 * 
 * This assessment uses 24 carefully selected items (3 per construct)
 * to provide comprehensive coverage while remaining practical.
 */

export interface AssessmentQuestion {
  id: string;
  originalItem: string; // Maps to DS1_1, DS2_5, etc.
  construct: string;
  dimension: string;
  text: string;
  reverseScored: boolean;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ============================================
  // DS1: Scrolling Frequency & Engagement
  // Research mean: 3.39/7, SD: 0.86
  // ============================================
  {
    id: "q1",
    originalItem: "DS1_1",
    construct: "frequency",
    dimension: "time_management",
    text: "I check social media news feeds multiple times throughout the day.",
    reverseScored: false
  },
  {
    id: "q2",
    originalItem: "DS1_4",
    construct: "frequency",
    dimension: "time_management",
    text: "I spend a significant portion of my free time scrolling through social media.",
    reverseScored: false
  },
  {
    id: "q3",
    originalItem: "DS1_7",
    construct: "frequency",
    dimension: "time_management",
    text: "Scrolling through news and social media is one of my main daily activities.",
    reverseScored: false
  },

  // ============================================
  // DS2: Loss of Control
  // Research mean: 2.73/7, SD: 1.19 (LOWEST - good sign)
  // ============================================
  {
    id: "q4",
    originalItem: "DS2_2",
    construct: "control",
    dimension: "behavioral_control",
    text: "I find it hard to stop scrolling even when I want to.",
    reverseScored: false
  },
  {
    id: "q5",
    originalItem: "DS2_5",
    construct: "control",
    dimension: "behavioral_control",
    text: "I often scroll longer than I originally planned.",
    reverseScored: false
  },
  {
    id: "q6",
    originalItem: "DS2_8",
    construct: "control",
    dimension: "behavioral_control",
    text: "I feel like I can't control my scrolling behavior.",
    reverseScored: false
  },

  // ============================================
  // DS3: Emotional Impact
  // Research mean: 3.38/7, SD: 1.12
  // ============================================
  {
    id: "q7",
    originalItem: "DS3_1",
    construct: "emotional",
    dimension: "emotional_wellbeing",
    text: "Reading negative news on social media makes me feel anxious or worried.",
    reverseScored: false
  },
  {
    id: "q8",
    originalItem: "DS3_4",
    construct: "emotional",
    dimension: "emotional_wellbeing",
    text: "I often feel sad or hopeless after scrolling through news feeds.",
    reverseScored: false
  },
  {
    id: "q9",
    originalItem: "DS3_7",
    construct: "emotional",
    dimension: "emotional_wellbeing",
    text: "My mood significantly worsens after spending time on social media.",
    reverseScored: false
  },

  // ============================================
  // DS4: Time Distortion
  // Research mean: 3.89/7, SD: 0.78
  // ============================================
  {
    id: "q10",
    originalItem: "DS4_2",
    construct: "time",
    dimension: "time_management",
    text: "I often lose track of time when scrolling through social media.",
    reverseScored: false
  },
  {
    id: "q11",
    originalItem: "DS4_5",
    construct: "time",
    dimension: "time_management",
    text: "Minutes turn into hours when I'm scrolling without me realizing it.",
    reverseScored: false
  },
  {
    id: "q12",
    originalItem: "DS4_8",
    construct: "time",
    dimension: "time_management",
    text: "I'm often surprised by how much time has passed while I was scrolling.",
    reverseScored: false
  },

  // ============================================
  // DS5: Compulsive Checking
  // Research mean: 3.04/7, SD: 0.95
  // ============================================
  {
    id: "q13",
    originalItem: "DS5_1",
    construct: "compulsive",
    dimension: "behavioral_control",
    text: "I feel a strong urge to check social media regularly.",
    reverseScored: false
  },
  {
    id: "q14",
    originalItem: "DS5_4",
    construct: "compulsive",
    dimension: "behavioral_control",
    text: "I check social media first thing in the morning, even before getting out of bed.",
    reverseScored: false
  },
  {
    id: "q15",
    originalItem: "DS5_7",
    construct: "compulsive",
    dimension: "behavioral_control",
    text: "I feel uncomfortable or anxious if I can't check social media for a while.",
    reverseScored: false
  },

  // ============================================
  // DS6: Harm Awareness
  // Research mean: 3.96/7, SD: 0.75 (HIGH awareness)
  // ============================================
  {
    id: "q16",
    originalItem: "DS6_2",
    construct: "awareness",
    dimension: "self_awareness",
    text: "I'm aware that my scrolling habits might not be good for my mental health.",
    reverseScored: false
  },
  {
    id: "q17",
    originalItem: "DS6_5",
    construct: "awareness",
    dimension: "self_awareness",
    text: "I recognize that constant news consumption affects my wellbeing.",
    reverseScored: false
  },
  {
    id: "q18",
    originalItem: "DS6_8",
    construct: "awareness",
    dimension: "self_awareness",
    text: "I know I should probably reduce my social media use.",
    reverseScored: false
  },

  // ============================================
  // DS7: Life Interference
  // Research mean: 3.84/7, SD: 0.88
  // ============================================
  {
    id: "q19",
    originalItem: "DS7_2",
    construct: "interference",
    dimension: "daily_functioning",
    text: "My scrolling habits interfere with completing my work or responsibilities.",
    reverseScored: false
  },
  {
    id: "q20",
    originalItem: "DS7_5",
    construct: "interference",
    dimension: "daily_functioning",
    text: "I've stayed up late scrolling when I should have been sleeping.",
    reverseScored: false
  },
  {
    id: "q21",
    originalItem: "DS7_8",
    construct: "interference",
    dimension: "daily_functioning",
    text: "Scrolling has caused me to neglect important activities or relationships.",
    reverseScored: false
  },

  // ============================================
  // DS8: Coping Motivation
  // Research mean: 4.16/7, SD: 0.73 (HIGHEST - concerning)
  // ============================================
  {
    id: "q22",
    originalItem: "DS8_2",
    construct: "coping",
    dimension: "emotional_wellbeing",
    text: "I scroll through social media to distract myself from stress or problems.",
    reverseScored: false
  },
  {
    id: "q23",
    originalItem: "DS8_5",
    construct: "coping",
    dimension: "emotional_wellbeing",
    text: "I use social media as a way to cope with negative emotions.",
    reverseScored: false
  },
  {
    id: "q24",
    originalItem: "DS8_8",
    construct: "coping",
    dimension: "emotional_wellbeing",
    text: "When I'm bored or lonely, I automatically turn to scrolling.",
    reverseScored: false
  }
];

// Mapping from question IDs to original dataset columns
export const QUESTION_TO_DATASET_MAP: Record<string, string> = ASSESSMENT_QUESTIONS.reduce(
  (acc, q) => ({ ...acc, [q.id]: q.originalItem }), 
  {} as Record<string, string>
);

// Get questions for a specific dimension
export function getQuestionsByDimension(dimensionId: string): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter(q => q.dimension === dimensionId);
}

// Get questions for a specific construct
export function getQuestionsByConstruct(constructId: string): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter(q => q.construct === constructId);
}

// Get total question count
export function getTotalQuestionCount(): number {
  return ASSESSMENT_QUESTIONS.length;
}

// Construct labels for display
export const CONSTRUCT_LABELS: Record<string, string> = {
  frequency: "Scrolling Frequency",
  control: "Loss of Control",
  emotional: "Emotional Impact",
  time: "Time Distortion",
  compulsive: "Compulsive Checking",
  awareness: "Harm Awareness",
  interference: "Life Interference",
  coping: "Coping Motivation"
};

// User-friendly dimension labels (5 categories)
export const DIMENSION_LABELS: Record<string, { label: string; shortLabel: string; color: string; icon: string }> = {
  behavioral_control: { 
    label: "Behavioral Control", 
    shortLabel: "Behavioral",
    color: "#EF4444", // Red
    icon: "RefreshCw"
  },
  emotional_wellbeing: { 
    label: "Emotional Wellbeing", 
    shortLabel: "Emotional",
    color: "#F59E0B", // Amber
    icon: "Heart"
  },
  time_management: { 
    label: "Time Management", 
    shortLabel: "Time",
    color: "#3B82F6", // Blue
    icon: "Clock"
  },
  daily_functioning: { 
    label: "Daily Life Impact", 
    shortLabel: "Daily",
    color: "#EC4899", // Pink
    icon: "TrendingDown"
  },
  self_awareness: { 
    label: "Self-Awareness", 
    shortLabel: "Awareness",
    color: "#6366F1", // Indigo
    icon: "Eye"
  }
};

// Research benchmarks from actual study data (n=401)
export const CONSTRUCT_BENCHMARKS = {
  frequency: { mean: 3.39, sd: 0.86, interpretation: "How often you engage with social media" },
  control: { mean: 2.73, sd: 1.19, interpretation: "Your ability to stop scrolling when you want" },
  emotional: { mean: 3.38, sd: 1.12, interpretation: "How scrolling affects your emotions" },
  time: { mean: 3.89, sd: 0.78, interpretation: "How aware you are of time while scrolling" },
  compulsive: { mean: 3.04, sd: 0.95, interpretation: "The urge to constantly check social media" },
  awareness: { mean: 3.96, sd: 0.75, interpretation: "Your recognition of potential harm" },
  interference: { mean: 3.84, sd: 0.88, interpretation: "How scrolling affects daily life" },
  coping: { mean: 4.16, sd: 0.73, interpretation: "Using scrolling to manage emotions" }
};
