"use client";

import { getSeverityLevel } from "@/lib/assessment/constructs";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  showLabel?: boolean;
}

export function ScoreGauge({
  score,
  maxScore = 7,
  size = 200,
  showLabel = true,
}: ScoreGaugeProps) {
  const severity = getSeverityLevel(score);
  const percentage = (score / maxScore) * 100;
  
  // SVG parameters
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Only show 270 degrees of the circle (3/4)
  const arcLength = circumference * 0.75;
  
  // Calculate how much of the arc to fill based on the score
  // percentage of 100% = fill full arc, percentage of 0% = fill nothing
  const filledLength = (arcLength * percentage) / 100;
  
  // strokeDashoffset hides the stroke from the beginning
  // To show filledLength, we need to offset by (arcLength - filledLength)
  // But since we draw starting from 0, we want the colored part to grow
  // So we use the dasharray trick: first dash is what's visible
  
  // Rotation to start from bottom-left (135deg puts start at 7:30 position)
  const rotation = 135;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Background arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          
          {/* Score arc - use dasharray to show only the filled portion */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={severity.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filledLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ paddingTop: size * 0.1 }}
        >
          <span
            className="text-4xl md:text-5xl font-bold"
            style={{ color: severity.color }}
          >
            {score.toFixed(1)}
          </span>
          <span className="text-gray-500 text-sm">out of {maxScore}</span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-4 text-center">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${severity.color}20`,
              color: severity.color,
            }}
          >
            {severity.label} Risk
          </span>
        </div>
      )}
    </div>
  );
}
