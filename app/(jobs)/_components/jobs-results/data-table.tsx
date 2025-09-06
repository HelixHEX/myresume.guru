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

interface JobsResultsDataTableProps {
  data: Job[];
}

function JobsResultsDataTable<TData, TValue>({
  data,
}: JobsResultsDataTableProps) {
  const table = useReactTable({
    data,
    columns,
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
        <DialogContent className="bg-[#181818] text-white border-none md:min-h-[600px] rounded-none sm:max-w-xl md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
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
