import { api } from "@/lib/api";
import { context } from "@/lib/context";
import AIProvider from "@/lib/providers/ai";
import ResumeDetails from "./data";

export default function Page({ params }: { params: { fileKey: string } }) {
  return (
    <>
    <context.resume.LayoutProvider fileKey={params.fileKey}>
      <AIProvider fileKey={params.fileKey}>
        <h1 className=" text-4xl font-light text-black">Improve your resume</h1>
        <div className="mt-8 md:mt-0 w-full flex flex-col">
          <p className="text-gray-400">
            Get specific, actionable feedback on how to improve your resume. The
            Al will highlight areas for improvement and provide clear
            recommendations to help you make your resume stand out for your next
            job application.
          </p>
        </div>
        <div className="mt-8 flex w-full flex-col md:flex-row justify-between"></div>
        {/* <ResumeDetails fileKey={params.fileKey} /> */}
      </AIProvider>
    </context.resume.LayoutProvider>
    </>
  );
}
