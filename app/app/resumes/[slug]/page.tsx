import ImprovementCard from "@/components/resumes/cards/improvement";
import Image from "next/image";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="p-4 md:p-0 w-full flex flex-col">
      <h1 className="mt-[-6px] text-4xl text-black">
        Improve your resume
      </h1>
      <p className="text-gray-400">
        Get specific, actionable feedback on how to improve your resume. The Al
        will highlight areas for improvement and provide clear recommendations
        to help you make your resume stand out for your next job application.
      </p>

      <div className="mt-8 flex flex-col md:flex-row justify-betwee">
        <div className="w-full self-center">
          <p className="hover:cursor-pointer hover:text-gray-500 underline text-gray-400">
            EliasWambuguResume.pdf
          </p>
          <p className="font-bold">Your resume is ready for review!</p>
          
        </div>
        <Image
          className="bg-none"
          height={100}
          width={300}
          src="/images/resume.jpg"
          alt=""
        />
      </div>
      <h2 className="mt-44 font-bold text-2xl">Suggested Improvements</h2>
          <p className="mt-4">
            {"We've used AI to help you improve your resume!"}
          </p>
      <div className="flex flex-col mt-8">
        {[...Array(3)].map((_, i) => (
          <ImprovementCard
            key={i}
            title="Add a summary section"
            description="A summary section can also help you tailor your resume to specific jobs by highlighting the most relevant experience and skills.
          Add a summary section at the top of your resume. This should be a concise paragraph that summarizes your career history, skills, and accomplishments. It's a great way to grab the reader's attention and give them a quick overview of who you are and what you're looking for."
          />
        ))}
      </div>
    </div>
  );
}
