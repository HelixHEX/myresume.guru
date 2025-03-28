"use client";

import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbListComp() {
	const pathname = usePathname();

	const paths = pathname
		.split("/")
		.filter((path) => path !== "app" && path !== "")
		.map((path) => path.charAt(0).toUpperCase() + path.slice(1));

	return (
		<Breadcrumb className="self-start">
			<BreadcrumbList className="w-full mt-1">
				{paths.map((path, index) => (
					<div className="flex flex-row justify-center gap-2" key={index}>
						<BreadcrumbItem  className="hidden items-center  text-white md:block">
							{path}
						</BreadcrumbItem>
						{index !== paths.length - 1 && (
							<BreadcrumbSeparator className="hidden self-center text-white md:block" />
						)}
					</div>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
