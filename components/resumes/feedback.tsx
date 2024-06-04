"use client";

import { generateFeedback, runThread } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import React, { useContext, useEffect, useState } from "react";
import ImprovementCard from "./cards/improvement";
import { useGenerateFeedback } from "@/lib/hooks";
import { useGetResumeFeedback } from "@/lib/api/queries/resumes";
import { context } from "@/lib/context";

export default function Feedback({ slug }: { slug: string }) {
  const {status, setStatus} = useContext(context.resume.LayoutContext)
  const { feedbacks } = useGenerateFeedback({
    slug,
    setStatus,
    status,
  });

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
