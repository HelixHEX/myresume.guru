import ApplicationCard from "@/components/jobs/cards/application";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className=" flex flex-col w-full h-full ">
      <h1 className="mt-[-6px] text-4xl text-black">{params.slug}</h1>
      <p className="md:w-10/12 text-gray-400">Easily manage the status of each job application as well as see how well your resume matches to the job description</p>
      <h2 className="mt-12 text-xl">Applications</h2>
      <div className="h-full w-full  mt-5 gap-4 md:20 lg:gap-8 m-auto grid grid-cols-1 md:grid-cols-2 self-center ">
        {[...Array(3)].map((_, i) => (
          <ApplicationCard
            key={i}
            name="Full Stack Engineer"
            id={i.toString()}
            score={Math.floor(Math.random() * 100) }
          />
        ))}
      </div>
    </div>
  )
}