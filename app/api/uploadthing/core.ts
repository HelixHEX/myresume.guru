import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { waitUntil } from "@vercel/functions";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUpload: f({
    pdf: {
      maxFileCount: 1,
      maxFileSize: "512KB",
      minFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await currentUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      try {
        const resume = await prisma.resume.create({
          data: {
            userId: metadata.userId,
            name: file.name,
            fileKey: file.key,
          },
        });
        if (!resume) {
          throw new UploadThingError(
            "There was an error uploading the file. Please try again."
          );
        }

        // waitUntil(axios.post("http://localhost:3000/api/resume/analyze"));

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata, fileKey: file.key };
      } catch (e) {
        console.log(e);
        throw new UploadThingError(
          "There was an error uploading the file. Please try again."
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
