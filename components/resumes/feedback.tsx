"use client";

import React, { useContext } from "react";
import ImprovementCard from "./cards/improvement";
import { context } from "@/lib/context";

export default function Feedback() {
  const { resume, status, feedbacks, setStatus } = useContext(
    context.resume.ResumeContext
  );

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
