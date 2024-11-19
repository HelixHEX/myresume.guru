import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateApplication = async (application: ApplicationUpdateInput): Promise<ApplicationUpdateResponse> => {
  const response = await axios.post(`/api/applications/${application.id}`, application);
  return response.data;
}

export const useUpdateApplication = () => {
  return useMutation<ApplicationUpdateResponse, Error, ApplicationUpdateInput>({
    mutationKey: ['update_application'],
    mutationFn: updateApplication
  })
}

const addApplication = async ({
  title,
  url,
  companyId,
  resumeId,
  jobDescription,
}: CreateApplication): Promise<CreateApplicationResponse> => {
  const response = await axios.post("/api/applications", {
    title,
    url,
    resumeId,
    companyId,
    jobDescription,
  });

  return response.data;
};

export const useAddApplication = ({
  setTitle,
  setUrl,
  setResumeId,
  setJobDescription,
  companyId,
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
      queryClient.invalidateQueries({
        queryKey: ["company", companyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });
};
