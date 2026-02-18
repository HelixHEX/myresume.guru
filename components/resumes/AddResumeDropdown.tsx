"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, FilePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AddResumeDropdown({
  w = "w-[170px]",
}: {
  w?: string;
}) {
  const router = useRouter();

  const handleUpload = () => {
    router.push("/app/resumes/upload");
  };

  const handleCreateNew = () => {
    router.push("/app/resumes/new");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Add resume options"
          className={`flex items-center gap-2 self-center rounded-none border-none bg-white font-bold text-blue-800 hover:bg-blue-800 hover:text-white ${w}`}
        >
          Add resume
          <ChevronDown className="size-4 shrink-0" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem
          onSelect={handleUpload}
          className="cursor-pointer gap-2"
        >
          <Upload className="size-4" aria-hidden />
          Upload resume
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={handleCreateNew}
          className="cursor-pointer gap-2"
        >
          <FilePlus className="size-4" aria-hidden />
          Create new resume
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
