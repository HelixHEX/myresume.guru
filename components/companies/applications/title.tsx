"use client";

import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CompanyApplicationsTitle({
  companyId,
}: {
  companyId: string;
}) {
  const router = useRouter();
  const { data, status, error } =
    api.queries.companies.useGetCompany(companyId);

  useEffect(() => {
    if (status === "success" && data && !data.company) {
      router.push("/app/companies");
    }
  }, [status, data, router]);
  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Unable to fetch company title</div>;
  }

  if (status === "success" && !data.company) return null;

  return (
    <h1 className="mt-[-6px] font-light text-4xl text-black">
      {data.company.name}
    </h1>
  );
}
