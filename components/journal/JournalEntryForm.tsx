"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { MOOD_LABELS } from "@/lib/journal/types";
import { Icon } from "@/components/ui/Icon";

interface JournalEntryFormProps {
  onSave: (content: string, mood?: number, title?: string) => Promise<void>;
  initialContent?: string;
  initialTitle?: string;
  initialMood?: number;
}

export function JournalEntryForm({
  onSave,
  initialContent = "",
  initialTitle = "",
  initialMood = 3,
}: JournalEntryFormProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [mood, setMood] = useState(initialMood);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (content.trim().length < 20) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(content.trim(), mood, title.trim() || undefined);
      setContent("");
      setTitle("");
      setMood(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = content.length;
  const isValid = characterCount >= 20;

  return (
    <div className="space-y-8">
      {/* Title (optional) */}
      <div className="space-y-2">
        <label htmlFor="entry-title" className="block text-sm font-medium text-stone-700">
          Title (optional)
        </label>
        <input
          id="entry-title"
          type="text"
          placeholder="Give your entry a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 text-base text-stone-800 bg-white border-2 border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder:text-stone-400 transition-colors"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="entry-content" className="block text-sm font-medium text-stone-700">
          What&apos;s on your mind?
        </label>
        <textarea
          id="entry-content"
          placeholder="Write about your scrolling experience today. How did it make you feel? What triggered it? What did you notice about yourself?..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 text-base text-stone-800 bg-white border-2 border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder:text-stone-400 transition-colors resize-y min-h-[200px]"
        />
        <div className="flex justify-between items-center text-sm px-1">
          <span className={characterCount < 20 ? "text-orange-500 font-medium" : "text-stone-500"}>
            {characterCount < 20
              ? `${20 - characterCount} more characters needed`
              : `${characterCount} characters`}
          </span>
          <span className="text-stone-400">Max 10,000 characters</span>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">
          How are you feeling?
        </label>
        <div className="flex justify-between gap-3">
          {Object.entries(MOOD_LABELS).map(([value, { emoji, label }]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMood(Number(value))}
              className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all ${
                mood === Number(value)
                  ? "border-primary bg-primary/5"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-stone-600 hidden sm:block">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-200 mt-8">
        <Button
          variant="flat"
          onPress={() => {
            setContent("");
            setTitle("");
            setMood(3);
          }}
          isDisabled={isSubmitting || (!content && !title)}
          className="text-stone-600"
        >
          Clear
        </Button>
        <Button
          color="warning"
          onPress={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
          className="bg-primary text-white font-medium px-8"
          endContent={!isSubmitting && <Icon name="Sparkles" className="w-4 h-4" />}
        >
          {isSubmitting ? "Analyzing..." : "Save & Analyze"}
        </Button>
      </div>

      {/* Analyzing indicator */}
      {isSubmitting && (
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800 text-sm">AI is analyzing your entry...</p>
              <p className="text-xs text-amber-600">
                Detecting emotions, triggers, and patterns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
