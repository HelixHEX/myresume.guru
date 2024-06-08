"use client";

import { context } from "@/lib/context";
import { useContext } from "react";

export default function ApplicationDescription({ id }: { id: string }) {
  const { application, status } = useContext(
    context.application.ApplicationContext
  );

  if (!application) return <p>Loading...</p>;
  return (
    <p className="text-gray-400 text-sm md:text-md ">
      {application?.description}
    </p>
  );
}
