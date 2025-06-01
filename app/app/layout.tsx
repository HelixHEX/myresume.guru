import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer";
import Logo from "@/components/logo";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen w-full overflow-hidden">
        <div className="flex flex-row h-full w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 h-full flex flex-col">
            <header className="bg-white pr-2 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex md:justify-start items justify-between flex-row w-full gap-2">
                <SidebarTrigger className="ml-7" />
                <div className="flex md:hidden">
                  <Logo />
                </div>
              </div>
              <UserButton />
            </header>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
