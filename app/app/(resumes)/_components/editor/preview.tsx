"use client";
import { cn } from "@/lib/utils";
import { useGetResumeEditorData } from "../../lib/queries";
import { useRef } from "react";
import useDimensions from "@/hooks/useDimensions";
import { Download, Github, Globe, Linkedin, Twitter } from "lucide-react";
import { useContentRef } from "../downloadResume";
import { useReactToPrint } from "react-to-print";

export default function PDFPreview() {
	const contentRef = useRef<HTMLDivElement>(null);

	const { data: resume } = useGetResumeEditorData("");
	const containerRef = useRef<HTMLDivElement>(null);
	const { width, height } = useDimensions(containerRef);

	const reactToPrint = useReactToPrint({
		contentRef,
		documentTitle: resume?.title || "Resume",
	});

	return (
		<div className={"flex flex-col w-full overflow-y-auto bg-gray-200 p-3 "}>
			<div className="flex justify-end pb-4">
				<Download
					onClick={() => reactToPrint()}
					className="text-blue-800 sm:text-black cursor-pointer  hover:text-blue-800"
				/>
			</div>
			<div
				ref={containerRef}
				className={
					"w-full max-w-[210mm] overflow-y-auto aspect-[210/297] bg-white h-fit text-[8px]"
				}
			>
				<div
					ref={contentRef}
					className={cn("space-y-2 p-6 ", !width && "invisible")}
					style={{
						zoom: (1 / 794) * width,
					}}
					id="resumePreviewContent"
				>
					{/* make font times new roman */}
					<h1 className=" text-center text-[34px] font-bold h-fit w-ful text-blue-800">
						{resume?.firstName} {resume?.lastName}
					</h1>
					{resume && (
						<div className="flex flex-col gap-4 items-center  ">
							<div className="flex flex-col gap-2 items-center  ">
								<div className="flex max-w-[600px] gap-4">
									{resume.website && resume.website.length && (
										<a href={resume.website} target="_blank">
											<Globe className="w-[20px] h-[20px] self-center" />
										</a>
									)}
									{resume.github && resume.github.length && (
										<a href={resume.github} target="_blank">
											<Github className="w-[20px] h-[20px] self-center" />
										</a>
									)}
									{resume.twitter && resume.twitter.length && (
										<a
											href={`https://twitter.com/${resume.twitter}`}
											target="_blank"
										>
											<Twitter className="w-[20px] h-[20px] self-center" />
										</a>
									)}
									{resume.linkedin && resume.linkedin.length && (
										<a href={resume.linkedin} target="_blank">
											<Linkedin className="w-[20px] h-[20px] self-center" />
										</a>
									)}
								</div>
								<div className="flex  max-w-[600px] gap-2">
									{resume.location && resume.location.length && (
										<p className="text-center text-[12px]">{resume.location}</p>
									)}
									{resume.phone && resume.phone.length && (
										<p className="text-center text-[12px]">{resume.phone}</p>
									)}
									{resume.email && resume.email.length && (
										<p className="text-center text-[12px]">{resume.email}</p>
									)}
								</div>
							</div>
							{resume.summary && resume.summary.length > 0 && (
								<>
									<div className="flex w-full h-[4px] bg-blue-800 " />
									<div className="flex flex-col text-start w-full gap-1">
										<h2 className="text-[22px] text-blue-800 font-bold">
											Summary
										</h2>
										<p className="text-[12px]">{resume.summary}</p>
									</div>
								</>
							)}
							{resume.workExperience && resume.workExperience.length > 0 && (
								<>
									<div className="flex w-full h-[4px] bg-blue-800 " />
									<div className="flex flex-col text-start w-full gap-1">
										<h2 className="text-[18px] text-blue-800 font-bold">
											Work Experience
										</h2>
										<div className="flex flex-col gap-2">
											{resume.workExperience.map((work: any) => (
												<div key={work.id}>
													<div className="flex justify-between">
														<h3 className="text-[16px] font-bold">
															{work.title}
															{work.title && work.company && ", "}{" "}
															{work.company}
														</h3>
														<p className="text-[12px]">
															{work.startDate}{" "}
															{work.endDate && `- ${work.endDate}`}
														</p>
													</div>
													<ul className="list-disc pl-4">
														{work.summary.length > 0 &&
															work.summary.map(({ summaryPoint }: any, index: number) => (
																<li className="list-disc" key={index}>
																	<p className="text-[12px]">{summaryPoint}</p>
																</li>
															))}
													</ul>
												</div>
											))}
										</div>
									</div>
								</>
							)}
							{resume.education && resume.education.length > 0 && (
								<>
									<div className="flex w-full h-[4px] bg-blue-800 " />
									<div className="flex flex-col text-start w-full gap-1">
										<h2 className="text-[18px] text-blue-800 font-bold">
											Education
										</h2>
										<div className="flex flex-col gap-2">
											{resume.education.map((education: any) => (
												<div className="flex flex-col gap-2" key={education.id}>
													<div className="flex justify-between">
														<h3 className="text-[17px] font-bold">
															{education.school}
															{education.school && education.location && ", "}
															{education.location}
														</h3>
														<p className="text-[12px]">
															{education.startDate} - {education.endDate}
														</p>
													</div>
													<div className="flex gap-2">
														<p className="text-[12px]">
															{education.degree}
															{education.degree &&
																education.fieldOfStudy &&
																", "}
															{education.fieldOfStudy}
														</p>
													</div>
													<p className="text-[12px]">{education.achievements}</p>
												</div>
											))}
										</div>
									</div>
								</>
							)}
							{resume.projects && resume.projects.length > 0 && (
								<>
									<div className="flex w-full h-[4px] bg-blue-800 " />
									<div className="flex flex-col text-start w-full gap-1">
										<h2 className="text-[18px] text-blue-800 font-bold">
											Projects
										</h2>
										<div className="flex flex-col gap-2">
											{resume.projects.map((project: any) => (
												<div key={project.id}>
													<h3 className="text-[17px] font-bold">
														{project.name}
													</h3>
													<p className="text-[12px]">{project.description}</p>
												</div>
											))}
										</div>
									</div>
								</>
							)}
							{resume.certifications && resume.certifications.length > 0 && (
								<>
									<div className="flex w-full h-[4px] bg-blue-800 " />
									<div className="flex flex-col text-start w-full gap-1">
										<h2 className="text-[18px] text-blue-800 font-bold">
											Certifications
										</h2>
										<div className="flex flex-col gap-2">
											{resume.certifications.map((certification: any) => (
												<div key={certification.id}>
													<h3 className="text-[17px] font-bold">
														{certification.name}
													</h3>
													<p className="text-[12px]">{certification.date}</p>
												</div>
											))}
										</div>
									</div>
								</>
							)}
							{resume.skills && (
								<>
									<div className="flex w-full h-[4px] bg-blue-800 " />
									<div className="flex flex-col text-start w-full gap-1">
										<h2 className="text-[18px] text-blue-800 font-bold">
											Skills
										</h2>
										<p className="text-[12px]">{resume.skills}</p>
									</div>
								</>
							)}
							{/* <div className="flex w-full h-[4px] bg-blue-800 " /> */}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
