import { NextResponse } from "next/server";
import { analyzeTrends, TrendAnalysisResult, JournalAnalysisResult } from "@/lib/services/gemini";

interface TrendRequestEntry {
  date: string;
  content: string;
  analysis: JournalAnalysisResult;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entries } = body as { entries: TrendRequestEntry[] };

    if (!entries || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: "Journal entries array is required" },
        { status: 400 }
      );
    }

    if (entries.length < 2) {
      return NextResponse.json(
        { error: "At least 2 analyzed journal entries are required for trend analysis" },
        { status: 400 }
      );
    }

    // Validate each entry has required fields
    for (const entry of entries) {
      if (!entry.date || !entry.content || !entry.analysis) {
        return NextResponse.json(
          { error: "Each entry must have date, content, and analysis" },
          { status: 400 }
        );
      }
    }

    const trendAnalysis: TrendAnalysisResult = await analyzeTrends(entries);

    return NextResponse.json({
      success: true,
      trendAnalysis,
    });
  } catch (error) {
    console.error("Trend analysis error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          { error: "API configuration error. Please check server settings." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze trends. Please try again." },
      { status: 500 }
    );
  }
}
