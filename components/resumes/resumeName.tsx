"use client";

import { context } from "@/lib/context";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { useModalOpen } from "../ui/assistant-ui/assistant-modal";
import { Sparkles } from "lucide-react";

export default function ResumeName() {
  const { resume, status } = useContext(context.resume.ResumeContext);
  const setOpen = useModalOpen((s) => s.setOpen);

  return (
    <div className="self-start md:self-center">
      {/* {status === "Loaded"? ( */}
      <>
        <p className="w-auto  underline text-gray-400">{resume?.name}</p>
        {/* <p className="font-bold">{status}</p> */}
        <Button onClick={() => setOpen(true)} className="mt-2 w-18 h-8">
          Chat with AI
          <Sparkles height={18} className="ml-2" width={18}/>
        </Button>
      </>
      {/* ) : (
        <p className="font-bold">{status}</p>
      )} */}
      {/* <p className="hover:cursor-pointer w-auto hover:text-gray-500 underline text-gray-400">
        {resume ? resume.name : ""}
      </p>
      <p className="font-bold">
        {status === "Done" ? "Your feedback is ready!" : status + "..."}
      </p> */}
    </div>
  );
}
