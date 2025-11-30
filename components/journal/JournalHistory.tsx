"use client";

import { JournalEntry, formatEntryDate, formatRelativeTime, MOOD_LABELS, SENTIMENT_CONFIG, TRIGGER_CATEGORIES, EMOTION_COLORS } from "@/lib/journal/types";
import { Button, Progress, Chip } from "@heroui/react";
import { Icon } from "@/components/ui/Icon";

interface JournalHistoryProps {
  entries: JournalEntry[];
  selectedEntry: JournalEntry | null;
  onSelect: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onBack?: () => void;
}

export function JournalHistory({
  entries,
  selectedEntry,
  onSelect,
  onDelete,
  onBack,
}: JournalHistoryProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="BookOpen" className="w-8 h-8 text-stone-400" />
        </div>
        <h3 className="text-lg font-semibold text-stone-700 mb-2">No entries yet</h3>
        <p className="text-stone-500 max-w-sm mx-auto">
          Start writing about your scrolling experiences to track your patterns and get AI-powered insights.
        </p>
      </div>
    );
  }

  // Show detail view if entry is selected
  if (selectedEntry) {
    return (
      <div className="divide-y divide-stone-200">
        {/* Back button header */}
        <div className="px-6 py-4">
          {onBack && (
            <Button
              variant="light"
              startContent={<Icon name="ChevronLeft" className="w-4 h-4" />}
              onPress={onBack}
              className="text-stone-600 hover:text-primary -ml-2"
            >
              Back to entries
            </Button>
          )}
        </div>

        {/* Entry Detail Content */}
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold text-stone-800">
                {selectedEntry.title || "Journal Entry"}
              </h2>
              <p className="text-sm text-stone-500 flex items-center gap-2 mt-1">
                <Icon name="Calendar" className="w-4 h-4" />
                {formatEntryDate(selectedEntry.createdAt)}
              </p>
            </div>
            {selectedEntry.mood && (
              <div className="flex items-center gap-2 bg-stone-100 px-3 py-2 rounded-lg self-start">
                <span className="text-2xl">{MOOD_LABELS[selectedEntry.mood].emoji}</span>
                <span className={`text-sm font-medium ${MOOD_LABELS[selectedEntry.mood].color}`}>
                  {MOOD_LABELS[selectedEntry.mood].label}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-stone-50 rounded-xl p-5">
            <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">
              {selectedEntry.content}
            </p>
          </div>

          {/* Analysis Results */}
          {selectedEntry.isAnalyzed && selectedEntry.analysis && (
            <div className="space-y-6">
              {/* Sentiment */}
              <div className="bg-stone-50 rounded-xl p-6">
                <h3 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-3">
                  <Icon name="Heart" className="w-5 h-5 text-primary" />
                  Sentiment Analysis
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg self-start ${SENTIMENT_CONFIG[selectedEntry.analysis.sentiment.overall].bgColor}`}>
                    <span className="text-xl">{SENTIMENT_CONFIG[selectedEntry.analysis.sentiment.overall].icon}</span>
                    <span className={`font-medium text-sm ${SENTIMENT_CONFIG[selectedEntry.analysis.sentiment.overall].color}`}>
                      {SENTIMENT_CONFIG[selectedEntry.analysis.sentiment.overall].label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-500">Sentiment Score</span>
                      <span className="font-medium text-stone-700">
                        {(selectedEntry.analysis.sentiment.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(selectedEntry.analysis.sentiment.score + 1) * 50}
                      color={selectedEntry.analysis.sentiment.score > 0 ? "success" : selectedEntry.analysis.sentiment.score < 0 ? "danger" : "warning"}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {/* Emotions */}
              {selectedEntry.analysis.emotions.length > 0 && (
                <div className="bg-stone-50 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-3">
                    <Icon name="Brain" className="w-5 h-5 text-primary" />
                    Detected Emotions
                  </h3>
                  <div className="space-y-4">
                    {selectedEntry.analysis.emotions.map((emotion, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-24 sm:w-28 text-sm font-medium text-stone-700 capitalize truncate">
                          {emotion.emotion}
                        </div>
                        <div className="flex-1">
                          <Progress
                            value={emotion.intensity * 100}
                            className="h-2"
                            color="warning"
                          />
                        </div>
                        <div className="w-10 text-right text-sm text-stone-500">
                          {(emotion.intensity * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Triggers */}
              {selectedEntry.analysis.triggers.length > 0 && (
                <div className="bg-stone-50 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-3">
                    <Icon name="Zap" className="w-5 h-5 text-primary" />
                    Identified Triggers
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedEntry.analysis.triggers.map((trigger, index) => (
                      <Chip
                        key={index}
                        variant="flat"
                        size="sm"
                        className={`${TRIGGER_CATEGORIES[trigger.category]?.color || 'bg-stone-100 text-stone-600'}`}
                        startContent={<span className="text-sm">{TRIGGER_CATEGORIES[trigger.category]?.icon || '❓'}</span>}
                      >
                        {trigger.trigger}
                        <span className={`ml-1 text-xs ${
                          trigger.severity === 'high' ? 'text-red-500' :
                          trigger.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          ({trigger.severity})
                        </span>
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {/* Insights */}
              {selectedEntry.analysis.insights.length > 0 && (
                <div className="bg-stone-50 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-stone-800 mb-5 flex items-center gap-3">
                    <Icon name="Lightbulb" className="w-5 h-5 text-primary" />
                    Key Insights
                  </h3>
                  <ul className="space-y-3">
                    {selectedEntry.analysis.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3 text-stone-600 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {selectedEntry.analysis.recommendations.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h3 className="text-base font-semibold text-amber-800 mb-5 flex items-center gap-3">
                    <Icon name="Target" className="w-5 h-5 text-amber-600" />
                    Personalized Recommendations
                  </h3>
                  <div className="space-y-4">
                    {selectedEntry.analysis.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-lg ${
                          rec.priority === 'high' ? 'bg-red-50' :
                          rec.priority === 'medium' ? 'bg-yellow-50' :
                          'bg-green-50'
                        }`}
                      >
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                          rec.priority === 'high' ? 'bg-red-200 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-green-200 text-green-700'
                        }`}>
                          {rec.priority}
                        </span>
                        <span className="text-stone-700 text-sm flex-1">{rec.suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {selectedEntry.analysis.summary && (
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                  <h3 className="text-base font-semibold text-stone-800 mb-4 flex items-center gap-3">
                    <Icon name="MessageCircle" className="w-5 h-5 text-primary" />
                    AI Summary
                  </h3>
                  <p className="text-stone-700 text-sm leading-relaxed">{selectedEntry.analysis.summary}</p>
                </div>
              )}
            </div>
          )}

          {/* Not analyzed yet */}
          {!selectedEntry.isAnalyzed && !selectedEntry.analysisError && (
            <div className="bg-yellow-50 rounded-xl p-5 text-center border border-yellow-200">
              <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-yellow-700 text-sm">
                This entry is being analyzed. Please check back in a moment.
              </p>
            </div>
          )}

          {/* Analysis Error */}
          {selectedEntry.analysisError && (
            <div className="bg-red-50 rounded-xl p-5 text-center border border-red-200">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="AlertCircle" className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-red-700 text-sm font-medium mb-1">Analysis Failed</p>
              <p className="text-red-600 text-xs">{selectedEntry.analysisError}</p>
              <p className="text-red-500 text-xs mt-2">
                Make sure GEMINI_API_KEY is set in your .env file.
              </p>
            </div>
          )}

          {/* Delete button */}
          <div className="flex justify-end pt-2">
            <Button
              color="danger"
              variant="light"
              size="sm"
              startContent={<Icon name="Trash2" className="w-4 h-4" />}
              onPress={() => {
                if (confirm("Are you sure you want to delete this entry?")) {
                  onDelete(selectedEntry.id);
                }
              }}
            >
              Delete Entry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div className="divide-y divide-stone-200">
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => onSelect(entry)}
          className="w-full text-left px-6 py-5 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-start gap-5">
            {/* Mood indicator */}
            {entry.mood && (
              <div className="text-2xl flex-shrink-0">{MOOD_LABELS[entry.mood].emoji}</div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-semibold text-stone-800 truncate text-base">
                  {entry.title || "Journal Entry"}
                </h3>
                {entry.isAnalyzed && entry.analysis && (
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${SENTIMENT_CONFIG[entry.analysis.sentiment.overall].bgColor} ${SENTIMENT_CONFIG[entry.analysis.sentiment.overall].color}`}>
                    {SENTIMENT_CONFIG[entry.analysis.sentiment.overall].icon}
                    {SENTIMENT_CONFIG[entry.analysis.sentiment.overall].label}
                  </span>
                )}
                {entry.analysisError && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    Error
                  </span>
                )}
                {!entry.isAnalyzed && !entry.analysisError && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                    Analyzing...
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                {entry.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" className="w-3 h-3" />
                  {formatRelativeTime(entry.createdAt)}
                </span>
                {entry.isAnalyzed && entry.analysis && entry.analysis.emotions.length > 0 && (
                  <span className="hidden sm:flex items-center gap-1">
                    <Icon name="Brain" className="w-3 h-3" />
                    {entry.analysis.emotions.slice(0, 2).map(e => e.emotion).join(", ")}
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <Icon name="ChevronRight" className="w-5 h-5 text-stone-300 flex-shrink-0 mt-1" />
          </div>
        </button>
      ))}
    </div>
  );
}
