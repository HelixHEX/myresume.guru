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
      onClick={() => router.push("/app/resumes/new")}
      className={`${sideNav ? "mt-4 hidden md:block" : "block self-center"} ${w}`}
    >
      Upload Resume
    </Button>
  );
}
