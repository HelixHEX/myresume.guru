import { Input } from "@/components/ui/input";
import JobsNav from "../_components/jobs-nav";
import SearchFilter from "../../../components/ui/search-filter";
import { SelectItem } from "@/components/ui/select";
import RegionFilter from "../_components/filters/region";
import JobTypeFilter from "../_components/filters/job-type";
import SalaryFilter from "../_components/filters/salary";
import { columns } from "../_components/jobs-results/columns";
import JobsResultsDataTable from "../_components/jobs-results/data-table";

export default function JobsPage() {
  function onChange() {}
  return (
    <div className="text-white p-2 h-auto min-h-screen w-full">
      <JobsNav />
      <div className="md:py-20 py-8 gap-8">
        <Input
          autoFocus
          placeholder="that dream job is a search away"
          className="w-full caret-blue-800 transition-all duration-400 bg-transparent -ml-[12px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-2xl md:text-3xl"
        />
        {/* filters */}
        <div className="transition-all duration-400 w-full md:w-[600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 flex-1">
          <JobTypeFilter />
          <RegionFilter />
          <SalaryFilter />
        </div>
        <JobsResultsDataTable />
      </div>
    </div>
  );
}
