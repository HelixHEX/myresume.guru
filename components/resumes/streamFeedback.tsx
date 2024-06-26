"use client";

import { context } from "@/lib/context";
import { useGenerateFeedback } from "@/lib/hooks";
import { useContext, useEffect } from "react";
import ImprovementCard from "./cards/improvement";
import { generateFeedback, saveToDb } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function StreamFeedback() {
  const { feedbacks, status, resume, setFeedbacks, setStatus } = useContext(
    context.resume.ResumeContext
  );

  const handleGenerateFeedbacks = async () => {
    setStatus("Analyzing");

    const { response, error } = await generateFeedback(resume!.fileKey);
    if (error) {
      toast(`${error}`);
    } else {
      toast("Generating feedback...");
      const feedbacksArray = [];
      for await (const value of readStreamableValue(response)) {
        setFeedbacks(value.feedbacks || []);
        feedbacksArray.push(value.feedbacks);
      }
      setStatus("Analyzed");
    }
  };

  useEffect(() => {
    const save = async () => {
      if (status === "Analyzed" && feedbacks.length > 0) {
        await saveToDb(resume!.fileKey, feedbacks);
        setStatus("Done");
      }
    };
    save()
  }, [resume, setStatus, status, feedbacks]);
  return (
    <div>
      {feedbacks.length > 0 ? (
        <>
          {feedbacks.map((feedback: Feedback, index: number) => (
            <ImprovementCard key={index} {...feedback} />
          ))}
        </>
      ) : (
        <Button onClick={handleGenerateFeedbacks}>{status}</Button>
      )}
    </div>
  );
}
