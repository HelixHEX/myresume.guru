import { FileText } from "lucide-react";

export default function Logo({size}: {size?: number | string}) {
  return (
    <div className="flex flex-row">
      <FileText />
      <h1 className='font-bold text-lg ml-2 hover:cursor-pointer'>myresume.guru</h1>
    </div>
  );
}
