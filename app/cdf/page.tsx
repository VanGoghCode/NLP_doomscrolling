"use client";

import React, { useState } from 'react';
import { CDFChart } from '@/components/results/CDFChart';
import { RESEARCH_SAMPLE_STATS } from '@/lib/assessment/scoring';

export default function CDFDemoPage() {
  const [userScore, setUserScore] = useState<number>(4.0);
  const [selectedConstruct, setSelectedConstruct] = useState<string>('overall');

  const constructOptions = [
    { id: 'overall', name: 'Overall Score', ...RESEARCH_SAMPLE_STATS.overall },
    { id: 'frequency', name: 'DS1: Frequency', ...RESEARCH_SAMPLE_STATS.constructs.frequency },
    { id: 'control', name: 'DS2: Control', ...RESEARCH_SAMPLE_STATS.constructs.control },
    { id: 'emotional', name: 'DS3: Emotional', ...RESEARCH_SAMPLE_STATS.constructs.emotional },
    { id: 'time', name: 'DS4: Time Distortion', ...RESEARCH_SAMPLE_STATS.constructs.time },
    { id: 'compulsive', name: 'DS5: Compulsive', ...RESEARCH_SAMPLE_STATS.constructs.compulsive },
    { id: 'awareness', name: 'DS6: Awareness', ...RESEARCH_SAMPLE_STATS.constructs.awareness },
    { id: 'interference', name: 'DS7: Interference', ...RESEARCH_SAMPLE_STATS.constructs.interference },
    { id: 'coping', name: 'DS8: Coping', ...RESEARCH_SAMPLE_STATS.constructs.coping },
  ];

  const selectedStats = constructOptions.find(c => c.id === selectedConstruct) || constructOptions[0];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          CDF Visualization
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Cumulative Distribution Function for Doomscrolling Research Data
        </p>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Controls
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Construct selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Construct
              </label>
              <select
                value={selectedConstruct}
                onChange={(e) => setSelectedConstruct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
              >
                {constructOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} (μ={opt.mean}, σ={opt.sd})
                  </option>
                ))}
              </select>
            </div>

            {/* Score slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Score: <span className="font-bold text-blue-600">{userScore.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="7"
                step="0.1"
                value={userScore}
                onChange={(e) => setUserScore(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Low)</span>
                <span>4 (Average)</span>
                <span>7 (High)</span>
              </div>
            </div>
          </div>

          {/* Statistics display */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-emerald-600">{selectedStats.mean}</div>
              <div className="text-xs text-gray-500">Mean (μ)</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{selectedStats.sd}</div>
              <div className="text-xs text-gray-500">Std Dev (σ)</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">401</div>
              <div className="text-xs text-gray-500">Sample Size (n)</div>
            </div>
          </div>
        </div>

        {/* CDF Chart */}
        <CDFChart
          userScore={userScore}
          mean={selectedStats.mean}
          sd={selectedStats.sd}
          title={`Cumulative Distribution Function (CDF): ${selectedStats.name}`}
          width={700}
          height={450}
          isAwareness={selectedConstruct === 'awareness'}
        />

        {/* Explanation */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg mt-6">
          
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            
            <p>
              <strong>How to read this chart:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The <span className="text-blue-600 font-medium">blue curve</span> shows the CDF</li>
              <li>The <span className="text-emerald-600 font-medium">green dashed line</span> marks the mean (50th percentile)</li>
              <li>The <span className="text-red-600 font-medium">red dot</span> shows where your score falls</li>
              <li>The Y-axis shows the percentile (0-100%)</li>
              <li>Higher percentile = higher doomscrolling behavior (except for DS6: Awareness)</li>
            </ul>
            
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-emerald-700 dark:text-emerald-400">
                <strong>⚠️ Note on DS6 (Awareness):</strong> This is the only construct where a 
                <strong> high score is GOOD</strong>. High awareness of your scrolling habits is a 
                protective factor that helps manage doomscrolling behavior.
              </p>
            </div>
            
            <p className="mt-4">
              <strong>Example:</strong> If your score is 4.5 and the chart shows 91%, 
              it means you score higher than 91% of the research participants.
            </p>
          </div>
        </div>

        {/* Z-Score Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg mt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Z-Score to Percentile Reference
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left">Z-Score</th>
                  <th className="px-4 py-2 text-left">Percentile</th>
                  <th className="px-4 py-2 text-left">Score (μ={selectedStats.mean}, σ={selectedStats.sd})</th>
                  <th className="px-4 py-2 text-left">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { z: -2, pct: 2.3, label: 'Very Low' },
                  { z: -1, pct: 15.9, label: 'Low' },
                  { z: 0, pct: 50, label: 'Average' },
                  { z: 1, pct: 84.1, label: 'High' },
                  { z: 2, pct: 97.7, label: 'Very High' },
                ].map(row => (
                  <tr key={row.z} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 font-mono">{row.z > 0 ? '+' : ''}{row.z}</td>
                    <td className="px-4 py-2">{row.pct}%</td>
                    <td className="px-4 py-2 font-mono">
                      {(selectedStats.mean + row.z * selectedStats.sd).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-gray-500">{row.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
