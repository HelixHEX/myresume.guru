"use client";

import { SidebarMenuItem } from "./ui/sidebar";
import { Sparkles } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";
import { useUser } from "@clerk/nextjs";

export default function UpgradeBtn() {
	const { user } = useUser();

	if (!user) return null;
	return (
		<>
			{user?.unsafeMetadata.plan !== "Plus" && (
				<SidebarMenuItem>
					<SidebarMenuButton className="cursor-pointer" tooltip="Upgrade">
						<Sparkles />
						<span>Upgrade</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			)}
		</>
	);
}
