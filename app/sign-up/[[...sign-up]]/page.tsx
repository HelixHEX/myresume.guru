import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center self-center h-screen w-full">
      <SignUp path="/sign-up" />
    </div>
  );
}
