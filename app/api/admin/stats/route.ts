import { NextRequest, NextResponse } from "next/server";
import { RESEARCH_SAMPLE_STATS } from "@/lib/assessment/scoring";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/stats - Get aggregated statistics
// This is a mock implementation using research sample data
// In production, this would query a database
export async function GET(req: NextRequest) {
  try {
    // Using authentic research sample statistics (n=401)
    const stats = RESEARCH_SAMPLE_STATS;
    
    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalAssessments: stats.overall.n,
          totalUsers: stats.overall.n,
          averageScore: stats.overall.mean,
        },
        averages: {
          frequency: stats.constructs.frequency.mean,
          control: stats.constructs.control.mean,
          emotional: stats.constructs.emotional.mean,
          time: stats.constructs.time.mean,
          compulsive: stats.constructs.compulsive.mean,
          awareness: stats.constructs.awareness.mean,
          interference: stats.constructs.interference.mean,
          coping: stats.constructs.coping.mean,
        },
        distribution: {
          low: 22, // 5.5% of 401
          moderate: 282, // 70.3% of 401
          high: 94, // 23.4% of 401
          severe: 3, // 0.7% of 401
        },
        dataSource: "The Dark at the End of the Tunnel study (n=401)",
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
