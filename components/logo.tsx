'use client';

import { FileText } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";

export default function Logo({size}: {size?: number | string}) {
  const { user } = useUser();

  return (
    <div className="flex flex-row">
      <FileText />
      <Link href={user ? '/app/resumes' : '/'} className='font-bold text-lg ml-2 hover:cursor-pointer'>myresume.guru</Link>
    </div>
  );
}
