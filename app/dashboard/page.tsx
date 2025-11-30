"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Header, Footer } from "@/components/layout";
import { Icon } from "@/components/ui/Icon";
import { Card, CardBody, Button } from "@heroui/react";

interface StoredResult {
  id: string;
  scores: {
    overallScore: number;
    overallSeverity: { label: string };
    completedAt: string;
  };
}

export default function UserDashboardPage() {
  const [lastResult, setLastResult] = useState<StoredResult | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    // Load last assessment result
    const storedResults = localStorage.getItem("assessmentResults");
    if (storedResults) {
      try {
        setLastResult(JSON.parse(storedResults));
      } catch (e) {
        console.error("Failed to parse results:", e);
      }
    }

    // Load session logs count
    const storedLogs = localStorage.getItem("sessionLogs");
    if (storedLogs) {
      try {
        const logs = JSON.parse(storedLogs);
        setSessionCount(logs.length);
      } catch (e) {
        console.error("Failed to parse logs:", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background bg-texture-circuit text-foreground selection:bg-primary selection:text-white flex flex-col">
      {/* Shared Header */}
      <Header variant="floating" />

      <main className="flex-grow max-w-4xl mx-auto px-4 pt-32 pb-12 w-full">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-stone-900 mb-4 tracking-tight">
            Your Dashboard
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Track your journey back to reality. Consistency is key.
          </p>
        </div>

        {/* Quick Stats */}
        {lastResult && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <Card className="bg-white border border-stone-200">
              <CardBody className="p-5 text-center">
                <p className="text-3xl font-black text-primary">
                  {lastResult.scores.overallScore.toFixed(1)}
                </p>
                <p className="text-sm text-stone-500">Last Score</p>
              </CardBody>
            </Card>
            <Card className="bg-white border border-stone-200">
              <CardBody className="p-5 text-center">
                <p className="text-3xl font-black text-amber-600">
                  {lastResult.scores.overallSeverity.label}
                </p>
                <p className="text-sm text-stone-500">Risk Level</p>
              </CardBody>
            </Card>
            <Card className="bg-white border border-stone-200 col-span-2 md:col-span-1">
              <CardBody className="p-5 text-center">
                <p className="text-3xl font-black text-stone-700">
                  {sessionCount}
                </p>
                <p className="text-sm text-stone-500">Sessions Logged</p>
              </CardBody>
            </Card>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Action Card: Take Assessment */}
          <Card
            as={NextLink}
            href="/assessment"
            isPressable
            className="bg-white border border-stone-200 shadow-sm hover:shadow-glow hover:border-primary/30 transition-all duration-300 group h-full"
          >
            <CardBody className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon name="Activity" className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">
                {lastResult ? "Check In Again" : "Take Assessment"}
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                {lastResult 
                  ? "See if your habits have changed. Track your progress over time."
                  : "Measure your current doomscrolling levels. Are you in control today?"}
              </p>
              <span className="inline-flex items-center text-primary font-bold uppercase tracking-wider text-sm">
                Start Assessment{" "}
                <Icon
                  name="ArrowRight"
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </span>
            </CardBody>
          </Card>

          {/* Action Card: Session Logs */}
          <Card
            as={NextLink}
            href="/dashboard/logs"
            isPressable
            className="bg-white border border-stone-200 shadow-sm hover:shadow-glow hover:border-primary/30 transition-all duration-300 group h-full"
          >
            <CardBody className="p-8">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon
                  name="BookOpen"
                  className="w-8 h-8 text-stone-600 group-hover:text-primary transition-colors"
                />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">
                Session Journal
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Log your scrolling sessions. Track triggers, duration, and mood changes.
              </p>
              <span className="inline-flex items-center text-stone-600 font-bold uppercase tracking-wider text-sm group-hover:text-primary transition-colors">
                {sessionCount > 0 ? `View ${sessionCount} Logs` : "Start Logging"}{" "}
                <Icon
                  name="ArrowRight"
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </span>
            </CardBody>
          </Card>

          {/* Action Card: View Results */}
          <Card
            as={NextLink}
            href="/results"
            isPressable
            className="bg-white border border-stone-200 shadow-sm hover:shadow-glow hover:border-primary/30 transition-all duration-300 group h-full"
          >
            <CardBody className="p-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon
                  name="Eye"
                  className="w-8 h-8 text-green-600 group-hover:text-primary transition-colors"
                />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">
                View Results
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                {lastResult 
                  ? "Review your detailed results, predictions, and recommendations."
                  : "Complete an assessment first to see your results."}
              </p>
              <span className="inline-flex items-center text-stone-600 font-bold uppercase tracking-wider text-sm group-hover:text-primary transition-colors">
                See Results{" "}
                <Icon
                  name="ArrowRight"
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </span>
            </CardBody>
          </Card>

          {/* Action Card: Learn More */}
          <Card
            as={NextLink}
            href="/#truth"
            isPressable
            className="bg-white border border-stone-200 shadow-sm hover:shadow-glow hover:border-primary/30 transition-all duration-300 group h-full"
          >
            <CardBody className="p-8">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon
                  name="Lightbulb"
                  className="w-8 h-8 text-amber-600 group-hover:text-primary transition-colors"
                />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">
                Learn More
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                Understand the research behind doomscrolling and its effects on mental health.
              </p>
              <span className="inline-flex items-center text-stone-600 font-bold uppercase tracking-wider text-sm group-hover:text-primary transition-colors">
                Read Research{" "}
                <Icon
                  name="ArrowRight"
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                />
              </span>
            </CardBody>
          </Card>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer variant="minimal" />
    </div>
  );
}
