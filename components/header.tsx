'use client'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Logo from "./logo";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  return (
    <div className=" z-10 w-full backdrop-blur-xs fixed flex flex-row p-4 text-black justify-between">
      <Logo />
      <SignedOut>
        <div className="flex flex-row">
          <Button onClick={() => router.push('/sign-up')} className="mr-2 hover:bg-white" variant={"ghost"}>
            Sign up
          </Button>
          <Button onClick={() => router.push('/sign-in')} variant={"secondary"}>Signin</Button>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
