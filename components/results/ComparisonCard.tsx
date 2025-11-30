"use client";

import { compareToResearchSample, getScoreInterpretation } from "@/lib/assessment/scoring";

interface ComparisonCardProps {
  score: number;
  percentile: number;
}

export function ComparisonCard({ score, percentile }: ComparisonCardProps) {
  const comparison = compareToResearchSample(score);
  const interpretation = getScoreInterpretation(score, percentile);

  const getComparisonIcon = () => {
    switch (comparison.comparison) {
      case "below":
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case "above":
        return (
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        How You Compare
      </h3>

      <div className="flex items-start gap-4 mb-6">
        {getComparisonIcon()}
        <div>
          <p className="text-gray-700 font-medium">{comparison.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Based on responses from 401 participants in the research study
          </p>
        </div>
      </div>

      {/* Percentile visualization */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>0%</span>
          <span>Your position: {percentile}th percentile</span>
          <span>100%</span>
        </div>
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 opacity-30" />
          {/* Position marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-md transition-all duration-500"
            style={{ left: `calc(${percentile}% - 8px)` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Higher percentile = more severe doomscrolling patterns
        </p>
      </div>

      {/* Interpretation */}
      <div className="mt-6 p-4 bg-purple-50 rounded-xl">
        <h4 className="text-sm font-semibold text-purple-800 mb-2">
          What This Means
        </h4>
        <p className="text-sm text-purple-700">{interpretation}</p>
      </div>
    </div>
  );
}
