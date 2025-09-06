"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SelectSlider({
  label,
  children,
  val,
  onChange,
}: {
  label: string;
  children: React.ReactNode;
  val: string;
  onChange: (value: number[]) => void;
}) {
  const [value, setValue] = useState<string>("");
  const handleChange = (value: number[]) => {
    if (onChange) {
      onChange(value);
    } else {
      setValue(value.toString());
    }
  };
  return (
    <Select value={val || value}>
      <SelectTrigger
        variant="jobFilter"
        className={cn(
          (val || value) && "h-18",
          "w-full lg:w-[180px] cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0"
        )}
      >
        <div
          className={cn((val ||value) && "flex flex-col h-auto   w-full items-start")}
        >
          <label
            className={`text-white cursor-pointer self-start ${
              (val || value) && "text-[12px] "
            } transition-all duration-400 group-hover:text-blue-800`}
          >
            {label}
          </label>
          <p>{val || value}</p>
          {/* <div className="text-lg">
          </div> */}
        </div>
      </SelectTrigger>
      <SelectContent variant="jobFilter" className="flex p-0 w-full h-[80] ">
        {children}
      </SelectContent>
    </Select>
  );
}
