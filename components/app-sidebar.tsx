"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Command,
  CreditCard,
  FileText,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
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
      title: 'Billing',
      url: 'https://polar.sh/myresumeguru/portal',
      icon: CreditCard,

    }
  ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {open} = useSidebar()
  return (
    <Sidebar className={`transition-all duration-300 bg-blue-800 ${open &&'p-2 sm:p-3 sm:pr-0 bg-blue-800'}`} collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>

      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
