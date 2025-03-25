"use client";

import { type Control, useForm } from "react-hook-form";
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
	phone: z
		.string()
		.min(10, {
			message: "Phone number must be at least 10 characters long",
		})
		.optional(),
	github: z
		.string()
		.min(3, {
			message: "Github username must be at least 3 characters long",
		})
		.optional(),
	linkedin: z
		.string()
		.min(3, {
			message: "Linkedin username must be at least 3 characters long",
		})
		.optional(),
	website: z
		.string()
		.min(3, {
			message: "Website must be at least 3 characters long",
		})
		.optional(),
	twitter: z
		.string()
		.min(3, {
			message: "Twitter username must be at least 3 characters long",
		})
		.optional(),
	location: z
		.string()
		.min(3, {
			message: "Location must be at least 3 characters long",
		})
		.optional(),
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
				startDate: z.date(),
				endDate: z.date().optional(),
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
				startDate: z.date(),
				endDate: z.date().optional(),
				location: z.string().min(3, {
					message: "Location must be at least 3 characters long",
				}),
				current: z.boolean(),
			}),
		)
		.optional(),
	skillCategories: z
		.array(
			z.object({
				title: z.string().min(3, {
					message: "Skill category must be at least 3 characters long",
				}),
				skills: z.array(
					z.string().min(3, {
						message: "Skill must be at least 3 characters long",
					}),
				),
			}),
		)
		.optional(),
	projects: z
		.array(
			z.object({
				name: z.string().min(3, {
					message: "Project name must be at least 3 characters long",
				}),
				description: z.string().min(3, {
					message: "Description must be at least 3 characters long",
				}),
				startDate: z.date(),
				endDate: z.date().optional(),
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
			z.string().min(3, {
				message: "Certification must be at least 3 characters long",
			}),
		)
		.optional(),
});

export default function Editor() {
	const { user } = useUser();
	if (!user) return null;
	const { firstName, lastName } = user;
	return (
		<EditorForm
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
}: { firstName: string; lastName?: string; email?: string; github?: string }) {
	const form = useForm<z.infer<typeof editorSchema>>({
		resolver: zodResolver(editorSchema),
		defaultValues: {
			firstName: firstName,
			lastName: lastName,
			phone: "",
			email: email,
			github: github,
			linkedin: "",
			website: "",
			twitter: "",
			location: "",
			summary: "",
			workExperience: [],
			education: [],
			skillCategories: [],
			projects: [],
			certifications: [],
		},
	});

	function onSubmit(values: z.infer<typeof editorSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form className="pt-8" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid grid-cols-2 gap-4">
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
				<div className="grid mt-8 grid-cols-2 gap-4">
					<EditorInput
						name="website"
						label="Website"
						placeholder="myresume.guru"
						control={form.control}
					/>
					<EditorInput
						name="github"
						label="Github Username"
						placeholder="HelixHEX"
						control={form.control}
					/>
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
}: {
	name: keyof z.infer<typeof editorSchema>;
	label: string;
	placeholder: string;
	control: Control<z.infer<typeof editorSchema>>;
}) {
	return (
		<FormField
			control={control}
			name={name}
      // biome-ignore lint:
			render={({ field }: { field: any }) => (
				<FormItem className="col-span-1 text-white">
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							className="text-blue-800 font-bold"
							placeholder={placeholder}
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
