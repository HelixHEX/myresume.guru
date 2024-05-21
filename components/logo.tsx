import { FileText } from "lucide-react";
import Link from "next/link";

export default function Logo({size}: {size?: number | string}) {
  return (
    <div className="flex flex-row">
      <FileText />
      <Link href='/' className='font-bold text-lg ml-2 hover:cursor-pointer'>myresume.guru</Link>
    </div>
  );
}
