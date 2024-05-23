import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getResumes = async () => {
  const res = await axios.get("http://localhost:3000/api/resumes");
  return res.data;
};

const useGetResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });
}
