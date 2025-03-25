import { useMutation, useQueryClient } from "@tanstack/react-query";
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
const updateResume = async ({ fileKey, resume }: { fileKey: string, resume: Resume }) => {
  const response = await axios.post(`/api/resume/${fileKey}`, resume);
  return response.data;
}

export const useUpdateResume = (fileKey: string) => {
  return useMutation({
    mutationKey: ["update_resume", fileKey],
    mutationFn: updateResume,
  });
}

const saveResumeEditorData = async ({ fileKey, data }: { fileKey: string, data: string }) => {
  localStorage.setItem(`resume:${fileKey}`, data);
}

export const useSaveResumeEditorData = (fileKey: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["save_resume_editor_data", fileKey],
    mutationFn: saveResumeEditorData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume_editor_data", fileKey] });
    }
  })
}