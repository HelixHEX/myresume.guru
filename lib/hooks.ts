import { generateFeedback } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import { useState } from "react";

export const useGenerateFeedback = ({
  slug,
  setStatus,
}: {
  slug: string;
  setStatus: React.Dispatch<
    React.SetStateAction<"Loading" | "Analyzing" | "Analyzed">
  >;
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const fetchFeedbacks = async () => {
    setStatus("Analyzing");
    const feedbacksData = await generateFeedback(slug);

    for await (const value of readStreamableValue(feedbacksData)) {
      if (value?.error) {
        throw new Error(value.error);
      }

      setFeedbacks(value?.feedbacks || []);
    }

    setStatus("Analyzed");
  };

  return { feedbacks, fetchFeedbacks };
};

type GenerateFeedbackResponse = ReturnType<typeof generateFeedback>;
