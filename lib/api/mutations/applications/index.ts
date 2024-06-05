import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const addApplication = async ({
  title,
  url,
  resumeId,
  jobDescription,
}: CreateApplication): Promise<CreateApplicationResponse> => {
  const response = await axios.post("/api/applications", {
    title,
    url,
    resumeId,
    jobDescription,
  });

  return response.data;
};

type CreateApplicationResponse = {
  application?: Application;
  message?: string;
};
export const useAddApplication = ({
  setTitle,
  setUrl,
  setResumeId,
  setJobDescription,
}: UseAddApplication) => {
  const queryClient = useQueryClient();
  return useMutation<CreateApplicationResponse, Error, CreateApplication>({
    mutationKey: ["add_application"],
    mutationFn: addApplication,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setTitle("");
      setUrl("");
      setResumeId(null);
      setJobDescription("");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
