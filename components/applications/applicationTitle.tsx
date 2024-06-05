import { Badge } from "../ui/badge";

export default function ApplicationTitle({ id }: { id: string }) {
  return (
    <>
      <h1 className="mt-[-6px] font-light  text-2xl text-black">Software Engineer - Frontend</h1>
      <Badge className="ml-2  self-center">Active</Badge>
    </>
  );
}
