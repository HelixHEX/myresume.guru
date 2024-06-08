"use client";

import CreateCard from "@/components/cards/create";
import { api } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
export default function CreateApplicationCard({companyId}: {companyId?: number | undefined | null}) {
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const complete = !!(title.length > 0 && url.length > 0 && resumeId && resumeId.toString().length > 0 && jobDescription.length > 0);

  const { data, status, error } = api.queries.resume.useGetResumes();
  const { mutate: addApplication, isPending } =
    api.mutations.applications.useAddApplication({
      setTitle,
      setUrl,
      setResumeId,
      setJobDescription,
      companyId
    });

  if (status === "pending") return null;

  if (status === "error") throw new Error(error.message);

  const handleSubmit = () => {
    if (isPending) return;

    if (complete) {
      addApplication({
        title,
        url,
        resumeId,
        jobDescription,
        companyId,
      })
    } else {
      toast.error("Please fill in all the required fields");
    }
  };
  return (
    <>
      <CreateCard
        styles=" min-w-[800px] h-full self-start"
        title="+ Add Application"
        modalTitle="Add Application"
        modalDescription="Add an application to see how well your resume matches to the job description"
        actionText="Add Application"
        action={handleSubmit}
        close={complete}
      >
        <div className="w-full grid grid-cols-4 gap-4">
          <Label htmlFor="name" className="text-left">
            Title
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="name"
            placeholder="Software Engineeer - Frontend"
            className="col-span-3"
          />
          <Label htmlFor="name" className="text-left">
            URL
          </Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            id="name"
            placeholder="https://careers.google.com/jobs/1"
            className="col-span-3"
          />
          <Label htmlFor="name" className="text-left">
            Resume
          </Label>
          <Select
            onValueChange={(value) => setResumeId(parseInt(value))}
            value={resumeId?.toString()}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Resumes</SelectLabel>
                {data?.map((resume, index) => (
                  <SelectItem
                    className="hover:cursor-pointer"
                    key={index}
                    value={resume.id.toString()}
                  >
                    {resume.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label htmlFor="name" className="text-left">
            Job Description
          </Label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            id="name"
            placeholder="Paste the job description here"
            className="col-span-3 min-h-[200px]"
          />
        </div>
      </CreateCard>
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
