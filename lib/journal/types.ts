import { JournalAnalysisResult, TrendAnalysisResult } from "../services/gemini";

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  title?: string;
  mood?: number; // 1-5 scale for quick mood tracking
  analysis?: JournalAnalysisResult;
  isAnalyzed: boolean;
  analysisError?: string; // Error message if analysis failed
}

export interface JournalStore {
  entries: JournalEntry[];
  trendAnalysis?: TrendAnalysisResult;
  lastTrendAnalysis?: string;
}

// Helper to generate unique IDs
export function generateEntryId(): string {
  return `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to format date for display
export function formatEntryDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatEntryDate(dateString);
}

// Mood labels for display
export const MOOD_LABELS: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: "Very Low", emoji: "😞", color: "text-red-500" },
  2: { label: "Low", emoji: "😔", color: "text-orange-500" },
  3: { label: "Neutral", emoji: "😐", color: "text-yellow-500" },
  4: { label: "Good", emoji: "🙂", color: "text-lime-500" },
  5: { label: "Great", emoji: "😊", color: "text-green-500" },
};

// Emotion colors for visualization
export const EMOTION_COLORS: Record<string, string> = {
  anxiety: "#EF4444", // red
  guilt: "#F97316", // orange
  stress: "#EAB308", // yellow
  loneliness: "#6366F1", // indigo
  boredom: "#8B5CF6", // violet
  shame: "#EC4899", // pink
  frustration: "#F43F5E", // rose
  relief: "#22C55E", // green
  awareness: "#3B82F6", // blue
  hope: "#10B981", // emerald
  fear: "#DC2626", // red-600
  sadness: "#6B7280", // gray
  anger: "#B91C1C", // red-700
  joy: "#FBBF24", // amber
  contentment: "#84CC16", // lime
};

// Trigger category icons and colors
export const TRIGGER_CATEGORIES: Record<string, { icon: string; label: string; color: string }> = {
  social_media: { icon: "📱", label: "Social Media", color: "bg-blue-500/20 text-blue-400" },
  news: { icon: "📰", label: "News", color: "bg-red-500/20 text-red-400" },
  boredom: { icon: "😑", label: "Boredom", color: "bg-gray-500/20 text-gray-400" },
  stress: { icon: "😰", label: "Stress", color: "bg-yellow-500/20 text-yellow-400" },
  habit: { icon: "🔄", label: "Habit", color: "bg-purple-500/20 text-purple-400" },
  fomo: { icon: "👀", label: "FOMO", color: "bg-pink-500/20 text-pink-400" },
  procrastination: { icon: "⏰", label: "Procrastination", color: "bg-orange-500/20 text-orange-400" },
  other: { icon: "❓", label: "Other", color: "bg-slate-500/20 text-slate-400" },
};

// Sentiment display configuration
export const SENTIMENT_CONFIG: Record<string, { icon: string; label: string; color: string; bgColor: string }> = {
  positive: { icon: "😊", label: "Positive", color: "text-green-400", bgColor: "bg-green-500/20" },
  negative: { icon: "😔", label: "Negative", color: "text-red-400", bgColor: "bg-red-500/20" },
  neutral: { icon: "😐", label: "Neutral", color: "text-gray-400", bgColor: "bg-gray-500/20" },
  mixed: { icon: "🤔", label: "Mixed", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
};

// Writing prompts to help users get started
export const WRITING_PROMPTS = [
  "Describe your last scrolling session. What triggered it?",
  "How did you feel before, during, and after scrolling today?",
  "What content captured your attention the most recently?",
  "Were there moments today when you chose not to scroll? What helped?",
  "Describe any physical sensations you noticed while doomscrolling.",
  "What were you avoiding when you started scrolling?",
  "How has scrolling affected your mood this week?",
  "What time of day do you find yourself scrolling the most?",
  "Describe a moment when you successfully resisted the urge to scroll.",
  "What emotions come up when you think about reducing your screen time?",
];

// Get a random writing prompt
export function getRandomPrompt(): string {
  return WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
}
