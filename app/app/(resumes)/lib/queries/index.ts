import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { RESUME_ANALYSIS_STATUS } from "@/lib/actions/resume";

export const getResume = async (fileKey: string) => {
  const res = await axios.get(`/api/resume/${fileKey}`);
  return res.data;
};

export const useGetResume = (fileKey: string, refetchInterval: number) => {
  return useQuery<GetResumeResponse>({
    queryKey: ["resume", fileKey],
    queryFn: () => getResume(fileKey),
    refetchInterval: refetchInterval || 0,
  });
};

export const getResumeEditorData = async (fileKey: string) => {
  const data = localStorage.getItem(`resume:${fileKey}`);
  return JSON.parse(data || "{}");
}

export const useGetResumeEditorData = (fileKey: string) => {
  return useQuery({
    queryKey: ["resume_editor_data", fileKey],
    queryFn: () => getResumeEditorData(fileKey),
  });
};
export const getResumes = async () => {
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

const getResumeAnalysisStatus = async (fileKey?: string) => {
  const resumeStatus = await RESUME_ANALYSIS_STATUS(fileKey);
  return { status: resumeStatus.status || "Pending" };
};

export const useGetResumeAnalysisStatus = (fileKey?: string) => {
  return useQuery<GetResumeAnalysisStatusResponse>({
    enabled: !!fileKey,
    queryKey: ["resume_analysis_status", fileKey],
    queryFn: () => getResumeAnalysisStatus(fileKey),
    refetchInterval: 2000
  });
};
