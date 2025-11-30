import { NextRequest, NextResponse } from "next/server";
import { calculateAssessmentResults, AssessmentResponse } from "@/lib/assessment/scoring";
import { generatePredictiveProfile } from "@/lib/assessment/predictions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { responses } = body;

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid responses" },
        { status: 400 }
      );
    }

    // Parse responses
    const parsedResponses: AssessmentResponse[] = responses.map((r: any) => ({
      questionId: r.questionId,
      score: r.score,
      timestamp: new Date(r.timestamp || Date.now()),
    }));

    // Calculate scores
    const sessionId = `session_${Date.now()}`;
    const results = calculateAssessmentResults(parsedResponses, sessionId);
    
    // Generate predictions (pass percentile for consistency)
    const predictions = generatePredictiveProfile(
      results.constructScoreMap,
      results.overallScore,
      results.overallPercentile
    );

    // In production, save to database here
    // For now, just return the results

    return NextResponse.json({
      success: true,
      data: {
        id: sessionId,
        scores: results,
        predictions,
      },
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit assessment" },
      { status: 500 }
    );
  }
}
