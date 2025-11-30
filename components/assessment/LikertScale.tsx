"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";

interface LikertScaleProps {
  onSelect: (score: number) => void;
  selectedValue?: number;
}

export function LikertScale({ onSelect, selectedValue }: LikertScaleProps) {
  const options = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Somewhat Disagree" },
    { value: 4, label: "Neutral" },
    { value: 5, label: "Somewhat Agree" },
    { value: 6, label: "Agree" },
    { value: 7, label: "Strongly Agree" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((option, index) => (
        <motion.div
          key={option.value}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button
            className={`w-full justify-between p-6 h-auto text-base font-medium transition-all shadow-sm hover:shadow-md group ${
              selectedValue === option.value
                ? "bg-primary text-white border-primary"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-primary hover:text-white hover:border-primary"
            }`}
            onPress={() => onSelect(option.value)}
            endContent={
              <span className={`transition-opacity transform group-hover:translate-x-1 ${
                selectedValue === option.value ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}>
                {selectedValue === option.value ? "✓" : "→"}
              </span>
            }
          >
            {option.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
