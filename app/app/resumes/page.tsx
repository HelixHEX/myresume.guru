import ResumeCard from "@/components/resumes/cards";

export default function Page() {
  return (
    <div className=" flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] text-4xl text-black">My Resumes</h1>
      <div className="h-full w-full  mt-5 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
        {[...Array(30)].map((_, i) => (
          <ResumeCard
            key={i}
            name="Resume Name"
            dateCreated="May 20, 2024"
            id={i.toString()}
          />
        ))}
      </div>
    </div>
  );
}
