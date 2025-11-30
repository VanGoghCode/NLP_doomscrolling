"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Chip } from "@heroui/react";
import { Icon } from "@/components/ui/Icon";

interface SessionLog {
  id: string;
  duration: number;
  platform: string;
  moodBefore: number;
  moodAfter: number;
  trigger?: string;
  notes?: string;
  startedAt: string;
}

interface SessionLogListProps {
  userId: string;
  refreshTrigger: number;
}

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "Twitter/X",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  reddit: "Reddit",
  youtube: "YouTube",
  news: "News Sites",
  other: "Other",
};

export function SessionLogList({
  userId,
  refreshTrigger,
}: SessionLogListProps) {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load logs from localStorage
    try {
      const storedLogs = localStorage.getItem("sessionLogs");
      if (storedLogs) {
        const allLogs: SessionLog[] = JSON.parse(storedLogs);
        // Filter by userId if needed (for now show all)
        setLogs(allLogs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, refreshTrigger]);

  const getMoodEmoji = (mood: number) => {
    if (mood <= 3) return "😢";
    if (mood <= 5) return "😐";
    if (mood <= 7) return "🙂";
    return "😊";
  };

  const getMoodChange = (before: number, after: number) => {
    const diff = after - before;
    if (diff > 0) return { text: `+${diff}`, color: "text-green-600", bg: "bg-green-50" };
    if (diff < 0) return { text: `${diff}`, color: "text-red-600", bg: "bg-red-50" };
    return { text: "0", color: "text-stone-500", bg: "bg-stone-50" };
  };

  const getTotalTime = () => {
    return logs.reduce((acc, log) => acc + (log.duration || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-12 text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
        <Icon name="BookOpen" className="w-12 h-12 mx-auto mb-4 text-stone-300" />
        <p className="font-medium">No sessions logged yet</p>
        <p className="text-sm mt-1">Start tracking your scrolling habits above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-stone-200 text-center">
          <p className="text-2xl font-bold text-primary">{logs.length}</p>
          <p className="text-sm text-stone-500">Sessions</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200 text-center">
          <p className="text-2xl font-bold text-amber-600">{getTotalTime()}</p>
          <p className="text-sm text-stone-500">Total Minutes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200 text-center">
          <p className="text-2xl font-bold text-stone-700">
            {logs.length > 0 ? Math.round(getTotalTime() / logs.length) : 0}
          </p>
          <p className="text-sm text-stone-500">Avg. Duration</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-200 text-center">
          <p className="text-2xl font-bold text-red-500">
            {logs.filter(l => l.moodAfter < l.moodBefore).length}
          </p>
          <p className="text-sm text-stone-500">Mood Drops</p>
        </div>
      </div>

      {/* Log List */}
      <div className="space-y-4">
        {logs.map((log, index) => {
          const moodChange = getMoodChange(log.moodBefore, log.moodAfter);
          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white border border-stone-200 hover:shadow-md transition-shadow">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm"
                        className="font-medium"
                      >
                        {PLATFORM_LABELS[log.platform] || log.platform || "Unknown"}
                      </Chip>
                      <span className="text-sm text-stone-400">
                        {new Date(log.startedAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <Chip 
                      variant="bordered" 
                      size="sm"
                      className="border-stone-300"
                    >
                      {log.duration} min
                    </Chip>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 text-sm">Mood:</span>
                      <span className="text-lg">{getMoodEmoji(log.moodBefore)}</span>
                      <span className="text-stone-400">→</span>
                      <span className="text-lg">{getMoodEmoji(log.moodAfter)}</span>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${moodChange.bg} ${moodChange.color}`}>
                        {moodChange.text}
                      </span>
                    </div>
                  </div>

                  {log.trigger && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-sm text-stone-500">
                        <span className="font-medium text-stone-600">Trigger:</span> {log.trigger}
                      </p>
                    </div>
                  )}

                  {log.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-stone-500 italic">&quot;{log.notes}&quot;</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
