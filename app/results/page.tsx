"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  AssessmentResponse,
  calculateAssessmentResults,
  AssessmentResult,
} from "@/lib/assessment/scoring";
import {
  generatePredictiveProfile,
  getRiskLevelLabel,
  PredictiveProfile,
} from "@/lib/assessment/predictions";
import { AISuggestionsResult } from "@/lib/services/gemini";
import { ScoreGauge } from "@/components/results/ScoreGauge";
import { RadarChart } from "@/components/results/RadarChart";
import { DimensionBreakdown } from "@/components/results/DimensionBreakdown";
import { ComparisonCard } from "@/components/results/ComparisonCard";
import { Header, Footer } from "@/components/layout";

import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Spinner,
  Progress,
} from "@heroui/react";
import { Icon } from "@/components/ui/Icon";

export default function ResultsPage() {
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [predictions, setPredictions] = useState<PredictiveProfile | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionsResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "dimensions" | "predictions" | "recommendations" | "ai-coach"
  >("overview");

  useEffect(() => {
    // Load results from localStorage (saved by assessment page after API call)
    const storedResults = localStorage.getItem("assessmentResults");

    if (storedResults) {
      try {
        const data = JSON.parse(storedResults);
        
        // The API returns { id, scores, predictions }
        if (data.scores) {
          const scores = data.scores;
          // Reconstruct the result object with proper Date
          const calculatedResults: AssessmentResult = {
            ...scores,
            completedAt: new Date(scores.completedAt),
          };
          setResults(calculatedResults);
          
          // Use predictions from API response
          if (data.predictions) {
            setPredictions(data.predictions);
          }
        }
      } catch (error) {
        console.error("Error parsing stored results:", error);
      }
    }

    setIsLoading(false);
  }, []);

  // Get all recommendations from top concerns
  const allRecommendations = useMemo(() => {
    if (!results) return [];
    return results.topConcerns.flatMap((concern) => concern.recommendations);
  }, [results]);

  // Load AI suggestions
  const loadAISuggestions = async () => {
    if (!results || !predictions) return;
    
    setIsLoadingAI(true);
    setAiError(null);

    try {
      const response = await fetch("/api/results/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: {
            overallScore: results.overallScore,
            severity: results.overallSeverity.label,
            percentile: results.overallPercentile,
            riskLevel: predictions.riskLevel,
            weeklyTimeEstimate: predictions.weeklyTimeEstimate,
            dimensionScores: results.dimensionScores.map((d) => ({
              id: d.dimensionId,
              name: d.name,
              score: d.score,
              severity: d.severity,
            })),
            topConcerns: results.topConcerns.map((c) => ({
              name: c.name,
              score: c.score,
            })),
            riskFactors: predictions.riskFactors,
            protectiveFactors: predictions.protectiveFactors,
          },
        }),
      });

      if (response.ok) {
        const { suggestions } = await response.json();
        setAiSuggestions(suggestions);
      } else {
        const data = await response.json();
        setAiError(data.error || "Failed to load AI suggestions");
      }
    } catch (error) {
      console.error("AI suggestions error:", error);
      setAiError("Network error. Please check your connection.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-stone-500 font-medium">
            Analyzing your reality...
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">
            No Results Found
          </h1>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            You haven&apos;t taken the assessment yet. The first step to
            recovery is awareness.
          </p>
          <Button
            as={Link}
            href="/assessment"
            size="lg"
            className="bg-primary text-white font-bold shadow-lg shadow-primary/20"
            endContent={<Icon name="ArrowRight" className="w-5 h-5" />}
          >
            Take the Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-texture-hexagon text-foreground selection:bg-primary selection:text-white flex flex-col">
      {/* Shared Header */}
      <Header variant="floating" />

      {/* Main content */}
      <main className="flex-grow max-w-5xl mx-auto px-3 sm:px-4 pt-24 sm:pt-32 pb-8 sm:pb-12 w-full">
        {/* Results header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 mb-3 sm:mb-4 tracking-tight">
            Your Reality Check
          </h1>
          <p className="text-stone-500 text-sm sm:text-base">
            Completed on {results.completedAt.toLocaleDateString()}
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-6 sm:mb-10 overflow-x-auto pb-2">
          <Tabs
            aria-label="Result Sections"
            color="primary"
            variant="underlined"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as any)}
            classNames={{
              tabList:
                "gap-2 sm:gap-6 border-b border-stone-200 w-full justify-start sm:justify-center p-0 min-w-max",
              cursor: "w-full bg-primary h-1",
              tab: "max-w-fit px-2 sm:px-3 h-10 sm:h-12 text-stone-500 font-medium text-xs sm:text-sm",
              tabContent:
                "group-data-[selected=true]:text-primary group-data-[selected=true]:font-bold",
            }}
          >
            <Tab key="overview" title="Overview" />
            <Tab key="dimensions" title="Dimensions" />
            <Tab key="predictions" title="Predictions" />
            <Tab key="recommendations" title={<span className="hidden sm:inline">Action Plan</span>} />
            <Tab 
              key="ai-coach" 
              title={
                <span className="flex items-center gap-1 sm:gap-1.5">
                  <Icon name="Sparkles" className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">AI Coach</span>
                  <span className="sm:hidden">AI</span>
                </span>
              } 
            />
          </Tabs>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Overall score */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-4 sm:mb-8 text-center uppercase tracking-wider">
                Doomscrolling Severity
              </h3>
              <ScoreGauge score={results.overallScore} />
              <p className="text-center text-stone-600 mt-4 sm:mt-6 font-medium text-sm sm:text-base">
                {results.overallSeverity.description}
              </p>
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-4 sm:mb-8 text-center uppercase tracking-wider">
                Your Pattern
              </h3>
              <div className="flex justify-center">
                <RadarChart dimensionScores={results.dimensionScores} size={280} />
              </div>
            </div>

            {/* Comparison */}
            <div className="md:col-span-2">
              <ComparisonCard
                score={results.overallScore}
                percentile={results.overallPercentile}
              />
            </div>

            {/* Top concerns */}
            {results.topConcerns.length > 0 && (
              <div className="md:col-span-2 bg-primary/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-primary/10">
                <h3 className="text-base sm:text-lg font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2 uppercase tracking-wider">
                  <Icon name="Target" className="w-4 h-4 sm:w-5 sm:h-5" />
                  Critical Areas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {results.topConcerns.map((concern) => (
                    <div
                      key={concern.dimensionId}
                      className="bg-white rounded-xl p-4 sm:p-6 border border-primary/20 shadow-sm"
                    >
                      <h4 className="font-bold text-stone-900 text-base sm:text-lg mb-2">
                        {concern.name}
                      </h4>
                      <div className="flex items-center gap-2 text-primary font-medium text-sm sm:text-base">
                        <span>Score: {concern.score.toFixed(1)}/7</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase">
                        {concern.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dimensions Tab */}
        {activeTab === "dimensions" && (
          <div className="max-w-3xl mx-auto px-0 sm:px-4">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 sm:mb-8">
              Detailed Breakdown
            </h3>
            <DimensionBreakdown
              dimensionScores={results.dimensionScores}
              showRecommendations={false}
            />
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === "predictions" && predictions && (
          <div className="max-w-4xl mx-auto">
            {/* Risk Score Header */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-texture-diagonal opacity-50"></div>
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center md:flex-row md:text-left md:justify-between gap-4 sm:gap-6">
                  <div>
                    <p className="text-stone-400 uppercase tracking-wider text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                      Predictive Risk Assessment
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black mb-1 sm:mb-2">
                      {getRiskLevelLabel(predictions.riskLevel).label}
                    </h3>
                    <p className="text-stone-300 text-sm sm:text-base">
                      {getRiskLevelLabel(predictions.riskLevel).description}
                    </p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="text-5xl sm:text-6xl font-black"
                      style={{ color: getRiskLevelLabel(predictions.riskLevel).color }}
                    >
                      {predictions.riskScore}
                    </div>
                    <p className="text-stone-400 text-xs sm:text-sm">Risk Score</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4 sm:mt-6">
                  <Progress 
                    value={predictions.riskScore} 
                    maxValue={100}
                    classNames={{
                      track: "bg-stone-700",
                      indicator: `bg-gradient-to-r from-green-500 via-yellow-500 to-red-500`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-stone-500 mt-2">
                    <span>Minimal</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison to Research Sample */}
            <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-primary/10">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-primary">
                    {predictions.comparisonToSample.percentile}%
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">Your Percentile (n=401)</h4>
                  <p className="text-stone-600 text-xs sm:text-sm">
                    {predictions.comparisonToSample.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Time Estimate */}
            <div className="bg-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-amber-200">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
                <Icon name="Clock" className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">Estimated Weekly Scrolling Time</h4>
                  <p className="text-xl sm:text-2xl font-black text-amber-600">
                    {predictions.weeklyTimeEstimate.min}–{predictions.weeklyTimeEstimate.max} hours
                  </p>
                  <p className="text-stone-500 text-xs sm:text-sm">Based on your frequency and time distortion scores</p>
                </div>
              </div>
            </div>

            {/* Predictions Grid */}
            <h4 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Icon name="Activity" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Predictive Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {predictions.predictions.map((prediction) => (
                <div 
                  key={prediction.id}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                    prediction.category === 'positive' 
                      ? 'bg-green-50 border-green-200' 
                      : prediction.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : prediction.severity === 'high'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <h5 className="font-bold text-stone-900 text-sm sm:text-base">{prediction.title}</h5>
                    <span className={`text-xs font-bold px-2 py-1 rounded w-fit ${
                      prediction.category === 'positive'
                        ? 'bg-green-100 text-green-700'
                        : prediction.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : prediction.severity === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {prediction.probability}% likely
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm mb-3 sm:mb-4">{prediction.description}</p>
                  <div className="bg-white/50 rounded-lg p-2 sm:p-3 border border-stone-100">
                    <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Recommendation</p>
                    <p className="text-xs sm:text-sm text-stone-700 font-medium">{prediction.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk & Protective Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {predictions.riskFactors.length > 0 && (
                <div className="bg-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-100">
                  <h5 className="font-bold text-red-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Icon name="Target" className="w-4 h-4 sm:w-5 sm:h-5" />
                    Risk Factors
                  </h5>
                  <ul className="space-y-2">
                    {predictions.riskFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-red-700 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {predictions.protectiveFactors.length > 0 && (
                <div className="bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100">
                  <h5 className="font-bold text-green-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Icon name="Shield" className="w-4 h-4 sm:w-5 sm:h-5" />
                    Protective Factors
                  </h5>
                  <ul className="space-y-2">
                    {predictions.protectiveFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-green-700 text-xs sm:text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Research Note */}
            <div className="mt-6 sm:mt-8 text-center text-stone-400 text-xs sm:text-sm">
              <p>Predictions based on patterns observed in research data from 401 participants.</p>
              <p>These are probabilistic estimates, not certainties.</p>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === "recommendations" && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6 sm:mb-8">
              Your Recovery Plan
            </h3>

            {allRecommendations.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {allRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm flex items-start gap-3 sm:gap-6 hover:shadow-md transition-shadow"
                  >
                    <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg shadow-primary/20">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-stone-700 text-sm sm:text-lg leading-relaxed font-medium">
                        {rec}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-green-100">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="Check" className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                </div>
                <h4 className="font-bold text-green-800 text-lg sm:text-xl mb-2">
                  You are in control.
                </h4>
                <p className="text-green-700 text-sm sm:text-base">
                  Your habits are healthy. Maintain your awareness and keep
                  living in the real world.
                </p>
              </div>
            )}

            {/* General tips */}
            <div className="mt-8 sm:mt-12 bg-stone-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200">
              <h4 className="font-bold text-stone-900 mb-4 sm:mb-6 flex items-center gap-2 text-base sm:text-lg">
                <Icon name="Lightbulb" className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Universal Truths
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 sm:mt-2.5"></span>
                  <span className="text-stone-600 text-sm sm:text-lg">
                    Real life happens offline. Don&apos;t miss it.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 sm:mt-2.5"></span>
                  <span className="text-stone-600 text-sm sm:text-lg">
                    Your attention is a currency. Stop spending it on things
                    that don&apos;t matter.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 sm:mt-2.5"></span>
                  <span className="text-stone-600 text-sm sm:text-lg">
                    Boredom is not the enemy. It&apos;s the birthplace of creativity.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* AI Coach Tab */}
        {activeTab === "ai-coach" && (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-texture-diagonal opacity-20"></div>
              <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:text-left gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon name="Sparkles" className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-black mb-1 sm:mb-2">AI Wellness Coach</h3>
                  <p className="text-white/80 text-sm sm:text-base">
                    Get personalized guidance based on your unique assessment results. 
                    Our AI analyzes your patterns to create a tailored recovery plan.
                  </p>
                </div>
                {!aiSuggestions && !isLoadingAI && (
                  <Button
                    onPress={loadAISuggestions}
                    className="bg-white text-amber-600 font-bold px-4 sm:px-6"
                    size="md"
                  >
                    Get AI Suggestions
                  </Button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoadingAI && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-stone-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-stone-600 font-medium text-sm sm:text-base">Analyzing your results and creating personalized suggestions...</p>
                <p className="text-stone-400 text-xs sm:text-sm mt-2">This may take a few seconds</p>
              </div>
            )}

            {/* Error State */}
            {aiError && !isLoadingAI && (
              <div className="bg-red-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-red-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="AlertCircle" className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                </div>
                <p className="text-red-700 font-medium mb-2 text-sm sm:text-base">{aiError}</p>
                <p className="text-red-500 text-xs sm:text-sm mb-4">Make sure GEMINI_API_KEY is configured in your .env file</p>
                <Button
                  onPress={loadAISuggestions}
                  color="danger"
                  variant="flat"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* AI Suggestions Content */}
            {aiSuggestions && !isLoadingAI && (
              <div className="space-y-6 sm:space-y-8">
                {/* Personalized Message */}
                <div className="bg-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
                  <p className="text-amber-900 text-sm sm:text-lg leading-relaxed">
                    {aiSuggestions.personalizedMessage}
                  </p>
                </div>

                {/* Top Priorities */}
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Icon name="Target" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Your Top Priorities
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {aiSuggestions.topPriorities.map((priority, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm sm:text-lg">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                              <h5 className="font-bold text-stone-900 text-sm sm:text-lg">{priority.title}</h5>
                              <span className={`text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full ${
                                priority.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                priority.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {priority.difficulty}
                              </span>
                              <span className="text-xs text-stone-400">{priority.timeframe}</span>
                            </div>
                            <p className="text-stone-600 text-xs sm:text-base mb-3 sm:mb-4">{priority.description}</p>
                            <div className="bg-stone-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                              <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Action Steps</p>
                              <ul className="space-y-1.5 sm:space-y-2">
                                {priority.actionSteps.map((step, stepIdx) => (
                                  <li key={stepIdx} className="flex items-start gap-2 text-stone-700 text-xs sm:text-sm">
                                    <Icon name="Check" className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Habits */}
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Icon name="Calendar" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Daily Habits to Build
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {aiSuggestions.dailyHabits.map((habit, idx) => (
                      <div
                        key={idx}
                        className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-green-200"
                      >
                        <h5 className="font-bold text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">{habit.habit}</h5>
                        <p className="text-green-700 text-xs sm:text-sm mb-2 sm:mb-3">{habit.why}</p>
                        <div className="flex items-center gap-2 text-green-600 text-xs">
                          <Icon name="Clock" className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">{habit.when}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mindset Shifts */}
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Icon name="Brain" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Mindset Shifts
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    {aiSuggestions.mindsetShifts.map((shift, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 border border-stone-200"
                      >
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-3">
                          <div className="flex-1 bg-red-50 rounded-lg p-2 sm:p-3 text-center">
                            <p className="text-xs text-red-500 uppercase mb-1">From</p>
                            <p className="text-red-700 font-medium text-xs sm:text-sm">&quot;{shift.from}&quot;</p>
                          </div>
                          <Icon name="ArrowRight" className="w-5 h-5 sm:w-6 sm:h-6 text-stone-400 flex-shrink-0 self-center rotate-90 sm:rotate-0" />
                          <div className="flex-1 bg-green-50 rounded-lg p-2 sm:p-3 text-center">
                            <p className="text-xs text-green-500 uppercase mb-1">To</p>
                            <p className="text-green-700 font-medium text-xs sm:text-sm">&quot;{shift.to}&quot;</p>
                          </div>
                        </div>
                        <p className="text-stone-600 text-xs sm:text-sm">{shift.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Goal */}
                <div className="bg-gradient-to-br from-primary to-amber-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
                  <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Icon name="Target" className="w-4 h-4 sm:w-5 sm:h-5" />
                    This Week&apos;s Goal
                  </h4>
                  <div className="bg-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 mb-3 sm:mb-4">
                    <p className="text-sm sm:text-lg font-medium">{aiSuggestions.weeklyGoal.goal}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                      <p className="text-xs text-white/70 uppercase mb-1">How to Measure</p>
                      <p className="text-xs sm:text-sm">{aiSuggestions.weeklyGoal.metric}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                      <p className="text-xs text-white/70 uppercase mb-1">Reward Yourself</p>
                      <p className="text-xs sm:text-sm">{aiSuggestions.weeklyGoal.reward}</p>
                    </div>
                  </div>
                </div>

                {/* Encouragement */}
                <div className="bg-stone-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-stone-200">
                  <Icon name="Heart" className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
                  <p className="text-stone-700 text-sm sm:text-lg leading-relaxed italic">
                    &quot;{aiSuggestions.encouragement}&quot;
                  </p>
                </div>

                {/* Regenerate Button */}
                <div className="text-center">
                  <Button
                    onPress={loadAISuggestions}
                    variant="bordered"
                    className="border-primary text-primary"
                    size="sm"
                    startContent={<Icon name="RefreshCw" className="w-3 h-3 sm:w-4 sm:h-4" />}
                  >
                    Get New Suggestions
                  </Button>
                </div>
              </div>
            )}

            {/* CTA if no suggestions yet */}
            {!aiSuggestions && !isLoadingAI && !aiError && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-stone-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Sparkles" className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-stone-900 mb-2">Ready for Personalized Guidance?</h4>
                <p className="text-stone-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                  Our AI will analyze your assessment results and create a custom action plan 
                  tailored to your specific patterns and challenges.
                </p>
                <Button
                  onPress={loadAISuggestions}
                  color="warning"
                  className="bg-primary text-white font-bold"
                  size="md"
                  startContent={<Icon name="Sparkles" className="w-4 h-4 sm:w-5 sm:h-5" />}
                >
                  Generate AI Suggestions
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6">
          <Button
            as={Link}
            href="/assessment"
            variant="bordered"
            className="font-bold border-stone-200 text-stone-600 hover:border-primary hover:text-primary"
            size="md"
          >
            Retake Assessment
          </Button>
          <Button
            as={Link}
            href="/journal"
            className="bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40"
            size="md"
            startContent={<Icon name="BookOpen" className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            Start Journaling
          </Button>
        </div>

        {/* Journal CTA */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-200">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="BookOpen" className="w-7 h-7 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-1 sm:mb-2">
                Go Deeper with Your Personal Journal
              </h3>
              <p className="text-stone-600 text-sm sm:text-base">
                Track your daily scrolling experiences and get AI-powered insights about your emotional patterns, 
                triggers, and progress over time. Writing helps build awareness, your first step to change.
              </p>
            </div>
            <Button
              as={Link}
              href="/journal"
              color="warning"
              className="bg-primary text-white font-bold px-4 sm:px-6"
              size="md"
            >
              Open Journal
            </Button>
          </div>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer variant="minimal" />
    </div>
  );
}
