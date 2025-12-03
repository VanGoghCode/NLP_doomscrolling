"use client";

import React, { useMemo } from 'react';

interface CDFChartProps {
  userScore?: number;
  mean?: number;
  sd?: number;
  title?: string;
  width?: number;
  height?: number;
  isAwareness?: boolean; // If true, high score = good (invert interpretation)
}

/**
 * Cumulative Distribution Function (CDF) Chart
 * 
 * Visualizes the normal distribution CDF for doomscrolling scores
 * and shows where a user's score falls on the distribution.
 * 
 * Formula: CDF(x) = 0.5 * (1 + erf((x - μ) / (σ * √2)))
 */
export function CDFChart({
  userScore,
  mean = 3.55,
  sd = 0.72,
  title = "Cumulative Distribution Function (CDF)",
  width = 600,
  height = 400,
  isAwareness = false
}: CDFChartProps) {
  
  // Error function approximation (Abramowitz and Stegun)
  const erf = (x: number): number => {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  // Normal CDF function
  const normalCDF = (x: number, mu: number, sigma: number): number => {
    return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
  };

  // Generate CDF curve data points
  const cdfData = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const minX = mean - 3.5 * sd; // Start from -3.5 SD
    const maxX = mean + 3.5 * sd; // End at +3.5 SD
    const step = (maxX - minX) / 100;

    for (let x = minX; x <= maxX; x += step) {
      points.push({
        x: x,
        y: normalCDF(x, mean, sd)
      });
    }
    return points;
  }, [mean, sd]);

  // Chart dimensions
  const padding = { top: 40, right: 40, bottom: 60, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const minX = mean - 3.5 * sd;
  const maxX = mean + 3.5 * sd;
  
  const scaleX = (x: number) => 
    padding.left + ((x - minX) / (maxX - minX)) * chartWidth;
  
  const scaleY = (y: number) => 
    padding.top + (1 - y) * chartHeight;

  // Create SVG path for CDF curve
  const pathD = cdfData
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ');

  // Calculate user's percentile if score provided
  const userPercentile = userScore !== undefined 
    ? normalCDF(userScore, mean, sd) * 100 
    : null;

  // Key percentile markers
  const percentileMarkers = [
    { percentile: 0.25, label: '25th', zScore: -0.67 },
    { percentile: 0.50, label: '50th', zScore: 0 },
    { percentile: 0.75, label: '75th', zScore: 0.67 },
    { percentile: 0.90, label: '90th', zScore: 1.28 },
  ];

  // X-axis tick values (scores)
  const xTicks = [1, 2, 3, 4, 5, 6, 7].filter(x => x >= minX && x <= maxX);

  // Y-axis tick values (percentiles)
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
        Based on research sample (n=401, μ={mean}, σ={sd})
      </p>
      
      <svg width={width} height={height} className="mx-auto">
        {/* Background grid */}
        <g className="grid">
          {/* Horizontal grid lines */}
          {yTicks.map((tick, i) => (
            <line
              key={`h-${i}`}
              x1={padding.left}
              y1={scaleY(tick)}
              x2={width - padding.right}
              y2={scaleY(tick)}
              stroke="#e5e7eb"
              strokeDasharray="4,4"
            />
          ))}
          {/* Vertical grid lines */}
          {xTicks.map((tick, i) => (
            <line
              key={`v-${i}`}
              x1={scaleX(tick)}
              y1={padding.top}
              x2={scaleX(tick)}
              y2={height - padding.bottom}
              stroke="#e5e7eb"
              strokeDasharray="4,4"
            />
          ))}
        </g>

        {/* Area under CDF curve (filled) */}
        <path
          d={`${pathD} L ${scaleX(maxX)} ${scaleY(0)} L ${scaleX(minX)} ${scaleY(0)} Z`}
          fill="url(#cdfGradient)"
          opacity={0.3}
        />

        {/* CDF curve */}
        <path
          d={pathD}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Mean line */}
        <line
          x1={scaleX(mean)}
          y1={padding.top}
          x2={scaleX(mean)}
          y2={height - padding.bottom}
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="8,4"
        />
        <text
          x={scaleX(mean)}
          y={padding.top - 8}
          textAnchor="middle"
          className="fill-emerald-600 text-xs font-medium"
        >
          Mean ({mean})
        </text>

        {/* User score marker */}
        {userScore !== undefined && userPercentile !== null && (
          <>
            {/* Vertical line from x-axis to curve */}
            <line
              x1={scaleX(userScore)}
              y1={scaleY(userPercentile / 100)}
              x2={scaleX(userScore)}
              y2={height - padding.bottom}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="4,4"
            />
            {/* Horizontal line from curve to y-axis */}
            <line
              x1={padding.left}
              y1={scaleY(userPercentile / 100)}
              x2={scaleX(userScore)}
              y2={scaleY(userPercentile / 100)}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="4,4"
            />
            {/* Point on curve */}
            <circle
              cx={scaleX(userScore)}
              cy={scaleY(userPercentile / 100)}
              r={8}
              fill="#ef4444"
              stroke="white"
              strokeWidth={2}
            />
            {/* User score label */}
            <text
              x={scaleX(userScore)}
              y={height - padding.bottom + 40}
              textAnchor="middle"
              className="fill-red-600 text-sm font-bold"
            >
              Your Score: {userScore.toFixed(2)}
            </text>
            {/* Percentile label */}
            <text
              x={padding.left - 5}
              y={scaleY(userPercentile / 100) + 4}
              textAnchor="end"
              className="fill-red-600 text-xs font-bold"
            >
              {userPercentile.toFixed(0)}%
            </text>
          </>
        )}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth={2}
        />
        {/* X-axis ticks and labels */}
        {xTicks.map((tick, i) => (
          <g key={`x-tick-${i}`}>
            <line
              x1={scaleX(tick)}
              y1={height - padding.bottom}
              x2={scaleX(tick)}
              y2={height - padding.bottom + 6}
              stroke="#374151"
              strokeWidth={2}
            />
            <text
              x={scaleX(tick)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="fill-gray-600 dark:fill-gray-400 text-sm"
            >
              {tick}
            </text>
          </g>
        ))}
        {/* X-axis label */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          className="fill-gray-700 dark:fill-gray-300 text-sm font-medium"
        >
          Doomscrolling Score (1-7 scale)
        </text>

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth={2}
        />
        {/* Y-axis ticks and labels */}
        {yTicks.map((tick, i) => (
          <g key={`y-tick-${i}`}>
            <line
              x1={padding.left - 6}
              y1={scaleY(tick)}
              x2={padding.left}
              y2={scaleY(tick)}
              stroke="#374151"
              strokeWidth={2}
            />
            <text
              x={padding.left - 10}
              y={scaleY(tick) + 4}
              textAnchor="end"
              className="fill-gray-600 dark:fill-gray-400 text-sm"
            >
              {(tick * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        {/* Y-axis label */}
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${height / 2})`}
          className="fill-gray-700 dark:fill-gray-300 text-sm font-medium"
        >
          Cumulative Probability (Percentile)
        </text>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="cdfGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">CDF Curve</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-500 border-dashed border-t-2 border-emerald-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Mean (μ={mean})</span>
        </div>
        {userScore !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Your Score</span>
          </div>
        )}
      </div>

      {/* Interpretation */}
      {userScore !== undefined && userPercentile !== null && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
            Interpretation
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your score of <strong>{userScore.toFixed(2)}</strong> places you at the{' '}
            <strong className={isAwareness ? "text-emerald-600" : "text-red-600"}>
              {userPercentile.toFixed(0)}th percentile
            </strong>.
            {isAwareness ? (
              // For awareness: high score = high awareness = GOOD
              userPercentile > 50 
                ? ` This means you have higher awareness than ${userPercentile.toFixed(0)}% of the research sample, this is a protective factor!`
                : ` This means you have lower awareness than ${(100 - userPercentile).toFixed(0)}% of the research sample. Building awareness can help manage doomscrolling.`
            ) : (
              // For other constructs: high score = high risk = BAD
              userPercentile > 50 
                ? ` This means you score higher than ${userPercentile.toFixed(0)}% of the research sample (n=401).`
                : ` This means you score lower than ${(100 - userPercentile).toFixed(0)}% of the research sample (n=401).`
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default CDFChart;
