"use client";

import {
	type Control,
	useFieldArray,
	useForm,
	type UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
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
import { Loader2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSaveResumeEditorData } from "../lib/mutations";
import { useGetResumeEditorData } from "../lib/queries";

const workExperienceSchema = z.object({
	company: z.string().min(3, {
		message: "Company must be at least 3 characters long",
	}),
	title: z.string().min(3, {
		message: "Title must be at least 3 characters long",
	}),
	summary: z.string().min(3, {
		message: "Summary must be at least 3 characters long",
	}),
	startDate: z.string(),
	endDate: z.string().optional(),
	location: z.string().min(3, {
		message: "Location must be at least 3 characters long",
	}),
	current: z.boolean(),
});

const editorSchema = z.object({
	firstName: z.string().min(3, {
		message: "First name must be at least 3 characters long",
	}),
	lastName: z.string().min(3, {
		message: "Last name must be at least 3 characters long",
	}),
	email: z
		.string()
		.email({
			message: "Invalid email address",
		})
		.optional(),
	phone: z.string().optional(),
	github: z.string().optional(),
	linkedin: z.string().optional(),
	website: z.string().optional(),
	twitter: z.string().optional(),
	location: z.string().optional(),
	summary: z
		.string()
		.min(3, {
			message: "Summary must be at least 3 characters long",
		})
		.optional(),
	workExperience: z
		.array(
			z.object({
				company: z.string().min(3, {
					message: "Company must be at least 3 characters long",
				}),
				title: z.string().min(3, {
					message: "Title must be at least 3 characters long",
				}),
				summary: z.string().min(3, {
					message: "Description must be at least 3 characters long",
				}),
				startDate: z.string(),
				endDate: z.string().optional(),
				location: z.string().min(3, {
					message: "Location must be at least 3 characters long",
				}),
				current: z.boolean(),
			}),
		)
		.optional(),
	education: z
		.array(
			z.object({
				school: z.string().min(3, {
					message: "School must be at least 3 characters long",
				}),
				degree: z.string().min(3, {
					message: "Degree must be at least 3 characters long",
				}),
				fieldOfStudy: z.string().min(3, {
					message: "Field of study must be at least 3 characters long",
				}),
				startDate: z.string(),
				endDate: z.string().optional(),
				location: z.string().min(3, {
					message: "Location must be at least 3 characters long",
				}),
				achievements: z.string().optional(),
				current: z.boolean(),
			}),
		)
		.optional(),
	skills: z.string().optional(),
	projects: z
		.array(
			z.object({
				name: z.string().min(3, {
					message: "Project name must be at least 3 characters long",
				}),
				description: z.string().min(3, {
					message: "Description must be at least 3 characters long",
				}),
				startDate: z.string(),
				endDate: z.string().optional(),
				location: z.string().min(3, {
					message: "Location must be at least 3 characters long",
				}),
				url: z
					.string()
					.url({
						message: "Invalid URL",
					})
					.optional(),
			}),
		)
		.optional(),
	certifications: z
		.array(
			z.object({
				name: z.string().min(3, {
					message: "Certification must be at least 3 characters long",
				}),
				date: z.string(),
			}),
		)
		.optional(),
});

export default function Editor() {
	const { user } = useUser();
	const { data: resumeEditorData, isLoading } = useGetResumeEditorData("");
	if (!user || isLoading)
		return (
			<div className="flex text-white mt-2 font-bold justify-center items-center w-full">
				Loading <Loader2 className="ml-2 animate-spin" />
			</div>
		);
	const { firstName, lastName } = user;
	return (
		<EditorForm
			resumeData={resumeEditorData}
			firstName={firstName || ""}
			lastName={lastName || ""}
			email={user.emailAddresses[0].emailAddress || ""}
			github={user.externalAccounts[0].username || ""}
		/>
	);
}

function EditorForm({
	firstName,
	lastName,
	email,
	github,
	resumeData,
}: {
	firstName: string;
	lastName?: string;
	email?: string;
	github?: string;
	resumeData: any;
}) {
	const { mutate: saveResumeEditorData } = useSaveResumeEditorData("");

	useEffect(() => console.log(resumeData), [resumeData]);

	const form = useForm<z.infer<typeof editorSchema>>({
		resolver: zodResolver(editorSchema),
		defaultValues: {
			firstName: resumeData?.firstName || firstName,
			lastName: resumeData?.lastName || lastName,
			phone: resumeData?.phone || "",
			email: resumeData?.email || email,
			github: resumeData?.github || github,
			linkedin: resumeData?.linkedin || "",
			website: resumeData?.website || "",
			twitter: resumeData?.twitter || "",
			location: resumeData?.location!,
			summary: resumeData?.summary || "",
			workExperience: resumeData?.workExperience || [],
			education: resumeData?.education || [],
			skills: resumeData?.skills || "",
			certifications: resumeData?.certifications || [],
			projects: resumeData?.projects || [],
		},
	});

	function onSubmit(values: z.infer<typeof editorSchema>) {
		console.log(values);
	}

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
			console.log(data);
			saveResumeEditorData({
				fileKey: "",
				data: JSON.stringify(data),
			});
		});

		return unsubscribe;
	}, [form, saveResumeEditorData]);

	return (
		<Form {...form}>
			<form className="pt-8" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid grid-cols-2 gap-4 ">
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
					placeholder="myresume.guru"
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
						label="Linkedin url"
						placeholder="https://www.linkedin.com/in/helixhex"
						control={form.control}
					/>
					<EditorInput
						name="twitter"
						label="Twitter Username"
						placeholder="@username"
						control={form.control}
					/>
				</div>

				<div className="mt-8">
					<Accordion type="multiple">
						<EditorSection value="work-experience" title="Work Experience">
							<Button
								onClick={() =>
									appendWorkExperience({
										title: "",
										company: "",
										summary: "",
										startDate: "",
										endDate: "",
										location: "",
										current: false,
									})
								}
								className="bg-white rounded-none text-blue-800 font-bold cursor-pointer hover:bg-gray-300 hover:text-blue-800"
							>
								Add Work Experience
							</Button>
							{workExperienceFields.map((workExperienceField, index) => (
								<div key={workExperienceField.id} className="pt-10">
									<div className="flex justify-between">
										<p className="font-bold pb-4 text-lg text-white">
											Experience {index + 1}
										</p>
										<X
											onClick={() => removeWorkExperience(index)}
											className="cursor-pointer hover:text-red-600 text-white"
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
									<EditorTextarea
										className="mt-8"
										name={`workExperience.${index}.summary`}
										label={"Summary"}
										placeholder="I was responsible for..."
										control={form.control}
									/>
								</div>
							))}
						</EditorSection>
						<EditorSection value="education" title="Education">
							<Button
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
								className="bg-white rounded-none text-blue-800 font-bold cursor-pointer hover:bg-gray-300 hover:text-blue-800"
							>
								Add Education
							</Button>
							{educationFields.map((educationField, index) => (
								<div key={educationField.id}>
									<div className="flex justify-between pt-8 pb-4">
										<p className="font-bold pb-4 text-lg text-white">
											Education {index + 1}
										</p>
										<X
											onClick={() => removeEducation(index)}
											className="cursor-pointer hover:text-red-600 text-white"
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
											placeholder="Computer Science"
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
						</EditorSection>
						<EditorSection value="projects" title="Projects">
							<Button
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
								className="bg-white rounded-none text-blue-800 font-bold cursor-pointer hover:bg-gray-300 hover:text-blue-800"
							>
								Add Project
							</Button>
							{projectsFields.map((projectField, index) => (
								<div key={projectField.id} className="pt-10">
									<div className="flex text-lg justify-between">
										<p className="font-bold text-lg pb-4 text-white">
											Project {index + 1}
										</p>
										<X
											onClick={() => removeProjects(index)}
											className="cursor-pointer hover:text-red-600 text-white"
											width={18}
											height={18}
										/>
									</div>
									<EditorInput
										className="mt-8"
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
						</EditorSection>
						<EditorSection value="certications" title="Certifications">
							<Button
								onClick={() =>
									appendCertifications({
										name: "",
										date: "",
									})
								}
								className="bg-white rounded-none text-blue-800 font-bold cursor-pointer hover:bg-gray-300 hover:text-blue-800"
							>
								Add Certification
							</Button>
							{certificationsFields.map((certificationField, index) => (
								<div key={certificationField.id}>
									<div className="flex justify-between pt-8 pb-4">
										<p className="font-bold text-lg text-white">
											Certification {index + 1}
										</p>
										<X
											onClick={() => removeCertifications(index)}
											className="cursor-pointer hover:text-red-600 text-white"
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
						</EditorSection>
					</Accordion>
				</div>
			</form>
		</Form>
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
						"col-span-1 text-white flex justify-between flex-col",
						className,
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
					<FormMessage className="text-white" />
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
						"col-span-1 text-white flex justify-between flex-col",
						className,
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
			<AccordionTrigger className="font-bold cursor-pointer text-md text-white">
				{title}
			</AccordionTrigger>
			<AccordionContent>{children}</AccordionContent>
		</AccordionItem>
	);
}
