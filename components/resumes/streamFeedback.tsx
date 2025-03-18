"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { context } from "@/lib/context";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startResumeAnalysis } from "@/app/_actions/resume";

export default function StreamFeedback() {
  const { status, resume, setStatus } = useContext(
    context.resume.ResumeContext
  );

  const handleGenerateFeedback = async () => {
    if (!resume) return;

    try {
      setStatus("analyzing");

      const result = await startResumeAnalysis(resume.fileKey);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Analysis started! This may take a few minutes.");
    } catch (error) {
      console.error("Error starting analysis:", error);
      toast.error("Failed to start analysis. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="flex justify-end mb-6">
      <Button
        onClick={handleGenerateFeedback}
        disabled={!resume || status === "analyzing"}
      >
        {status === "analyzing" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Generate Feedback"
        )}
      </Button>
    </div>
  );
}
