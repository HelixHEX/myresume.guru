'use client'
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RESUME_ANALYSIS_STATUS } from "@/lib/actions/resume";
import { getDownloadedResumes as getDownloadedResumesAction } from "@/app/app/(resumes)/_actions";
import { getChat } from "@/lib/actions/chat";
import { chatQueryKeys } from "@/lib/providers/app-chat-provider";
import { useEffect } from "react";
const isDbResumeNewer = (
  dbResume: { updatedAt?: string | Date },
  stored: Record<string, unknown> | null
): boolean => {
  if (!stored?.updatedAt) return true;
  const dbTime = new Date(dbResume.updatedAt ?? 0).getTime();
  const storedTime = new Date(String(stored.updatedAt)).getTime();
  return dbTime > storedTime;
};

export const getResume = async (fileKeyOrId: string) => {
  const res = await axios.get(`/api/resume/${encodeURIComponent(fileKeyOrId)}`);
  const dbResume = res.data.resume as Record<string, unknown> & { updatedAt?: string | Date; name?: string };
  const storedRaw = localStorage.getItem(`resume:${fileKeyOrId}`);
  const stored = storedRaw ? (JSON.parse(storedRaw) as Record<string, unknown>) : null;
  if (isDbResumeNewer(dbResume, stored)) {
    localStorage.setItem(`resume:${fileKeyOrId}`, JSON.stringify({
      ...dbResume,
      resumeName: dbResume.name ?? (stored?.resumeName as string),
    }));
  }
  return res.data;
};

/** Primary chat id for a resume (by fileKey). Uses React Query with key including resumeId. */
export const useGetResumeChat = (resumeIdOrFileKey: string) => {
  return useQuery<number | null>({
    queryKey: chatQueryKeys.resumeChat(resumeIdOrFileKey),
    queryFn: () => getChat(resumeIdOrFileKey),
    enabled: !!resumeIdOrFileKey,
  });
};

export const useGetResume = (fileKey: string, refetchInterval?: number | false) => {
  const queryClient = useQueryClient();
  const query = useQuery<GetResumeResponse>({
    queryKey: ["resume", fileKey],
    queryFn: () => getResume(fileKey),
    refetchInterval: refetchInterval || 0,
    enabled: !!fileKey,
  });
  useEffect(() => {
    if (query.data) {
      queryClient.invalidateQueries({ queryKey: ["resume_editor_data", fileKey] });
    }
  }, [query.data, query.dataUpdatedAt, fileKey, queryClient]);
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

const DRAFT_KEY_PREFIX = "resume_draft:";

export const getResumeEditorData = async (fileKey: string) => {
  const draftRaw = localStorage.getItem(`${DRAFT_KEY_PREFIX}${fileKey}`);
  if (draftRaw) {
    try {
      const parsed = JSON.parse(draftRaw);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return parsed;
      }
    } catch {
      // fall through to resume key
    }
  }
  const data = localStorage.getItem(`resume:${fileKey}`);
  if (!data) {
    return {};
  }
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