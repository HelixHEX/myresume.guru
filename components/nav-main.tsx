"use client";

import { ChevronRight, Sparkles, type LucideIcon } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import UpgradeBtn from "./upgrade-btn";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const { user } = useUser();
  const router = useRouter()
	return (
		<SidebarGroup>
			{/* <SidebarGroupLabel></SidebarGroupLabel> */}
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
						onClick={() => {
							if (item.url && !item.items) {
								window.open(item.url, "_blank");
							}
						}}
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									{item.items && (
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									)}
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<a href={subItem.url}>
													<span>{subItem.title}</span>
												</a>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
				{user && user?.unsafeMetadata.plan !== "Plus" && (
					<SidebarMenuItem>
						<SidebarMenuButton onClick={() => router.push("/plans")} className="cursor-pointer" tooltip="Upgrade">
							<Sparkles />
							<span>Upgrade</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroup>
	);
}
