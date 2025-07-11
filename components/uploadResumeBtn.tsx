"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function UploadResumeBtn({
  sideNav = false,
  w = "w-full",
}: {
  sideNav?: boolean;
  w?: string;
}) {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/app/resumes/upload")}
      className={`${sideNav ? "mt-4 hidden md:block" : "block self-center hover:text-white bg-white rounded-none text-blue-800 font-bold cursor-pointer hover:bg-blue-800"} ${w}`}
    >
      Upload Resume
    </Button>
  );
}
