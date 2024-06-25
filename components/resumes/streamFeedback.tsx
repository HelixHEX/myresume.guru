"use client";

import { context } from "@/lib/context";
import { useGenerateFeedback } from "@/lib/hooks";
import { useContext, useEffect } from "react";
import ImprovementCard from "./cards/improvement";

export default function StreamFeedback() {
  const { feedbacks } = useContext(context.resume.ResumeContext);

  useGenerateFeedback();
  return (
    <div>
      {feedbacks ? (
        feedbacks.map((feedback: Feedback, index: number) => (
          <ImprovementCard key={index} {...feedback} />
        ))
      ) : (
        <h2 className="text-gray-400 text-center mt-8">
          Generating resume feedback...
        </h2>
      )}
    </div>
  );
}
