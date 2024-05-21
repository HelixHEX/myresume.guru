import ResumeCard from "@/components/resumes/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="p-4 flex flex-col w-full h-full ">
      <h1 className="font-bold text-4xl text-black">My Resumes</h1>
      <div className="h-full mt-5 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
        {[...Array(30)].map((_, i) => (
          <ResumeCard
            key={i}
            name="Resume Name"
            dateCreated="May 20, 2024"
            id="123"
          />
        ))}
      </div>
    </div>
  );
}
