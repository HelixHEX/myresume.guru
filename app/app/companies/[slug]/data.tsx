"use client";

import ApplicationCard from "@/components/companies/cards/application";
import { api } from "@/lib/api";

export default function Company({ slug }: { slug: string }) {
  const { data, status, error } =
    api.queries.applications.useGetApplications(slug);

  if (status === "pending") {
    return <div className="text-gray-400 text-center">Loading...</div>;
  }

  if (status === "error") {
    return (
      <div className="text-red-400 text-center">Error: {error.message}</div>
    );
  }

  if (status === "success" && !data) {
    return (
      <div className="text-gray-400 text-center">No applications found</div>
    );
  }

  return (
    <>
      {data?.applications.length > 0 ? (
        <>
          <h2 className="mt-12 text-xl">Applications</h2>
          <div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
            {data.applications.map((application, i) => (
              <ApplicationCard
                key={i}
                name="Full Stack Engineer"
                id={i.toString()}
                score={Math.floor(Math.random() * 100)}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <h1 className="text-center text-gray-400">
            Add an application to get started
          </h1>
        </div>
      )}
    </>
  );
}
