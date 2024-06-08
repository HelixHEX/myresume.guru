import { generateApplicationFeedback } from "@/actions";
import { context } from "@/lib/context";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const getApplications = async (companyId?: string) => {
  const res = await axios.get(`/api/applications?companyId=${companyId}`);
  return res.data;
};

export const useGetApplications = (companyId?: string) => {
  return useQuery<GetApplicationsResponse>({
    queryKey: ["applications", companyId],
    queryFn: () => getApplications(companyId),
  });
};

const getApplication = async (id: string) => {
  const res = await axios.get(`/api/applications/${id}`);
  return res.data;
};

export const useGetApplication = (id: string) => {
  const { status: aiStatus, setStatus: setAiStatus } = useContext(
    context.application.ApplicationContext
  );
  // const [aiStatus, setAiStatus] = useState<string>("not-started");
  let { data, status } = useQuery<GetApplicationResponse>({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
    enabled: !!id,
  });

  return { data, status };
};

export const useGenerateApplicationFeedback = (id: string) => {
  const { status } = useContext(context.application.ApplicationContext);
  console.log(status);
  return useQuery<GenerateApplicationFeedbackResponse>({
    queryKey: ["application", id],
    queryFn: async () => await generateApplicationFeedback(parseInt(id)),
    enabled: !!id && status === "Analyzing",
  });
};
