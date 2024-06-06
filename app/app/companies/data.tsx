"use client";

import CompanyCard from "@/components/companies/cards";
import CreateCompanyCard from "@/components/companies/cards/create";
import { api } from "@/lib/api";

export default function Companies() {
  const { data, status, error } = api.queries.companies.useGetCompanies();

  if (status === "pending") {
    return <div className="text-gray-400 text-center">Loading...</div>;
  }

  if (status === "error") {
    return (
      <div className="text-red-400 text-center">Error: {error.message}</div>
    );
  }

  if (status === "success" && !data.companies) return null;

  return (
    <>
      {data.companies.length > 0 ? (
        <div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
          <CreateCompanyCard />
          {data.companies.map((company, index) => (
            <CompanyCard
              key={index}
              name={company.name}
              id={company.id.toString()}
              applications={company.applications!.length}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <CreateCompanyCard />
        </div>
      )}
    </>
  );
}
