"use client";

import { saveMessageToDb } from "@/actions";
import { api } from "@/lib/api";
import { useGetResume } from "@/lib/api/queries/resumes";
import { useChat } from "ai/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ResumeContextProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  resume: Resume | null;
  setResume: React.Dispatch<React.SetStateAction<Resume | null>>;
  status: Feedback["status"];
  setStatus: React.Dispatch<React.SetStateAction<Feedback["status"]>>;
  feedbacks: Feedback[];
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
}

export const ResumeContext = createContext<ResumeContextProps>({
  sortBy: "",
  setSortBy: () => { },
  resume: null,
  setResume: () => { },
  status: "loading",
  setStatus: () => { },
  feedbacks: [],
  setFeedbacks: () => { },
});

export function ResumeProvider({
  children,
  fileKey,
}: {
  children: React.ReactNode;
  fileKey: Resume["fileKey"];
}) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [status, setStatus] = useState<string>("loading");
  const [sortBy, setSortBy] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const {
    data: resumeData,
    status: resumeStatus,
    error: resumeError,
  } = api.queries.resume.useGetResume(fileKey);

  useEffect(() => {
    if (resumeStatus === "success" && resumeData && resumeData.resume) {
      setResume(resumeData.resume);
      setStatus("Loaded");
      setFeedbacks(resumeData.resume.feedbacks || []);
    }
  }, [resumeStatus, resumeData]);

  if (resumeStatus === "pending") {
    return <div>Loading...</div>;
  }

  if (resumeStatus === "error") {
    return <div>Error: {resumeError.message}</div>;
  }

  if (!resumeData) {
    return <div>Resume not found</div>;
  }

  if (resumeData.message) {
    return <div>Error: {resumeData.message}</div>;
  }

  if (!resumeData.resume) {
    return <div>Resume not found</div>;
  }

  return (
    <ResumeContext.Provider
      value={{
        sortBy,
        setSortBy,
        status,
        setStatus,
        resume,
        setResume,
        feedbacks,
        setFeedbacks,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useInitiateAssistantUI = () => {
  const { resume, feedbacks } = useContext(ResumeContext);

  const { data } = api.queries.chat.useGetMessages({
    fileKey: resume!.fileKey,
    enabled: resume!.id !== null,
  });


  const chat = useChat({
    api: "/api/ai/chat",
    id: "chat",
    // initialMessages: data?.map((m) => ({
    //   id: m.id.toString(),
    //   content: m.content,
    //   role: m.role as "user" | "assistant" | "system",
    // })),

    // onFinish: (message) => {
    //   saveMessageToDb({
    //     message,
    //     resumeId: resume?.id,
    //     applicationId: resume?.applicationId,
    //     userId: resume?.userId,
    //   });
    // },
    body: {
      context: [
        {
          role: "system",
          content:
            "You are a resume analyzer tool. You will be analyzing a user-uploaded resume that has been converted to plain text. You also have already provided some feedback on the resume. Your job is to answer any questions the user has about their resume or the feedback provided",
        },
        // {
        //   role: "system",
        //   content: `resume: ${resume?.text}`,
        // },
        // {
        //   role: "system",
        //   content: `feedback you have already provided. Use it as context for responding to any questions users have: ${feedbacks
        //     .map((f: Feedback, index) => {
        //       return `\n- ${f.title}: ${f.text ?? ""} \n${f.actionableFeedbacks
        //         ?.map(
        //           (aF, aFIndex) =>
        //             `${aFIndex + 1}. ${aF.title}: ${aF.text ?? ""}`
        //         )
        //         .join("\n")}`;
        //     })
        //     .join("")}`,
        // },
      ],
      resumeId: resume!.id,
      // applicationId: resume!.applicationId,
      userId: resume!.userId,
    },
  });

  if (!resume || resume.status !== "Analyzed") {
    return { chat: null, isReady: false }
  }

  return { chat };
};

// interface LayoutContextProps {
//   sortBy: string;
//   setSortBy: React.Dispatch<React.SetStateAction<string>>;
//   resume: any | null;
//   setResume: React.Dispatch<React.SetStateAction<any>>;
//   status: "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database";
//   setStatus: React.Dispatch<
//     React.SetStateAction<
//       "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
//     >
//   >;
//   feedbacks: Feedback[],
//   setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
// }

// const LayoutContext = createContext<LayoutContextProps>({
//   sortBy: "",
//   setSortBy: () => {},
//   resume: null,
//   setResume: () => {},
//   status: "Loading",
//   setStatus: () => {},
//   feedbacks: [],
//   setFeedbacks: () => {},
// });

// export const useInitiateAssistantUI = () => {
//   const { resume, feedbacks } = useContext(LayoutContext);

// const { data } = api.queries.chat.useGetMessages({
//   resumeId: resume?.id,
//   enabled: resume?.id !== null,
// });

// const chat = useChat({
//   api: "/api/ai/chat",
//   id: "chat",
//   // initialMessages: data?.map((m) => ({
//   //   id: m.id.toString(),
//   //   content: m.content,
//   //   role: m.role as "user" | "assistant" | "system",
//   // })),

//   // onFinish: (message) => {
//   //   saveMessageToDb({
//   //     message,
//   //     resumeId: resume?.id,
//   //     applicationId: resume?.applicationId,
//   //     userId: resume?.userId,
//   //   });
//   // },
//   body: {
//     context: [
//       {
//         role: "system",
//         content:
//           "You area resume analyzer tool. You will be analyzing a user-uploaded resume that has been converted to plain text. You also have already provided some feedback on the resume. Your job is to answer any questions the user has about their resume or the feedback provided",
//       },
//       // {
//       //   role: "system",
//       //   content: `resume: ${resume?.text}`,
//       // },
//       // {
//       //   role: "system",
//       //   content: `feedback you have already provided. Use it as context for responding to any questions users have: ${feedbacks
//       //     .map((f: Feedback, index) => {
//       //       return `\n- ${f.title}: ${f.text ?? ""} \n${f.actionableFeedbacks
//       //         ?.map(
//       //           (aF, aFIndex) =>
//       //             `${aFIndex + 1}. ${aF.title}: ${aF.text ?? ""}`
//       //         )
//       //         .join("\n")}`;
//       //     })
//       //     .join("")}`,
//       // },
//     ],
//     resumeId: resume?.id,
//     applicationId: resume?.applicationId,
//     userId: resume?.userId,
//   },
// });
// return {chat}
// }

// const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
//   const [resume, setResume] = useState<Resume | null>(null);
//   const [status, setStatus] = useState<
//     "Done" | "Loading" | "Analyzing" | "Analyzed" | "Saving to database"
//   >("Loading");
//   const [sortBy, setSortBy] = useState<string>("");
//   const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
//   return (
//     <LayoutContext.Provider
//       value={{ sortBy, setSortBy, status, setStatus, resume, setResume, feedbacks, setFeedbacks }}
//     >
//       {children}
//     </LayoutContext.Provider>
//   );
// };

// /*

// LEGACY CODE

// const ChangeTitle = ({title}: {title: string}) => {
//   const {setTitle} = useContext(context.resume.ResumeContext)

//   useEffect(() => {
//     setTitle(title)
//   }, [title, setTitle]);

//   return null;
// }

// */

// export { LayoutContext, LayoutProvider };
