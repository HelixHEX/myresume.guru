import ResumeDetails from "./data";
import RecordRecentResume from "@/components/resumes/RecordRecentResume";
import PDFPreview from "../../_components/editor/preview";
import { QueryClient } from "@tanstack/react-query";
import { getResumeEditorData } from "../../lib/queries";
import EditResumeTab from "./edit-resume-tab";
import { ResumePageTabs } from "./resume-page-tabs";

export default async function Page(props: {
  params: Promise<{ fileKey: string }>;
}) {
  const params = await props.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["resume_editor_data", params.fileKey],
    queryFn: () => getResumeEditorData(params.fileKey),
  });
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden">
      <RecordRecentResume fileKey={params.fileKey} />
      <ResumePageTabs
        fileKey={params.fileKey}
        editResumeContent={<EditResumeTab fileKey={params.fileKey} resumeId={params.fileKey} />}
        feedbackContent={
          <div className="md:px-8 p-4 flex-col flex w-[400px] h-full">
            <h1 className="text-4xl font-bold text-blue-800">
              Suggested Improvements
            </h1>
            <div className="mt-8 md:mt-0 w-full flex flex-col">
              <p className="mt-2 text-gray-400 font-bold w-full">
                Get specific, actionable feedback on how to improve your
                resume. The AI will highlight areas for improvement and
                provide clear recommendations to help you make your resume
                stand out for your next job application.
              </p>
            </div>
            <ResumeDetails fileKey={params.fileKey} />
          </div>
        }
        pdfPreview={<PDFPreview fileKey={params.fileKey} />}
      />
    </div>
  );
}
