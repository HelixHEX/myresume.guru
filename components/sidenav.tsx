"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
// import { FcSettings } from "react-icons/fc";
import { FcDocument, FcOrganization, FcRatings, FcSettings } from "react-icons/fc";

type SidenavItem = {
  title: string;
  href: string;
  Icon?: any;
  flag: 'production' | 'development';
}

const sidenavItems: SidenavItem[] = [
  {
    title: "My Resumes",
    href: "/app/resumes",
    Icon: FcDocument,
    flag: 'production'
  },
  {
    title: "Applications",
    href: "/app/applications",
    Icon: FcRatings,
    flag: 'development'
  },
  {
    title: "Companies",
    href: "/app/companies",
    Icon: FcOrganization,
    flag: 'development'
  },
  {
    title: "Settings",
    href: "/app/settings",
    Icon: FcSettings,
    flag: 'development'
  },
];

export default function Sidenav({env}: {env: "production" | "development"}) {
  const pathname = usePathname();
  const router = useRouter();

  // if (!process.env.APP_ENV) return null;
  return (
    <>
      <div className="hidden fixed md:flex p-4 flex-col justify-between items-center w-[200px] h-screen top-0 pt-[78px] lg:w-[300px]">
        <div className="w-full ">
          {sidenavItems.filter(item => env === 'development' ? true : item.flag === env).map((item, index) => (
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
        {/* {sidenavItems.filter(item => item.flag === process.env.APP_ENV).map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center justify-center hover:bg-gray-100 w-10 rounded-lg h-8 ${
              pathname === item.href && "bg-gray-100"
            }`}
          >
            {item.Icon && <item.Icon size={26} />}
          </Link>
        ))} */}
      </div>
    </>
  );
}
