import { NextRequest, NextResponse } from "next/server";
import { ASSESSMENT_QUESTIONS } from "@/lib/assessment/questions";
import { USER_DIMENSIONS, CONSTRUCTS } from "@/lib/assessment/constructs";

/**
 * GET /api/assessment/questions
 * Returns the assessment questions and configuration
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      questions: ASSESSMENT_QUESTIONS,
      dimensions: USER_DIMENSIONS.map(d => ({
        id: d.id,
        name: d.name,
        description: d.description,
      })),
      constructs: CONSTRUCTS.map(c => ({
        id: c.id,
        name: c.name,
        shortName: c.shortName,
        description: c.description,
      })),
      scale: {
        min: 1,
        max: 7,
        labels: {
          1: "Strongly Disagree",
          2: "Disagree",
          3: "Somewhat Disagree",
          4: "Neutral",
          5: "Somewhat Agree",
          6: "Agree",
          7: "Strongly Agree",
        },
      },
    },
  });
}
