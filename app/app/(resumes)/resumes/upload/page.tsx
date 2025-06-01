import UploadButton from "@/components/upload";

export default function Page() {
  return (
    <>
      <div className="w-full p-4 flex flex-col items-center h-full justify-center">
        <div className="flex flex-col w-full md:w-[500px] self-center">
          <h1 className="font-bold text-4xl text-blue-800">
            Get instant feedback on your resume
          </h1>
          <p className="mt-2 text-gray-400">
            {
              "Upload your resume and we'll provide AI-generated suggestions to help you land your dream job."
            }
          </p>
          <p className="font-bold text-xl mt-8">Upload your resume</p>

          <UploadButton endpoint="resumeUpload" />
          <p className="mt-2">We currently only support .pdf files.</p>
        </div>
      </div>
    </>
  );
}
