"use client";

import { DimensionScore } from "@/lib/assessment/scoring";
import { USER_DIMENSIONS } from "@/lib/assessment/constructs";

// Helper to check if dimension is awareness (where high score = good)
const isAwarenessDimension = (dimensionId: string) => dimensionId === 'self_awareness';

interface DimensionBarProps {
  dimensionScore: DimensionScore;
  showRecommendations?: boolean;
}

export function DimensionBar({ dimensionScore, showRecommendations = false }: DimensionBarProps) {
  const dimension = USER_DIMENSIONS.find((d) => d.id === dimensionScore.dimensionId);
  const percentage = (dimensionScore.score / 7) * 100;
  const isAwareness = isAwarenessDimension(dimensionScore.dimensionId);

  // For awareness: HIGH score = GOOD (green), LOW score = BAD (red)
  // For others: HIGH score = BAD (red), LOW score = GOOD (green)
  const getBarColor = (score: number) => {
    const effectiveScore = isAwareness ? (8 - score) : score;
    if (effectiveScore <= 2.5) return "bg-emerald-500";
    if (effectiveScore <= 4.0) return "bg-amber-500";
    if (effectiveScore <= 5.5) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTextColor = (score: number) => {
    const effectiveScore = isAwareness ? (8 - score) : score;
    if (effectiveScore <= 2.5) return "text-emerald-600";
    if (effectiveScore <= 4.0) return "text-amber-600";
    if (effectiveScore <= 5.5) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-800">
            {dimensionScore.name}
            {isAwareness && (
              <span className="ml-2 text-xs font-normal text-emerald-600">
                (higher = better)
              </span>
            )}
          </h4>
          <p className="text-sm text-gray-500">{dimension?.description}</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${getTextColor(dimensionScore.score)}`}>
            {dimensionScore.score.toFixed(1)}
          </span>
          <span className="text-gray-400 text-sm">/7</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(
            dimensionScore.score
          )}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentile badge */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>
          {dimensionScore.percentile}th percentile compared to study sample
        </span>
        <span
          className={`px-2 py-0.5 rounded-full ${
            dimensionScore.severity === "Low"
              ? "bg-emerald-100 text-emerald-700"
              : dimensionScore.severity === "Moderate"
              ? "bg-amber-100 text-amber-700"
              : dimensionScore.severity === "High"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {dimensionScore.severity}
        </span>
      </div>

      {/* Recommendations */}
      {showRecommendations && dimensionScore.recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Suggestions to improve:
          </h5>
          <ul className="space-y-2">
            {dimensionScore.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-purple-500 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface DimensionBreakdownProps {
  dimensionScores: DimensionScore[];
  showRecommendations?: boolean;
}

export function DimensionBreakdown({
  dimensionScores,
  showRecommendations = false,
}: DimensionBreakdownProps) {
  // Sort by score descending
  const sortedScores = [...dimensionScores].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      {sortedScores.map((score) => (
        <DimensionBar
          key={score.dimensionId}
          dimensionScore={score}
          showRecommendations={showRecommendations}
        />
      ))}
    </div>
  );
}
