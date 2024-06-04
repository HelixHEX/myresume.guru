"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Logo({ size }: { size?: number | string }) {
  const { user } = useUser();

  return (
    <>
      <SignedIn>
        <div className="flex self-center flex-row">
          <FileText />
          <Link
            href={user ? "/app/resumes" : "/"}
            className="font-bold ml-2 text-sm sm:text-md  hover:cursor-pointer"
          >
            myresume.guru
          </Link>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex self-center flex-row">
          <FileText />
          <Link
            href={user ? "/app/resumes" : "/"}
            className="font-bold ml-2 text-sm sm:text-md hover:cursor-pointer"
          >
            myresume.guru
          </Link>
        </div>
      </SignedOut>
    </>
  );
}
