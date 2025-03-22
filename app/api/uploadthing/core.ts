import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { waitUntil } from "@vercel/functions";
import { convertPDFToText } from "@/lib";
import { task } from "@trigger.dev/sdk/v3";
import { tasks } from "@trigger.dev/sdk/v3";

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
            status: "Analyzing",
          },
        });
        if (!resume) {
          throw new UploadThingError(
            "There was an error uploading the file. Please try again."
          );
        }
        waitUntil(convertPDFToText(file.key));
        // waitUntil(axios.post("http://localhost:3000/api/resume/generate-feedback"));

        // Chain the analysis and feedback tasks

        waitUntil(tasks.trigger('analyze-resume', {
          fileKey: file.key
        }))

        // const analysisResult = await analyzeResume.run({ fileKey: file.key });
        // await generateFeedback.run(analysisResult);

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata, fileKey: file.key };
      } catch (e) {
        console.error("Error in upload handler:", e);
        throw new UploadThingError(
          "There was an error uploading the file. Please try again."
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
