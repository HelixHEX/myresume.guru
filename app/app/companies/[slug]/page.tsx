import ApplicationCard from "@/components/applications/cards/create";
import CompanyApplications from "./data";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className=" flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] font-light text-4xl text-black">
        {params.slug}
      </h1>
      <p className="md:w-10/12 text-gray-400">
        Easily manage the status of each job application as well as see how well
        your resume matches to the job description
      </p>
      <CompanyApplications slug={params.slug} />
    </div>
  );
}
