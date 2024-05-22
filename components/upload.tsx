"use client";
// import { UploadDropzone as Upload } from "@/lib/uploadthing";
import { toast } from "sonner";
import { UploadDropzone as UploadThingDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

export default function UploadButton({endpoint}: {endpoint: keyof OurFileRouter}) {
  return (
    <UploadThingDropzone<OurFileRouter, keyof OurFileRouter>
      config={{ mode: "auto" }}
      endpoint={endpoint}
      appearance={{
        button: "w-1/2 p-4 ut-uploading:cursor-not-allowed ut-uploading:bg-black text-sm rounded-lg flex justify-center items-center text-white h-10 bg-black"
      }}
      content={{
        // button({ ready, isUploading, uploadProgress, fileTypes }) {
        //   if (ready) {
        //     return (
        //       <div className="">
        //         Browse files
        //       </div>
        //     );
        //   }
        //   if (isUploading) {
        //     return (
        //       <div className="w-full p-4 text-sm rounded-lg flex justify-center items-center text-white h-10 bg-gray-700">
        //         Uploading...
        //       </div>
        //     );
        //   }
        //   return (
        //     <div className="w-full p-4 text-sm rounded-lg flex justify-center items-center text-white h-10 bg-gray-700">
        //       Getting ready...
        //     </div>
        //   );
        // },
      }}
      className="ut-label:text-black mt-8 border-2 border-gray-300 border-dashed rounded-lg w-full h-64 hover:bg-gray-50"
      onClientUploadComplete={(res) => {
        // Do something with the response
        toast("File uploaded successfully!");
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
