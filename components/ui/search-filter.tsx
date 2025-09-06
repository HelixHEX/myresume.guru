"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FilterPros = {
  label: string;
  children: React.ReactNode;
  val?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchFilter({
  label,
  children,
  val,
  onChange,
}: FilterPros) {
  const [value, setValue] = useState<string>(val || "");

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue(value);
    }
  };
  return (
    <Select value={val || value} onValueChange={handleChange}>
      <SelectTrigger
        variant="jobFilter"
        className={cn(
          value && "h-auto",
          "w-full lg:w-[180px] cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0"
        )}
      >
        <div
          className={cn(value && "flex flex-col h-auto  w-full items-start")}
        >
          <label
            className={`text-white cursor-pointer ${
              value && "text-[12px] "
            } transition-all duration-400 group-hover:text-blue-800`}
          >
            {label}
          </label>
          <div className="text-lg">
            <SelectValue className={"text-[14px] "} />
          </div>
        </div>
      </SelectTrigger>
      <SelectContent variant="jobFilter" className="">
        {children}
      </SelectContent>
    </Select>
  );
}
