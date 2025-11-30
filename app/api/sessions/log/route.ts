import { NextRequest, NextResponse } from "next/server";

interface SessionEvent {
  type: "scroll" | "pause" | "exit" | "switch_app";
  timestamp: string;
  duration?: number;
  scrollDepth?: number;
  platform?: string;
}

interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: string;
  events: SessionEvent[];
}

// In-memory store for demo (in production, use database)
const sessions: Map<string, SessionData> = new Map();

/**
 * POST /api/sessions/log
 * Log session events for time-series analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { sessionId, userId, event } = body;
    
    if (!sessionId || !event) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId or event" },
        { status: 400 }
      );
    }
    
    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        userId,
        startTime: new Date().toISOString(),
        events: [],
      };
      sessions.set(sessionId, session);
    }
    
    // Add event with timestamp
    session.events.push({
      ...event,
      timestamp: new Date().toISOString(),
    });
    
    // In production, save to database:
    // await db.sessionEvents.create({ sessionId, ...event })
    
    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        eventCount: session.events.length,
        sessionDuration: calculateSessionDuration(session),
      },
    });
    
  } catch (error) {
    console.error("Session logging error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log session event" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions/log
 * Get session summary and events
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const userId = searchParams.get("userId");
  
  if (sessionId) {
    // Get specific session
    const session = sessions.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        session,
        summary: summarizeSession(session),
      },
    });
  }
  
  if (userId) {
    // Get all sessions for user (mock data for demo)
    const userSessions = Array.from(sessions.values())
      .filter(s => s.userId === userId);
    
    return NextResponse.json({
      success: true,
      data: {
        sessions: userSessions.map(s => ({
          sessionId: s.sessionId,
          startTime: s.startTime,
          eventCount: s.events.length,
          summary: summarizeSession(s),
        })),
        totalSessions: userSessions.length,
      },
    });
  }
  
  // Return aggregate stats
  const allSessions = Array.from(sessions.values());
  
  return NextResponse.json({
    success: true,
    data: {
      totalSessions: allSessions.length,
      totalEvents: allSessions.reduce((sum, s) => sum + s.events.length, 0),
      averageEventsPerSession: allSessions.length > 0
        ? Math.round(allSessions.reduce((sum, s) => sum + s.events.length, 0) / allSessions.length)
        : 0,
    },
  });
}

function calculateSessionDuration(session: SessionData): number {
  if (session.events.length === 0) return 0;
  
  const startTime = new Date(session.startTime).getTime();
  const lastEvent = session.events[session.events.length - 1];
  const endTime = new Date(lastEvent.timestamp).getTime();
  
  return Math.round((endTime - startTime) / 1000); // Duration in seconds
}

function summarizeSession(session: SessionData): {
  duration: number;
  scrollCount: number;
  pauseCount: number;
  averageScrollDepth: number;
} {
  const scrollEvents = session.events.filter(e => e.type === "scroll");
  const pauseEvents = session.events.filter(e => e.type === "pause");
  
  const averageScrollDepth = scrollEvents.length > 0
    ? scrollEvents.reduce((sum, e) => sum + (e.scrollDepth || 0), 0) / scrollEvents.length
    : 0;
  
  return {
    duration: calculateSessionDuration(session),
    scrollCount: scrollEvents.length,
    pauseCount: pauseEvents.length,
    averageScrollDepth: Math.round(averageScrollDepth * 100) / 100,
  };
}
