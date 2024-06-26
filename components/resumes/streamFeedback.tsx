"use client";

import { context } from "@/lib/context";
import { useGenerateFeedback } from "@/lib/hooks";
import { useContext, useEffect } from "react";
import ImprovementCard from "./cards/improvement";
import { generateFeedback } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function StreamFeedback() {
  const { feedbacks, resume, setFeedbacks, setStatus } = useContext(
    context.resume.ResumeContext
  );

  useEffect(() => {
    console.log(feedbacks);
  }, [feedbacks]);

  const handleGenerateFeedbacks = async () => {
    setStatus("Analyzing");
    const { response, error } = await generateFeedback(resume!.fileKey);
    if (error) {
      toast(`${error}`);
    } else {
      // console.log(response);
      for await (const value of readStreamableValue(response)) {
        // console.log(value?.feedbacks);
        setFeedbacks(value || []);
        // setFeedbacksContext(value?.feedbacks || []);
      }
      setStatus("Analyzed");
    }
  };
  // const {handleGenerateFeedbacks} =  useGenerateFeedback();
  return (
    <div>
      {feedbacks.length > 0 ? (
        <></>
      ) : (
        <Button onClick={handleGenerateFeedbacks}>Generate feedback</Button>
      )}
      {/* {feedbacks ? (
        feedbacks.map((feedback: Feedback, index: number) => (
          <ImprovementCard key={index} {...feedback} />
        ))
      ) : (
        <h2 className="text-gray-400 text-center mt-8">
          Generating resume feedback...
        </h2>
      )} */}
    </div>
  );
}
