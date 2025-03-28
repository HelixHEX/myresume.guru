"use client";
import { generateFeedback } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import { useContext, useEffect } from "react";
import { context } from "./context";
import { toast } from "sonner";
import posthog from "posthog-js";

export const useGenerateFeedback = async () => {
  const { resume, status, feedbacks, setFeedbacks, setStatus } = useContext(
    context.resume.ResumeContext
  );

  const handleGenerateFeedbacks = async () => {
    setStatus("Analyzing");
    const { response, error } = await generateFeedback(resume!.fileKey);
    if (error) {
      toast(`${error}`);
    } else {
      for await (const value of readStreamableValue(response)) {
        setFeedbacks(value || []);
      }
      setStatus("Analyzed");
    }
  };

  return { handleGenerateFeedbacks };
};


type GenerateFeedbackResponse = ReturnType<typeof generateFeedback>;
