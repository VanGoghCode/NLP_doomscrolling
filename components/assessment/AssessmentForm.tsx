"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ASSESSMENT_QUESTIONS, DIMENSION_LABELS, CONSTRUCT_LABELS } from "@/lib/assessment/questions";
import { LikertScale } from "./LikertScale";
import { AssessmentResponse } from "@/lib/assessment/scoring";
import { Progress, Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@/components/ui/Icon";

interface AssessmentFormProps {
  onComplete: (responses: AssessmentResponse[]) => Promise<void> | void;
}

export function AssessmentForm({ onComplete }: AssessmentFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  // Check if current question has been answered
  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);

  const handleAnswer = async (score: number) => {
    // Update or add response for current question
    const existingIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    
    let newResponses: AssessmentResponse[];
    if (existingIndex >= 0) {
      // Update existing response
      newResponses = [...responses];
      newResponses[existingIndex] = {
        questionId: currentQuestion.id,
        score,
        timestamp: new Date(),
      };
    } else {
      // Add new response
      newResponses = [...responses, {
        questionId: currentQuestion.id,
        score,
        timestamp: new Date(),
      }];
    }
    
    setResponses(newResponses);
    setDirection("forward");

    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      setIsSubmitting(true);
      try {
        await onComplete(newResponses);
      } catch (error) {
        console.error("Error in onComplete:", error);
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection("backward");
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-12">
        <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
          <span>
            Question {currentIndex + 1} / {ASSESSMENT_QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress
          value={progress}
          color="primary"
          className="h-2"
          aria-label="Assessment Progress"
          classNames={{
            indicator: "bg-primary",
            track: "bg-stone-200",
          }}
        />
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction === "forward" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "forward" ? -50 : 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <Card className="bg-white border border-stone-200 shadow-soft rounded-3xl overflow-visible">
              <CardBody className="p-8 md:p-12">
                {/* Construct Label (8 categories) */}
                {currentQuestion.construct && CONSTRUCT_LABELS[currentQuestion.construct] && (
                  <div className="mb-6">
                    <span 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary"
                    >
                      {CONSTRUCT_LABELS[currentQuestion.construct]}
                    </span>
                  </div>
                )}

                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-10 leading-tight">
                  {currentQuestion.text}
                </h2>

                <LikertScale 
                  onSelect={handleAnswer} 
                  selectedValue={currentResponse?.score}
                />

                {/* Previous Button */}
                {currentIndex > 0 && (
                  <div className="mt-8 pt-6 border-t border-stone-100">
                    <Button
                      variant="light"
                      onPress={handlePrevious}
                      startContent={<Icon name="ArrowRight" className="w-4 h-4 rotate-180" />}
                      className="text-stone-500 hover:text-primary font-medium"
                    >
                      Previous Question
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-stone-200 border-t-primary rounded-full animate-spin"></div>
            <p className="text-xl font-bold text-stone-800">
              Calculating your reality score...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
