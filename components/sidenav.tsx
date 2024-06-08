"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
// import { FcSettings } from "react-icons/fc";
import {
  FcDocument,
  FcOrganization,
  FcRatings,
  FcSettings,
} from "react-icons/fc";
import UploadResumeBtn from "./uploadResumeBtn";

type SidenavItem = {
  title: string;
  href: string;
  Icon?: any;
  flag: "production" | "development";
};

const sidenavItems: SidenavItem[] = [
  {
    title: "Resumes",
    href: "/app/resumes",
    Icon: FcDocument,
    flag: "production",
  },
  {
    title: "Applications",
    href: "/app/applications",
    Icon: FcRatings,
    flag: "production",
  },
  {
    title: "Companies",
    href: "/app/companies",
    Icon: FcOrganization,
    flag: "production",
  },
  {
    title: "Settings",
    href: "/app/settings",
    Icon: FcSettings,
    flag: "production",
  },
];

export default function Sidenav({
  env,
}: {
  env: "production" | "development";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const filteredItems = sidenavItems.filter((item) =>
    env === "development" ? true : item.flag === env
  );
  // if (!process.env.APP_ENV) return null;
  return (
    <>
      <div className="md:fixed flex flex-col p-4 justify-between items-center w-full md:w-[200px] md:h-screen top-0 md:mt-0 md:pt-[78px]  lg:w-[300px]">
        <div className="w-full flex flex-row md:flex-col justify-around">
          {filteredItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`text-sm mb-4 p-2 ${
                index < filteredItems.length - 1 ? "mr-2" : ""
              }  rounded-lg flex flex-col md:items-start items-center ${
                pathname === item.href && "bg-gray-100"
              } hover:bg-gray-100 w-full h-10`}
            >
              {item.title}
            </Link>
          ))}
        </div>
       <UploadResumeBtn sideNav={true} />
      </div>
      {/* <div className="p-4 mb-[72px] flex md:hidden justify-between w-full h-14 ">
        {sidenavItems
          .filter((item) => (env === "development" ? true : item.flag === env))
          .map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center justify-center hover:bg-gray-100 w-10 rounded-lg h-8 ${
                pathname === item.href && "bg-gray-200"
              }`}
            >
              {item.Icon && <item.Icon size={26} />}
            </Link>
          ))}
      </div> */}
    </>
  );
}
