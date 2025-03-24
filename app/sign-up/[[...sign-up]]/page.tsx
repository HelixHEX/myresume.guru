import Footer from "@/components/fooer";
import Header from "@/components/header";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
	return (
		<>
			<div className="w-full h-screen flex ">
				<div className="relative hidden md:block transition-all duration-300 w-1/2 h-full">
					<div className="relative w-full h-full">
						<Image
							className="relative"
							alt="Computer with resume on screen"
							fill
							src="/images/dreams.jpg"
						/>
					</div>
				</div>
				<div className="flex flex-col transition-all duration-300 w-full h-full md:w-1/2">
					<Header />
					<div className=" gap-4 items-center justify-center w-full flex flex-col h-full">
						<div className="flex flex-col w-fulljustify-center items-center gap-0 sm:gap-2">
							<h1 className="sm:text-4xl text-2xl transition-all duration-300 font-bold text-dark-gray">
								MyResume.<span className="text-blue-800">Guru</span>
							</h1>
							<p className="font-medium text-gray-700 text-sm sm:text-md transition-all duration-300">
								Create a free account to get started
							</p>
						</div>
						<SignUp path="/sign-up" />
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
