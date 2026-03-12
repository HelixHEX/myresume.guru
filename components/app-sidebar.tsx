"use client"

import * as React from "react"
import { Suspense } from "react"
import {
  BriefcaseBusiness,
  CreditCard,
  FileText,
  MessageCircle,
} from "lucide-react"

import { CreditsBalance } from "@/components/credits-balance"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    // {
    //   name: "Acme Inc",
    //   logo: GalleryVerticalEnd,
    //   plan: "Enterprise",
    // },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Chat",
      url: "/app/chat",
      icon: MessageCircle,
    },
    {
      title: "Resume",
      url: "/app/resumes",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "My Resumes",
          url: "/app/resumes",
        },
        {
          title: "New Resume",
          url: "/app/resumes/new",
        },
        {
          title: "Upload Resume",
          url: "/app/resumes/upload",
        },
      
      ],
    },
    {
      title: "Applications",
      url: "/app/applications",
      icon: BriefcaseBusiness,
      isActive: true,
      items: [
        // {
        //   title: "New Job Application",
        //   url: "#",
        // },
        {
          title: "View Applications",
          url: "/app/applications",
        },
      ],
    },
   
    {
      title: "Billing",
      url: "/app/billing",
      icon: CreditCard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  return (
    <Sidebar className={`transition-all duration-300 bg-blue-800 ${open && "p-2 sm:p-3 sm:pr-0 bg-blue-800"}`} collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="text-sidebar-foreground [&_button]:border-sidebar-border [&_button]:text-sidebar-foreground [&_button]:hover:bg-sidebar-accent [&_button]:hover:text-sidebar-accent-foreground">
          <Suspense fallback={<span className="text-sm text-sidebar-foreground" aria-hidden="true">…</span>}>
            <CreditsBalance />
          </Suspense>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
