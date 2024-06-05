import FilterResumes from "@/components/resumes/filter";
import Resumes from "./data";

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-light text-black">My Resumes</h1>
      {/* <div className="flex mb-8 w-auto pt-4">
        <FilterResumes />
      </div> */}
      <div className="mt-2" />
      <Resumes />
    </>
  );
}
