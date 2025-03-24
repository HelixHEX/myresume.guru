"use client";
import Header from "@/components/header";
import FeatureCard from "@/components/home/featureCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Fade, Jello, Tada, Zoom } from "react-swift-reveal";

const text = `The resume currently lacks a personal summary, which is a crucial section that provides a snapshot of your professional identity and career goals. A well-crafted summary can capture the attention of hiring managers and set the tone for the rest of the resume.**Actionable Steps:**1. Write a concise summary (3-4 sentences) that highlights your key skills, experiences, and career objectives.2. Focus on your strengths in software development and project management.3. Mention any unique qualities or achievements that differentiate you from other candidates.**Example:**"Dynamic software engineer with over 5 years of experience in developing scalable web applications and leading project management initiatives. Proven track record in enhancing user engagement and satisfaction through innovative solutions. Passionate about leveraging AI to improve user experiences and drive business growth."`;

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
						<Zoom duration={1000}>
							<h1 className="text-4xl  font-bold">
								The easiest way to get your resume reviewed
							</h1>
						</Zoom>
						<Zoom delay={100}>
							<p className="mt-8 ">
								{
									"Your resume is often the first thing a potential employer sees, so it's important to make a good impression. MyResume Guru makes it easy to get feedback on your resume, so you can feel confident that you're putting your best foot forward."
								}
							</p>
						</Zoom>
					</div>

					<div className="flex mt-4 flex-col w-full py-14 self-center">
						<Zoom>
							<h1 className="text-2xl text-center  font-bold">
								Example Improvements
							</h1>
						</Zoom>
						<Zoom delay={100}>
							<Card className="p-6 rounded-none mt-4">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-3">
											<Fade out delay={100}>
												<h3 className="text-xl font-bold">
													Enhance Personal Summary
												</h3>
											</Fade>
										</div>
										<div className="text-[#373737] whitespace-pre-wrap">
											<Fade out delay={200}>
												The resume currently lacks a personal summary, which is
												a crucial section that provides a snapshot of your
												professional identity and career goals. A well-crafted
												summary can immediately capture the attention of hiring
												managers and set the tone for the rest of the resume.
											</Fade>
											<br />
											<br />
											<Fade out delay={300}>**Actionable Steps:**</Fade>
											<br />
											<Fade out delay={400}>
												1. **Write a Concise Summary:** Start with a strong
												opening that highlights your key skills and experiences.
												For example, "Dynamic Front-End Developer with over 5
												years of experience in building scalable web
												applications using React and Next.js."
											</Fade>
											<br />
											<Fade out delay={500}>
												2. **Include Career Goals:** Mention your career
												aspirations and how they align with the roles you are
												applying for. For example, "Seeking to leverage
												expertise in UI/UX design to contribute to innovative
												projects at a forward-thinking tech company."
											</Fade>
											<br />
											<Fade out delay={600}>
												3. **Highlight Key Achievements:** Briefly mention one
												or two significant accomplishments that demonstrate your
												impact, such as "Led a team to increase app performance
												by 30%, enhancing user experience."
											</Fade>
											<br />
											<br />
											<Fade out delay={700}>**Example Summary:**</Fade>
											<br />
											<Fade out delay={800}>
												"Innovative Front-End Developer with 5+ years of
												experience in creating user-centric applications using
												React and Next.js. Proven track record of improving app
												performance and user satisfaction. Passionate about
												leveraging technology to solve real-world problems and
												eager to contribute to cutting-edge projects in a
												dynamic tech environment."
											</Fade>
										</div>
									</div>
								</div>
							</Card>
						</Zoom>
					</div>

					<div className="items-center md:itesm-start mt-44 mb-[700px] lg:mb-44 h-[400] w-full flex flex-col md:flex-row justify-between">
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
										"Upload your resume and in seconds we'll assess your skills, experiences, and more. Also get help from our AI resume guru."
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
								delay={300}
							/>
							<FeatureCard
								title="Job Application Tracker"
								description="You can keep track of the jobs you've applied to and the status of your applications."
								Icon={() => <BriefcaseBusiness />}
								delay={600}
							/>
							<FeatureCard
								title="AI Resume Builder"
								description="AI powered resume builder will help you create a resume that stands out from the crowd. (Coming soon...!)"
								Icon={() => <FileEdit />}
								delay={900}
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
