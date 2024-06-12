import { generateFeedback, saveToDb } from "@/actions";
import { readStreamableValue, StreamableValue } from "ai/rsc";
import { useContext, useEffect, useState } from "react";
import { context } from "./context";
import { set } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import posthog from "posthog-js"

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
  const {
    setResume,
    resume,
    setFeedbacks: setFeedbacksContext,
  } = useContext(context.resume.LayoutContext);
  const [feedbacks, setFeedbacks] = useState<any>([]);
  const [type, setType] = useState<"http" | "stream" | null>(null);
  const router = useRouter()
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const feedbacksData = await generateFeedback(slug);

      setType(feedbacksData.type);
      console.log(feedbacksData);
      if (feedbacksData.type === "stream") {
        setStatus("Analyzing");
        for await (const value of readStreamableValue(feedbacksData.response)) {
          if (value?.error) {
            throw new Error(value.error);
          }

          console.log(value?.feedbacks);
          setFeedbacks(value?.feedbacks || []);
          setFeedbacksContext(value?.feedbacks || []);
        }
        setStatus("Analyzed");
      } else {
        setStatus("Loading");
        if (feedbacksData.response.error) {
          toast(`${feedbacksData.response.error}`);
          router.push('/app/resumes')
        } else {
          setFeedbacks(feedbacksData.response.feedbacks!);
          setFeedbacksContext(feedbacksData.response.feedbacks!);
          setResume(feedbacksData.response.feedbacks![0].resume);
          setStatus("Done");
        }
      }
      posthog.capture("Generated feedback", { slug });

    };
    fetchFeedbacks();
  }, [setStatus, setResume, router, slug, setFeedbacksContext]);

  useEffect(() => {
    if (!resume) {
      if (feedbacks.length > 0) {
        setResume(feedbacks[0].resume);
      }
    }
  }, [resume, setResume, feedbacks]);

  useEffect(() => {
    if (status === "Analyzed" && type === "stream" && feedbacks.length > 0) {
      setStatus("Saving to database");
      setTimeout(async () => {
        const newResume = await saveToDb(slug, feedbacks);
        setResume(newResume);
        setStatus("Done");
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type]);
  return { feedbacks };
};

type GenerateFeedbackResponse = ReturnType<typeof generateFeedback>;
