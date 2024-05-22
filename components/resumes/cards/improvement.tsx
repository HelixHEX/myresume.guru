import { MoveRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
}

export default function ImprovementCard({ title, description }: Props) {
  return (
    <div className="flex flex-row w-full mb-12  ">
      <div className="bg-gray-200 w-12 h-12 flex rounded-lg items-center mr-4 justify-center ">
      <MoveRight />
      </div>
      <div className="w-full">
        <h2 className="font-semibold">{title}</h2>
        <p className=" text-gray-400">{description}</p>
      </div>
    </div>
  )
}