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

const saveResumeEditorData = async ({ resumeId, data }: { resumeId: string, data: string }) => {
  localStorage.setItem(`resume:${resumeId}`, data);
}

export const useSaveResumeEditorData = (resumeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["save_resume_editor_data", resumeId],
    mutationFn: saveResumeEditorData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resume_editor_data", resumeId] });
    }
  })
}

const patchResume = async ({
  fileKeyOrId,
  data,
}: {
  fileKeyOrId: string;
  data: { pinned?: boolean; name?: string; tags?: string[] };
}) => {
  const response = await axios.patch(`/api/resume/${encodeURIComponent(fileKeyOrId)}`, data);
  return response.data;
};

export const usePatchResume = (fileKeyOrId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["patch_resume", fileKeyOrId],
    mutationFn: patchResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resume", fileKeyOrId] });
    },
  });
};

const duplicateResume = async (fileKeyOrId: string) => {
  const response = await axios.post(`/api/resume/${encodeURIComponent(fileKeyOrId)}/duplicate`);
  return response.data as { resume: Resume; id: number };
};

export const useDuplicateResume = (fileKeyOrId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["duplicate_resume", fileKeyOrId],
    mutationFn: () => duplicateResume(fileKeyOrId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

const reorderResumes = async (orderedIds: number[]) => {
  await axios.patch("/api/resume/reorder", { orderedIds });
};

export const useReorderResumes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["reorder_resumes"],
    mutationFn: reorderResumes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}