"use client";

import ApplicationCard from "@/components/companies/cards/application";
import { api } from "@/lib/api";
import Company from "./data";

export default function Page({ params }: { params: { slug: string } }) {
  
  return (
    <div className=" flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] font-light text-4xl text-black">{params.slug}</h1>
      <p className="md:w-10/12 text-gray-400">
        Easily manage the status of each job application as well as see how well
        your resume matches to the job description
      </p>
      <Company slug={params.slug} />
    </div>
  );
}
