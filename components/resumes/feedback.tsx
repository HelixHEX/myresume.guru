"use client";

import React, { useContext } from "react";
import ImprovementCard from "./cards/improvement";
import { context } from "@/lib/context";
import { Loader2 } from "lucide-react";


export default function Feedback() {
  const { resume, status, improvements, setStatus } = useContext(
    context.resume.ResumeContext
  );

  if (!improvements && status === "analyzing") {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />
        <h2 className="text-gray-400 text-center">
          Analyzing your resume and generating feedback...
        </h2>
      </div>
    );
  }

  if (!resume?.improvements || resume.improvements.length < 1) {
    return (
      <div className="w-full text-center py-12">
        <h2 className="text-gray-400">
          No feedback generated yet. Click the button above to start.
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
        {resume.improvements.map((improvement: Improvement) => (
        <ImprovementCard
          key={improvement.id}
          id={improvement.id}
          title={improvement.title}
          text={improvement.text}
          priority={improvement.priority}
          status={improvement.status}
        />
      ))}
    </div>
  );
}
