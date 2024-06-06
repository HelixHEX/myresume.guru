"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function FilterResumes() {
  const [sortBy, setSortBy] = useState<string>("Name (A-Z)");
  return (
    <>
      {/* <p className="self-center pr-4">sort by: </p> */}
      <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue defaultValue={sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-a-z">Name (A-Z)</SelectItem>
          <SelectItem value="name-z-a">Name (Z-A)</SelectItem>
          <SelectItem value="date-new">Date (Newest First)</SelectItem>
          <SelectItem value="date-old">Date (Oldest First)</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
