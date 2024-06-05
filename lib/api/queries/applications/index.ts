import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
  return useQuery<GetApplicationResponse>({
    queryKey: ["application", id],
    queryFn: () => getApplication(id),
  });
};
