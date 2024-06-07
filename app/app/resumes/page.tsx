import FilterResumes from "@/components/resumes/filter";
import Resumes from "./data";
import UploadResumeBtn from "@/components/uploadResumeBtn";

export default function Page() {
  return (
    <>
      <div className="flex flex-row">
        <h1 className="text-4xl mr-2 font-light self-center text-black">My Resumes</h1>
        <UploadResumeBtn w={'w-[170px]'} />
      </div>
      {/* <div className="flex mb-8 w-auto pt-4">
        <FilterResumes />
      </div> */}
      <div className="mt-2" />
      <Resumes />
    </>
  );
}
