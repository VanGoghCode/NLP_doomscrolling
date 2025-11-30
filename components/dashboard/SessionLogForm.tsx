"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Input,
  Select,
  SelectItem,
  Slider,
  Textarea,
  Button,
} from "@heroui/react";

interface SessionLogFormProps {
  userId: string;
  onLogCreated: () => void;
}

const PLATFORMS = [
  { key: "twitter", label: "Twitter/X" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "reddit", label: "Reddit" },
  { key: "youtube", label: "YouTube" },
  { key: "news", label: "News Sites" },
  { key: "other", label: "Other" },
];

// Reusable Mood Slider Component
interface MoodSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function MoodSlider({ label, value, onChange }: MoodSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-stone-700">{label}</label>
        <span className="text-sm font-bold text-primary">{value}/10</span>
      </div>
      <Slider
        aria-label={label}
        step={1}
        maxValue={10}
        minValue={1}
        value={value}
        onChange={(v) => onChange(v as number)}
        color="primary"
        showSteps={true}
        className="max-w-full"
        classNames={{
          track: "bg-stone-200 h-2",
          filler: "bg-primary",
          thumb: "bg-primary border-2 border-white shadow-md",
          step: "bg-stone-300",
        }}
      />
      <div className="flex justify-between text-xs text-stone-400 px-1">
        <span>😢 Terrible</span>
        <span>😐 Neutral</span>
        <span>😊 Great</span>
      </div>
    </div>
  );
}

export function SessionLogForm({ userId, onLogCreated }: SessionLogFormProps) {
  const [duration, setDuration] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [trigger, setTrigger] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create log entry
      const newLog = {
        id: `log_${Date.now()}`,
        userId,
        duration: parseInt(duration) || 0,
        platform,
        moodBefore,
        moodAfter,
        trigger,
        notes,
        startedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingLogs = JSON.parse(localStorage.getItem("sessionLogs") || "[]");
      existingLogs.unshift(newLog);
      localStorage.setItem("sessionLogs", JSON.stringify(existingLogs));

      // Reset form
      setDuration("");
      setPlatform("");
      setMoodBefore(5);
      setMoodAfter(5);
      setTrigger("");
      setNotes("");
      onLogCreated();
    } catch (error) {
      console.error("Failed to create log:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-8 space-y-8 border border-stone-200 shadow-sm"
    >
      <h3 className="text-xl font-bold text-stone-800">Log a Scrolling Session</h3>

      {/* Duration and Platform Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">
            Duration (minutes) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder="30"
            value={duration}
            onValueChange={setDuration}
            isRequired
            variant="bordered"
            size="lg"
            classNames={{
              inputWrapper: "border-2 border-stone-300 hover:border-primary focus-within:border-primary bg-white shadow-sm",
              input: "text-stone-800 placeholder:text-stone-400",
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-700">Platform</label>
          <Select
            placeholder="Select platform"
            selectedKeys={platform ? [platform] : []}
            onSelectionChange={(keys) => setPlatform(Array.from(keys)[0] as string)}
            variant="bordered"
            size="lg"
            classNames={{
              trigger: "border-2 border-stone-300 hover:border-primary data-[open=true]:border-primary bg-white shadow-sm",
              value: "text-stone-800",
              selectorIcon: "right-3 text-stone-500",
              popoverContent: "bg-white border border-stone-200 shadow-lg",
              listbox: "bg-white",
              listboxWrapper: "bg-white",
            }}
            popoverProps={{
              classNames: {
                content: "bg-white border border-stone-200 shadow-lg rounded-lg",
              },
            }}
          >
            {PLATFORMS.map((p) => (
              <SelectItem 
                key={p.key}
                classNames={{
                  base: "hover:bg-primary/10 data-[selected=true]:bg-primary/20",
                  title: "text-stone-800",
                }}
              >
                {p.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Mood Sliders - Using common component */}
      <div className="space-y-8">
        <MoodSlider
          label="Mood Before Scrolling"
          value={moodBefore}
          onChange={setMoodBefore}
        />
        <MoodSlider
          label="Mood After Scrolling"
          value={moodAfter}
          onChange={setMoodAfter}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">What triggered this session?</label>
        <Input
          placeholder="Boredom, stress, habit, notification..."
          value={trigger}
          onValueChange={setTrigger}
          variant="bordered"
          size="lg"
          classNames={{
            inputWrapper: "border-2 border-stone-300 hover:border-primary focus-within:border-primary bg-white shadow-sm",
            input: "text-stone-800 placeholder:text-stone-400",
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">Notes (Optional)</label>
        <Textarea
          placeholder="How do you feel now? What did you scroll through?"
          value={notes}
          onValueChange={setNotes}
          variant="bordered"
          minRows={3}
          classNames={{
            inputWrapper: "border-2 border-stone-300 hover:border-primary focus-within:border-primary bg-white shadow-sm",
            input: "text-stone-800 placeholder:text-stone-400",
          }}
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        isDisabled={!duration}
        className="w-full font-bold bg-primary text-white shadow-lg shadow-primary/20"
        size="lg"
      >
        Log Session
      </Button>
    </motion.form>
  );
}
