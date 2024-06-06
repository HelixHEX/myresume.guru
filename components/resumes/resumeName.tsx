"use client";

import { context } from "@/lib/context";
import { useContext, useState } from "react";

export default function ResumeName({ slug }: { slug: string }) {
  const { resume, status } = useContext(context.resume.LayoutContext);

  return (
    <div className="self-start md:self-center">
      <p className="hover:cursor-pointer w-auto hover:text-gray-500 underline text-gray-400">
        {resume ? resume.name : ""}
      </p>
      <p className="font-bold">
        {status === "Done" ? "Your feedback is ready!" : status + "..."}
      </p>
    </div>
  );
}
