/**
 * Doomscrolling Assessment Constructs
 *
 * Based on "The Dark at the End of the Tunnel: Doomscrolling on Social Media Newsfeeds" study
 * The DS1-DS8 blocks measure different facets of doomscrolling behavior.
 *
 * After analyzing the response patterns and common doomscrolling measurement frameworks,
 * we infer the following construct mappings:
 *
 * DS1: FREQUENCY/ENGAGEMENT - How often and how much someone engages in scrolling news feeds
 * DS2: LOSS OF CONTROL - Difficulty stopping or regulating scrolling behavior
 * DS3: MOOD/EMOTIONAL IMPACT - Negative emotional consequences from doomscrolling
 * DS4: TIME DISTORTION - Losing track of time while scrolling
 * DS5: COMPULSIVE CHECKING - Urge to constantly check for updates
 * DS6: AWARENESS OF HARM - Recognition that the behavior is harmful
 * DS7: INTERFERENCE WITH LIFE - Impact on daily activities, sleep, work
 * DS8: COPING MOTIVATION - Using scrolling as emotional regulation/coping
 */

export interface Construct {
  id: string;
  name: string;
  shortName: string;
  description: string;
  items: string[]; // DS block items (e.g., "DS1_1", "DS1_2", etc.)
  color: string;
  icon: string;
}

export interface UserDimension {
  id: string;
  name: string;
  description: string;
  constructs: string[]; // IDs of constructs that contribute to this dimension
  weight: number;
  recommendations: string[];
}

// Full construct definitions from the research scale
export const CONSTRUCTS: Construct[] = [
  {
    id: "frequency",
    name: "Scrolling Frequency & Engagement",
    shortName: "Frequency",
    description:
      "How often and extensively you engage with news feeds and social media content",
    items: [
      "DS1_1",
      "DS1_2",
      "DS1_3",
      "DS1_4",
      "DS1_5",
      "DS1_6",
      "DS1_7",
      "DS1_8",
      "DS1_9",
      "DS1_10",
    ],
    color: "#8B5CF6", // Purple
    icon: "Smartphone",
  },
  {
    id: "control",
    name: "Loss of Control",
    shortName: "Control",
    description:
      "Difficulty stopping or regulating your scrolling behavior when you want to",
    items: [
      "DS2_1",
      "DS2_2",
      "DS2_3",
      "DS2_4",
      "DS2_5",
      "DS2_6",
      "DS2_7",
      "DS2_8",
      "DS2_9",
      "DS2_10",
    ],
    color: "#EF4444", // Red
    icon: "RefreshCw",
  },
  {
    id: "emotional",
    name: "Emotional Impact",
    shortName: "Emotion",
    description:
      "Negative emotional consequences such as anxiety, sadness, or distress from scrolling",
    items: [
      "DS3_1",
      "DS3_2",
      "DS3_3",
      "DS3_4",
      "DS3_5",
      "DS3_6",
      "DS3_7",
      "DS3_8",
      "DS3_9",
      "DS3_10",
    ],
    color: "#F59E0B", // Amber
    icon: "Frown",
  },
  {
    id: "time",
    name: "Time Distortion",
    shortName: "Time",
    description:
      "Losing track of time or spending more time than intended while scrolling",
    items: [
      "DS4_1",
      "DS4_2",
      "DS4_3",
      "DS4_4",
      "DS4_5",
      "DS4_6",
      "DS4_7",
      "DS4_8",
      "DS4_9",
      "DS4_10",
    ],
    color: "#3B82F6", // Blue
    icon: "Clock",
  },
  {
    id: "compulsive",
    name: "Compulsive Checking",
    shortName: "Compulsive",
    description: "Strong urges to constantly check for updates and new content",
    items: [
      "DS5_1",
      "DS5_2",
      "DS5_3",
      "DS5_4",
      "DS5_5",
      "DS5_6",
      "DS5_7",
      "DS5_8",
      "DS5_9",
      "DS5_10",
    ],
    color: "#10B981", // Emerald
    icon: "Bell",
  },
  {
    id: "awareness",
    name: "Harm Awareness",
    shortName: "Awareness",
    description:
      "Recognition that your scrolling habits may be harmful to your wellbeing",
    items: [
      "DS6_1",
      "DS6_2",
      "DS6_3",
      "DS6_4",
      "DS6_5",
      "DS6_6",
      "DS6_7",
      "DS6_8",
      "DS6_9",
      "DS6_10",
    ],
    color: "#6366F1", // Indigo
    icon: "Eye",
  },
  {
    id: "interference",
    name: "Life Interference",
    shortName: "Interference",
    description:
      "How scrolling affects daily activities, sleep, work, and relationships",
    items: [
      "DS7_1",
      "DS7_2",
      "DS7_3",
      "DS7_4",
      "DS7_5",
      "DS7_6",
      "DS7_7",
      "DS7_8",
      "DS7_9",
      "DS7_10",
    ],
    color: "#EC4899", // Pink
    icon: "TrendingDown",
  },
  {
    id: "coping",
    name: "Coping Motivation",
    shortName: "Coping",
    description:
      "Using scrolling as a way to cope with stress, boredom, or negative emotions",
    items: [
      "DS8_1",
      "DS8_2",
      "DS8_3",
      "DS8_4",
      "DS8_5",
      "DS8_6",
      "DS8_7",
      "DS8_8",
      "DS8_9",
      "DS8_10",
    ],
    color: "#14B8A6", // Teal
    icon: "Shield",
  },
];

// User-facing dimensions (simplified from the 8 constructs to 5 clear dimensions)
export const USER_DIMENSIONS: UserDimension[] = [
  {
    id: "behavioral_control",
    name: "Behavioral Control",
    description: "Your ability to regulate and stop scrolling when you want to",
    constructs: ["control", "compulsive"],
    weight: 1.2,
    recommendations: [
      "Set app timers to limit social media usage",
      "Use 'grayscale mode' on your phone to reduce visual appeal",
      "Create physical barriers (e.g., keep phone in another room during specific times)",
      "Practice the '5-minute delay' technique before opening social media apps",
      "Designate 'phone-free' zones in your home",
    ],
  },
  {
    id: "emotional_wellbeing",
    name: "Emotional Wellbeing",
    description: "How scrolling affects your mood and emotional state",
    constructs: ["emotional", "coping"],
    weight: 1.3,
    recommendations: [
      "Keep a mood journal to track how you feel before and after scrolling",
      "Practice mindfulness meditation for 5-10 minutes daily",
      "Curate your feed to include more positive, uplifting content",
      "Unfollow or mute accounts that consistently trigger negative emotions",
      "Replace doom-scrolling with healthier coping activities (exercise, calling a friend)",
    ],
  },
  {
    id: "time_management",
    name: "Time Management",
    description: "Your awareness and control over time spent scrolling",
    constructs: ["time", "frequency"],
    weight: 1.0,
    recommendations: [
      "Use screen time tracking apps to monitor your usage",
      "Schedule specific times for checking social media",
      "Set a 'closing time' for social media each evening",
      "Use the Pomodoro technique: work/life intervals with brief social media breaks",
      "Keep a time log for one week to understand your patterns",
    ],
  },
  {
    id: "daily_functioning",
    name: "Daily Life Impact",
    description:
      "How scrolling interferes with work, sleep, and daily activities",
    constructs: ["interference"],
    weight: 1.4,
    recommendations: [
      "Establish a phone-free bedtime routine 1 hour before sleep",
      "Use 'Do Not Disturb' mode during work hours",
      "Replace morning phone checking with a healthier routine",
      "Set specific goals for activities that scrolling has displaced",
      "Create accountability by telling someone about your goals",
    ],
  },
  {
    id: "self_awareness",
    name: "Self-Awareness",
    description: "Your recognition of scrolling patterns and their effects (higher = more aware, which is positive)",
    constructs: ["awareness"],
    weight: 0.8,
    // Note: For awareness, these recommendations show when awareness is LOW (inverted)
    recommendations: [
      "Start tracking your screen time to build awareness",
      "Reflect on what triggers your scrolling episodes",
      "Notice physical sensations when you feel the urge to scroll",
      "Keep a scrolling diary noting triggers, duration, and aftermath",
      "Set intention before opening apps: 'What am I looking for?'",
    ],
  },
];

// Scale information
export const SCALE_INFO = {
  min: 1,
  max: 7,
  midpoint: 4,
  labels: {
    1: "Strongly Disagree",
    2: "Disagree",
    3: "Somewhat Disagree",
    4: "Neutral",
    5: "Somewhat Agree",
    6: "Agree",
    7: "Strongly Agree",
  },
};

// Severity levels based on percentiles from the research sample
export const SEVERITY_LEVELS = {
  low: {
    max: 2.5,
    label: "Low",
    color: "#10B981",
    description: "Your scrolling habits are generally healthy.",
  },
  moderate: {
    max: 4.0,
    label: "Moderate",
    color: "#F59E0B",
    description:
      "You show some concerning patterns that could benefit from attention.",
  },
  high: {
    max: 5.5,
    label: "High",
    color: "#EF4444",
    description:
      "Your scrolling habits may be significantly impacting your wellbeing.",
  },
  severe: {
    max: 7.0,
    label: "Severe",
    color: "#7C3AED",
    description:
      "Your scrolling patterns suggest serious concerns that warrant immediate attention.",
  },
};

export function getSeverityLevel(
  score: number,
  invertForAwareness: boolean = false
): (typeof SEVERITY_LEVELS)[keyof typeof SEVERITY_LEVELS] & { key: string } {
  // For awareness dimension, HIGH score = HIGH awareness = GOOD (low severity)
  // So we invert: 7 becomes 1, 1 becomes 7
  const effectiveScore = invertForAwareness ? (8 - score) : score;
  
  if (effectiveScore <= SEVERITY_LEVELS.low.max)
    return { ...SEVERITY_LEVELS.low, key: "low" };
  if (effectiveScore <= SEVERITY_LEVELS.moderate.max)
    return { ...SEVERITY_LEVELS.moderate, key: "moderate" };
  if (effectiveScore <= SEVERITY_LEVELS.high.max)
    return { ...SEVERITY_LEVELS.high, key: "high" };
  return { ...SEVERITY_LEVELS.severe, key: "severe" };
}
