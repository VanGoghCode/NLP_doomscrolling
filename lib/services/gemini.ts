import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the structured output schema for journal analysis
const journalAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.OBJECT,
      properties: {
        overall: {
          type: Type.STRING,
          enum: ["positive", "negative", "neutral", "mixed"],
        },
        score: {
          type: Type.NUMBER,
          description: "Sentiment score from -1 (very negative) to 1 (very positive)",
        },
        confidence: {
          type: Type.NUMBER,
          description: "Confidence level from 0 to 1",
        },
      },
      required: ["overall", "score", "confidence"],
    },
    emotions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          emotion: {
            type: Type.STRING,
            description: "The detected emotion",
          },
          intensity: {
            type: Type.NUMBER,
            description: "Intensity from 0 to 1",
          },
        },
        required: ["emotion", "intensity"],
      },
      description: "List of detected emotions with their intensities",
    },
    triggers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trigger: {
            type: Type.STRING,
            description: "The identified trigger",
          },
          category: {
            type: Type.STRING,
            enum: ["social_media", "news", "boredom", "stress", "habit", "fomo", "procrastination", "other"],
          },
          severity: {
            type: Type.STRING,
            enum: ["low", "medium", "high"],
          },
        },
        required: ["trigger", "category", "severity"],
      },
      description: "Identified triggers for doomscrolling behavior",
    },
    patterns: {
      type: Type.OBJECT,
      properties: {
        timeOfDay: {
          type: Type.STRING,
          enum: ["morning", "afternoon", "evening", "night", "unspecified"],
        },
        duration: {
          type: Type.STRING,
          enum: ["brief", "moderate", "extended", "unspecified"],
        },
        platform: {
          type: Type.STRING,
          description: "Social media platform mentioned if any",
        },
      },
      required: ["timeOfDay", "duration"],
    },
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "Key insights and observations about the user's doomscrolling behavior",
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          suggestion: {
            type: Type.STRING,
          },
          priority: {
            type: Type.STRING,
            enum: ["low", "medium", "high"],
          },
        },
        required: ["suggestion", "priority"],
      },
      description: "Personalized recommendations based on the journal entry",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, empathetic summary of the journal entry analysis",
    },
  },
  required: ["sentiment", "emotions", "triggers", "patterns", "insights", "recommendations", "summary"],
};

export interface JournalAnalysisResult {
  sentiment: {
    overall: "positive" | "negative" | "neutral" | "mixed";
    score: number;
    confidence: number;
  };
  emotions: Array<{
    emotion: string;
    intensity: number;
  }>;
  triggers: Array<{
    trigger: string;
    category: "social_media" | "news" | "boredom" | "stress" | "habit" | "fomo" | "procrastination" | "other";
    severity: "low" | "medium" | "high";
  }>;
  patterns: {
    timeOfDay: "morning" | "afternoon" | "evening" | "night" | "unspecified";
    duration: "brief" | "moderate" | "extended" | "unspecified";
    platform?: string;
  };
  insights: string[];
  recommendations: Array<{
    suggestion: string;
    priority: "low" | "medium" | "high";
  }>;
  summary: string;
}

const JOURNAL_ANALYSIS_PROMPT = `You are an expert psychologist specializing in digital wellness and doomscrolling behavior analysis. Analyze the following journal entry about a user's scrolling experience.

Your task is to:
1. Detect the overall sentiment and emotional state
2. Identify specific emotions and their intensity (common ones include: anxiety, guilt, stress, loneliness, boredom, shame, frustration, relief, awareness, hope)
3. Identify triggers that led to doomscrolling behavior
4. Recognize patterns in timing, duration, and platforms
5. Provide thoughtful, evidence-based insights
6. Offer personalized, actionable recommendations

Be empathetic and non-judgmental in your analysis. Focus on understanding rather than criticizing. The goal is to help the user gain self-awareness and develop healthier habits.

Journal Entry:
---
{entry}
---

Analyze this entry comprehensively.`;

export async function analyzeJournalEntry(entry: string): Promise<JournalAnalysisResult> {
  const client = getGeminiClient();

  const prompt = JOURNAL_ANALYSIS_PROMPT.replace("{entry}", entry);

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: journalAnalysisSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini API");
  }

  const result = JSON.parse(text) as JournalAnalysisResult;
  return result;
}

// Analyze trends across multiple journal entries
const trendAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallTrend: {
      type: Type.STRING,
      enum: ["improving", "stable", "declining", "fluctuating"],
    },
    sentimentTrend: {
      type: Type.OBJECT,
      properties: {
        direction: {
          type: Type.STRING,
          enum: ["positive", "negative", "neutral"],
        },
        change: {
          type: Type.NUMBER,
        },
      },
      required: ["direction", "change"],
    },
    commonTriggers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trigger: { type: Type.STRING },
          frequency: { type: Type.NUMBER },
          trend: { type: Type.STRING, enum: ["increasing", "decreasing", "stable"] },
        },
        required: ["trigger", "frequency", "trend"],
      },
    },
    emotionalPatterns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          emotion: { type: Type.STRING },
          averageIntensity: { type: Type.NUMBER },
          trend: { type: Type.STRING, enum: ["increasing", "decreasing", "stable"] },
        },
        required: ["emotion", "averageIntensity", "trend"],
      },
    },
    progressInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    weeklyFocus: {
      type: Type.STRING,
      description: "A specific area to focus on for the coming week",
    },
  },
  required: ["overallTrend", "sentimentTrend", "commonTriggers", "emotionalPatterns", "progressInsights", "weeklyFocus"],
};

export interface TrendAnalysisResult {
  overallTrend: "improving" | "stable" | "declining" | "fluctuating";
  sentimentTrend: {
    direction: "positive" | "negative" | "neutral";
    change: number;
  };
  commonTriggers: Array<{
    trigger: string;
    frequency: number;
    trend: "increasing" | "decreasing" | "stable";
  }>;
  emotionalPatterns: Array<{
    emotion: string;
    averageIntensity: number;
    trend: "increasing" | "decreasing" | "stable";
  }>;
  progressInsights: string[];
  weeklyFocus: string;
}

const TREND_ANALYSIS_PROMPT = `You are an expert psychologist analyzing a user's doomscrolling journey over time. Review the following journal entries and their individual analyses to identify patterns, progress, and areas for growth.

Journal Entries (chronological order, newest last):
---
{entries}
---

Analyze the trends across these entries. Focus on:
1. Overall behavioral trend (improving, stable, declining, fluctuating)
2. Sentiment changes over time
3. Recurring triggers and whether they're being managed better
4. Emotional patterns and changes
5. Signs of progress or concern
6. A specific focus area for improvement

Be encouraging about progress while being honest about challenges.`;

export async function analyzeTrends(
  entries: Array<{ date: string; content: string; analysis: JournalAnalysisResult }>
): Promise<TrendAnalysisResult> {
  const client = getGeminiClient();

  const formattedEntries = entries
    .map(
      (e) =>
        `Date: ${e.date}
Entry: ${e.content}
Analysis Summary: ${e.analysis.summary}
Sentiment: ${e.analysis.sentiment.overall} (${e.analysis.sentiment.score})
Main Emotions: ${e.analysis.emotions.slice(0, 3).map((em) => `${em.emotion} (${em.intensity})`).join(", ")}
Triggers: ${e.analysis.triggers.map((t) => t.trigger).join(", ")}
---`
    )
    .join("\n\n");

  const prompt = TREND_ANALYSIS_PROMPT.replace("{entries}", formattedEntries);

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: trendAnalysisSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini API");
  }

  return JSON.parse(text) as TrendAnalysisResult;
}

// ===== AI Suggestions for Assessment Results =====

const resultsSuggestionsSchema = {
  type: Type.OBJECT,
  properties: {
    personalizedMessage: {
      type: Type.STRING,
      description: "A warm, personalized opening message addressing the user's specific situation",
    },
    topPriorities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          actionSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          timeframe: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["easy", "moderate", "challenging"] },
        },
        required: ["title", "description", "actionSteps", "timeframe", "difficulty"],
      },
      description: "Top 3 priority areas to focus on based on assessment results",
    },
    dailyHabits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          habit: { type: Type.STRING },
          why: { type: Type.STRING },
          when: { type: Type.STRING },
        },
        required: ["habit", "why", "when"],
      },
      description: "Simple daily habits to implement",
    },
    mindsetShifts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["from", "to", "explanation"],
      },
      description: "Mental reframes to help change perspective",
    },
    weeklyGoal: {
      type: Type.OBJECT,
      properties: {
        goal: { type: Type.STRING },
        metric: { type: Type.STRING },
        reward: { type: Type.STRING },
      },
      required: ["goal", "metric", "reward"],
    },
    encouragement: {
      type: Type.STRING,
      description: "A final encouraging message with hope and motivation",
    },
  },
  required: ["personalizedMessage", "topPriorities", "dailyHabits", "mindsetShifts", "weeklyGoal", "encouragement"],
};

export interface AISuggestionsResult {
  personalizedMessage: string;
  topPriorities: Array<{
    title: string;
    description: string;
    actionSteps: string[];
    timeframe: string;
    difficulty: "easy" | "moderate" | "challenging";
  }>;
  dailyHabits: Array<{
    habit: string;
    why: string;
    when: string;
  }>;
  mindsetShifts: Array<{
    from: string;
    to: string;
    explanation: string;
  }>;
  weeklyGoal: {
    goal: string;
    metric: string;
    reward: string;
  };
  encouragement: string;
}

const RESULTS_SUGGESTIONS_PROMPT = `You are a compassionate digital wellness coach. Based on the user's doomscrolling assessment results, provide personalized, actionable suggestions to help them develop healthier habits.

Assessment Results:
---
Overall Score: {overallScore}/7 (higher = more problematic)
Severity Level: {severity}
Percentile: {percentile}% (compared to 401 research participants)
Risk Level: {riskLevel}

Dimension Scores (1-7 scale, higher = more concerning):
{dimensions}

Top Concerns:
{concerns}

Predictions:
- Weekly scrolling estimate: {weeklyTime} hours
- Risk Factors: {riskFactors}
- Protective Factors: {protectiveFactors}
---

Based on these results, provide:
1. A personalized opening message (acknowledge their specific scores and situation)
2. Top 3 priority areas with concrete action steps
3. Simple daily habits they can start immediately
4. Mindset shifts (from/to reframes)
5. A specific, measurable weekly goal
6. An encouraging closing message

Be specific to their scores. If they score low (1-3), celebrate their healthy habits. If moderate (3-5), provide balanced guidance. If high (5-7), be supportive while emphasizing the importance of change.

Tailor recommendations to their specific problem areas based on dimension scores.`;

export interface AssessmentResultsForAI {
  overallScore: number;
  severity: string;
  percentile: number;
  riskLevel: string;
  weeklyTimeEstimate: { min: number; max: number };
  dimensionScores: Array<{ id: string; name: string; score: number; severity: string }>;
  topConcerns: Array<{ name: string; score: number }>;
  riskFactors: string[];
  protectiveFactors: string[];
}

export async function generateAISuggestions(results: AssessmentResultsForAI): Promise<AISuggestionsResult> {
  const client = getGeminiClient();

  const dimensions = results.dimensionScores
    .map((d) => `- ${d.name}: ${d.score.toFixed(1)}/7 (${d.severity})`)
    .join("\n");

  const concerns = results.topConcerns.length > 0
    ? results.topConcerns.map((c) => `- ${c.name}: ${c.score.toFixed(1)}/7`).join("\n")
    : "None identified (scores are healthy)";

  const prompt = RESULTS_SUGGESTIONS_PROMPT
    .replace("{overallScore}", results.overallScore.toFixed(1))
    .replace("{severity}", results.severity)
    .replace("{percentile}", results.percentile.toString())
    .replace("{riskLevel}", results.riskLevel)
    .replace("{dimensions}", dimensions)
    .replace("{concerns}", concerns)
    .replace("{weeklyTime}", `${results.weeklyTimeEstimate.min}-${results.weeklyTimeEstimate.max}`)
    .replace("{riskFactors}", results.riskFactors.join(", ") || "None identified")
    .replace("{protectiveFactors}", results.protectiveFactors.join(", ") || "None identified");

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resultsSuggestionsSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini API");
  }

  return JSON.parse(text) as AISuggestionsResult;
}
