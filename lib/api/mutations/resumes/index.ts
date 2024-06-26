import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const generateFeedback = async () => {
  const response = await fetch("/api/resume/generate-feedback", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.body) {
    throw new Error("No reader");
  }

  const reader = response.body.getReader();
};

export const useGenerateFeedback = (fileKey: string) => {
  return useMutation({
    mutationFn: generateFeedback,
    mutationKey: ["generate_feedback", fileKey],
    // onSuccess: (reader: ReadableStreamDefaultReader) => {
    //   async function readStream() {
    //     const {done, value} = await reader.read();
    //     if (done ) return;

    //     const text = new TextDecoder().decode(value);

    //   }
    // }
  });
  
};
