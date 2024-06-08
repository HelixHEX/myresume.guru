"use client";

import { useContext } from "react";
import { Badge } from "../ui/badge";
import { context } from "@/lib/context";

export default function ApplicationTitle({ id }: { id: string }) {
  const { application, status } = useContext(
    context.application.ApplicationContext
  );
  return (
    <>
      {application ? (
        <>
          <h1 className="mt-[-6px] font-light  text-2xl text-black">
            {status === "Loading" && !application
              ? "Loading..."
              : application?.title}
          </h1>
          <Badge className="ml-2  self-center">Active</Badge>
        </>
      ) : (
        <>
          <h1 className="mt-[-6px] font-light  text-2xl text-black">
            Loading...
          </h1>
        </>
      )}
    </>
  );
}
