"use client";
import { cn } from "@/lib/utils";
import {
  useGetEditorColor,
  useGetEditorBg,
  useGetResumeEditorData,
} from "../../lib/queries";
import { useEffect, useRef, useState } from "react";
import useDimensions from "@/hooks/useDimensions";
import { Download, Github, Globe, Linkedin, Twitter } from "lucide-react";
import { useContentRef } from "../downloadResume";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { toast } from "sonner";
import { incrementDownloadedResumes } from "../../_actions";
import { useQueryClient } from "@tanstack/react-query";

export default function PDFPreview({ resumeId }: { resumeId?: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: resume } = useGetResumeEditorData(resumeId ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useDimensions(containerRef);
  const [editorBg, setEditorBg] = useState<string | undefined>("bg-[#174BDC]");
  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: resume?.title || "Resume",
  });
  const { data: editorColor, isLoading: isLoadingEditorColor } =
    useGetEditorColor(resumeId ?? "");
  return (
    <div className={"flex flex-col w-full overflow-y-auto p-3 "}>
      <div className="flex justify-end pb-4">
        <Download
          onClick={() =>
            toast.promise(
              async () => {
                //wait until the resume is downloaded and then increment the downloaded resumes
                await reactToPrint();
                await incrementDownloadedResumes();
                queryClient.invalidateQueries({
                  queryKey: ["downloaded_resumes"],
                });
              },
              {
                loading: "Loading...",
                success: "Resume downloaded successfully",
                error: "Failed to download resume",
              }
            )
          }
          className={
            "text-blue-800 cursor-pointer  hover:text-black hover:translate-y-[-3px] transition-all duration-300"
          }
        />
      </div>
      <div
        ref={containerRef}
        className={
          "w-full  overflow-y-auto aspect-[210/297] bg-white shadow-md h-fit text-[8px]"
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
          <h1
            style={{ color: editorColor }}
            className={`text-center text-[34px] font-bold h-fit w-full `}
          >
            {resume?.firstName} {resume?.lastName}
          </h1>
          {resume && !isLoadingEditorColor && editorColor && (
            <div className="flex flex-col gap-4 items-center  ">
              <div className="flex flex-col gap-2 items-center  ">
                <div className="flex max-w-[600px] gap-4">
                  {resume.website && resume.website.length && (
                    <a href={`${resume.website}`} target="_blank">
                      <Globe className="w-[20px] h-[20px] self-center" />
                    </a>
                  )}
                  {resume.github && resume.github.length && (
                    <a
                      href={`https://github.com/${resume.github}`}
                      target="_blank"
                    >
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
                    <a
                      href={`https://linkedin.com${resume.linkedin}`}
                      target="_blank"
                    >
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
                  <div
                    style={{ backgroundColor: editorColor }}
                    className={"flex w-full h-[4px]"}
                  />
                  <div className="flex flex-col text-start w-full gap-1">
                    <h2
                      style={{ color: editorColor }}
                      className={"text-[22px] font-bold"}
                    >
                      Summary
                    </h2>
                    <p className="text-[12px]">{resume.summary}</p>
                  </div>
                </>
              )}
              {resume.workExperience && resume.workExperience.length > 0 && (
                <>
                  <div
                    style={{ backgroundColor: editorColor }}
                    className={"flex w-full h-[4px]"}
                  />
                  <div className="flex flex-col text-start w-full gap-1">
                    <h2
                      style={{ color: editorColor }}
                      className={"text-[18px]  font-bold"}
                    >
                      Work Experience
                    </h2>
                    <div className="flex flex-col gap-2">
                      {/* biome-ignore lint: */}
                      {resume.workExperience.map((work: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between">
                            <h3 className="text-[14px] font-bold">
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
                              work.summary.map(
                                // biome-ignore lint:
                                ({ summaryPoint }: any, index: number) => (
                                  // biome-ignore lint:
                                  <li className="list-disc" key={index}>
                                    <p className="text-[12px]">
                                      {summaryPoint}
                                    </p>
                                  </li>
                                )
                              )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {resume.education && resume.education.length > 0 && (
                <>
                  <div
                    style={{ backgroundColor: editorColor }}
                    className={"flex w-full h-[4px]"}
                  />
                  <div className="flex flex-col text-start w-full gap-1">
                    <h2
                      style={{ color: editorColor }}
                      className={"text-[18px] font-bold"}
                    >
                      Education
                    </h2>
                    <div className="flex flex-col gap-2">
                      {/* biome-ignore lint: */}
                      {resume.education.map((education: any) => (
                        <div className="flex flex-col " key={education.id}>
                          <div className="flex justify-between">
                            <h3 className="text-[14px] font-bold">
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
                          {/* <p className="text-[12px]">
														{education.achievements}
													</p> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {resume.projects && resume.projects.length > 0 && (
                <>
                  <div
                    style={{ backgroundColor: editorColor }}
                    className={"flex w-full h-[4px]"}
                  />
                  <div className="flex flex-col text-start w-full gap-1">
                    <h2
                      style={{ color: editorColor }}
                      className={"text-[18px]  font-bold"}
                    >
                      Projects
                    </h2>
                    <div className="flex flex-col gap-2">
                      {/* biome-ignore lint: */}
                      {resume.projects.map((project: any, index: number) => (
                        <div key={index}>
                          <h3 className="text-[14px] font-bold">
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
                  <div
                    style={{ backgroundColor: editorColor }}
                    className={"flex w-full h-[4px]"}
                  />
                  <div className="flex flex-col text-start w-full gap-1">
                    <h2
                      style={{ color: editorColor }}
                      className={"text-[18px] font-bold"}
                    >
                      Certifications
                    </h2>
                    <div className="flex flex-col gap-2">
                      {/* biome-ignore lint: */}
                      {resume.certifications.map((certification: any) => (
                        <div
                          className="flex justify-between"
                          key={certification.id}
                        >
                          <h3 className="text-[14px] font-bold">
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
                  <div
                    style={{ backgroundColor: editorColor }}
                    className={"flex w-full h-[4px]"}
                  />
                  <div className="flex flex-col text-start w-full gap-1">
                    <h2
                      style={{ color: editorColor }}
                      className={"text-[18px] font-bold"}
                    >
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
