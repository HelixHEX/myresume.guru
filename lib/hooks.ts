"use client";
import { generateFeedback } from "@/actions";
import { readStreamableValue } from "ai/rsc";
import { useContext, useEffect } from "react";
import { context } from "./context";
import { toast } from "sonner";
import posthog from "posthog-js";

export const useGenerateFeedback = async () => {
  const { resume, setFeedbacks } = useContext(context.resume.ResumeContext);

  useEffect(() => {
    const main = async () => {
      const { response, error } = await generateFeedback(resume!.fileKey);
      if (error) {
        toast(`${error}`);
      } else {
        for await (const value of readStreamableValue(response)) {
          if (value?.error) {
            throw new Error(value.error);
          }

          console.log(value?.feedbacks);
          setFeedbacks(value?.feedbacks || []);
          // setFeedbacksContext(value?.feedbacks || []);
        }
      }
    };
    main();
  }, [setFeedbacks, resume]);
};

// export const useGenerateFeedback = ({
//   fileKey,
//   status,
//   setStatus,
// }: {
//   fileKey: string;
//   status: string;
//   setStatus: React.Dispatch<
//     React.SetStateAction<
//       "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
//     >
//   >;
// }) => {
//   const {
//     setResume,
//     resume,
//     setFeedbacks: setFeedbacksContext,
//   } = useContext(context.resume.ResumeContext);
//   const [feedbacks, setFeedbacks] = useState<any>([]);
//   const [type, setType] = useState<"http" | "stream" | null>(null);
//   const router = useRouter()
//   useEffect(() => {
//     const fetchFeedbacks = async () => {
//       const feedbacksData = await generateFeedback(resume!.fileKey);

//       setType(feedbacksData.type);
//       console.log(feedbacksData);
//       if (feedbacksData.type === "stream") {
//         setStatus("Analyzing");
//         for await (const value of readStreamableValue(feedbacksData.response)) {
//           if (value?.error) {
//             throw new Error(value.error);
//           }

//           console.log(value?.feedbacks);
//           setFeedbacks(value?.feedbacks || []);
//           setFeedbacksContext(value?.feedbacks || []);
//         }
//         setStatus("Analyzed");
//       } else {
//         setStatus("Loading");
//         if (feedbacksData.response.error) {
//           toast(`${feedbacksData.response.error}`);
//           router.push('/app/resumes')
//         } else {
//           setFeedbacks(feedbacksData.response.feedbacks!);
//           setFeedbacksContext(feedbacksData.response.feedbacks!);
//           setResume(feedbacksData.response.feedbacks![0].resume!);
//           setStatus("Done");
//         }
//       }
//       posthog.capture("Generated feedback", { fileKey });

//     };
//     fetchFeedbacks();
//   }, [setStatus, setResume, router, resume, fileKey, setFeedbacksContext]);

//   useEffect(() => {
//     if (!resume) {
//       if (feedbacks.length > 0) {
//         setResume(feedbacks[0].resume);
//       }
//     }
//   }, [resume, setResume, feedbacks]);

//   useEffect(() => {
//     if (status === "Analyzed" && type === "stream" && feedbacks.length > 0) {
//       setStatus("Saving to database");
//       setTimeout(async () => {
//         const newResume = await saveToDb(resumeId, feedbacks);
//         setResume(newResume);
//         setStatus("Done");
//       }, 1000);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [status, type]);
//   return { feedbacks };
// };

type GenerateFeedbackResponse = ReturnType<typeof generateFeedback>;
