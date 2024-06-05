import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getCompany = async (companyId: string) => {
  const res = await axios.get(`/api/companies/${companyId}`);
  return res.data;
};

export const useGetCompany = (companyId: string) => {
  return useQuery<GetCompanyResponse>({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
  });
};


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
