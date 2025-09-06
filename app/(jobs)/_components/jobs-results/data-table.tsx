"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import { useEffect } from "react";

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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function JobsResultsDataTableSkeleton() {
  const { data: jobsData, status } = useGetJobs();
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
