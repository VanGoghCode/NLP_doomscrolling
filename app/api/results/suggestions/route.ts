import { NextResponse } from "next/server";
import { generateAISuggestions, AssessmentResultsForAI } from "@/lib/services/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const results: AssessmentResultsForAI = body.results;

    if (!results || typeof results.overallScore !== "number") {
      return NextResponse.json(
        { error: "Valid assessment results are required" },
        { status: 400 }
      );
    }

    const suggestions = await generateAISuggestions(results);

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("AI suggestions error:", error);

    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          { error: "API configuration error. Please check server settings." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate AI suggestions. Please try again." },
      { status: 500 }
    );
  }
}
