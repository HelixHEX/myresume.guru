"use client";

import { generateFeedback, runThread } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import React, { useEffect, useState } from "react";
import ImprovementCard from "./cards/improvement";
import { useGenerateFeedback } from "@/lib/hooks";

export default function Feedback({
  slug,
  setStatus,
}: {
  slug: string;
  setStatus: React.Dispatch<
    React.SetStateAction<"Loading" | "Analyzing" | "Analyzed">
  >;
}) {
  const { feedbacks, fetchFeedbacks } = useGenerateFeedback({ slug, setStatus });

  // NEEDS WORK
  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {feedbacks ? (
        feedbacks.map((feedback: Feedback, index: number) => (
          <ImprovementCard key={index} {...feedback} />
        ))
      ) : (
        <h2 className="text-gray-400 text-center mt-8">
          Generating resume feedback...
        </h2>
      )}
    </>
  );
}
