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
    <div className=" z-10 w-full sm:backdrop-blur-xs sm:bg-transparent bg-white fixed flex flex-row p-6 text-black justify-between">
      <Logo />
      <SignedOut>
        <div className="flex flex-row">
          {pathname !== "/" && <Link href="/" className='hover:underline text-sm md:text-md mr-2 md:mr-8 self-center'>Home</Link>}
          <Link href="/sign-in" className='hover:underline mr-2 md:mr-8 text-sm md:text-md self-center'>Signup</Link>
          <Button className=" w-14 sm:w-full" onClick={() => router.push("/sign-in")}>
            Signin
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
