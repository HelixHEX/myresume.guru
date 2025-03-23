"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Logo from "./logo";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<div
			className={` z-10 w-full h-[20px] bg-white  ${pathname.includes("sign-in") || pathname.includes("sign-up") ? "" : "fixed"} flex flex-row p-6 text-black justify-between`}
		>
			<div className="flex items-center gap-2 sm:gap-4 flex-row">
				<Link className="text-sm font-bold" href="/">
					Home
				</Link>
				<SignedIn>
					<Link className="text-sm font-bold" href="/app">
						Dashboard
					</Link>
				</SignedIn>

				<Link className="text-sm font-bold" href="/plans">
					Plans
				</Link>
				<SignedOut>
				<Link className="text-sm font-bold" href="/sign-in">
						Sign-in
					</Link>
					<Link className="text-sm font-bold" href="/sign-up">
						Sign-up
					</Link>
				</SignedOut>
			</div>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
}
