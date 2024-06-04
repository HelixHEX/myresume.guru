"use client";
import CompanyCard from "@/components/companies/cards";
import CreateCompanyCard from "@/components/companies/cards/create";
import { api } from "@/lib/api/";

export default function Page({ params }: { params: { slug: string } }) {
  const { data, status, error } = api.queries.companies.useGetCompanies();

  if (status === "pending") {
    return <div className="text-gray-400 text-center">Loading...</div>;
  }

  if (status === "error") {
    return (
      <div className="text-red-400 text-center">Error: {error.message}</div>
    );
  }

  if (status === "success" && !data) {
    return <div className="text-gray-400 text-center">No companies found</div>;
  }
  return (
    <>
      <p className="md:w-10/12 text-gray-400">
        Organize your job applications by company and see how many applications
        you have for each company
      </p>

      {data.companies.length > 0 ? (
        <div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
          <CreateCompanyCard />
          {data.companies.map((company, index) => (
            <CompanyCard
              key={index}
              name={company.name}
              id={company.id.toString()}
              applications={Math.floor(Math.random() * 15)}
            />
          ))}
        </div>
      ) : (
        <div>
          <CreateCompanyCard />
          <h1 className="text-center text-gray-400">
            Add a company to get started
          </h1>
        </div>
      )}
    </>
  );
}
