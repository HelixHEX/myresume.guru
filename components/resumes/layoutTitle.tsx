"use client";

import { context } from "@/lib/context";
import { useContext } from "react";

export default function ResumeTitle() {
  const {title} = useContext(context.resume.LayoutContext);

  return <h1 className="mt-[-6px] text-4xl text-black">{title}</h1>;
}
