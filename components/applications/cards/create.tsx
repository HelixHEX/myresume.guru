"use client";

import CreateCard from "@/components/cards/create";
import { api } from "@/lib/api";
import { useState } from "react";

export default function CreateApplicationCard() {
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  const { data, status, error } = api.queries.resume.useGetResumes();

  if (status === "pending") return null;

  if (status === "error") throw new Error(error.message);

  return (
    <>
      <CreateCard
        title="+ Add Application"
        modalTitle="Add Application"
        modalDescription="Add an application to see how well your resume matches to the job description"
        actionText="Add Application"
        action={() => {}}
      ></CreateCard>
    </>
  );
}
// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { api } from "@/lib/api";
// import { useState } from "react";
// import { DialogClose } from "@radix-ui/react-dialog";

// export default function CreateApplicationCard({company}: {company?: number}) {
//   const [name, setName] = useState<string>("");
//   const [jobDescription, setJobDescription] = useState<string>("");

//   // const { mutate } = api.mutations.companies.useAddCompany(setName, setWebsite);

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Card className="w-full flex items-center border-gray-200 hover:cursor-pointer border-dashed border-2 md:w-[270px] lg:w-[320px] h-[180px]">
//           <Button className="hover:bg-white h-full w-full self-center bg-white">
//             <CardContent className="flex w-full flex-col ">
//               <h1 className="text-gray-400 ">+ Add Application</h1>
//             </CardContent>
//           </Button>
//         </Card>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Company</DialogTitle>
//           <DialogDescription>
//             Add a company to keep track of your job applications
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-left">
//               Name
//             </Label>
//             <Input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               id="name"
//               placeholder="Company name (ex: Google)"
//               className="col-span-3"
//             />
//             <Label htmlFor="name" className="text-left">
//               Website
//             </Label>
//             <Input
//               value={website}
//               onChange={(e) => setWebsite(e.target.value)}
//               id="name"
//               placeholder="Company url (ex: careers.google.com)"
//               className="col-span-3"
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <DialogClose asChild>
//             <Button
//               onClick={() => {
//                 mutate({ name, website: website ?? "" });
//               }}
//               type="submit"
//             >
//               Add Company
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
