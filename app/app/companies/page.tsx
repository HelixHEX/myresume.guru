import CompanyCard from "@/components/jobs/cards/company";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="mt-4 flex flex-col w-full h-full ">
      <h1 className=" text-4xl text-black">Companies</h1>
      <p className="md:w-10/12 text-gray-400">
        Organize your job applications by company and see how many applications
        you have for each company
      </p>
      <div className="h-full w-full  mt-4 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
        {[...Array(3)].map((_, i) => (
          <CompanyCard
            key={i}
            name="Full Stack Engineer"
            id={i.toString()}
            applications={Math.floor(Math.random() * 15)}
          />
        ))}
      </div>
    </div>
  );
}
