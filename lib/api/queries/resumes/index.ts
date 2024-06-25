import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getResume = async (fileKey: string) => {
  const res = await axios.get(`/api/resume/${fileKey}`);
  return res.data;
};

export const useGetResume = (fileKey: string) => {
  return useQuery<GetResumeResponse>({
    queryKey: ["resume", fileKey],
    queryFn: () => getResume(fileKey),
  });
};

const getResumes = async () => {
  const res = await axios.get("/api/resume");
  return res.data;
};

export const useGetResumes = () => {
  return useQuery<GetAllResumesResponse>({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
};

const getResumeFeedback = async (id: string) => {
  const res = await axios.get(`/api/resume/${id}/feedback`);
  return res.data;
};

export const useGetResumeFeedback = (id: string) => {
  return useQuery<GetResumeFeedbackResponse>({
    queryKey: ["resume_feedback", id],
    queryFn: () => getResumeFeedback(id),
  });
};
