"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetResumeEditorData } from "../lib/queries";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
export default function SaveResume({
  className,
  isSubmitting,
  resumeName,
}: {
  className?: string;
  isSubmitting: boolean;
  resumeName: string;
}) {
  return (
    <Button
      disabled={!resumeName || isSubmitting}
      type="submit"
      className={cn(
        "bg-blue-800 rounded-none md:bg-white md:text-blue-800 md:hover:bg-gray-300 md:hover:text-blue-800 text-white hover:bg-blue-900 font-bold cursor-pointer",
        className
      )}
    >
      {isSubmitting ? <Loader2 className="animate-spin" /> : "Save"}
    </Button>
  );
}
