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
		<Breadcrumb>
			<BreadcrumbList className="w-full">
				{paths.map((path, index) => (
					<div className="flex flex-row items-center gap-2" key={index}>
						<BreadcrumbItem  className="hidden md:block">
							{path}
						</BreadcrumbItem>
						{index !== paths.length - 1 && (
							<BreadcrumbSeparator className="hidden md:block" />
						)}
					</div>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
