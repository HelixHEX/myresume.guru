"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    title: "jobs",
    href: "/jobs",
  },
  {
    title: "back to dashboard",
    href: "/app",
  },
];

export default function JobsNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.includes(href);
  return (
    <div className="flex flex-row gap-8 ">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            isActive(item.href) && "text-blue-500",
            "hover:text-blue-500 group"
          )}
        >
          {item.title}
          <div
            className={cn(
              "mt-1 w-full h-[2px] group-hover:bg-blue-500 bg-transparent",
              isActive(item.href) && "text-blue-500 bg-blue-500"
            )}
          />
        </Link>
      ))}
    </div>
  );
}
