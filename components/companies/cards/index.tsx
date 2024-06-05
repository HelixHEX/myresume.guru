'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  applications: number;
}

export default function CompanyCard({ id, name, applications }: Props) {
  const router = useRouter()
  return (
    <Card className="w-full md:w-[270px] lg:w-[320px] h-[180px]">
      <CardHeader className="flex  flex-col">
        <h2 className="text-md mb-[-10px] font-bold">{name}</h2>
        <p className="text-sm text-gray-400">Applications: {applications}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-end">
          <Button onClick={() => router.push(`/app/companies/${id}`)} className="bg-white rounded-full text-black text-xl hover:bg-gray-800 hover:border-gray-800 hover:text-white w-12 h-12 border-2 border-black">
            <MoveRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}