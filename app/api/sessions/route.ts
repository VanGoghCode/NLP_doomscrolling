import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock session storage (in-memory for demo)
const mockSessions: Record<string, any[]> = {};

// GET /api/sessions - Get all sessions for a user
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const sessions = mockSessions[userId] || [];
    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create a new session log
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, duration, platform, moodBefore, moodAfter, notes } = body;

    if (!userId || !duration) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const session = {
      id: `session_${Date.now()}`,
      userId,
      duration: parseInt(duration),
      platform,
      moodBefore: parseInt(moodBefore),
      moodAfter: parseInt(moodAfter),
      notes,
      startedAt: new Date().toISOString(),
    };

    if (!mockSessions[userId]) {
      mockSessions[userId] = [];
    }
    mockSessions[userId].push(session);

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create session" },
      { status: 500 }
    );
  }
}
