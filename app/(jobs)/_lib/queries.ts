import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const getJobs = async () => {
  const res = await axios.get("/api/jobs?skip=0&limit=10");
  return res.data;
};

export const useGetJobs = () => {
  return useQuery({ queryKey: ["jobs"], queryFn: getJobs });  
};