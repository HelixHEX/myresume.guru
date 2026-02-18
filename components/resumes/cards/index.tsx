"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowRight, ArrowUp, FileText, MoreVertical, Pin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatchResume, useDuplicateResume } from "@/app/app/(resumes)/lib/mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ResumeCardProps = Resume & {
  viewMode?: "grid" | "list";
  reorderProps?: {
    fullOrderedIds: number[];
    onReorder: (orderedIds: number[]) => void;
    isReordering?: boolean;
  };
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date: Date | string) => {
  const t = new Date(date).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return t;
};

const PREVIEW_MAX_LEN = 120;

export default function ResumeCard({
  name,
  id,
  fileKey,
  createdAt,
  updatedAt,
  pinned = false,
  tags = [],
  text = null,
  applicationCount = 0,
  viewMode = "grid",
  reorderProps,
}: ResumeCardProps) {
  const router = useRouter();
  const identifier = fileKey ?? String(id);
  const { mutate: patchResume, isPending: isPinning } = usePatchResume(identifier);
  const { mutate: duplicateResume, isPending: isDuplicating } = useDuplicateResume(identifier);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(name);
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [addTagValue, setAddTagValue] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const addTagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditNameValue(name);
  }, [name]);

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingName]);

  const handleSaveName = () => {
    const trimmed = editNameValue.trim();
    if (trimmed && trimmed !== name) {
      patchResume({ fileKeyOrId: identifier, data: { name: trimmed } });
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveName();
    if (e.key === "Escape") {
      setEditNameValue(name);
      setIsEditingName(false);
    }
  };

  const createdFormatted = formatDate(createdAt);
  const createdTime = formatTime(createdAt);
  const updatedFormatted =
    updatedAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime()
      ? formatDate(updatedAt)
      : null;

  const handleOpen = () => {
    router.push(`/app/resumes/${encodeURIComponent(identifier)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/app/resumes/${encodeURIComponent(identifier)}`);
    }
  };

  const handleTogglePinned = (e: React.MouseEvent) => {
    e.stopPropagation();
    patchResume({ fileKeyOrId: identifier, data: { pinned: !pinned } });
  };

  const handleOpenAddTag = () => {
    setAddTagValue("");
    setAddTagOpen(true);
  };

  useEffect(() => {
    if (addTagOpen) {
      const t = setTimeout(() => addTagInputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [addTagOpen]);

  const handleAddTagSubmit = () => {
    const newTag = addTagValue.trim();
    if (!newTag) return;
    if (tags.includes(newTag)) {
      setAddTagValue("");
      setAddTagOpen(false);
      return;
    }
    patchResume({
      fileKeyOrId: identifier,
      data: { tags: [...tags, newTag] } as { pinned?: boolean; name?: string; tags?: string[] },
    });
    setAddTagValue("");
    setAddTagOpen(false);
  };

  const handleAddTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddTagSubmit();
  };

  const handleDuplicate = () => {
    duplicateResume(undefined, {
      onSuccess: (data) => {
        if (data?.id) router.push(`/app/resumes/${data.id}`);
      },
    });
  };

  const handleDelete = () => {
    // TODO: wire to delete API + confirmation
  };

  const handleMoveUp = () => {
    if (!reorderProps) return;
    const { fullOrderedIds, onReorder } = reorderProps;
    const i = fullOrderedIds.indexOf(id);
    if (i <= 0) return;
    const next = [...fullOrderedIds];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onReorder(next);
  };

  const handleMoveDown = () => {
    if (!reorderProps) return;
    const { fullOrderedIds, onReorder } = reorderProps;
    const i = fullOrderedIds.indexOf(id);
    if (i < 0 || i >= fullOrderedIds.length - 1) return;
    const next = [...fullOrderedIds];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onReorder(next);
  };

  const reorderIndex = reorderProps?.fullOrderedIds.indexOf(id) ?? -1;
  const canMoveUp = reorderProps && reorderIndex > 0;
  const canMoveDown =
    reorderProps &&
    reorderIndex >= 0 &&
    reorderIndex < reorderProps.fullOrderedIds.length - 1;

  if (viewMode === "list") {
    return (
      <Card
        role="button"
        tabIndex={0}
        aria-label={`Open resume ${name}`}
        onClick={() => router.push(`/app/resumes/${encodeURIComponent(identifier)}`)}
        onKeyDown={handleKeyDown}
        className="flex h-[50px] w-full cursor-pointer flex-row rounded-none border border-gray-200 border-x-0 border-t-[0.02px] border-b-[0.02px] p-0 transition-colors hover:border-blue-800 hover:bg-blue-800 hover:text-white group"
      >
        <CardHeader className="flex h-full flex-col justify-center p-0 px-4">
          <div className="flex items-center gap-2 px-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-7 shrink-0 rounded group-hover:bg-white/20",
                pinned && "text-amber-400"
              )}
              aria-label={pinned ? "Unpin resume" : "Pin resume"}
              onClick={handleTogglePinned}
              disabled={isPinning}
            >
              <Pin
                className={cn("size-4", pinned && "fill-current")}
                aria-hidden
              />
            </Button>
            <h2 className="text-sm font-medium">{name}</h2>
          </div>
        </CardHeader>
        <CardContent className="flex h-full w-full flex-row items-end justify-end pt-3">
          <div className="flex h-full flex-row justify-end gap-2">
            <p className="text-sm text-gray-500 group-hover:text-white">
              {createdFormatted}
            </p>
            <p className="text-sm text-gray-500 group-hover:text-white">
              {createdTime}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const previewSnippet =
    text && text.trim()
      ? text.trim().slice(0, PREVIEW_MAX_LEN) + (text.length > PREVIEW_MAX_LEN ? "…" : "")
      : null;

  const cardContent = (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Open resume ${name}`}
      onClick={() => router.push(`/app/resumes/${encodeURIComponent(identifier)}`)}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex min-h-[140px] w-full cursor-pointer flex-col rounded-lg border border-gray-200 transition-all hover:border-blue-800 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2"
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-0">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-800">
            <FileText className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
            {isEditingName ? (
              <Input
                ref={nameInputRef}
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={handleNameKeyDown}
                className="h-8 text-base font-semibold"
                aria-label="Resume name"
              />
            ) : (
              <h2
                role="button"
                tabIndex={0}
                className="truncate text-base font-semibold text-gray-900 cursor-text hover:underline"
                onClick={() => setIsEditingName(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsEditingName(true);
                  }
                }}
                aria-label="Edit resume name"
              >
                {name}
              </h2>
            )}
            <p className="mt-0.5 text-xs text-gray-500">
              Created {createdFormatted}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-8 rounded-full hover:bg-gray-100",
              pinned && "text-amber-500 hover:text-amber-600"
            )}
            aria-label={pinned ? "Unpin resume" : "Pin resume"}
            onClick={handleTogglePinned}
            disabled={isPinning}
          >
            <Pin
              className={cn("size-4", pinned && "fill-current")}
              aria-hidden
            />
          </Button>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-full hover:bg-gray-100"
              aria-label="Resume actions"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleOpen();
              }}
              className="cursor-pointer gap-2"
            >
              <ArrowRight className="size-4" aria-hidden />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleOpenAddTag();
              }}
              className="cursor-pointer gap-2"
            >
              Add tag
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleDuplicate();
              }}
              className="cursor-pointer gap-2"
              disabled={isDuplicating}
            >
              Duplicate
            </DropdownMenuItem>
            {canMoveUp && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleMoveUp();
                }}
                className="cursor-pointer gap-2"
                disabled={reorderProps?.isReordering}
              >
                <ArrowUp className="size-4" aria-hidden />
                Move up
              </DropdownMenuItem>
            )}
            {canMoveDown && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleMoveDown();
                }}
                className="cursor-pointer gap-2"
                disabled={reorderProps?.isReordering}
              >
                <ArrowDown className="size-4" aria-hidden />
                Move down
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="cursor-pointer gap-2"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 p-4 pt-2">
        {applicationCount > 0 && (
          <p className="text-xs text-gray-500">
            Used in {applicationCount} application{applicationCount !== 1 ? "s" : ""}
          </p>
        )}
        {updatedFormatted && (
          <p className="text-xs text-gray-500">Updated {updatedFormatted}</p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-end border-t border-gray-100 p-3">
        <span className="flex items-center gap-1 text-xs text-blue-800">
          Open
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </CardFooter>
    </Card>
  );

  const addTagDialog = (
    <Dialog
      open={addTagOpen}
      onOpenChange={(open) => {
        setAddTagOpen(open);
        if (!open) setAddTagValue("");
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add tag</DialogTitle>
          <DialogDescription>
            Enter a tag name to add to this resume. Tags help you filter and
            organize resumes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            ref={addTagInputRef}
            value={addTagValue}
            onChange={(e) => setAddTagValue(e.target.value)}
            onKeyDown={handleAddTagKeyDown}
            placeholder="e.g. Tech, 2024"
            className="rounded-none"
            aria-label="Tag name"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() => setAddTagOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-none bg-blue-800 text-white hover:bg-blue-900"
            onClick={handleAddTagSubmit}
            disabled={!addTagValue.trim()}
          >
            Add tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (previewSnippet) {
    return (
      <>
        {addTagDialog}
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-xs whitespace-pre-wrap break-words text-xs"
            >
              {previewSnippet}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    );
  }

  return (
    <>
      {addTagDialog}
      {cardContent}
    </>
  );
}
