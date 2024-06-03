'use client';
import FeatureCard from "@/components/home/featureCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck, Megaphone, Search, WandSparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="p-6  mb-44 w-full flex flex-col">
      <div className="flex flex-col lg:w-[928px] w-full self-center">
        <div className="p-4 lg:p-8  self-center bg-[url('/images/hero1-bg.png')] bg-center   bg-no-repeat rounded-lg w-full h-[480px] text-white flex flex-col justify-end">
          <h1 className="text-2xl lg:text-4xl font-bold lg:w-96">
            Land your dream job with myresume.guru
          </h1>
          <p className="mt-8 w-full md:w-[500px]">
            Upload your resume and receive instant, personalized feedback
            powered by AI. Our gurus will help you craft a resume that stands
            out.
          </p>
          {/* <div className="mt-8 rounded-md flex flex-row bg-white md:w-96 p-4">
            <Input
              className="bg-none border-none text-black rounded-sm  h-8 self-center"
              placeholder="Enter your email"
            />
            <Button className=" ml-2">Coming soon...!</Button>
          </div> */}
          <Button onClick={() => router.push('/sign-up')} className="w-44 mt-8">Try now!</Button>
        </div>
       <div className="flex mt-44 flex-col w-full sm:self-center ">
       <h1 className="text-4xl  font-bold">Why use myresume.guru?</h1>
        <div className="flex w-full items-center h-[900px] lg:h-auto justify-between flex-col lg:flex-row mt-8">
          <FeatureCard
            title="AI-powered suggestions"
            description="Our AI powered resume scanner will help you identify areas of improvement."
            Icon={() => <WandSparkles />}
          />
          <FeatureCard
            title="Instant feedback"
            description="Get instant feedback on your resume and improve it in real-time."
            Icon={() => <Search />}
          />
          <FeatureCard
            title="Resume score"
            description="Get a score for your resume and see how it compares to others."
            Icon={() => <CircleCheck />}
          />
          <FeatureCard
            title="Job application tips"
            description="Get tips on how to apply for jobs and stand out from the crowd."
            Icon={() => <Megaphone />}
          />
        </div>
       </div>
        <div className="mt-44 flex flex-col w-full self-center">
          <h1 className="text-4xl  font-bold">
            The easiest way to get your resume reviewed
          </h1>
          <p className="mt-8 ">
            {
              "Your resume is often the first thing a potential employer sees, so it's important to make a good impression. MyResume Guru makes it easy to get expert feedback on your resume, so you can feel  confident that you're putting your best foot forward."
            }
          </p>
        </div>
        <div className="items-center md:itesm-start mt-44  h-[400] w-full flex flex-col md:flex-row justify-between">
          <div className="md:w-[400px] self-center flex flex-col items-center md:h-[300px] h-[400px] w-full">
            <Image
              src="/images/hero2.png"
              className="w-full h-full"
              alt="Hero 2"
              width={400}
              height={400}
            />
          </div>
          <div className=" h-[400] mt-24 md:mt-0 w-full md:w-96 flex flex-col">
            <h1 className="font-bold text-4xl">
              {"Get resume feedback that's actually meaningful"}
            </h1>
            <p className="mt-8">
              {
                "Upload your resume and in seconds we'll assess your skills, experiences, and more. Then we'll give you feedback from our team of experts."
              }
            </p>
            {/* <Button className="mt-4">Upload your resume</Button> */}
          </div>
        </div>
        {/* <h1 className="mt-44 font-bold text-4xl text-center">
          Coming Soon...!
        </h1> */}
      </div>
    </div>
  );
}
