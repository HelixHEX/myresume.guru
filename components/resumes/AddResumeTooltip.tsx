"use client";

import { useEffect, useState } from "react";
import AddResumeDropdown from "./AddResumeDropdown";
import { Button } from "@/components/ui/button";

const TOOLTIP_DISMISSED_KEY = "resumes-add-tooltip-dismissed";

export default function AddResumeTooltip() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(TOOLTIP_DISMISSED_KEY) !== "true") {
        setDismissed(false);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(TOOLTIP_DISMISSED_KEY, "true");
      setDismissed(true);
    } catch {
      setDismissed(true);
    }
  };

  if (dismissed) {
    return <AddResumeDropdown w="w-[170px]" />;
  }

  return (
    <div className="relative inline-block">
      <AddResumeDropdown w="w-[170px]" />
      <div
        className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
        role="dialog"
        aria-label="Add resume tip"
      >
        <p className="text-sm text-gray-700">
          <strong>Add a resume:</strong> upload an existing PDF or create one
          from scratch using the builder.
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-2 rounded-none bg-blue-800 font-medium text-white hover:bg-blue-900"
          onClick={handleDismiss}
          aria-label="Dismiss tip"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
