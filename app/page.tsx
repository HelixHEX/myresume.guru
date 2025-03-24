"use client";
import Header from "@/components/header";
import FeatureCard from "@/components/home/featureCard";
import { Button } from "@/components/ui/button";
import {
	BriefcaseBusiness,
	CircleCheck,
	FileEdit,
	FileText,
	Megaphone,
	Search,
	Sparkles,
	WandSparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Zoom from "react-reveal/Zoom";

export default function Home() {
	const router = useRouter();
	return (
		<>
			<Header />
			<div className="p-6 mb-44 pt-[62px] w-full h-auto flex flex-col">
				<div className="flex flex-col lg:w-[1000px] w-full self-center">
					<div className="p-4 lg:p-8  self-center bg-cover bg-[url('/images/hero1-bg.png')] bg-center   bg-no-repeat rounded-lg w-full h-[480px] text-white flex flex-col justify-end">
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
						<Button
							onClick={() => router.push("/sign-up")}
							className="w-44 mt-8"
						>
							Try now!
						</Button>
					</div>
					<div className="mt-44 flex flex-col w-full self-center">
						<h1 className="text-4xl  font-bold">
							The easiest way to get your resume reviewed
						</h1>
						<Zoom>
							<p className="mt-8 ">
								{
									"Your resume is often the first thing a potential employer sees, so it's important to make a good impression. MyResume Guru makes it easy to get expert feedback on your resume, so you can feel  confident that you're putting your best foot forward."
								}
							</p>
						</Zoom>
					</div>

					<div className="flex flex-col w-full h-[650px] relative self-center">
						<Image
							src="/images/feedback_demo.png"
							className="relative"
							alt="Hero 2"
							fill
						/>
					</div>

					<div className="items-center md:itesm-start mt-44 mb-[500px] sm:mb-44 h-[400] w-full flex flex-col md:flex-row justify-between">
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
							<Zoom>
								<p className="mt-8">
									{
										"Upload your resume and in seconds we'll assess your skills, experiences, and more. Then we'll give you feedback from our team of experts."
									}
								</p>
								<Button
									onClick={() => router.push("/sign-up")}
									className="mt-4"
								>
									Upload your resume
								</Button>
							</Zoom>
						</div>
					</div>
					<div className="flex flex-col w-full sm:self-center ">
						<h1 className="text-4xl  font-bold">Why use myresume.guru?</h1>
						<div className="flex w-full items-center h-full justify-between flex-col lg:flex-row mt-8">
							<FeatureCard
								title="AI-powered suggestions"
								description="Our AI powered resume scanner will help you identify areas of improvement."
								Icon={() => <Sparkles />}
							/>
							<FeatureCard
								title="AI Resume Guru"
								description="Personalized AI resume assistant. You can ask questions about your resume or get tips on how to prepare for an interview."
								Icon={() => <WandSparkles />}
							/>
							<FeatureCard
								title="Job Application Tracker"
								description="You can keep track of the jobs you've applied to and the status of your applications."
								Icon={() => <BriefcaseBusiness />}
							/>
							<FeatureCard
								title="AI Resume Builder"
								description="AI powered resume builder will help you create a resume that stands out from the crowd. (Coming soon...!)"
								Icon={() => <FileEdit />}
							/>
						</div>
					</div>

					{/* <h1 className="mt-44 font-bold text-4xl text-center">
          Coming Soon...!
        </h1> */}
				</div>
			</div>
		</>
	);
}
