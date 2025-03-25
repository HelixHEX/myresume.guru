import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Check } from "lucide-react";
import Header from "@/components/header";
import CheckoutButton from "@/components/checkout-button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Footer from "@/components/fooer";

export default function Plans() {
	return (
		<>
			<Header />
			<div className="flex flex-col gap-10 p-4 sm:p-10 lg:px-30">
				<div className="flex flex-col gap-4 pt-[80px] sm:pt-[30px]">
					<div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
						<h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
							Guru Free
						</h2>
						<p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
							Get a feel of the app with limited features.
						</p>
					</div>
					<div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
						<div className="grid gap-6">
							<h3 className="text-xl font-bold sm:text-2xl">
								What&apos;s included in the Free plan
							</h3>
							<ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> Unlimited Job applications
									tracking
								</li>
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> 3 resume feedbacks a day
								</li>
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> Chrome extension(Coming Soon!)
								</li>
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> Resume editor (Coming Soon!)
								</li>
							</ul>
						</div>
						<div className="flex flex-col gap-4 text-center">
							<div>
								<h4 className="text-7xl font-bold">Free</h4>
							</div>
							<Link
								href="/sign-up"
								className={cn(buttonVariants({ size: "lg" }), "bg-dark-gray")}
							>
								Get Started for Free
							</Link>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
						<h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
							Guru Plus+
						</h2>
						<p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
							Unlock all features including unlimited AI usage.
						</p>
					</div>
					<div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
						<div className="grid gap-6">
							<h3 className="text-xl font-bold sm:text-2xl">
								What&apos;s included in the Plus plan
							</h3>
							<ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> Acess to AI Guru
								</li>
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> Unlimited resume feedbacks
								</li>
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> Unlimited Job applications
									tracking
								</li>
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> AI resume editor (Coming Soon!)
								</li>
								<li className="flex items-center">
									<Check className="mr-2 h-4 w-4" /> Premium Support
								</li>
							</ul>
						</div>
						<div className="flex flex-col gap-4 text-center">
							<div>
								<h4 className="text-7xl font-bold">$5</h4>
								<p className="text-sm font-medium text-muted-foreground">
									Billed Monthly
								</p>
							</div>
							<SignedIn>
								<CheckoutButton />
							</SignedIn>
							<SignedOut>
								<Link
									href="/sign-up"
									className={cn(buttonVariants({ size: "lg" }), "bg-dark-gray")}
								>
									Get Started
								</Link>
							</SignedOut>
						</div>
					</div>
				</div>
			</div>
				<Footer />
		</>
	);
}
