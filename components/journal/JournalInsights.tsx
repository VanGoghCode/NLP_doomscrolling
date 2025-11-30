"use client";

import { useState, useMemo } from "react";
import { JournalEntry, EMOTION_COLORS, TRIGGER_CATEGORIES, SENTIMENT_CONFIG } from "@/lib/journal/types";
import { TrendAnalysisResult } from "@/lib/services/gemini";
import { Button, Progress } from "@heroui/react";
import { Icon } from "@/components/ui/Icon";

interface JournalInsightsProps {
  entries: JournalEntry[];
  trendAnalysis?: TrendAnalysisResult;
}

export function JournalInsights({ entries, trendAnalysis }: JournalInsightsProps) {
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [localTrendAnalysis, setLocalTrendAnalysis] = useState<TrendAnalysisResult | undefined>(trendAnalysis);
  const [trendError, setTrendError] = useState<string | null>(null);

  // Analyzed entries only
  const analyzedEntries = useMemo(
    () => entries.filter((e) => e.isAnalyzed && e.analysis),
    [entries]
  );

  // Aggregate statistics
  const stats = useMemo(() => {
    if (analyzedEntries.length === 0) return null;

    // Sentiment distribution
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0, mixed: 0 };
    let totalSentimentScore = 0;

    // Emotion aggregation
    const emotionTotals: Record<string, { total: number; count: number }> = {};

    // Trigger aggregation
    const triggerCounts: Record<string, number> = {};
    const triggerCategories: Record<string, number> = {};

    analyzedEntries.forEach((entry) => {
      if (!entry.analysis) return;

      // Sentiment
      sentimentCounts[entry.analysis.sentiment.overall]++;
      totalSentimentScore += entry.analysis.sentiment.score;

      // Emotions
      entry.analysis.emotions.forEach((emotion) => {
        const key = emotion.emotion.toLowerCase();
        if (!emotionTotals[key]) {
          emotionTotals[key] = { total: 0, count: 0 };
        }
        emotionTotals[key].total += emotion.intensity;
        emotionTotals[key].count++;
      });

      // Triggers
      entry.analysis.triggers.forEach((trigger) => {
        triggerCounts[trigger.trigger] = (triggerCounts[trigger.trigger] || 0) + 1;
        triggerCategories[trigger.category] = (triggerCategories[trigger.category] || 0) + 1;
      });
    });

    // Calculate averages
    const avgSentiment = totalSentimentScore / analyzedEntries.length;

    const topEmotions = Object.entries(emotionTotals)
      .map(([emotion, data]) => ({
        emotion,
        avgIntensity: data.total / data.count,
        frequency: data.count,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 6);

    const topTriggers = Object.entries(triggerCounts)
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const triggerCategoryStats = Object.entries(triggerCategories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      sentimentCounts,
      avgSentiment,
      topEmotions,
      topTriggers,
      triggerCategoryStats,
    };
  }, [analyzedEntries]);

  // Load trend analysis
  const loadTrendAnalysis = async () => {
    if (analyzedEntries.length < 2) {
      setTrendError("Need at least 2 analyzed entries for trend analysis");
      return;
    }

    setIsLoadingTrends(true);
    setTrendError(null);

    try {
      const response = await fetch("/api/journal/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: analyzedEntries.map((e) => ({
            date: e.createdAt,
            content: e.content,
            analysis: e.analysis,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze trends");
      }

      const { trendAnalysis } = await response.json();
      setLocalTrendAnalysis(trendAnalysis);
    } catch (error) {
      console.error("Trend analysis error:", error);
      setTrendError("Failed to analyze trends. Please try again.");
    } finally {
      setIsLoadingTrends(false);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="BarChart3" className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-lg font-semibold text-stone-700 mb-2">No insights yet</h3>
        <p className="text-stone-500 max-w-sm mx-auto">
          Write your first journal entry to start seeing personalized insights about your scrolling patterns.
        </p>
      </div>
    );
  }

  if (analyzedEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
        <div className="w-12 h-12 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-stone-700 mb-2">Analyzing your entries...</h3>
        <p className="text-stone-500 max-w-sm mx-auto">
          Your journal entries are being analyzed. Insights will appear here shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {stats && (
        <>
          {/* Sentiment Overview */}
          <div className="bg-white rounded-xl border border-stone-200 p-8">
            <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-3">
              <Icon name="Heart" className="w-5 h-5 text-primary" />
              Sentiment Overview
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {Object.entries(stats.sentimentCounts).map(([sentiment, count]) => (
                <div
                  key={sentiment}
                  className={`text-center p-4 rounded-xl ${SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG].bgColor}`}
                >
                  <span className="text-2xl">{SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG].icon}</span>
                  <p className="text-2xl font-bold text-stone-800 mt-2">{count}</p>
                  <p className={`text-xs ${SENTIMENT_CONFIG[sentiment as keyof typeof SENTIMENT_CONFIG].color} capitalize`}>
                    {sentiment}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-stone-50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-stone-600">Average Sentiment</span>
                <span className={`font-medium text-sm ${
                  stats.avgSentiment > 0.2 ? 'text-green-600' :
                  stats.avgSentiment < -0.2 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {stats.avgSentiment > 0 ? '+' : ''}{(stats.avgSentiment * 100).toFixed(0)}%
                </span>
              </div>
              <Progress
                value={(stats.avgSentiment + 1) * 50}
                color={stats.avgSentiment > 0.2 ? "success" : stats.avgSentiment < -0.2 ? "danger" : "warning"}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-stone-400 mt-1">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
            </div>
          </div>

          {/* Top Emotions */}
          {stats.topEmotions.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-8">
              <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-3">
                <Icon name="Brain" className="w-5 h-5 text-primary" />
                Most Frequent Emotions
              </h3>
              <div className="space-y-4">
                {stats.topEmotions.map((emotion) => (
                  <div key={emotion.emotion} className="flex items-center gap-4">
                    <div className="w-24 sm:w-28 text-sm font-medium text-stone-700 capitalize flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: EMOTION_COLORS[emotion.emotion] || '#D97706' }}
                      />
                      <span className="truncate">{emotion.emotion}</span>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={emotion.avgIntensity * 100}
                        className="h-3"
                        color="warning"
                      />
                    </div>
                    <div className="w-16 text-right text-sm text-stone-500">
                      {emotion.frequency}x
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Triggers */}
          {stats.topTriggers.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-8">
              <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center gap-3">
                <Icon name="Zap" className="w-5 h-5 text-primary" />
                Common Triggers
              </h3>
              <div className="space-y-3">
                {stats.topTriggers.map((trigger) => (
                  <div
                    key={trigger.trigger}
                    className="flex items-center justify-between p-4 bg-stone-50 rounded-xl"
                  >
                    <span className="text-stone-700 text-sm">{trigger.trigger}</span>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{trigger.count}x</span>
                  </div>
                ))}
              </div>

              {/* Trigger Categories */}
              {stats.triggerCategoryStats.length > 0 && (
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <p className="text-sm font-medium text-stone-600 mb-4">By Category</p>
                  <div className="flex flex-wrap gap-3">
                    {stats.triggerCategoryStats.map((cat) => (
                      <div
                        key={cat.category}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${
                          TRIGGER_CATEGORIES[cat.category]?.color || 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <span>{TRIGGER_CATEGORIES[cat.category]?.icon || '❓'}</span>
                        <span className="font-medium">
                          {TRIGGER_CATEGORIES[cat.category]?.label || cat.category}
                        </span>
                        <span className="opacity-60">({cat.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Trend Analysis */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-6">
          <h3 className="text-base font-semibold text-amber-800 flex items-center gap-2">
            <Icon name="TrendingUp" className="w-5 h-5 text-amber-600" />
            AI Trend Analysis
          </h3>
          {!localTrendAnalysis && analyzedEntries.length >= 2 && (
            <Button
              color="warning"
              variant="flat"
              size="sm"
              onPress={loadTrendAnalysis}
              isLoading={isLoadingTrends}
              startContent={!isLoadingTrends && <Icon name="Sparkles" className="w-4 h-4" />}
            >
              {isLoadingTrends ? "Analyzing..." : "Analyze Trends"}
            </Button>
          )}
        </div>

        {trendError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
            {trendError}
          </div>
        )}

        {analyzedEntries.length < 2 && !localTrendAnalysis && (
          <p className="text-amber-700 text-sm">
            Write at least 2 journal entries to unlock AI-powered trend analysis that tracks your progress over time.
          </p>
        )}

        {localTrendAnalysis && (
          <div className="space-y-5">
            {/* Overall Trend */}
            <div className="bg-white/60 rounded-xl p-5">
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {localTrendAnalysis.overallTrend === 'improving' ? '📈' :
                   localTrendAnalysis.overallTrend === 'declining' ? '📉' :
                   localTrendAnalysis.overallTrend === 'fluctuating' ? '📊' : '➡️'}
                </span>
                <div>
                  <p className="font-medium text-amber-800 capitalize">
                    {localTrendAnalysis.overallTrend} Trend
                  </p>
                  <p className="text-sm text-amber-600">
                    Sentiment {localTrendAnalysis.sentimentTrend.direction === 'positive' ? 'improving' :
                              localTrendAnalysis.sentimentTrend.direction === 'negative' ? 'declining' : 'stable'}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Focus */}
            {localTrendAnalysis.weeklyFocus && (
              <div className="bg-white/60 rounded-xl p-5">
                <p className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-3">
                  <Icon name="Target" className="w-4 h-4" />
                  This Week&apos;s Focus
                </p>
                <p className="text-amber-700 text-sm">{localTrendAnalysis.weeklyFocus}</p>
              </div>
            )}

            {/* Progress Insights */}
            {localTrendAnalysis.progressInsights.length > 0 && (
              <div className="bg-white/60 rounded-xl p-5">
                <p className="text-sm font-medium text-amber-800 mb-3 flex items-center gap-3">
                  <Icon name="Lightbulb" className="w-4 h-4" />
                  Progress Insights
                </p>
                <ul className="space-y-3">
                  {localTrendAnalysis.progressInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                      <Icon name="Check" className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Emotional Patterns */}
            {localTrendAnalysis.emotionalPatterns.length > 0 && (
              <div className="bg-white/60 rounded-xl p-5">
                <p className="text-sm font-medium text-amber-800 mb-3 flex items-center gap-3">
                  <Icon name="Brain" className="w-4 h-4" />
                  Emotional Patterns
                </p>
                <div className="flex flex-wrap gap-3">
                  {localTrendAnalysis.emotionalPatterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 rounded-full text-xs"
                    >
                      <span className="capitalize">{pattern.emotion}</span>
                      <span className={`flex items-center ${
                        pattern.trend === 'increasing' ? 'text-red-500' :
                        pattern.trend === 'decreasing' ? 'text-green-500' : 'text-amber-500'
                      }`}>
                        <Icon
                          name={pattern.trend === 'increasing' ? 'ArrowUp' :
                                pattern.trend === 'decreasing' ? 'ArrowDown' : 'ArrowRight'}
                          className="w-3 h-3"
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connection to Assessment */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-800 mb-3 flex items-center gap-3">
          <Icon name="Target" className="w-5 h-5 text-primary" />
          Connect with Your Assessment
        </h3>
        <p className="text-stone-600 text-sm mb-6">
          Your journal insights can provide additional context to your doomscrolling assessment results.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            as="a"
            href="/assessment"
            color="warning"
            variant="flat"
            size="sm"
            className="text-primary"
          >
            Take Assessment
          </Button>
          <Button
            as="a"
            href="/results"
            variant="light"
            size="sm"
          >
            View Results
          </Button>
        </div>
      </div>
    </div>
  );
}
