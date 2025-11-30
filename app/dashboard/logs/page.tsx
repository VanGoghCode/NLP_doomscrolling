"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/layout";
import { SessionLogForm } from "@/components/dashboard/SessionLogForm";
import { SessionLogList } from "@/components/dashboard/SessionLogList";

export default function SessionLogsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // For prototype, we'll use localStorage to store logs
  const userId = "demo-user-123";

  const handleLogCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background bg-texture-dots text-foreground selection:bg-primary selection:text-white flex flex-col">
      {/* Shared Header */}
      <Header variant="floating" />

      <main className="flex-grow max-w-4xl mx-auto px-4 pt-32 pb-12 w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-stone-900 mb-4 tracking-tight">
            Session Journal
          </h1>
          <p className="text-stone-500 text-lg">
            Track your scrolling episodes to identify patterns and triggers.
          </p>
        </div>

        <div className="grid gap-12">
          <section>
            <SessionLogForm userId={userId} onLogCreated={handleLogCreated} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              Recent Sessions
            </h2>
            <SessionLogList userId={userId} refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer variant="minimal" />
    </div>
  );
}
