"use client";
import { Download } from "lucide-react";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useGetResumeEditorData } from "../lib/queries";

export default function DownloadResume() {
	const { data } = useGetResumeEditorData("");
	const contentRef = useContentRef();

	useEffect(() => {
		console.log(contentRef.current);
	}, [contentRef]);
  
	const reactToPrint = useReactToPrint({
		contentRef,
		documentTitle: data?.title || "Resume",
	});

	if (!data) return null;
	return (
		<Download
			onClick={() => reactToPrint()}
			className="text-blue-800 sm:text-white"
		/>
	);
}

export const useContentRef = () => useRef<HTMLDivElement>(null);
