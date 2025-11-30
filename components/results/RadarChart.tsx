"use client";

import { useMemo } from "react";
import { USER_DIMENSIONS } from "@/lib/assessment/constructs";
import { DimensionScore } from "@/lib/assessment/scoring";

interface RadarChartProps {
  dimensionScores: DimensionScore[];
  size?: number;
}

export function RadarChart({ dimensionScores, size = 300 }: RadarChartProps) {
  const center = size / 2;
  const maxRadius = (size / 2) - 40;

  const dimensions = USER_DIMENSIONS;
  const numDimensions = dimensions.length;
  const angleStep = (2 * Math.PI) / numDimensions;

  // Get score for each dimension (default to 0 if not found)
  const scores = useMemo(() => {
    return dimensions.map((dim) => {
      const score = dimensionScores.find((s) => s.dimensionId === dim.id);
      return score?.score ?? 0;
    });
  }, [dimensions, dimensionScores]);

  // Calculate polygon points for the scores
  const scorePoints = useMemo(() => {
    return scores.map((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const normalizedScore = (score / 7) * maxRadius;
      const x = center + normalizedScore * Math.cos(angle);
      const y = center + normalizedScore * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  }, [scores, angleStep, center, maxRadius]);

  // Generate concentric grid circles
  const gridCircles = [0.25, 0.5, 0.75, 1].map((ratio) => {
    const radius = maxRadius * ratio;
    return { radius, label: Math.round(ratio * 7) };
  });

  // Generate axis lines
  const axes = dimensions.map((dim, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x2 = center + maxRadius * Math.cos(angle);
    const y2 = center + maxRadius * Math.sin(angle);
    const labelX = center + (maxRadius + 25) * Math.cos(angle);
    const labelY = center + (maxRadius + 25) * Math.sin(angle);
    return { x1: center, y1: center, x2, y2, labelX, labelY, name: dim.name.split(" ")[0] };
  });

  // Color based on highest score
  const maxScore = Math.max(...scores);
  const polygonColor = maxScore > 5 ? "#EF4444" : maxScore > 3.5 ? "#F59E0B" : "#10B981";

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid circles */}
        {gridCircles.map(({ radius }, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axes.map(({ x1, y1, x2, y2 }, i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Score polygon */}
        <polygon
          points={scorePoints}
          fill={polygonColor}
          fillOpacity="0.3"
          stroke={polygonColor}
          strokeWidth="2"
        />

        {/* Score points */}
        {scores.map((score, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const normalizedScore = (score / 7) * maxRadius;
          const x = center + normalizedScore * Math.cos(angle);
          const y = center + normalizedScore * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill={polygonColor}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Axis labels */}
        {axes.map(({ labelX, labelY, name }, i) => (
          <text
            key={i}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600 font-medium"
          >
            {name}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          Low (1-3.5)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          Moderate (3.5-5)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          High (5-7)
        </span>
      </div>
    </div>
  );
}
