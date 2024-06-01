import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getApplications = async () => {
  const res = await axios.get("/api/applications")
  return res.data
}

export const useGetApplications = (filter?: string) => {
  return useQuery<GetApplicationsResponse>({
    queryKey: ["applications"],
    queryFn: getApplications,
  })
}