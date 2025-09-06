'use client';

import SearchFilter from "@/components/ui/search-filter";
import { SelectItem } from "@/components/ui/select";
import { useState } from "react";

export default function JobTypeFilter() {
  const [jobType, setJobType] = useState<string>("full-time");
  return (
    <SearchFilter val={jobType} onChange={setJobType} label="job type">
      <SelectItem variant="jobFilter" value="full-time">
        full-time
      </SelectItem>
      <SelectItem variant="jobFilter" value="part-time">
        part-time
      </SelectItem>
    </SearchFilter>
  );
}

