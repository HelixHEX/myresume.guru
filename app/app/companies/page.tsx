"use client";
import CompanyCard from "@/components/jobs/cards/company";
import { useGetCompanies } from "@/lib/api/queries/companies";

export default function Page({ params }: { params: { slug: string } }) {
  const { data, status, error } = useGetCompanies();

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  if (status === "success" && !data) {
    return <div>No companies found</div>;
  }
  return (
    <div className="mt-4 flex flex-col w-full h-full ">
      <h1 className=" text-4xl text-black">Companies</h1>
      <p className="md:w-10/12 text-gray-400">
        Organize your job applications by company and see how many applications
        you have for each company
      </p>
      {data.companies.length > 0 ? (
        <div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
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
        <h1 className="text-center text-gray-400">
          Add a company to get started
        </h1>
      )}
    </div>
  );
}
