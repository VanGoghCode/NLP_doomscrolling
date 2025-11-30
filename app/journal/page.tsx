"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JournalEntry, JournalStore, generateEntryId, getRandomPrompt } from "@/lib/journal/types";
import { JournalEntryForm } from "@/components/journal/JournalEntryForm";
import { JournalHistory } from "@/components/journal/JournalHistory";
import { JournalInsights } from "@/components/journal/JournalInsights";
import { Button } from "@heroui/react";
import { Icon } from "@/components/ui/Icon";

const STORAGE_KEY = "journalStore";

function getStoredJournal(): JournalStore {
  if (typeof window === "undefined") {
    return { entries: [] };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { entries: [] };
    }
  }
  return { entries: [] };
}

function saveJournal(store: JournalStore) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

type TabKey = "write" | "history" | "insights";

export default function JournalPage() {
  const [journalStore, setJournalStore] = useState<JournalStore>({ entries: [] });
  const [activeTab, setActiveTab] = useState<TabKey>("write");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [writingPrompt, setWritingPrompt] = useState<string>("");

  useEffect(() => {
    const stored = getStoredJournal();
    setJournalStore(stored);
    setWritingPrompt(getRandomPrompt());
    setIsLoading(false);
  }, []);

  const handleSaveEntry = useCallback(async (content: string, mood?: number, title?: string) => {
    const newEntry: JournalEntry = {
      id: generateEntryId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content,
      title,
      mood,
      isAnalyzed: false,
    };

    setJournalStore((prev) => {
      const updated = {
        ...prev,
        entries: [newEntry, ...prev.entries],
      };
      saveJournal(updated);
      return updated;
    });

    // Automatically analyze the entry
    try {
      const response = await fetch("/api/journal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const { analysis } = await response.json();
        setJournalStore((prev) => {
          const updated = {
            ...prev,
            entries: prev.entries.map((e) =>
              e.id === newEntry.id
                ? { ...e, analysis, isAnalyzed: true, updatedAt: new Date().toISOString() }
                : e
            ),
          };
          saveJournal(updated);
          return updated;
        });
      } else {
        // Mark as analyzed but with error
        setJournalStore((prev) => {
          const updated = {
            ...prev,
            entries: prev.entries.map((e) =>
              e.id === newEntry.id
                ? { ...e, isAnalyzed: true, analysisError: "Analysis failed. API may not be configured.", updatedAt: new Date().toISOString() }
                : e
            ),
          };
          saveJournal(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to analyze entry:", error);
      // Mark as analyzed but with error
      setJournalStore((prev) => {
        const updated = {
          ...prev,
          entries: prev.entries.map((e) =>
            e.id === newEntry.id
              ? { ...e, isAnalyzed: true, analysisError: "Network error. Please check your connection.", updatedAt: new Date().toISOString() }
              : e
          ),
        };
        saveJournal(updated);
        return updated;
      });
    }

    setActiveTab("history");
  }, []);

  const handleDeleteEntry = useCallback((id: string) => {
    setJournalStore((prev) => {
      const updated = {
        ...prev,
        entries: prev.entries.filter((e) => e.id !== id),
      };
      saveJournal(updated);
      return updated;
    });
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  }, [selectedEntry]);

  const handleSelectEntry = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry);
  }, []);

  const refreshPrompt = () => {
    setWritingPrompt(getRandomPrompt());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Header variant="sticky" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-stone-600">Loading your journal...</span>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: "PenSquare" | "BookOpen" | "BarChart3" }[] = [
    { key: "write", label: "New Entry", icon: "PenSquare" },
    { key: "history", label: "History", icon: "BookOpen" },
    { key: "insights", label: "Insights", icon: "BarChart3" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header variant="sticky" />

      {/* Page Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Personal Scrolling Journal
          </h1>
          <p className="text-stone-600">
            Reflect on your scrolling habits with AI-powered insights.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-stone-200 sticky top-[65px] z-40">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key !== "history") {
                    setSelectedEntry(null);
                  }
                }}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
                }`}
              >
                <Icon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.key === "history" && journalStore.entries.length > 0 && (
                  <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full">
                    {journalStore.entries.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Write Tab */}
          {activeTab === "write" && (
            <div className="space-y-8">
              {/* Writing Prompt */}
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800 mb-1 flex items-center gap-2">
                      <span>💡</span>
                      Writing Prompt
                    </p>
                    <p className="text-amber-700">{writingPrompt}</p>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={refreshPrompt}
                    className="text-amber-600 hover:bg-amber-100"
                  >
                    <Icon name="RefreshCw" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Entry Form */}
              <div className="bg-white rounded-xl border border-stone-200 p-8">
                <JournalEntryForm onSave={handleSaveEntry} />
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="bg-white rounded-xl border border-stone-200">
              <JournalHistory
                entries={journalStore.entries}
                selectedEntry={selectedEntry}
                onSelect={handleSelectEntry}
                onDelete={handleDeleteEntry}
                onBack={() => setSelectedEntry(null)}
              />
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === "insights" && (
            <JournalInsights
              entries={journalStore.entries}
              trendAnalysis={journalStore.trendAnalysis}
            />
          )}
        </div>
      </div>

      {/* Quick Stats Bar (only when entries exist) */}
      {journalStore.entries.length > 0 && (
        <div className="bg-white border-t border-stone-200 py-5">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-10 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Entries:</span>
                <span className="font-semibold text-stone-800">{journalStore.entries.length}</span>
              </div>
              <div className="w-px h-4 bg-stone-200" />
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Analyzed:</span>
                <span className="font-semibold text-stone-800">
                  {journalStore.entries.filter((e) => e.isAnalyzed).length}
                </span>
              </div>
              <div className="w-px h-4 bg-stone-200" />
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Days Active:</span>
                <span className="font-semibold text-stone-800">
                  {new Set(journalStore.entries.map((e) => new Date(e.createdAt).toDateString())).size}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer variant="minimal" />
    </div>
  );
}
