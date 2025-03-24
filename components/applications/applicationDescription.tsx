"use client";

import { useGetApplication } from "@/lib/api/queries/applications";

export default function ApplicationDescription({ id }: { id: string }) {
  const { data: applicationData, status: applicationStatus } = useGetApplication(id);
  const application = applicationData?.application;

  if (!application) return <p>Loading...</p>;
  return (
    <p className="text-gray-400 text-sm md:text-md ">
      {application?.description}
    </p>
  );
}
