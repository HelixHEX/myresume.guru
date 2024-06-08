import ApplicationDescription from "@/components/applications/applicationDescription";
import ApplicationTitle from "@/components/applications/applicationTitle";
import ApplicationScores from "@/components/applications/scores";
import ImprovementCard from "@/components/resumes/cards/improvement";
import { Badge } from "@/components/ui/badge";
import { context } from "@/lib/context";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <context.application.ApplicationProvider id={params.slug}>
      <div className=" flex flex-col w-full h-full ">
        <div className="flex mt-2">
          {/* {params.slug} */}
          <ApplicationTitle id={"1"} />
        </div>
        <h2 className="mt-4 font-semibold text-lg">Job Description</h2>
        <ApplicationDescription id={'1'} />
        <h2 className="mt-20 md:mt-28 font-semibold text-lg">
          Compare to Job Posting
        </h2>
        {/* <div className="mt-4 w-full flex flex-col">
          <div className="w-full flex justify-between">
            <p className="font-semibold">Job Requirments</p>
            <p className=" font-semibold">Your Match</p>
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
        </div> */}
        <ApplicationScores />
        {/* <h2 className="mt-28 font-bold text-2xl">Suggested Improvements</h2>
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
      </div> */}
      </div>
    </context.application.ApplicationProvider>
  );
}
