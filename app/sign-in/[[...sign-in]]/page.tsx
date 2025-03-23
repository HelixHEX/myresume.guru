import Header from "@/components/header";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
	return (
		<div className="flex items-center p-2 sm:p-6 justify-center bg-dark-gray self-center h-screen w-full">
			<div className="bg-white transition-all duration-300 lg:gap-20 gap-8 shadow-lg rounded-2xl p-4 sm:p-8 h-full flex justify-center items-center w-full">
				<div className="flex flex-col gap-4 h-full">
					<div>
						<h1 className="md:text-4xl text-2xl transition-all duration-300 font-bold text-black">
							MyResume.<span className="text-blue-800">Guru</span>
						</h1>
            <Header />
					</div>

					<div className="lg:w-auto h-full gap-4 justify-center flex-col items-center w-full flex">
						<div className="flex flex-col">
							<h1 className="text-blue-800 transition-all duration-300 md:text-3xl text-2xl font-bold">
								Welcome Back!
							</h1>
						</div>
						<SignIn path="/sign-in" />
					</div>
				</div>
				<div className="md:w-full sm:w-3/5 hidden md:flex shadow-lg rounded-2x; h-full relative">
					<Image
						src="/images/resume_2.jpg"
						alt="Abstract"
						fill
						className="relative rounded-2xl"
					/>
				</div>
			</div>
		</div>
	);
}
