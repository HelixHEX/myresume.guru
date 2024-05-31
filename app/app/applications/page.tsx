import ApplicationCard from "@/components/companies/cards/application";
import CompanyCard from "@/components/companies/cards";

export default function Page() {
  return (
    <div className=" flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] text-4xl text-black">Job Applications</h1>
      <p className="text-gray-400">{"See how well your resume matches to job applications and keep track of the status for each application "}</p>
      <div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
        {[...Array(10)].map((_, i) => (
          <ApplicationCard
            key={i}
            name="Full Stack Developer"
            score={Math.floor(Math.random() * 100)}
            id={i.toString()}
          />
        ))}
      </div>
    </div>
  );
}
