import { NextResponse } from "next/server";
import { analyzeJournalEntry, JournalAnalysisResult } from "@/lib/services/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Journal content is required" },
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { error: "Please write at least 20 characters for meaningful analysis" },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: "Journal entry is too long. Please keep it under 10,000 characters" },
        { status: 400 }
      );
    }

    const analysis: JournalAnalysisResult = await analyzeJournalEntry(content);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Journal analysis error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          { error: "API configuration error. Please check server settings." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze journal entry. Please try again." },
      { status: 500 }
    );
  }
}
