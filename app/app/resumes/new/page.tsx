import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="w-full p-4">
      <div className="flex flex-col w-full md:w-[500px] self-center">
        <h1 className="font-bold text-4xl">
          Get instant feedback on your resume
        </h1>
        <p className="mt-8 text-gray-400">
          {
            "Upload your resume and we'll provide AI-generated suggestions to help you land your dream job."
          }
        </p>
        <p className="font-bold text-xl mt-8">Upload your resume</p>
        <div className="mt-8  flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm font-bold text-black dark:text-gray-400">
                Drag and drop your resume here
              </p>
              <div className="p-4 text-sm rounded-lg flex justify-center items-center text-white h-10 bg-black">
                or browse files
              </div>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>
        <p className="mt-2">We support .doc, .docx, and .pdf files.</p>
      </div>
    </div>
  );
}
