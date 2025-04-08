"use client";

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
