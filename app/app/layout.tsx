import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbListComp } from "@/components/ui/breadcrumb-list";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex justify-between items-center gap-2 px-4 w-full">
						<div className="flex flex-row w-full  items-center gap-2">
							<SidebarTrigger className="-ml-1" />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<BreadcrumbListComp />
						</div>
						<UserButton />
					</div>
				</header>
				<div className="pb-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
