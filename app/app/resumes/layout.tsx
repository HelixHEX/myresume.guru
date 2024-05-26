import Title from "@/components/resumes/layoutTitle";
import {context} from "@/lib/context";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <context.resume.LayoutProvider>
      <div className="flex flex-col w-full h-full mt-6">
      <div className=" flex flex-col w-full h-full ">
        <Title />
        {children}
      </div>
    </div>
    </context.resume.LayoutProvider>
  );
}
