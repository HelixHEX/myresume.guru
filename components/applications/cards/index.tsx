"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function ApplicationCard({
  title,
  id,
  company,
  score,
}: {
  title: string;
  id: string;
  company?: string;
  score: number;
}) {
  return (
    <Link href={`/app/applications/${id}`}>
      <Card className="hover:bg-gray-50 transition-all duration-200">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-medium">{title}</h2>
              <p className="text-sm text-gray-500">{company}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500">Match Score</p>
              <p className="text-lg font-medium">{score}%</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={score} />
        </CardContent>
      </Card>
    </Link>
  );
}
