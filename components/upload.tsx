"use client";
import { UploadButton as Upload } from "@/lib/uploadthing";

export default function UploadButton() {
  return (
    <Upload
      content={{
        button({ ready }) {
          if (ready) {
            return (
              <div className="w-full p-4 text-sm rounded-lg flex justify-center items-center text-white h-10 bg-black">
                Browse files
              </div>
            );
          }

          return (
            <div className="w-full p-4 text-sm rounded-lg flex justify-center items-center text-white h-10 bg-gray-700">
              Getting ready...
            </div>
          );
        },
      }}
      className="mt-8 border-2 border-gray-300 border-dashed rounded-lg w-full h-64 cursor-pointer hover:bg-gray-50"
      endpoint="resumeUpload"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
