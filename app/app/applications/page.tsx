import ApplicationCard from "@/components/applications/cards/create";
import CompanyCard from "@/components/companies/cards";
import Applications from "./data";

export default function Page() {
  return (
    <div className="p-4 px-8 flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] text-4xl font-bold text-black">Job Applications</h1>
      <p className="text-[#525252]">{"Keep track of the status for each application "}</p>
      <Applications />
    </div>
  );
}
