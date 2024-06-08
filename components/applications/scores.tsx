"use client";
import { context } from "@/lib/context";
import { useContext } from "react";

export default function ApplicationScores() {
  const { application, status } = useContext(context.application.ApplicationContext);

 

  if (!application) return <div>Loading...</div>
  return (
    <div className="mt-4 w-full flex flex-col">
      {application.applicationScores?.map((score, index) => (
        <ApplicationScore
          key={index}
          title={score.title}
          score={score.score}
        />
      ))}
    </div>
  )
}

const ApplicationScore = ({
  title,
  score,
}: {
  title: string;
  score: number;
}) => {
  return (
    <div className="mt-2 w-full flex justify-between">
      <p>{title}</p>
      <p className="">{score}%</p>
    </div>
  );
};
