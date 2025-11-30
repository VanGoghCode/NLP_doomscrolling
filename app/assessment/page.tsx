"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentForm } from "@/components/assessment/AssessmentForm";
import { AssessmentResponse } from "@/lib/assessment/scoring";
import { Header, Footer } from "@/components/layout";
import { Icon } from "@/components/ui/Icon";

export default function AssessmentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleComplete = useCallback(async (responses: AssessmentResponse[]) => {
    try {
      setError(null);
      
      // Submit to API
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to submit assessment");
      }

      // Store results in localStorage for the results page
      localStorage.setItem("assessmentResults", JSON.stringify(data.data));

      // Redirect to results page
      router.push("/results");
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 bg-texture-dots flex flex-col">
      {/* Shared Header */}
      <Header variant="sticky" transparent />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Doomscrolling Self-Assessment
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Answer the following 24 questions honestly to understand your
            scrolling habits and receive predictive insights and personalized 
            recommendations. This assessment is based on research from 
            &quot;The Dark at the End of the Tunnel&quot; study (n=401 participants).
          </p>
        </div>

        {/* Tips */}
        <div className="bg-purple-50 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Icon name="Lightbulb" className="w-6 h-6 text-radium-purple" />
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-1">Tips for best results:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-600">
              <li>Answer based on your typical behavior over the past week</li>
              <li>Be honest-there are no right or wrong answers</li>
              <li>Take your time with each question</li>
            </ul>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <Icon name="Target" className="w-6 h-6 text-red-500" />
            <div className="text-sm text-red-700">
              <p className="font-medium mb-1">Something went wrong</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Assessment form */}
        <AssessmentForm onComplete={handleComplete} />
      </main>

      {/* Shared Footer */}
      <Footer variant="minimal" />
    </div>
  );
}
