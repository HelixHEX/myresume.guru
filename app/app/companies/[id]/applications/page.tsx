import ApplicationCard from "@/components/applications/cards/create";
import CompanyApplications from "./data";
import CreateApplicationCard from "@/components/applications/cards/create";
import CompanyApplicationsTitle from "@/components/companies/applications/title";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className=" flex flex-col w-full h-full ">
      <CompanyApplicationsTitle companyId={params.id} />
      <p className="md:w-10/12 text-gray-400">
        Easily manage the status of each job application as well as see how well
        your resume matches to the job description
      </p>
      <h2 className="mt-16 text-xl">Applications</h2>

      <div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
        <CreateApplicationCard companyId={parseInt(params.id)} />
        <CompanyApplications slug={params.id} />
      </div>
    </div>
  );
}
