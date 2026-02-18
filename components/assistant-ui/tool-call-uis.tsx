"use client";

import type { FC } from "react";
import type { ToolCallMessagePartProps } from "@assistant-ui/react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const toolCallCardClass =
  "rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900";

const RunningState: FC<{ label: string }> = ({ label }) => (
  <div className={cn(toolCallCardClass, "flex items-center gap-2 text-neutral-600 dark:text-neutral-400")}>
    <Loader2Icon className="size-4 shrink-0 animate-spin" aria-hidden />
    <span>{label}</span>
  </div>
);

const ErrorState: FC<{ message?: string }> = ({ message }) => (
  <div className={cn(toolCallCardClass, "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200")}>
    {message ?? "Something went wrong."}
  </div>
);

export const SetChatTitleToolUI: FC<ToolCallMessagePartProps<{ title?: string }, { success?: boolean; message?: string }>> = ({
  args,
  result,
  isError,
  status,
}) => {
  if (status.type === "running") {
    const title = args?.title != null ? String(args.title).slice(0, 40) : null;
    return <RunningState label={title ? `Setting title to "${title}…"` : "Setting chat title…"} />;
  }
  if (isError) {
    return <ErrorState message={typeof result === "object" && result && "message" in result ? String((result as { message?: string }).message) : undefined} />;
  }
  if (result != null) {
    const success = typeof result === "object" && result && "success" in result && (result as { success?: boolean }).success;
    return (
      <div className={cn(toolCallCardClass, success ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300")}>
        {success ? "Chat title updated." : (result as { message?: string }).message ?? "Title update failed."}
      </div>
    );
  }
  return null;
};

export const GetResumeToolUI: FC<
  ToolCallMessagePartProps<object, { resumeText?: string; summary?: string; _message?: string }>
> = ({ result, isError, status }) => {
  if (status.type === "running") return <RunningState label="Loading resume…" />;
  if (isError) return <ErrorState />;
  if (result != null) {
    const msg = result._message ?? result.summary ?? (result.resumeText ? "Resume loaded." : "No resume in context.");
    return <div className={toolCallCardClass}>{msg}</div>;
  }
  return null;
};

export const GetResumeStructuredToolUI: FC<ToolCallMessagePartProps<object, unknown>> = ({ result, isError, status }) => {
  if (status.type === "running") return <RunningState label="Loading structured resume…" />;
  if (isError) return <ErrorState />;
  if (result != null) {
    const msg = typeof result === "object" && "_message" in result ? String((result as { _message?: string })._message) : "Resume data loaded.";
    return <div className={toolCallCardClass}>{msg}</div>;
  }
  return null;
};

type FeedbackItem = { title?: string; text?: string; actionableFeedbacks?: { title?: string; text?: string }[] };

export const GetFeedbackToolUI: FC<
  ToolCallMessagePartProps<object, { feedbacks?: FeedbackItem[]; _message?: string }>
> = ({ result, isError, status }) => {
  if (status.type === "running") return <RunningState label="Loading feedback…" />;
  if (isError) return <ErrorState />;
  if (result != null) {
    const feedbacks = result.feedbacks ?? [];
    const msg = result._message;
    if (msg) return <div className={toolCallCardClass}>{msg}</div>;
    if (feedbacks.length === 0) return <div className={toolCallCardClass}>No feedback yet.</div>;
    return (
      <div className={cn(toolCallCardClass, "space-y-2")}>
        <p className="font-medium text-neutral-800 dark:text-neutral-200">Feedback ({feedbacks.length})</p>
        <ul className="list-inside list-disc space-y-1 text-neutral-600 dark:text-neutral-400">
          {feedbacks.slice(0, 5).map((f, i) => (
            <li key={i}>{f.title ?? "Feedback"}</li>
          ))}
          {feedbacks.length > 5 && <li>…and {feedbacks.length - 5} more</li>}
        </ul>
      </div>
    );
  }
  return null;
};

export const GetSuggestedFeedbackToolUI: FC<
  ToolCallMessagePartProps<object, { feedbacks?: FeedbackItem[]; _message?: string }>
> = (props) => <GetFeedbackToolUI {...props} />;

export const GetMoreMessagesToolUI: FC<
  ToolCallMessagePartProps<{ beforeId?: string; limit?: number }, { messages?: unknown[]; hasMore?: boolean }>
> = ({ result, isError, status }) => {
  if (status.type === "running") return <RunningState label="Loading older messages…" />;
  if (isError) return <ErrorState />;
  if (result != null) {
    const count = Array.isArray(result.messages) ? result.messages.length : 0;
    const more = result.hasMore ? " More available." : "";
    return <div className={toolCallCardClass}>Loaded {count} message{count !== 1 ? "s" : ""}.{more}</div>;
  }
  return null;
};

export const ModifyResumeToolUI: FC<
  ToolCallMessagePartProps<Record<string, unknown>, { success?: boolean; message?: string; updated?: string[] }>
> = ({ args, result, isError, status }) => {
  if (status.type === "running") {
    const fields = typeof args === "object" && args && Object.keys(args).filter((k) => !["type", "toolCallId", "toolName"].includes(k));
    const label = fields && fields.length > 0 ? `Updating: ${fields.join(", ")}…` : "Updating resume…";
    return <RunningState label={label} />;
  }
  if (isError) {
    return <ErrorState message={typeof result === "object" && result && "message" in result ? String((result as { message?: string }).message) : undefined} />;
  }
  if (result != null) {
    const success = result.success ?? false;
    const msg = result.message ?? (success ? "Resume updated." : "Update failed.");
    const updated = result.updated;
    return (
      <div className={cn(toolCallCardClass, success ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300")}>
        <p>{msg}</p>
        {updated && updated.length > 0 && (
          <p className="mt-1 text-xs opacity-80">Fields: {updated.join(", ")}</p>
        )}
      </div>
    );
  }
  return null;
};
