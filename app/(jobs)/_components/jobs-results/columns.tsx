import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
      return (
        <div className=" cursor-pointer flex flex-col text-lg sm:text-xl md:text-2xl py-4 font-bold">
          <p className="text-muted  group-hover:text-blue-800">{row.original.companyName}</p>
          <p className="text-[#5F5F5F] transition-all duration-400  w-[300px] sm:w-[500px] md:w-[800px] whitespace-normal ">{row.original.jobTitle.replace(/&amp;#8211;/g, "—")}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "salaryMin",
    header: "Salary",
    cell: ({ row }) => {
      return (
        <div className=" cursor-pointer flex flex-col py-4 font-bold">
          <p className="text-muted text-xl md:text-3xl group-hover:text-blue-800">${row.original.salaryMin.toLocaleString()} {row.original.salaryCurrency}</p>

        </div>
      );
    },
  },
];
