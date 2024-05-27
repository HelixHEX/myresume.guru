"use client";
import ResumeCard from "@/components/resumes/cards";
import { api } from "@/lib/api";

export default function Page() {
  const {
    data: resumes,
    isLoading,
    isError,
  } = api.queries.resume.useGetResumes();

  if (isLoading) {
    return (
      <div className="text-center mt-4 text-gray-400">
        Loading your resumes...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-4 text-red-400">
        An error occurred while loading your resumes
      </div>
    );
  }

  if (!resumes || resumes.length <= 0) {
    return (
      <div className="text-center mt-4 text-gray-400">
        {
          "You don't have any resumes yet. Click the button above to upload your first resume."
        }
      </div>
    );
  }
  return (
    <div className="h-full w-full mt-4 gap-4 md:20 lg:gap-8 grid grid-cols-1 md:grid-cols-2 self-center ">
      {resumes.map((resume, i) => (
        <ResumeCard key={i} {...resume} />
      ))}
    </div>
  );
}
