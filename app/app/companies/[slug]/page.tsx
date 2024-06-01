"use client";

import ApplicationCard from "@/components/companies/cards/application";
import { api } from "@/lib/api";

export default function Page({ params }: { params: { slug: string } }) {
  const { data, status, error } = api.queries.applications.useGetApplications(
    params.slug
  );

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  if (status === "success" && !data) {
    return <div>No applications found</div>;
  }
  return (
    <div className=" flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] text-4xl text-black">{params.slug}</h1>
      <p className="md:w-10/12 text-gray-400">
        Easily manage the status of each job application as well as see how well
        your resume matches to the job description
      </p>
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
    </div>
  );
}
