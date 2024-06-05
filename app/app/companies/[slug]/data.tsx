"use client";

import ApplicationCard from "@/components/applications/cards";
import CreateApplicationCard from "@/components/applications/cards/create";
import { api } from "@/lib/api";

export default function CompanyApplications({ slug }: { slug: string }) {
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

  if (!slug) return null;

  return (
    <>
      {data.applications && (
        <>
          {data.applications.map((application, i) => (
            <ApplicationCard
              key={i}
              title={application.title}
              id={application.id}
              score={Math.floor(Math.random() * 100)}
            />
          ))}
        </>
      )}
    </>
  );
}
