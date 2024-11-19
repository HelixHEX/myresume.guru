"use client";

import { useContext } from "react";
import { Badge } from "../ui/badge";
import { context } from "@/lib/context";
import {  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "../ui/select";
import { useUpdateApplication } from "@/lib/api/mutations/applications";

export default function ApplicationTitle({ id }: { id: string }) {
  const { application, status } = useContext(
    context.application.ApplicationContext
  );
  const {mutate, isPending} = useUpdateApplication();

  const handleUpdate = (e: string) => {

    mutate( {...application, status: e} as Application)
  }
  return (
    <div className="flex mt-[-6px] ">
      {application ? (
        <>
          <h1 className="self-center font-light  text-2xl text-black">
            {status === "Loading" && !application
              ? "Loading..."
              : application?.title}
          </h1>
          {/* <Badge className="ml-2  self-center">Active</Badge> */}
          <Select onValueChange={handleUpdate} disabled={isPending}>
            <SelectTrigger className="w-[120px] ml-2 h-[40px]">
              <SelectValue placeholder={application.status} />
            </SelectTrigger>
            <SelectContent  defaultValue={application.status.toString()}>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Denied">Denied</SelectItem>
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
          <h1 className="mt-[-6px] font-light  text-2xl text-black">
            Loading...
          </h1>
        </>
      )}
    </div>
  );
}
