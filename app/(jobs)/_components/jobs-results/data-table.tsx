"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetJobs } from "../../_lib/queries";

import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface JobsResultsDataTableProps {
  data: Job[];
}

function JobsResultsDataTable<TData, TValue>({
  data,
}: JobsResultsDataTableProps) {
  const [job, setJob] = useState<Job | null>(null);
  const table = useReactTable({
    data,
    columns: columns(setJob),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Dialog>
        <div className="overflow-hidden">
          <Table>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogContent className="bg-[#111] overflow-y-scroll text-white border-none md:h-[600px] rounded-none sm:max-w-xl md:max-w-4xl">
          <DialogHeader>
            <div className="flex  pr-4 justify-between">
              <DialogTitle className="text-2xl font-bold flex flex-col">
                {job?.jobTitle}{" "}
                <span className="text-blue-800 !text-md font-bold">
                  {job?.companyName}
                </span>
              </DialogTitle>
              <Button onClick={() => window.open(job?.url || "", "_blank")} className="bg-[#111] hover:text-blue-800 hover:[#111010] hover:bg-[#181818]">Apply</Button>
            </div>
          </DialogHeader>
          {/* <DialogDescription> */}
          <div></div>

          <div
            className="job-description-content"
            dangerouslySetInnerHTML={{ __html: job?.jobDescription || "" }}
          />
          {/* </DialogDescription> */}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function JobsResultsDataTableSkeleton() {
  const { data: jobsData, status } = useGetJobs();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    console.log(jobsData);
  }, [jobsData]);

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }
  const jobs = jobsData.jobs;
  return <JobsResultsDataTable data={jobs} />;
}
