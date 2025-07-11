'use client'
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RESUME_ANALYSIS_STATUS } from "@/lib/actions/resume";
import { getDownloadedResumes as getDownloadedResumesAction } from "@/app/app/(resumes)/_actions";
import { useEffect } from "react";
export const getResume = async (resumeId: string) => {
  const res = await axios.get(`/api/resume/${resumeId}`);
  localStorage.setItem(`resume:${resumeId}`, JSON.stringify({
    ...res.data.resume,
    resumeName: res.data.resume.name
  }));
  // queryClient.invalidateQueries({ queryKey: ["resume_editor_data", resumeId] });
  return res.data;
};

export const useGetResume = (resumeId: string, refetchInterval: number) => {
  const queryClient = useQueryClient();
  const query = useQuery<GetResumeResponse>({
    queryKey: ["resume", resumeId],
    queryFn: () => getResume(resumeId),
    refetchInterval: refetchInterval || 0,
    enabled: !!resumeId,
  });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["resume_editor_data", resumeId] });
  }, [query]);  
  return query;
};

export const getEditorColor = async (resumeId: string) => {
  const color = localStorage.getItem(`resume${resumeId && `:${resumeId}`}:color`);
  if (!color) {
    localStorage.setItem(`resume${resumeId && `:${resumeId}`}:color`, "#174BDC");
    return "#174BDC";
  }
  return color;
}

export const getEditorBg = async (resumeId: string) => {
  const bg = localStorage.getItem(`resume${resumeId && `:${resumeId}`}:bg`);
  if (!bg) {
    localStorage.setItem(`resume${resumeId && `:${resumeId}`}:bg`, "#174BDC");
    return "#174BDC";
  }
  return bg;
}

export const useGetEditorColor = (resumeId: string) => {
  return useQuery({
    queryKey: ["editor_color", resumeId],
    queryFn: () => getEditorColor(resumeId),
  });
}

export const useGetEditorBg = (resumeId: string) => {
  return useQuery({
    queryKey: ["editor_bg", resumeId],
    queryFn: () => getEditorBg(resumeId),
  });
}

export const getResumeEditorData = async (resumeId: string) => {
  const data = localStorage.getItem(`resume:${resumeId}`);
  if (!data) {
    return {};
  }
  return JSON.parse(data || "{}");
}

export const useGetResumeEditorData = (resumeId: string) => {
  return useQuery({
    queryKey: ["resume_editor_data", resumeId],
    queryFn: () => getResumeEditorData(resumeId),
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

export const getDownloadedResumes = async () => {
  const res = await getDownloadedResumesAction();
  return { downloadedResumes: res ?? 0 };
};

export const useGetDownloadedResumes = () => {
  return useQuery<GetDownloadedResumesResponse>({
    queryKey: ["downloaded_resumes"],
    queryFn: getDownloadedResumes,
  });
};