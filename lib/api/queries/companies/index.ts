import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getCompanies = async () => {
  const res = await axios.get("/api/companies");
  return res.data;
}

export const useGetCompanies = () => {
  return useQuery<GetCompaniesResponse>({
    queryKey: ["companies"],
    queryFn: getCompanies,
  })
}