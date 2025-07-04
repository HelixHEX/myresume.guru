"use client";

import { type Control, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignedIn, useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSaveResumeEditorData } from "../../lib/mutations";
import {
  getResumeEditorData,
  useGetEditorColor,
  useGetResume,
  useGetResumeEditorData,
} from "../../lib/queries";
import SaveResume from "../save-resume";
import { saveResume } from "../../lib/actions";
import { usePathname, useRouter } from "next/navigation";
import { ColorPicker, GradientPicker } from "@/components/ui/color-picker";
import { useQueryClient } from "@tanstack/react-query";

export const editorSchema = z.object({
  resumeName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  twitter: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  workExperience: z
    .array(
      z.object({
        company: z.string().optional(),
        title: z.string().optional(),
        summary: z.array(z.object({ summaryPoint: z.string() })).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        current: z.boolean().optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        school: z.string().optional(),
        degree: z.string().optional(),
        fieldOfStudy: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        achievements: z.string().optional(),
        current: z.boolean().optional(),
      })
    )
    .optional(),
  skills: z.string().optional(),
  projects: z
    .array(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .optional(),
});

export default function Editor({
  resumeId,
  isHomePage = false,
}: {
  resumeId?: string;
  isHomePage?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [refetchInterval, setRefetchInterval] = useState(0);
  const { data: resumeData, isLoading: resumeLoading } = useGetResume(
    resumeId ?? "",
    refetchInterval
  );
  const isNewResumePage = pathname.includes("/resumes/new");
  const isEditorPage =
    pathname.includes("/app/resumes") && pathname !== "/app/resumes/new";

  const { data: resumeEditorData, isLoading: resumeEditorLoading } =
    useGetResumeEditorData(resumeId ?? "");
  const { mutate: saveResumeEditorData } = useSaveResumeEditorData(
    resumeId ?? ""
  );

  const resume = resumeData?.resume;

  useEffect(() => {
    if (resume?.status !== "Analyzed" && refetchInterval === 0) {
      setRefetchInterval(1000);
    } else if (resume?.status === "Analyzed" && refetchInterval !== 0) {
      setRefetchInterval(0);
    }
  }, [resume, refetchInterval]);
  useEffect(() => {
    const main = async () => {
      if (user) {
        const localResumeEditorData = await getResumeEditorData(resumeId ?? "");
        console.log("Saving resume editor data", resume, user);
        if (resume && resume.userId === user.id) {
          saveResumeEditorData({
            resumeId: resumeId ?? "",
            data: JSON.stringify({
              resumeName: resume?.name,
              firstName: resume?.firstName,
              lastName: resume?.lastName,
              email: resume?.email,
              phone: resume?.phone,
              github: resume?.github,
              linkedin: resume?.linkedin,
              website: resume?.website,
              twitter: resume?.twitter,
              location: resume?.location,
              summary: resume?.summary,
              workExperience: resume?.workExperience,
              education: resume?.education_new,
              skills: resume?.skills,
              certifications: resume?.certifications,
              projects: resume?.projects,
            }),
          });
        } else if (
          Object.keys(localResumeEditorData).length === 0 &&
          resume &&
          resume.userId === user.id
        ) {
          saveResumeEditorData({
            resumeId: resumeId ?? "",
            data: JSON.stringify({ ...localResumeEditorData }),
          });
        }
      }
    };
    main();
  }, [user, saveResumeEditorData, resumeId, resume]);

  if (resumeLoading || resumeEditorLoading)
    return (
      <div className="flex text-blue-800 sm:text-white mt-2 font-bold justify-center items-center w-full">
        Loading <Loader2 className="ml-2 animate-spin" />
      </div>
    );

  if (!resumeData && isEditorPage) router.push("/app/resumes");

  if (resumeData?.message && resumeData.message.length > 0 && !isHomePage) {
    router.push("/app/resumes");
  }

  const { firstName, lastName } = user ?? { firstName: "", lastName: "" };

  if (
    resume?.status === "Analyzing resume" ||
    resume?.status === "Generating feedback"
  ) {
    return (
      <div className="flex text-blue-800 sm:text-white mt-2 font-bold justify-center items-center w-full">
        {resume?.status} <Loader2 className="ml-2 animate-spin" />
      </div>
    );
  }

  return (
    <EditorForm
      resumeData={resumeEditorData}
      firstName={firstName || ""}
      lastName={lastName || ""}
      email={user?.emailAddresses[0].emailAddress || ""}
      github={user?.externalAccounts[0].username || ""}
      resumeId={resumeId ?? ""}
      resume={resume}
    />
  );
}

function EditorForm({
  firstName,
  lastName,
  email,
  github,
  resumeData,
  resumeId,
  resume,
}: {
  firstName: string;
  lastName?: string;
  email?: string;
  github?: string;
  resumeData: any;
  resumeId: string;
  resume?: Resume;
}) {
  const { mutate: saveResumeEditorData } = useSaveResumeEditorData(
    resumeId ?? ""
  );
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof editorSchema>>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      resumeName: resume?.name,
      firstName: resume?.firstName || resumeData?.firstName || firstName,
      lastName: resume?.lastName || resumeData?.lastName || lastName,
      phone: resume?.phone || resumeData?.phone || "",
      email: resume?.email || resumeData?.email || email,
      github: resume?.github || resumeData?.github || github,
      linkedin: resume?.linkedin || resumeData?.linkedin || "",
      website: resume?.website || resumeData?.website || "",
      twitter: resume?.twitter || resumeData?.twitter || "",
      location: resume?.location || resumeData?.location || "",
      summary: resume?.summary || resumeData?.summary || "",
      workExperience:
        resume?.workExperience || resumeData?.workExperience || [],
      education: resume?.education_new || resumeData?.education || [],
      skills: resume?.skills || resumeData?.skills || "",
      certifications:
        resume?.certifications || resumeData?.certifications || [],
      projects: resume?.projects || resumeData?.projects || [],
    },
  });

  const {
    fields: workExperienceFields,
    append: appendWorkExperience,
    remove: removeWorkExperience,
  } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const {
    fields: projectsFields,
    append: appendProjects,
    remove: removeProjects,
  } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const {
    fields: certificationsFields,
    append: appendCertifications,
    remove: removeCertifications,
  } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (data) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      saveResumeEditorData({
        resumeId: resumeId ?? "",
        data: JSON.stringify(data),
      });
    });

    return unsubscribe;
  }, [form, saveResumeEditorData, resumeId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof editorSchema>) {
    setIsSubmitting(true);
    const res = await saveResume(values, resumeId);
    localStorage.removeItem("resume:");
    router.push(`/app/resumes/${res.resumeId}`);
    setIsSubmitting(false);
  }
  const queryClient = useQueryClient();

  const { data: editorColor } = useGetEditorColor(resumeId ?? "");

  const changeColor = (color: string) => {
    localStorage.setItem(`resume${resumeId && `:${resumeId}`}:color`, color);
    queryClient.invalidateQueries({
      queryKey: ["editor_color", resumeId],
    });
  };
  return (
    <Form {...form}>
      <form className="pt-8 " onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <p className="font-bold text-blue-800">Color</p>
          <ColorPicker
            value={editorColor ?? "#174BDC"}
            onChange={changeColor}
          />
        </div>
        {/* <GradientPicker background={editorColor} setBackground={changeColor} /> */}
        <div className="grid mt-8 grid-cols-2 gap-4 ">
          <EditorInput
            name="resumeName"
            className={`self-end ${user ? "" : "col-span-2"}`}
            label="Resume Name"
            placeholder="Updated resume"
            control={form.control}
          />
          <SignedIn>
            <SaveResume
              className="self-end"
              isSubmitting={isSubmitting}
              resumeName={form.getValues("resumeName") || ""}
            />
          </SignedIn>
        </div>
        <div className="grid mt-8 grid-cols-2 gap-4 ">
          <EditorInput
            name="firstName"
            label="First Name"
            placeholder="John"
            control={form.control}
          />
          <EditorInput
            name="lastName"
            label="Last Name"
            placeholder="Doe"
            control={form.control}
          />
        </div>
        <EditorInput
          className="mt-8"
          name="summary"
          label="Summary"
          placeholder="I'm a passionate software engineer who's eager to learn and grow. While I'm still early in my career, I've already had some exciting opportunities to work on real-world projects that make a difference."
          control={form.control}
        />
        <div className="grid mt-8 grid-cols-2 gap-4">
          <EditorInput
            name="email"
            label="Email"
            placeholder="support@thenextcreatives.com"
            control={form.control}
          />
          <EditorInput
            name="phone"
            label="Phone"
            placeholder="123 456 7890"
            control={form.control}
          />
        </div>
        <EditorInput
          name="website"
          className="mt-8"
          label="Website"
          placeholder="https://www.example.com"
          control={form.control}
        />
        <div className="grid mt-8 grid-cols-2 gap-4">
          <EditorInput
            name="github"
            label="Github Username"
            placeholder="HelixHEX"
            control={form.control}
          />
          <EditorInput
            name="location"
            label="Location"
            placeholder="San Francisco, CA"
            control={form.control}
          />
        </div>
        <div className="grid mt-8 grid-cols-2 gap-4">
          <EditorInput
            name="linkedin"
            label="LinkedIn"
            placeholder="/in/eliaswambugu"
            control={form.control}
          />
          <EditorInput
            name="twitter"
            label="Twitter Username"
            placeholder="@eliasdevs"
            control={form.control}
          />
        </div>

        <div className="mt-8">
          <Accordion type="multiple">
            <EditorSection value="work-experience" title="Work Experience">
              {workExperienceFields.map((workExperienceField, index) => (
                <div key={workExperienceField.id} className="pt-10">
                  <div className="flex justify-between">
                    <p className="font-bold pb-4 text-lg text-blue-800 ">
                      {workExperienceField.company || workExperienceField.title
                        ? `${workExperienceField.title}${
                            workExperienceField.company &&
                            workExperienceField.title
                              ? ", "
                              : ""
                          }${workExperienceField.company}`
                        : `Experience ${index + 1}`}
                    </p>
                    <X
                      onClick={() => removeWorkExperience(index)}
                      className="cursor-pointer hover:text-red-400 text-blue-800"
                      width={18}
                      height={18}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <EditorInput
                      name={`workExperience.${index}.title`}
                      label={"Job Title"}
                      placeholder="Software Engineer"
                      control={form.control}
                    />
                    <EditorInput
                      name={`workExperience.${index}.company`}
                      label={"Company"}
                      placeholder="Google"
                      control={form.control}
                    />
                  </div>
                  <div className="grid pt-4 grid-cols-2 gap-4">
                    <EditorInput
                      name={`workExperience.${index}.startDate`}
                      label={"Start Date"}
                      placeholder="Aug 2024"
                      control={form.control}
                    />
                    <EditorInput
                      name={`workExperience.${index}.endDate`}
                      label={"End Date"}
                      placeholder="Present"
                      control={form.control}
                    />
                  </div>
                  <EditorWorkExperienceBulletPoints
                    control={form.control}
                    index={index}
                    placeholder="I was responsible for..."
                    appendWorkExperience={appendWorkExperience}
                  />
                </div>
              ))}
              <div className="mt-6 w-full flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    appendWorkExperience({
                      title: "",
                      company: "",
                      summary: [{ summaryPoint: "" }],
                      startDate: "",
                      endDate: "",
                      location: "",
                      current: false,
                    })
                  }
                  className="sm:bg-white rounded-none h-[30px] sm:text-blue-800 sm:hover:bg-blue-800 sm:hover:text-white bg-blue-800 text-white hover:bg-blue-900 font-bold cursor-pointer"
                >
                  Add Work Experience
                </Button>
              </div>
            </EditorSection>
            <EditorSection value="education" title="Education">
              {educationFields.map((educationField, index) => (
                <div key={educationField.id}>
                  <div className="flex justify-between pt-8 pb-4">
                    <p className="font-bold pb-4 text-lg text-blue-800 ">
                      {educationField.school
                        ? educationField.school
                        : `Education ${index + 1}`}
                    </p>
                    <X
                      onClick={() => removeEducation(index)}
                      className="cursor-pointer hover:text-red-400 text-blue-800"
                      width={18}
                      height={18}
                    />
                  </div>
                  <EditorInput
                    name={`education.${index}.school`}
                    label={"School"}
                    placeholder="University of California, Berkeley"
                    control={form.control}
                  />
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <EditorInput
                      name={`education.${index}.fieldOfStudy`}
                      label={"Field of Study"}
                      placeholder="Software Engineer"
                      control={form.control}
                    />
                    <EditorInput
                      name={`education.${index}.degree`}
                      label={"Degree"}
                      placeholder="Bachelors"
                      control={form.control}
                    />
                  </div>
                  <div className="grid pt-4 grid-cols-2 gap-4">
                    <EditorInput
                      name={`education.${index}.startDate`}
                      label={"Start Date"}
                      placeholder="Aug 2024"
                      control={form.control}
                    />
                    <EditorInput
                      name={`education.${index}.endDate`}
                      label={"End Date"}
                      placeholder="Present"
                      control={form.control}
                    />
                  </div>
                  <EditorInput
                    className="mt-8"
                    name={`education.${index}.location`}
                    label={"Location"}
                    placeholder="San Francisco, CA"
                    control={form.control}
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    appendEducation({
                      school: "",
                      degree: "",
                      fieldOfStudy: "",
                      startDate: "",
                      endDate: "",
                      location: "",
                      current: false,
                    })
                  }
                  className="sm:bg-white mt-4 justify-self-end rounded-none h-[30px] sm:text-blue-800 sm:hover:bg-blue-800 sm:hover:text-white bg-blue-800 text-white hover:bg-blue-900 font-bold cursor-pointer"
                >
                  Add Education
                </Button>
              </div>
            </EditorSection>
            <EditorSection value="projects" title="Projects">
              {projectsFields.map((projectField, index) => (
                <div key={projectField.id} className="">
                  <div className="flex text-lg justify-between pt-8 pb-4">
                    <p className="font-bold text-lg text-blue-800 ">
                      Project {index + 1}
                    </p>
                    <X
                      onClick={() => removeProjects(index)}
                      className="cursor-pointer hover:text-red-400 text-blue-800"
                      width={18}
                      height={18}
                    />
                  </div>
                  <EditorInput
                    className=""
                    name={`projects.${index}.name`}
                    label={"Project Name"}
                    placeholder="My Resume Guru"
                    control={form.control}
                  />
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <EditorInput
                      name={`projects.${index}.url`}
                      label={"URL"}
                      placeholder="https://myresumeguru.com"
                      control={form.control}
                    />
                    <EditorInput
                      className=""
                      name={`projects.${index}.location`}
                      label={"Location"}
                      placeholder="San Francisco, CA"
                      control={form.control}
                    />
                  </div>
                  <div className="grid pt-4 grid-cols-2 gap-4">
                    <EditorInput
                      name={`projects.${index}.startDate`}
                      label={"Start Date"}
                      placeholder="Aug 2024"
                      control={form.control}
                    />
                    <EditorInput
                      name={`projects.${index}.endDate`}
                      label={"End Date"}
                      placeholder="Present"
                      control={form.control}
                    />
                  </div>
                  <EditorTextarea
                    className="mt-8"
                    name={`projects.${index}.description`}
                    label={"Description"}
                    placeholder="I built..."
                    control={form.control}
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    appendProjects({
                      name: "",
                      description: "",
                      startDate: "",
                      endDate: "",
                      location: "",
                      url: "",
                    })
                  }
                  className="sm:bg-white mt-4 justify-self-end rounded-none h-[30px] sm:text-blue-800 sm:hover:bg-blue-800 sm:hover:text-white bg-blue-800 text-white hover:bg-blue-900 font-bold cursor-pointer"
                >
                  Add Project
                </Button>
              </div>
            </EditorSection>
            <EditorSection value="certications" title="Certifications">
              {certificationsFields.map((certificationField, index) => (
                <div key={certificationField.id}>
                  <div className="flex justify-between pt-8 pb-4">
                    <p className="font-bold pb-4 text-lg text-blue-800 ">
                      Certification {index + 1}
                    </p>
                    <X
                      onClick={() => removeCertifications(index)}
                      className="cursor-pointer hover:text-red-400 text-blue-800"
                      width={18}
                      height={18}
                    />
                  </div>

                  <div className=" grid grid-cols-2 gap-4">
                    <EditorInput
                      name={`certifications.${index}.name`}
                      label={"Certification Name"}
                      placeholder="Cybersecurity Fundamentals"
                      control={form.control}
                    />
                    <EditorInput
                      name={`certifications.${index}.date`}
                      label={"Date"}
                      placeholder="Awarded on 2024-08-01"
                      control={form.control}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    appendCertifications({
                      name: "",
                      date: "",
                    })
                  }
                  className="sm:bg-white mt-4 justify-self-end rounded-none h-[30px] sm:text-blue-800 sm:hover:bg-blue-800 sm:hover:text-white bg-blue-800 text-white hover:bg-blue-900 font-bold cursor-pointer"
                >
                  Add Certification
                </Button>
              </div>
            </EditorSection>
            <EditorSection value="skills" title="Skills">
              <EditorInput
                name={"skills"}
                label={""}
                placeholder="Microsoft Office, Photoshop, etc."
                control={form.control}
              />
            </EditorSection>
          </Accordion>
        </div>
      </form>
    </Form>
  );
}

function EditorWorkExperienceBulletPoints({
  control,
  index,
  placeholder,
  appendWorkExperience,
}: {
  control: Control<z.infer<typeof editorSchema>>;
  index: number;
  placeholder: string;
  appendWorkExperience: (data: any) => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workExperience.${index}.summary`,
  });
  return (
    <div className="mt-8">
      <div className="flex justify-between">
        <p className="self-center font-bold text-blue-800">Summary</p>
      </div>
      {/* {fields.length} */}
      {fields.map((field, summaryIndex) => (
        <div className="flex w-full" key={field.id}>
          <EditorInput
            name={`workExperience.${index}.summary.${summaryIndex}.summaryPoint`}
            label={""}
            className="mr-2 w-full "
            placeholder="I was responsible for..."
            control={control}
          />
          <X
            onClick={() => remove(summaryIndex)}
            className="cursor-pointer self-center hover:text-red-400 text-blue-800"
            width={18}
            height={18}
          />
        </div>
      ))}
      <div className="mt-6 w-full flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={() => append({ summaryPoint: "" })}
          className="sm:bg-white rounded-none h-[30px] sm:text-blue-800 sm:hover:bg-blue-800 sm:hover:text-white bg-blue-800 text-white hover:bg-blue-900 font-bold cursor-pointer"
        >
          New Summary Point
        </Button>
      </div>
    </div>
  );
}

function EditorInput({
  name,
  label,
  placeholder,
  control,
  className,
  onChange,
}: {
  name: string;
  onChange?: (value: string) => void;
  label: string;
  placeholder: string;
  control: Control<z.infer<typeof editorSchema>>;
  className?: string;
}) {
  return (
    <FormField
      control={control}
      //biome-ignore lint:
      name={name as any}
      render={({ field }) => (
        <FormItem
          className={cn(
            "col-span-1 text-blue-800 flex justify-between flex-col",
            className
          )}
        >
          <div className="flex flex-col gap-2">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                className="text-blue-800 font-bold"
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage className="text-blue-800 md:text-white" />
        </FormItem>
      )}
    />
  );
}

function EditorTextarea({
  name,
  label,
  placeholder,
  control,
  className,
  onChange,
}: {
  name: string;
  onChange?: (value: string) => void;
  label: string;
  placeholder: string;
  control: Control<z.infer<typeof editorSchema>>;
  className?: string;
}) {
  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => (
        <FormItem
          className={cn(
            "col-span-1 text-blue-800  flex justify-between flex-col",
            className
          )}
        >
          <div className="flex flex-col gap-2">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea
                className="text-blue-800 rounded-none font-bold"
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage className="text-white" />
        </FormItem>
      )}
    />
  );
}

export function EditorSection({
  title,
  children,
  value,
}: {
  title: string;
  children: React.ReactNode;
  value: string;
}) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="flex  justify-between w-full font-bold cursor-pointer text-2xl text-blue-800 ">
        {title}
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  );
}
