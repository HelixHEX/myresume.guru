import ImprovementCard from "@/components/resumes/cards/improvement";
import { Badge } from "@/components/ui/badge";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className=" flex flex-col w-full h-full ">
      <div className="flex">
        <h1 className="mt-[-6px] font-light  text-4xl text-black">
          {params.slug.replaceAll("%20", " ")}
        </h1>
        <Badge className="ml-2  self-center">Active</Badge>
      </div>
      <h2 className="mt-4 font-semibold text-xl">Job Description</h2>
      <p className="text-gray-400 text-sm md:text-md ">
        {
          "About the role Your role, should you choose to join us, will be a Software Engineer in our founding team. You’re the right person for thisrole if you’re excited to build not just a stunning product, but helpshape the company’s trajectory from the earliest days. You’re a good fitif you’re the type of person that is known by your peers to movemountains and make progress, no matter the circumstances. The ambiguityof early stage company building is thrilling to you, and you’re excitedby the challenge of breathing life into things that didn’t exist before.Your responsibilities will include: Designing and implementingautomation technology, along with the data and processing infrastructureto scale with our customers Working with customers across logistics tounderstand their needs, and design the tools that enable the workflowsof the future Working closely with the founders to design, hire, andbuild the company from seed to success You likely have: Experience and /or appetite for working at a startup Built and scaled a web-basedproduct Implemented and maintained technology stacks through stages ofgrowth Expertise in cloud infrastructure platforms like AWS, Azure, GCPEagerness to wear multiple hats, lead new initiatives, learn newtechnologies, and get it done; whatever it is Compensation The rareopportunity to join a formidable team to build an enduring company, inperson, as a first 10 employee Competitive compensation Significantequity upside Medical / dental / vision This role is based in person inSan Mateo, CA (not remote)"
        }
      </p>
      <h2 className="mt-20 md:mt-28 font-semibold text-xl">
        Compare to Job Posting
      </h2>
      <div className="mt-4 w-full flex flex-col">
        <div className="w-full flex justify-between">
          <p className="font-semibold">Job Requirments</p>
          <p className="font-semibold">Your Match</p>
        </div>
        <div className="mt-2 w-full flex justify-between">
          <p>Relevant skills</p>
          <p className="text-red-400">60%</p>
        </div>
        <div className="mt-2 w-full flex justify-between">
          <p>Work Experience</p>
          <p className="text-yellow-400">75%</p>
        </div>

        <div className="mt-2 w-full flex justify-between">
          <p>Education</p>
          <p className=" text-green-400">95%</p>
        </div>
      </div>
      <h2 className="mt-28 font-bold text-2xl">Suggested Improvements</h2>
      <p className="mt-4">{"We've used AI to help you improve your resume!"}</p>
      <div className="flex flex-col mt-8">
        {[...Array(3)].map((_, i) => (
          <ImprovementCard
            key={i}
            title="Add a summary section"
            text="A summary section can also help you tailor your resume to specific jobs by highlighting the most relevant experience and skills.
          Add a summary section at the top of your resume. This should be a concise paragraph that summarizes your career history, skills, and accomplishments. It's a great way to grab the reader's attention and give them a quick overview of who you are and what you're looking for."
          />
        ))}
      </div>
    </div>
  );
}
