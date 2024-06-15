"use client";

import { saveMessageToDb } from "@/actions";
import { api } from "@/lib/api";
import { useChat } from "ai/react";
import React, { createContext, useContext, useState } from "react";

interface LayoutContextProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  resume: Resume | null;
  setResume: React.Dispatch<React.SetStateAction<Resume | null>>;
  status: Feedback["status"];
  setStatus: React.Dispatch<React.SetStateAction<Feedback["status"]>>;
  feedbacks: Feedback[];
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
}

export const LayoutContext = createContext<LayoutContextProps>({
  sortBy: "",
  setSortBy: () => {},
  resume: null,
  setResume: () => {},
  status: "loading",
  setStatus: () => {},
  feedbacks: [],
  setFeedbacks: () => {},
});

export function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [status, setStatus] = useState<Feedback["status"]>("loading");
  const [sortBy, setSortBy] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  return (
    <LayoutContext.Provider
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
    </LayoutContext.Provider>
  );
}

export const useInitiateAssistantUI = () => {
  const { resume, feedbacks } = useContext(LayoutContext);

  const { data } = api.queries.chat.useGetMessages({
    resumeId: resume!.id,
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
            "You area resume analyzer tool. You will be analyzing a user-uploaded resume that has been converted to plain text. You also have already provided some feedback on the resume. Your job is to answer any questions the user has about their resume or the feedback provided",
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
//   const {setTitle} = useContext(context.resume.LayoutContext)

//   useEffect(() => {
//     setTitle(title)
//   }, [title, setTitle]);

//   return null;
// }

// */

// export { LayoutContext, LayoutProvider };
