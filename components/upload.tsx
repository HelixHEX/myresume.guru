"use client";
// import { UploadDropzone as Upload } from "@/lib/uploadthing";
import { toast } from "sonner";
import { UploadDropzone as UploadThingDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { context } from "@/lib/context";

export default function UploadButton({
  endpoint,
}: {
  endpoint: keyof OurFileRouter;
}) {
  const router = useRouter();
  return (
    <UploadThingDropzone<OurFileRouter, keyof OurFileRouter>
      config={{ mode: "auto" }}
      endpoint={endpoint}
      appearance={{
        button:
          "w-1/2 p-4 ut-uploading:cursor-not-allowed bg-blue-800 ut-uploading:bg-black text-sm rounded-lg flex justify-center items-center text-white h-10",
      }}
      className="ut-label:text-black mt-8 cursor-pointer border-2 border-gray-300 border-dashed rounded-lg w-full h-64 hover:bg-gray-50"
      onClientUploadComplete={(res) => {
        // Do something with the response
        toast("File uploaded successfully!");
        const fileKey = res[0].serverData.fileKey ?? res[0].serverData.resumeId?.toString();
        if (fileKey) router.push(`/app/resumes/${encodeURIComponent(fileKey)}`);
      }}
      onUploadError={(error: Error ) => {
        // Do something with the error.
        toast(error.message);
      }}
    />
  );
}
