import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getResumes = async () => {
  const res = await axios.get("/api/resume");
  return res.data;
};

export const useGetResumes = () => {
  return useQuery<GetAllResumesResponse>({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
}