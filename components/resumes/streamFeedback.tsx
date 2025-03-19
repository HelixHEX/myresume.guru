"use client";

import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { context } from "@/lib/context";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startResumeAnalysis } from "@/lib/actions/resume";

export default function StreamFeedback() {

  const { resume, setStatus, setRefetchInterval } = useContext(
    context.resume.ResumeContext
  );

  const handleGenerateFeedback = async () => {
    if (!resume) return;

    try {
      const result = await startResumeAnalysis(resume.fileKey);
      setRefetchInterval(2000);
      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Analysis started! This may take a minute or two.");
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
        {resume?.status === "Analyzing" ? (
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
