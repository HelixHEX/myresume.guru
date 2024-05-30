"use client";

import { generateFeedback, runThread } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import React, { useEffect, useState } from "react";
import ImprovementCard from "./cards/improvement";
import { useGenerateFeedback } from "@/lib/hooks";
import { useGetResumeFeedback } from "@/lib/api/queries/resumes";

export default function Feedback({
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
}) {
  // const {
  //   data: feedbacksData,
  //   error,
  //   isSuccess,
  //   status,
  // } = useGetResumeFeedback(slug);
  // let [feedbacks, setFeedbacks] = useState<{
  //   type: string;
  //   feedbacks: Feedback[];
  // }>({ type: "", feedbacks: [] });

  const {feedbacks} = useGenerateFeedback({
    slug,
    setStatus,
    status,
  });

  // useEffect(() => {
  //   if (status === "success" && feedbacksData) {
  //     if (feedbacksData.message) {
  //       setFeedbacks({ type: "stream", feedbacks: [] });
  //     } else {
  //       setFeedbacks({
  //         type: "http",
  //         feedbacks: feedbacksData.feedbacks!,
  //       });
  //     }
  //   }
  // }, [status, feedbacksData]);

  // if (status === "pending")
  //   return <h2 className="text-gray-400 text-center mt-8">Loading...</h2>;

  // if (status === "error")
  //   return (
  //     <h2 className="text-gray-400 text-center mt-8">Error: {error.message}</h2>
  //   );

  // const { feedbacks } = useGenerateFeedback({ slug, status, setStatus });

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
