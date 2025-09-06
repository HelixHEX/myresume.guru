"use client";

import SelectSlider from "@/components/ui/select-slider";
import { SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export default function SalaryFilter() {
  const [salary, setSalary] = useState<number[]>([100000]);

  const handleChange = (value: number[]) => {
    setSalary(value);
  };
  return (
    <SelectSlider
      label="Salary"
      val={"$" + salary[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + `${salary[0] === 500000 ? "+" : ""}`}
      onChange={setSalary}
    >

      <div className=" p-2">
      <Slider className=''  value={salary} onValueChange={handleChange} defaultValue={[100000]} max={500000} min={50000} step={10000} />
      </div>
    </SelectSlider>
  );
}
