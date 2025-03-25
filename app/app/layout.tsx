import { AppSidebar } from "@/components/app-sidebar";
import Logo from "@/components/logo";
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
					<div className="flex md:justify-start justify-between text-white bg-blue-800 h-full items-center gap-2 px-4 w-full">
						<div className="flex  md:justify-start items justify-between flex-row w-full  gap-2">
							<SidebarTrigger className="-ml-1 " />
							{/* <div className="flex md:hidden bg-yellow-500"> 
								<Logo />
							</div> */}
							<BreadcrumbListComp />
						</div>
						<UserButton />
					</div>
				</header>
				<div className="h-full">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
