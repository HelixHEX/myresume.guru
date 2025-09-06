'use client';

import CountryDropdown, {type Country} from "@/components/ui/country-dropdown";
import { useState } from "react";

export default function RegionFilter() {
  const [region, setRegion] = useState<string>("USA");
  function onChange(value: Country) {
    console.log('ff',value);
  }
  return (<CountryDropdown placeholder="Select a country" defaultValue={"USA"} />);
}