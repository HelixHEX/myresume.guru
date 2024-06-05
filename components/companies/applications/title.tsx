'use client';

import { api } from "@/lib/api";

export default function CompanyApplicationsTitle({
  companyId,
}: {
  companyId: string;
}) {
  const { data, status, error } =
    api.queries.companies.useGetCompany(companyId);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Unable to fetch company title</div>;
  }

  if (status === "success" && !data) return null;
  
  return <h1 className="mt-[-6px] font-light text-4xl text-black">{data.company.name}</h1>;
}
