import ApplicationCard from "@/components/applications/cards/create";
import CompanyCard from "@/components/companies/cards";
import Applications from "./data";

export default function Page() {
  return (
    <div className="px-4 flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] text-4xl font-light text-black">Job Applications</h1>
      <p className="text-gray-400">{"Keep track of the status for each application "}</p>
      <Applications />
    </div>
  );
}
