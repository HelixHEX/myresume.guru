import { generateFeedback, saveToDb } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import { useEffect, useState } from "react";

export const useGenerateFeedback = ({
  slug,
  status,
  setStatus,
}: {
  slug: string;
  status: string;
  setStatus: React.Dispatch<
    React.SetStateAction<
      "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
    >
  >;
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [type, setType] = useState<"http" | "stream" | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      
      setStatus("Analyzing");
      const feedbacksData = await generateFeedback(slug);

      setType(feedbacksData.type);
      if (feedbacksData.type === "stream") {
        for await (const value of readStreamableValue(feedbacksData.response)) {
          if (value?.error) {
            throw new Error(value.error);
          }

          setFeedbacks(value?.feedbacks || []);
        }
        setStatus("Analyzed");
        // save();
      } else {
        setFeedbacks(feedbacksData.response.feedbacks);
        setStatus("Done");
      }
    };
    fetchFeedbacks();
  }, [setStatus, slug]);

  useEffect(() => {
    if (status === "Analyzed" && type === "stream" && feedbacks.length > 0) {
      setStatus("Saving to database");
      setTimeout(async () => {
        await saveToDb(slug, feedbacks);
        setStatus("Done");
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type]);
  return { feedbacks };
};

type GenerateFeedbackResponse = ReturnType<typeof generateFeedback>;
