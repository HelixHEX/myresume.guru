"use client";

import { MoveRight } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { FcCalendar } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function ResumeCard({ name, fileKey }: Resume) {
  const router = useRouter();
  return (
    <Card className="w-full md:w-[270px] lg:w-[320px] h-[180px]">
      <CardHeader className="flex flex-col justify-between">
        <h2 className="text-md font-medium">{name}</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-end">
          <Button
            onClick={() => router.push(`/app/resumes/${fileKey}`)}
            className="bg-white rounded-full text-black text-xl hover:bg-gray-800 hover:border-gray-800 hover:text-white w-12 h-12 border-2 border-black"
          >
            <MoveRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
