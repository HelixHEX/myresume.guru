"use client";

import ApplicationCard from "@/components/applications/cards";
import CreateApplicationCard from "@/components/applications/cards/create";
import { api } from "@/lib/api";

export default function CompanyApplications({ slug }: { slug: string }) {
  const { data, status, error } =
    api.queries.companies.useGetCompany(slug);

  if (status === "pending") {
    return <div className="text-gray-400 text-center">Loading...</div>;
  }

  if (status === "error") {
    return (
      <div className="text-red-400 text-center">Error: {error.message}</div>
    );
  }

  if (status === "success" && !data.company) return null;

  if (!slug) return null;


  const calcScore = ({ scores }: { scores: ApplicationScore[] }) => {
    let total = 0;
    if (scores.length > 0) {
      scores.forEach((score) => {
        if (!isNaN(score.score)) {
          total += score.score;
        }
  
        console.log(isNaN(score.score));
      });
      // console.log()
      return Math.round(total / scores.length);
    }
    return 0;
    // return total;
  };

  return (
    <>
      {data.company.applications && (
        <>
          {data.company.applications.map((application, i) => (
            <ApplicationCard
              key={i}
              title={application.title}
              id={application.id}
              score={calcScore({ scores: application.applicationScores! })}
            />
          ))}
        </>
      )}
    </>
  );
}
