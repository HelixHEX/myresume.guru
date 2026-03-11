"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ResumePageTabsProps = {
  fileKey: string;
  editResumeContent: React.ReactNode;
  feedbackContent: React.ReactNode;
  pdfPreview: React.ReactNode;
};

export function ResumePageTabs({
  fileKey,
  editResumeContent,
  feedbackContent,
  pdfPreview,
}: ResumePageTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") === "edit-resume" ? "edit-resume" : "feedback";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`/app/resumes/${fileKey}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={tabFromUrl} onValueChange={handleTabChange} className="w-full flex flex-col flex-1 min-h-0">
      <TabsList className="bg-white rounded-none w-full shrink-0">
        <TabsTrigger
          className="cursor-pointer text-blue-800 transition-all duration-800 font-bold text-md group data-[state=active]:text-white data-[state=active]:bg-blue-800 bg-white rounded-none border-none"
          value="edit-resume"
        >
          <p className="group-hover:translate-y-[-5px] transition-all duration-800">Edit Resume</p>
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer text-blue-800 transition-all duration-800 font-bold text-md data-[state=active]:text-white group data-[state=active]:bg-blue-800 bg-white rounded-none border-none"
          value="feedback"
        >
          <p className="group-hover:translate-y-[-5px] transition-all duration-800">Feedback</p>
        </TabsTrigger>
      </TabsList>
      <div className="w-full bg-white -mt-[8px] h-[1px]" />
      <div className="relative flex flex-1 min-h-0 w-full flex-col overflow-hidden md:flex-row bg-white">
        <TabsContent className="-mt-2 w-full flex-1 min-h-0 flex flex-col" value="edit-resume">
          {editResumeContent}
        </TabsContent>
        <TabsContent className="-mt-2 w-full h-full" value="feedback">
          {feedbackContent}
        </TabsContent>
        <div className="bg-gray-50 flex min-h-0 w-full flex-1 flex-col overflow-hidden min-w-0">
          {pdfPreview}
        </div>
      </div>
    </Tabs>
  );
}
