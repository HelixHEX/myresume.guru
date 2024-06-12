import { context } from "@/lib/context";
import AssistantProvider from "@/lib/providers/ai";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <context.resume.LayoutProvider>
      <AssistantProvider>
        <div className="flex  flex-col w-full h-full">
          <div className=" flex flex-col w-full h-full ">
            {/* <Title /> */}
            {children}
          </div>
        </div>
      </AssistantProvider>
    </context.resume.LayoutProvider>
  );
}
