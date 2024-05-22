"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { FcSettings } from "react-icons/fc";
import { FcDocument } from "react-icons/fc";
import { FcRatings } from "react-icons/fc";

const sidenavItems = [
  {
    title: "My Resumes",
    href: "/app/resumes",
    Icon: FcDocument,
  },
  {
    title: "Job Applications",
    href: "/app/jobs/applications",
    Icon: FcRatings,
  },
  {
    title: "Settings",
    href: "/app/settings",
    Icon: FcSettings,
  },
];

export default function Sidenav() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <div className="hidden md:block fixed md:flex p-4 flex-col justify-between items-center w-[200px] h-screen top-0 pt-[78px] lg:w-[300px]">
        <div className="w-full ">
          {sidenavItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`mb-6 pl-4 rounded-lg flex items-center ${
                pathname === item.href && "bg-gray-100"
              } hover:bg-gray-100 w-full h-10`}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <Button onClick={() => router.push('/app/resumes/new')} className="mt-4 w-full">Upload Resume</Button>
      </div>
      <div className="p-4 flex md:hidden justify-between w-full h-14 ">
        {sidenavItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center justify-center hover:bg-gray-100 w-10 rounded-lg h-8 ${
              pathname === item.href && "bg-gray-100"
            }`}
          >
            {item.Icon && <item.Icon size={26} />}
          </Link>
        ))}
      </div>
    </>
  );
}
