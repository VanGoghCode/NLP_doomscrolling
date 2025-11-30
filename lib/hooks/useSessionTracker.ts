"use client";

import { useCallback, useEffect, useRef } from "react";

interface SessionEvent {
  type: "scroll" | "pause" | "exit" | "switch_app" | "assessment_start" | "assessment_complete";
  scrollDepth?: number;
  platform?: string;
  metadata?: Record<string, unknown>;
}

interface UseSessionTrackerOptions {
  userId?: string;
  enabled?: boolean;
  autoLogScroll?: boolean;
  scrollThrottle?: number;
}

/**
 * Hook for tracking user sessions and logging events
 */
export function useSessionTracker(options: UseSessionTrackerOptions = {}) {
  const {
    userId,
    enabled = true,
    autoLogScroll = false,
    scrollThrottle = 1000,
  } = options;

  const sessionIdRef = useRef<string | null>(null);
  const lastScrollLogRef = useRef<number>(0);

  // Generate or retrieve session ID
  useEffect(() => {
    if (!enabled) return;

    // Check for existing session
    let sessionId = sessionStorage.getItem("doomscroll_session_id");
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("doomscroll_session_id", sessionId);
    }
    
    sessionIdRef.current = sessionId;

    // Log session start
    logEvent({ type: "scroll", metadata: { action: "session_start" } });

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logEvent({ type: "switch_app" });
      }
    };

    // Handle before unload
    const handleBeforeUnload = () => {
      logEvent({ type: "exit" });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);

  // Auto-track scrolling
  useEffect(() => {
    if (!enabled || !autoLogScroll) return;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollLogRef.current < scrollThrottle) return;
      lastScrollLogRef.current = now;

      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      logEvent({ type: "scroll", scrollDepth });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled, autoLogScroll, scrollThrottle]);

  // Log event to API
  const logEvent = useCallback(async (event: SessionEvent) => {
    if (!enabled || !sessionIdRef.current) return;

    try {
      await fetch("/api/sessions/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          userId,
          event: {
            ...event,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error("Failed to log session event:", error);
    }
  }, [enabled, userId]);

  // Log assessment events
  const logAssessmentStart = useCallback(() => {
    logEvent({ type: "assessment_start" });
  }, [logEvent]);

  const logAssessmentComplete = useCallback((score: number) => {
    logEvent({
      type: "assessment_complete",
      metadata: { score },
    });
  }, [logEvent]);

  // Log pause (when user stops scrolling for a period)
  const logPause = useCallback((duration: number) => {
    logEvent({
      type: "pause",
      metadata: { duration },
    });
  }, [logEvent]);

  return {
    sessionId: sessionIdRef.current,
    logEvent,
    logAssessmentStart,
    logAssessmentComplete,
    logPause,
  };
}

/**
 * Get current session ID (for components that don't need the full hook)
 */
export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("doomscroll_session_id");
}
