"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Renders the trial limit upgrade message when user has reached the free trial limit.
 * Use in place of Thread when (messageCount >= 10 && plan !== "Plus").
 */
export const ChatTrialLimitUpgrade = () => {
  const router = useRouter();
  const { user } = useUser();

  if (!user) return null;

  const messageCount = (user.unsafeMetadata?.messageCount as number) ?? 0;
  const plan = user.unsafeMetadata?.plan as string | undefined;
  const isOverLimit = messageCount >= 10 && plan !== "Plus";

  if (!isOverLimit) return null;

  return (
    <div className="flex flex-col text-center items-center justify-center flex-1 min-h-0 p-6">
      <h1 className="text-lg w-full sm:w-3/4 font-bold">
        Thanks for using the Resume Guru {plan === "Plus" ? "Plus" : "Assistant"}!
      </h1>
      <p className="text-sm w-full sm:w-4/5 mt-2">
        You have reached the limit of your free trial. Please upgrade to continue using the assistant.
      </p>
      <Button
        variant="ghost"
        onClick={() => router.push("/plans")}
        className="mt-4 font-bold hover:bg-transparent hover:text-blue-800 hover:cursor-pointer"
      >
        Upgrade Now
      </Button>
    </div>
  );
};

export const useChatTrialLimit = (): boolean => {
  const { user } = useUser();
  if (!user) return false;
  const messageCount = (user.unsafeMetadata?.messageCount as number) ?? 0;
  const plan = user.unsafeMetadata?.plan as string | undefined;
  return messageCount >= 10 && plan !== "Plus";
};
