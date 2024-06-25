'use client'
import { api } from "@/lib/api";

export default function ResumeDetails({fileKey}: {fileKey: Resume['fileKey']}) {
  // const {data: resumeData, status, error} = api.queries.resume.useGetResume(fileKey); 
  
  // if (status === "pending") {
  //   return <div>Loading...</div>;
  // }

  // if (status === "error") {
  //   return <div>Error: {error.message}</div>;
  // }

  // if (!resumeData) {
  //   return <div>Resume not found</div>;
  // }

  // if (resumeData.message) { 
  //   return <div>Error: {resumeData.message}</div>;
  // }

  // if (!resumeData.resume) {
  //   return <div>Resume not found</div>;
  // }

  return (
    <>
      {/* {resumeData.resume.text} */}
    </>
  )
}

// export const LoadResume = ({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) => {
//   const { data, status } = api.queries.resume.useGetResume(id);

//   if (status === "pending")
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   return <>{children}</>;
// };

