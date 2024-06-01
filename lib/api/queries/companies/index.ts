import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getCompanies = async (companyId?: string) => {
  const res = await axios.get(`/api/companies?companyId=${companyId}`);
  return res.data;
};

export const useGetCompanies = (companyId?: string) => {
  return useQuery<GetCompaniesResponse>({
    queryKey: ["companies", { companyId }],
    queryFn: () => getCompanies(companyId),
  });
};
