"use client";

import { saveMessageToDb } from "@/actions";
import { api } from "@/lib/api";
import { useGetResume } from "@/app/app/(resumes)/lib/queries";
import { useChat } from "ai/react";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface ResumeContextProps {
	sortBy: string;
	setSortBy: React.Dispatch<React.SetStateAction<string>>;
	resume: Resume | null;
	setResume: React.Dispatch<React.SetStateAction<Resume | null>>;
	status: Feedback["status"];
	setStatus: React.Dispatch<React.SetStateAction<Feedback["status"]>>;
	feedbacks: Feedback[];
	setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
	improvements: Improvement[];
	setImprovements: React.Dispatch<React.SetStateAction<Improvement[]>>;
	refetchInterval: number;
	setRefetchInterval: React.Dispatch<React.SetStateAction<number>>;
}

export const ResumeContext = createContext<ResumeContextProps>({
	sortBy: "",
	setSortBy: () => {},
	resume: null,
	setResume: () => {},
	status: "loading",
	setStatus: () => {},
	feedbacks: [],
	setFeedbacks: () => {},
	improvements: [],
	setImprovements: () => {},
	refetchInterval: 0,
	setRefetchInterval: () => {},
});

export function ResumeProvider({
	children,
	resumeId,
}: {
	children: React.ReactNode;
	resumeId: Resume["id"];
}) {
	const [refetchInterval, setRefetchInterval] = useState<number>(0);
	const [resume, setResume] = useState<Resume | null>(null);
	const [status, setStatus] = useState<string>("loading");
	const [sortBy, setSortBy] = useState<string>("");
	const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
	const [improvements, setImprovements] = useState<Improvement[]>([]);
	const {
		data: resumeData,
		status: resumeStatus,
		error: resumeError,
	} = useGetResume(resumeId.toString(), refetchInterval);

	useEffect(() => {
		if (resumeStatus === "success" && resumeData && resumeData.resume) {
			setResume(resumeData.resume);
			setStatus("Loaded");
			setFeedbacks(resumeData.resume.feedbacks || []);
		}
	}, [resumeStatus, resumeData]);

	useEffect(() => {
		if (resume?.status === "Analyzing" && refetchInterval === 0) {
			setRefetchInterval(2000);
		}
	}, [resume, refetchInterval]);

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
				improvements,
				setImprovements,
				refetchInterval,
				setRefetchInterval,
			}}
		>
			{children}
		</ResumeContext.Provider>
	);
}

export const useInitiateAssistantUI = () => {
	const { resume, feedbacks } = useContext(ResumeContext);

	const { data } = api.queries.chat.useGetMessages({
		resumeId: resume?.id,
		enabled: resume?.id !== null,
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
			resumeId: resume?.id,
			// applicationId: resume!.applicationId,
			userId: resume?.userId,
		},
	});

	if (!resume || resume.status !== "Analyzed") {
		return { chat, isReady: false };
	}

	return { chat };
};